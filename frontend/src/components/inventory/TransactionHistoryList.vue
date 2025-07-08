<template>
  <div class="space-y-4">
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-8">
      <LoadingSpinner size="md" />
      <span class="ml-2 text-slate-600">{{ $t('common.loading') }}</span>
    </div>
    
    <!-- Empty State -->
    <EmptyState
      v-else-if="transactions.length === 0"
      :title="$t('inventorySessions.history.noTransactions')"
      :description="$t('inventorySessions.history.noTransactionsSubtext')"
      icon="📋"
      :show-actions="false"
    />
    
    <!-- Transaction List -->
    <div v-else class="space-y-2">
      <div
        v-for="transaction in paginatedTransactions"
        :key="transaction.id"
        class="bg-white border border-slate-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
      >
        <div class="flex items-start justify-between">
          <!-- Transaction Info -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-3 mb-2">
              <!-- Transaction Type Icon -->
              <div :class="getTypeIconClasses(transaction.type)">
                <component :is="getTypeIcon(transaction.type)" class="w-4 h-4" />
              </div>
              
              <!-- Compound Name -->
              <div class="font-medium text-slate-900 truncate">
                {{ getCompoundName(transaction) }}
              </div>
              
              <!-- Transaction Type Badge -->
              <Badge :variant="getTypeBadgeVariant(transaction.type)">
                {{ $t(`inventorySessions.quickTransaction.types.${transaction.type}`) }}
              </Badge>
            </div>
            
            <!-- Transaction Details -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-slate-600">
              <div>
                <span class="font-medium">{{ $t('inventorySessions.history.quantity') }}:</span>
                <span :class="getQuantityClasses(transaction.type)">
                  {{ formatQuantity(transaction) }}
                </span>
              </div>
              
              <div>
                <span class="font-medium">{{ $t('inventorySessions.history.date') }}:</span>
                {{ formatDate(transaction.timestamp) }}
              </div>
              
              <div>
                <span class="font-medium">{{ $t('inventorySessions.history.user') }}:</span>
                {{ transaction.userName || 'Unknown' }}
              </div>
              
              <div v-if="transaction.location">
                <span class="font-medium">{{ $t('compounds.labels.location') }}:</span>
                {{ transaction.location }}
              </div>
            </div>
            
            <!-- Notes -->
            <div v-if="transaction.notes" class="mt-2 text-sm text-slate-600">
              <span class="font-medium">{{ $t('inventorySessions.history.notes') }}:</span>
              {{ transaction.notes }}
            </div>
          </div>
          
          <!-- Action Buttons -->
          <div class="flex gap-2 ml-4">
            <Button
              variant="ghost"
              size="sm"
              @click="$emit('edit-transaction', transaction)"
            >
              {{ $t('inventorySessions.actions.edit') }}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              class="text-red-600 hover:text-red-700"
              @click="$emit('delete-transaction', transaction)"
            >
              {{ $t('inventorySessions.actions.delete') }}
            </Button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Pagination -->
    <PaginationControls
      v-if="transactions.length > itemsPerPage"
      :current-page="currentPage"
      :total-items="transactions.length"
      :items-per-page="itemsPerPage"
      @page-changed="handlePageChange"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCompounds } from '@/composables/useCompounds.js'
import { useInventory } from '@/composables/useInventory.js'
import { useFormat } from '@/utils/format.js'

// Components
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import Button from '@/components/ui/Button.vue'
import Badge from '@/components/ui/Badge.vue'
import PaginationControls from '@/components/ui/PaginationControls.vue'
import EmptyState from '@/components/ui/EmptyState.vue'

// Icons
import { 
  MinusIcon, 
  PlusIcon, 
  PencilIcon, 
  ArrowRightIcon, 
  TrashIcon 
} from '@heroicons/vue/24/outline'

const { t } = useI18n()
const { formatDate } = useFormat()

const props = defineProps({
  transactions: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['edit-transaction', 'delete-transaction'])

// Composables
const { compounds } = useCompounds()
const { TRANSACTION_TYPES } = useInventory()

// Pagination state
const currentPage = ref(1)
const itemsPerPage = ref(10)

// Computed properties
const paginatedTransactions = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return props.transactions.slice(start, end)
})

// Methods
const getCompoundName = (transaction) => {
  // First try to use the compound name from the transaction
  if (transaction.compoundName) {
    return transaction.compoundName
  }
  
  // Fall back to looking up the compound by ID
  const compound = compounds.value.find(c => c.id === transaction.compoundId)
  return compound?.name || transaction.compoundId || 'Unknown Compound'
}

const getTypeIcon = (type) => {
  const iconMap = {
    use: MinusIcon,
    restock: PlusIcon,
    adjust: PencilIcon,
    transfer: ArrowRightIcon,
    waste: TrashIcon
  }
  return iconMap[type] || MinusIcon
}

const getTypeIconClasses = (type) => {
  const config = TRANSACTION_TYPES[type]
  if (!config) return 'w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center'
  
  const colorMap = {
    red: 'bg-red-100 text-red-600',
    green: 'bg-green-100 text-green-600',
    blue: 'bg-blue-100 text-blue-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    purple: 'bg-purple-100 text-purple-600'
  }
  
  return [
    'w-8 h-8 rounded-full flex items-center justify-center',
    colorMap[config.color] || 'bg-slate-100 text-slate-600'
  ]
}

const getTypeBadgeVariant = (type) => {
  const config = TRANSACTION_TYPES[type]
  if (!config) return 'secondary'
  
  const variantMap = {
    red: 'destructive',
    green: 'success',
    blue: 'primary',
    yellow: 'warning',
    purple: 'secondary'
  }
  
  return variantMap[config.color] || 'secondary'
}

const getQuantityClasses = (type) => {
  const config = TRANSACTION_TYPES[type]
  if (!config) return ''
  
  const colorMap = {
    red: 'text-red-600',
    green: 'text-green-600',
    blue: 'text-blue-600',
    yellow: 'text-yellow-600',
    purple: 'text-purple-600'
  }
  
  return ['font-medium', colorMap[config.color] || 'text-slate-900']
}

const formatQuantity = (transaction) => {
  const config = TRANSACTION_TYPES[transaction.type]
  const quantity = transaction.quantity
  const unit = transaction.unit || ''
  
  if (transaction.type === 'adjust') {
    return `${quantity} ${unit}`.trim() // No prefix for adjustments
  }
  
  const prefix = config?.multiplier === 1 ? '+' : '-'
  return `${prefix}${quantity} ${unit}`.trim()
}

const handlePageChange = (page) => {
  currentPage.value = page
}

// Reset page when transactions change
watch(() => props.transactions.length, () => {
  currentPage.value = 1
})
</script>
