<template>
  <BaseModal
    v-model="isModalOpen"
    :title="compound?.name || $t('compounds.detail.title')"
    size="xl"
    @close="handleClose"
  >
    <template #header>
      <div class="flex-1 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <h2 class="text-xl font-semibold text-slate-900">
            {{ compound?.name || $t('compounds.detail.title') }}
          </h2>
          <div class="flex items-center gap-2">
            <Badge :variant="hazardBadgeVariant">{{ compound?.hazardClass }}</Badge>
            <Badge v-if="compound?.casNumber" variant="secondary" class="font-mono text-xs">
              CAS: {{ compound.casNumber }}
            </Badge>
          </div>
        </div>
      </div>
    </template>

    <div v-if="loading" class="flex items-center justify-center py-12">
      <LoadingSpinner size="lg" />
      <span class="ml-3 text-slate-600">{{ $t('compounds.detail.loading') }}</span>
    </div>

    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6">
      <div class="flex items-center">
        <span class="text-red-400 text-xl mr-3">⚠️</span>
        <div>
          <h3 class="text-sm font-medium text-red-800">{{ $t('compounds.detail.errorLoading') }}</h3>
          <p class="text-sm text-red-700 mt-1">{{ error }}</p>
        </div>
      </div>
    </div>

    <div v-else-if="compound" class="space-y-6">
      <!-- Compound Information Section -->
      <div class="bg-slate-50 rounded-lg p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-slate-900">
            {{ $t('compounds.detail.compoundInfo') }}
          </h3>
          <Button 
            v-if="!isEditing"
            variant="outline" 
            size="sm"
            @click="startEdit"
          >
            {{ $t('compounds.detail.editCompound') }}
          </Button>
          <div v-else class="flex gap-2">
            <Button 
              variant="primary" 
              size="sm"
              @click="saveEdit"
              :loading="saving"
            >
              {{ $t('common.save') }}
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              @click="cancelEdit"
            >
              {{ $t('common.cancel') }}
            </Button>
          </div>
        </div>

        <!-- View Mode -->
        <div v-if="!isEditing" class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-slate-700">
                {{ $t('compounds.labels.name') }}
              </label>
              <p class="mt-1 text-sm text-slate-900">{{ compound.name }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700">
                {{ $t('compounds.labels.casNumber') }}
              </label>
              <p class="mt-1 text-sm text-slate-900 font-mono">{{ compound.casNumber || '-' }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700">
                {{ $t('compounds.labels.supplier') }}
              </label>
              <p class="mt-1 text-sm text-slate-900">{{ compound.supplier || '-' }}</p>
            </div>
          </div>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-slate-700">
                {{ $t('compounds.labels.hazardClass') }}
              </label>
              <p class="mt-1">
                <Badge :variant="hazardBadgeVariant">{{ compound.hazardClass }}</Badge>
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700">
                {{ $t('compounds.labels.threshold') }}
              </label>
              <p class="mt-1 text-sm text-slate-900">{{ compound.threshold }}</p>
            </div>
            <div v-if="compound.notes">
              <label class="block text-sm font-medium text-slate-700">
                {{ $t('compounds.detail.notes') }}
              </label>
              <p class="mt-1 text-sm text-slate-900">{{ compound.notes }}</p>
            </div>
          </div>
        </div>

        <!-- Edit Mode -->
        <form v-else @submit.prevent="saveEdit" class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">
                {{ $t('compounds.labels.name') }} *
              </label>
              <Input
                v-model="editForm.name"
                :placeholder="$t('compounds.namePlaceholder')"
                :error="editErrors.name"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">
                {{ $t('compounds.labels.casNumber') }}
              </label>
              <Input
                v-model="editForm.casNumber"
                :placeholder="$t('compounds.casPlaceholder')"
                :error="editErrors.casNumber"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">
                {{ $t('compounds.labels.supplier') }}
              </label>
              <Input
                v-model="editForm.supplier"
                :placeholder="$t('compounds.supplierPlaceholder')"
                :error="editErrors.supplier"
              />
            </div>
          </div>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">
                {{ $t('compounds.labels.hazardClass') }} *
              </label>
              <select
                v-model="editForm.hazardClass"
                required
                class="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                :class="{ 'border-red-500': editErrors.hazardClass }"
              >
                <option value="">{{ $t('compounds.hazardClassSelect') }}</option>
                <option value="Non-hazardous">{{ $t('compounds.hazardClassNonHazardous') }}</option>
                <option value="Flammable">{{ $t('compounds.hazardClassFlammable') }}</option>
                <option value="Corrosive">{{ $t('compounds.hazardClassCorrosive') }}</option>
                <option value="Toxic">{{ $t('compounds.hazardClassToxic') }}</option>
                <option value="Oxidizing">{{ $t('compounds.hazardClassOxidizing') }}</option>
                <option value="Explosive">{{ $t('compounds.hazardClassExplosive') }}</option>
                <option value="Carcinogenic">{{ $t('compounds.hazardClassCarcinogenic') }}</option>
                <option value="Radioactive">{{ $t('compounds.hazardClassRadioactive') }}</option>
              </select>
              <p v-if="editErrors.hazardClass" class="mt-1 text-sm text-red-600">
                {{ editErrors.hazardClass }}
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">
                {{ $t('compounds.labels.threshold') }} *
              </label>
              <Input
                v-model.number="editForm.threshold"
                type="number"
                min="0"
                step="0.01"
                :placeholder="$t('compounds.thresholdPlaceholder')"
                :error="editErrors.threshold"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">
                {{ $t('compounds.detail.notes') }}
              </label>
              <textarea
                v-model="editForm.notes"
                :placeholder="$t('compounds.detail.notesPlaceholder')"
                rows="3"
                class="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </form>
      </div>

      <!-- Stock Summary Section -->
      <div class="bg-white border border-slate-200 rounded-lg p-6">
        <h3 class="text-lg font-semibold text-slate-900 mb-4">
          {{ $t('compounds.detail.stockSummary') }}
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="text-center p-4 bg-slate-50 rounded-lg">
            <div class="text-2xl font-bold text-slate-900">{{ instanceSummary.totalInstances || 0 }}</div>
            <div class="text-sm text-slate-600">{{ $t('compounds.instances.summary.totalInstances') }}</div>
          </div>
          <div class="text-center p-4 bg-slate-50 rounded-lg">
            <div class="text-2xl font-bold" :class="stockStatusClasses">
              {{ totalStock || 0 }}
            </div>
            <div class="text-sm text-slate-600">
              {{ $t('compounds.instances.summary.totalQuantity') }}
              <span v-if="instanceSummary.unit">({{ instanceSummary.unit }})</span>
            </div>
          </div>
          <div class="text-center p-4 bg-slate-50 rounded-lg">
            <div class="text-2xl font-bold text-slate-900">
              {{ instanceSummary.locations?.length || 0 }}
            </div>
            <div class="text-sm text-slate-600">{{ $t('compounds.instances.summary.locations') }}</div>
          </div>
          <div class="text-center p-4 bg-slate-50 rounded-lg">
            <div class="text-2xl font-bold text-orange-600">
              {{ expiringSoonCount }}
            </div>
            <div class="text-sm text-slate-600">{{ $t('compounds.instances.summary.expiringSoon') }}</div>
          </div>
        </div>
      </div>

      <!-- Instances Management Section -->
      <div class="bg-white border border-slate-200 rounded-lg p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-slate-900">
            {{ $t('compounds.instances.title') }}
          </h3>
          <Button 
            variant="primary" 
            size="sm"
            @click="openAddInstanceModal"
          >
            {{ $t('compounds.instances.addNew') }}
          </Button>
        </div>

        <div v-if="instancesLoading" class="flex items-center justify-center py-8">
          <LoadingSpinner />
          <span class="ml-3 text-slate-600">{{ $t('compounds.detail.loadingInstances') }}</span>
        </div>

        <div v-else-if="instances.length === 0" class="text-center py-8 text-slate-500">
          <div class="text-4xl mb-2">📦</div>
          <p>{{ $t('compounds.instances.noInstances') }}</p>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-slate-200">
            <thead class="bg-slate-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  {{ $t('compounds.instances.location') }}
                </th>
                <th class="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  {{ $t('compounds.instances.batchNumber') }}
                </th>
                <th class="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  {{ $t('compounds.instances.quantity') }}
                </th>
                <th class="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  {{ $t('compounds.instances.expiryDate') }}
                </th>
                <th class="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  {{ $t('compounds.instances.status') }}
                </th>
                <th class="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                  {{ $t('compounds.instances.actions') }}
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-slate-200">
              <tr v-for="instance in instances" :key="instance.id" class="hover:bg-slate-50">
                <td class="px-4 py-3 text-sm text-slate-900">
                  {{ instance.location }}
                </td>
                <td class="px-4 py-3 text-sm font-mono text-slate-900">
                  {{ instance.batchNumber }}
                </td>
                <td class="px-4 py-3 text-sm text-slate-900">
                  {{ instance.quantity }} {{ instance.unit }}
                </td>
                <td class="px-4 py-3 text-sm text-slate-900">
                  <span v-if="instance.expiryDate" :class="getExpiryClasses(instance.expiryDate)">
                    {{ formatDate(instance.expiryDate) }}
                  </span>
                  <span v-else class="text-slate-400">-</span>
                </td>
                <td class="px-4 py-3 text-sm">
                  <Badge :variant="getStatusVariant(instance.status)">
                    {{ getStatusLabel(instance.status) }}
                  </Badge>
                </td>
                <td class="px-4 py-3 text-right text-sm">
                  <div class="flex items-center justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="xs"
                      @click="editInstance(instance)"
                    >
                      {{ $t('compounds.instances.edit') }}
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="xs"
                      @click="createTransaction(instance)"
                    >
                      {{ $t('compounds.actions.recordTransaction') }}
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="xs"
                      class="text-red-600 hover:text-red-700"
                      @click="deleteInstance(instance)"
                    >
                      {{ $t('compounds.instances.delete') }}
                    </Button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex items-center justify-between w-full">
        <Button 
          variant="destructive" 
          @click="deleteCompound"
          :loading="deleting"
        >
          {{ $t('compounds.detail.deleteCompound') }}
        </Button>
        <div class="flex gap-3">
          <Button 
            variant="outline" 
            @click="createTransaction()"
          >
            {{ $t('compounds.detail.createTransaction') }}
          </Button>
          <Button 
            variant="outline" 
            @click="handleClose"
          >
            {{ $t('common.close') }}
          </Button>
        </div>
      </div>
    </template>
  </BaseModal>

  <!-- Child Modals -->
  <InstanceFormModal
    v-model="instanceFormModal.isOpen"
    :compound="compound"
    :instance="instanceFormModal.instance"
    @saved="handleInstanceSaved"
  />

  <ConfirmDialog
    v-model="confirmDialog.isOpen"
    :title="confirmDialog.title"
    :message="confirmDialog.message"
    :confirmText="confirmDialog.confirmText"
    :loading="confirmDialog.loading"
    @confirm="confirmDialog.onConfirm"
  />
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseModal from '@/components/ui/BaseModal.vue'
import Button from '@/components/ui/Button.vue'
import Badge from '@/components/ui/Badge.vue'
import Input from '@/components/ui/Input.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import InstanceFormModal from './InstanceFormModal.vue'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
import { useCompounds } from '@/composables/useCompounds'
import { useCompoundInstances } from '@/composables/useCompoundInstances'
import { useToast } from '@/composables/useToast'
import { useFormat } from '@/utils/format'

const { t } = useI18n()
const toast = useToast()
const { formatDate } = useFormat()
const compoundsComposable = useCompounds()
const instancesComposable = useCompoundInstances()

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  compoundId: {
    type: [String, Number],
    required: true
  }
})

