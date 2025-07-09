<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-xl text-slate-600">
          {{ $t('inventorySessions.subtitle') }}
        </h1>
      </div>
      
      <div class="flex gap-3">
        <Button variant="outline" @click="refreshData">
          {{ $t('inventorySessions.actions.refresh') }}
        </Button>
        <Button variant="outline" @click="showBulkModal = true">
          {{ $t('inventorySessions.actions.bulkAction') }}
        </Button>
      </div>
    </div>

    

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <!-- Quick Transaction Form (Left Column) -->
      <div class="lg:col-span-1">
        <Card>
          <template #header>
            <h2 class="text-lg font-semibold text-slate-900">
              {{ $t('inventorySessions.quickTransaction.title') }}
            </h2>
          </template>
          
          <QuickTransactionForm 
            :loading="loading"
            @transaction-recorded="handleTransactionRecorded"
          />
        </Card>
      </div>

      <!-- Transaction History (Right Column) -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Quick Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <div class="text-center p-2">
              <div class="text-2xl font-bold text-blue-600">{{ todayTransactions }}</div>
              <div class="text-sm text-slate-600">{{ $t('inventorySessions.history.today') }}</div>
            </div>
          </Card>  
          <Card>
            <div class="text-center p-2">
              <div class="text-2xl font-bold text-green-600">{{ weekTransactions }}</div>
              <div class="text-sm text-slate-600">{{ $t('inventorySessions.history.thisWeek') }}</div>
            </div>
          </Card>  
          <Card>
            <div class="text-center p-2">
              <div class="text-2xl font-bold text-purple-600">{{ totalTransactions }}</div>
              <div class="text-sm text-slate-600">{{ $t('inventorySessions.history.total') }}</div>
            </div>
          </Card>
        </div>
        <Card>
          <template #header>
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-semibold text-slate-900">
                {{ $t('inventorySessions.history.title') }}
              </h2>
              
              <!-- Filter Controls -->
              <div class="flex gap-2">
                <select 
                  v-model="historyFilter.type"
                  class="px-3 py-1 border border-slate-300 rounded-md text-sm"
                  @change="applyFilters"
                >
                  <option value="">{{ $t('inventorySessions.history.allTypes') }}</option>
                  <option v-for="(config, type) in TRANSACTION_TYPES" :key="type" :value="type">
                    {{ $t(`inventorySessions.quickTransaction.types.${type}`) }}
                  </option>
                </select>
                
                <select 
                  v-model="historyFilter.period"
                  class="px-3 py-1 border border-slate-300 rounded-md text-sm"
                  @change="applyFilters"
                >
                  <option value="">{{ $t('inventorySessions.history.allTime') }}</option>
                  <option value="7days">{{ $t('inventorySessions.history.last7Days') }}</option>
                  <option value="30days">{{ $t('inventorySessions.history.last30Days') }}</option>
                  <option value="thisMonth">{{ $t('inventorySessions.history.thisMonth') }}</option>
                </select>
              </div>
            </div>
          </template>
          
          <TransactionHistoryList 
            :transactions="filteredTransactions"
            :loading="loading"
            @edit-transaction="handleEditTransaction"
            @delete-transaction="handleDeleteTransaction"
          />
        </Card>
      </div>
    </div>

    <!-- Bulk Operations Modal -->
    <BaseModal
      v-if="showBulkModal"
      :title="$t('inventorySessions.bulk.title')"
      @close="showBulkModal = false"
    >
      <div class="space-y-4">
        <p class="text-slate-600">
          {{ $t('inventorySessions.bulk.description') }}
        </p>
        
        <div class="flex gap-3">
          <Button variant="outline" @click="handleBulkImport">
            {{ $t('inventorySessions.bulk.import') }}
          </Button>
          <Button variant="outline" @click="handleBulkExport">
            {{ $t('inventorySessions.bulk.export') }}
          </Button>
        </div>
      </div>
    </BaseModal>

    <!-- Loading Overlay -->
    <div 
      v-if="loading" 
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <LoadingSpinner size="lg" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { useInventory } from '@/composables/useInventory.js'
import { useToast } from '@/composables/useToast.js'