const emit = defineEmits(['update:modelValue', 'compound-updated', 'compound-deleted'])

// Modal state
const isModalOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// Data state
const compound = ref(null)
const loading = ref(false)
const error = ref(null)

// Edit state
const isEditing = ref(false)
const saving = ref(false)
const editForm = ref({})
const editErrors = ref({})

// Delete state
const deleting = ref(false)

// Child modals
const instanceFormModal = ref({
  isOpen: false,
  instance: null
})

const confirmDialog = ref({
  isOpen: false,
  title: '',
  message: '',
  confirmText: '',
  loading: false,
  onConfirm: null
})

// Computed properties
const instances = computed(() => 
  instancesComposable.getInstancesForCompound(props.compoundId)
)

const instancesLoading = computed(() => instancesComposable.loading.value)

const totalStock = computed(() => 
  instancesComposable.getTotalStockForCompound(props.compoundId)
)

const instanceSummary = computed(() => 
  instancesComposable.getInstanceSummary(props.compoundId)
)

const expiringSoonCount = computed(() => {
  const thirtyDaysFromNow = new Date()
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)
  
  return instances.value.filter(instance => {
    if (!instance.expiryDate) return false
    return new Date(instance.expiryDate) <= thirtyDaysFromNow
  }).length
})

const hazardBadgeVariant = computed(() => {
  if (!compound.value || !compound.value.hazardClass) return 'secondary'
  const hazard = compound.value.hazardClass.toLowerCase()
  if (hazard.includes('toxic') || hazard.includes('carcinogenic')) return 'destructive'
  if (hazard.includes('flammable') || hazard.includes('corrosive')) return 'warning'
  return 'secondary'
})

const stockStatusClasses = computed(() => {
  if (!compound.value || !totalStock.value) return 'text-slate-600'
  const percentage = (totalStock.value / compound.value.threshold) * 100
  return {
    'text-red-600': percentage < 50,
    'text-yellow-600': percentage >= 50 && percentage < 100,
    'text-green-600': percentage >= 100
  }
})

// Methods
const loadCompound = async () => {
  if (!props.compoundId) return
  
  loading.value = true
  error.value = null
  
  try {
    compound.value = compoundsComposable.findCompound(props.compoundId)
    if (!compound.value) {
      error.value = t('compounds.detail.notFound')
    }
  } catch (err) {
    error.value = err.message || t('compounds.detail.errorLoading')
    console.error('Failed to load compound:', err)
  } finally {
    loading.value = false
  }
}

const startEdit = () => {
  isEditing.value = true
  editForm.value = { ...compound.value }
  editErrors.value = {}
}

const cancelEdit = () => {
  isEditing.value = false
  editForm.value = {}
  editErrors.value = {}
}

const validateForm = () => {
  editErrors.value = {}
  
  if (!editForm.value.name?.trim()) {
    editErrors.value.name = t('validation.required')
  }
  
  if (!editForm.value.hazardClass) {
    editErrors.value.hazardClass = t('validation.required')
  }
  
  if (!editForm.value.threshold || editForm.value.threshold <= 0) {
    editErrors.value.threshold = t('validation.required')
  }
  
  return Object.keys(editErrors.value).length === 0
}