// Components
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import QuickTransactionForm from '@/components/inventory/QuickTransactionForm.vue'
import TransactionHistoryList from '@/components/inventory/TransactionHistoryList.vue'

const { t } = useI18n()
const { toast } = useToast()
const route = useRoute()

// Inventory composable
const {
  transactions,
  loading,
  error,
  loadTransactions,
  deleteTransaction,
  TRANSACTION_TYPES
} = useInventory()

// Local state
const showBulkModal = ref(false)
const historyFilter = reactive({
  type: '',
  period: '',
  search: ''
})

// Computed properties for stats
const todayTransactions = computed(() => {
  const today = new Date().toDateString()
  return transactions.value.filter(t => 
    new Date(t.timestamp).toDateString() === today
  ).length
})

const weekTransactions = computed(() => {
  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 7)
  return transactions.value.filter(t => 
    new Date(t.timestamp) >= weekAgo
  ).length
})

const totalTransactions = computed(() => transactions.value.length)

// Filtered transactions based on current filters
const filteredTransactions = computed(() => {
  let filtered = [...transactions.value]
  
  // Filter by type
  if (historyFilter.type) {
    filtered = filtered.filter(t => t.type === historyFilter.type)
  }
  
  // Filter by period
  if (historyFilter.period) {
    const now = new Date()
    let cutoffDate
    
    switch (historyFilter.period) {
      case '7days':
        cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case '30days':
        cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      case 'thisMonth':
        cutoffDate = new Date(now.getFullYear(), now.getMonth(), 1)
        break
    }
    
    if (cutoffDate) {
      filtered = filtered.filter(t => new Date(t.timestamp) >= cutoffDate)
    }
  }
  
  return filtered
})

// Event handlers
const handleTransactionRecorded = async () => {
  await loadTransactions()
}

const handleEditTransaction = (transaction) => {
  toast.info('Transaction editing coming soon')
}

const handleDeleteTransaction = async (transaction) => {
  try {
    const confirmed = confirm(t('inventorySessions.messages.deleteTransactionConfirm'))
    if (!confirmed) return
    
    await deleteTransaction(transaction.id)
    toast.success('Transaction deleted successfully')
  } catch (err) {
    toast.error('Failed to delete transaction')
    console.error('Delete transaction error:', err)
  }
}

const handleBulkImport = () => {
  toast.info('Bulk import coming soon')
  showBulkModal.value = false
}

const handleBulkExport = () => {
  try {
    const csvData = exportTransactionsToCsv(filteredTransactions.value)
    downloadCsv(csvData, 'inventory_transactions.csv')
    toast.success('Export completed')
  } catch (err) {
    toast.error('Export failed')
  }
  showBulkModal.value = false
}

const refreshData = async () => {
  try {
    await loadTransactions()
    toast.success('Data refreshed')
  } catch (err) {
    toast.error('Failed to refresh data')
  }
}

const applyFilters = () => {
  // Filters are reactive, so computed property will update automatically
}

// Utility functions
const exportTransactionsToCsv = (transactions) => {
  const headers = ['Date', 'Compound', 'Type', 'Quantity', 'User', 'Notes']
  const rows = transactions.map(t => [
    new Date(t.timestamp).toLocaleDateString(),
    t.compoundName || t.compoundId,
    t.type,
    t.quantity,
    t.userName,
    t.notes || ''
  ])
  
  return [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n')
}

const downloadCsv = (csvData, filename) => {
  const blob = new Blob([csvData], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  window.URL.revokeObjectURL(url)
}

// Lifecycle
onMounted(() => {
  const compoundId = route.query.compound
  if (compoundId) {
    console.log('Pre-selected compound:', compoundId)
  }
})
</script>