const saveEdit = async () => {
  if (!validateForm()) return
  
  saving.value = true
  try {
    const updatedCompound = await compoundsComposable.updateCompound(compound.value.id, editForm.value)
    compound.value = updatedCompound
    isEditing.value = false
    editForm.value = {}
    toast.success(t('compounds.updateSuccess'))
    emit('compound-updated', updatedCompound)
  } catch (err) {
    toast.error(err.message || t('compounds.saveError'))
  } finally {
    saving.value = false
  }
}

const deleteCompound = () => {
  confirmDialog.value = {
    isOpen: true,
    title: t('compounds.deleteConfirmTitle'),
    message: t('compounds.deleteConfirm', { name: compound.value.name }),
    confirmText: t('common.delete'),
    loading: false,
    onConfirm: async () => {
      confirmDialog.value.loading = true
      try {
        await compoundsComposable.deleteCompound(compound.value.id)
        toast.success(t('compounds.deleteSuccess'))
        emit('compound-deleted', compound.value)
        handleClose()
      } catch (err) {
        toast.error(err.message || t('compounds.deleteError'))
      } finally {
        confirmDialog.value.loading = false
        confirmDialog.value.isOpen = false
      }
    }
  }
}

const openAddInstanceModal = () => {
  instanceFormModal.value = {
    isOpen: true,
    instance: null
  }
}

const editInstance = (instance) => {
  instanceFormModal.value = {
    isOpen: true,
    instance: instance
  }
}

const deleteInstance = (instance) => {
  confirmDialog.value = {
    isOpen: true,
    title: t('compounds.instances.delete'),
    message: t('compounds.instances.deleteConfirm'),
    confirmText: t('common.delete'),
    loading: false,
    onConfirm: async () => {
      confirmDialog.value.loading = true
      try {
        await instancesComposable.deleteInstance(instance.id)
        toast.success(t('compounds.instances.deleteSuccess'))
      } catch (err) {
        toast.error(err.message)
      } finally {
        confirmDialog.value.loading = false
        confirmDialog.value.isOpen = false
      }
    }
  }
}

const createTransaction = (instance = null) => {
  // For now, just show a toast notification
  // In a real implementation, this would open a transaction modal
  toast.info(t('compounds.detail.transactionFeatureComingSoon'))
}

const handleInstanceSaved = () => {
  instanceFormModal.value.isOpen = false
  // Instances will be automatically refreshed via the composable
}

const handleClose = () => {
  if (isEditing.value) {
    cancelEdit()
  }
  emit('update:modelValue', false)
}

const getExpiryClasses = (expiryDate) => {
  if (!expiryDate) return ''
  
  const expiry = new Date(expiryDate)
  const now = new Date()
  const thirtyDaysFromNow = new Date()
  thirtyDaysFromNow.setDate(now.getDate() + 30)
  
  if (expiry < now) return 'text-red-600 font-semibold'
  if (expiry <= thirtyDaysFromNow) return 'text-orange-600 font-semibold'
  return 'text-slate-900'
}

const getStatusVariant = (status) => {
  switch (status) {
    case 'active': return 'success'
    case 'expired': return 'destructive'
    case 'used_up': return 'secondary'
    default: return 'secondary'
  }
}

const getStatusLabel = (status) => {
  switch (status) {
    case 'active': return t('compounds.instances.statusActive')
    case 'expired': return t('compounds.instances.statusExpired')
    case 'used_up': return t('compounds.instances.statusUsedUp')
    default: return status
  }
}

// Watchers
watch(() => props.compoundId, (newId) => {
  if (newId && props.modelValue) {
    loadCompound()
  }
}, { immediate: true })

watch(() => props.modelValue, (isOpen) => {
  if (isOpen && props.compoundId) {
    loadCompound()
  }
})

// Load instances when modal opens
onMounted(() => {
  if (props.modelValue && props.compoundId) {
    instancesComposable.loadInstances()
  }
})
</script>
