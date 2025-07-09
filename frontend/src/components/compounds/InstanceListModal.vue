<template>
  <BaseModal
    :model-value="isOpen"
    :title="$t('compounds.instances.title')"
    size="xl"
    @update:model-value="isOpen = $event"
    @close="$emit('close')"
  >
    <template #description>
      <div class="flex items-center gap-2">
        <span>{{ compound?.name }}</span>
        <Badge :variant="hazardBadgeVariant">{{ compound?.hazardClass }}</Badge>
      </div>
      <p class="text-sm text-slate-600 mt-1">
        {{ $t('compounds.instances.description') }}
      </p>
    </template>

    <div class="space-y-4">
      <!-- Summary Section -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-lg">
        <div class="text-center">
          <div class="text-2xl font-bold text-slate-900">{{ summary.totalInstances }}</div>
          <div class="text-sm text-slate-500">{{ $t('compounds.instances.summary.totalInstances') }}</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-slate-900">{{ summary.totalQuantity }}</div>
          <div class="text-sm text-slate-500">{{ $t('compounds.instances.summary.totalQuantity') }}</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-slate-900">{{ summary.locations.length }}</div>
          <div class="text-sm text-slate-500">{{ $t('compounds.instances.summary.locations') }}</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-amber-600">{{ summary.expiringSoon }}</div>
          <div class="text-sm text-slate-500">{{ $t('compounds.instances.summary.expiringSoon') }}</div>
        </div>
      </div>

      <!-- Filters -->
      <div class="flex flex-wrap gap-2">
        <Input
          v-model="searchQuery"
          :placeholder="$t('compounds.instances.search')"
          size="sm"
          class="flex-1 min-w-48"
        />
        <select
          v-model="selectedLocation"
          class="px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">{{ $t('compounds.allLocations') }}</option>
          <option v-for="location in allLocations" :key="location" :value="location">
            {{ location }}
          </option>
        </select>
        <select
          v-model="selectedStatus"
          class="px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">{{ $t('compounds.instances.status') }}</option>
          <option value="active">{{ $t('compounds.instances.statusActive') }}</option>
          <option value="used_up">{{ $t('compounds.instances.statusUsedUp') }}</option>
          <option value="expired">{{ $t('compounds.instances.statusExpired') }}</option>
        </select>
      </div>

      <!-- Instances Table -->
      <div class="border border-slate-200 rounded-lg overflow-hidden">
        <table class="w-full">
          <thead class="bg-slate-50">
            <tr>
              <th class="px-4 py-3 text-left text-sm font-medium text-slate-900">
                {{ $t('compounds.instances.location') }}
              </th>
              <th class="px-4 py-3 text-left text-sm font-medium text-slate-900">
                {{ $t('compounds.instances.batchNumber') }}
              </th>
              <th class="px-4 py-3 text-left text-sm font-medium text-slate-900">
                {{ $t('compounds.instances.description') }}
              </th>
              <th class="px-4 py-3 text-left text-sm font-medium text-slate-900">
                {{ $t('compounds.instances.quantity') }}
              </th>
              <th class="px-4 py-3 text-left text-sm font-medium text-slate-900">
                {{ $t('compounds.instances.expiryDate') }}
              </th>
              <th class="px-4 py-3 text-left text-sm font-medium text-slate-900">
                {{ $t('compounds.instances.status') }}
              </th>
              <th class="px-4 py-3 text-left text-sm font-medium text-slate-900">
                {{ $t('compounds.instances.actions') }}
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200">
            <tr v-if="loading" class="h-32">
              <td colspan="7" class="text-center">
                <LoadingSpinner />
              </td>
            </tr>
            <tr v-else-if="filteredInstances.length === 0" class="h-32">
              <td colspan="7" class="text-center text-slate-500">
                {{ $t('compounds.instances.noInstances') }}
              </td>
            </tr>
            <tr v-else v-for="instance in filteredInstances" :key="instance.id" class="hover:bg-slate-50">
              <td class="px-4 py-3 text-sm text-slate-900">
                {{ instance.location }}
              </td>
              <td class="px-4 py-3 text-sm font-mono text-slate-900">
                {{ instance.batchNumber }}
              </td>
              <td class="px-4 py-3 text-sm text-slate-600">
                <span v-if="instance.description">{{ instance.description }}</span>
                <span v-else class="text-slate-400">-</span>
              </td>
              <td class="px-4 py-3 text-sm text-slate-900">
                <span :class="getQuantityClasses(instance)">
                  {{ instance.quantity }} {{ instance.unit }}
                </span>
              </td>
              <td class="px-4 py-3 text-sm text-slate-900">
                <span :class="getExpiryClasses(instance)">
                  {{ formatDate(instance.expiryDate) }}
                </span>
              </td>
              <td class="px-4 py-3 text-sm">
                <Badge :variant="getStatusVariant(instance.status)">
                  {{ getStatusLabel(instance.status) }}
                </Badge>
              </td>
              <td class="px-4 py-3 text-sm">
                <div class="flex gap-1">
                  <Button
                    variant="outline"
                    size="xs"
                    @click="editInstance(instance)"
                  >
                    {{ $t('compounds.instances.edit') }}
                  </Button>
                  <Button
                    variant="destructive"
                    size="xs"
                    @click="confirmDeleteInstance(instance)"
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

    <template #footer>
      <div class="flex justify-between">
        <Button variant="outline" @click="$emit('close')">
          {{ $t('common.close') }}
        </Button>
        <div class="flex gap-2">
          <Button variant="primary" @click="$emit('add-instance', compound)">
            {{ $t('compounds.instances.addNew') }}
          </Button>
        </div>
      </div>
    </template>
  </BaseModal>

  <!-- Delete Confirmation -->
  <ConfirmDialog
    v-model="showDeleteConfirm"
    :title="$t('compounds.instances.delete')"
    :message="$t('compounds.instances.deleteConfirm')"
    @confirm="deleteInstance"
    @cancel="showDeleteConfirm = false"
  />
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseModal from '@/components/ui/BaseModal.vue'
import Badge from '@/components/ui/Badge.vue'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
import { useCompoundInstances } from '@/composables/useCompoundInstances.js'
import { useHazardStyles } from '@/composables/useHazardStyles.js'
import { useFormat } from '@/utils/format.js'

const { t } = useI18n()
const { formatDate } = useFormat()
const { getHazardVariant } = useHazardStyles()
const instanceComposable = useCompoundInstances()

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  compound: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'close', 'add-instance', 'edit-instance'])

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// Local state
const searchQuery = ref('')
const selectedLocation = ref('')
const selectedStatus = ref('')
const showDeleteConfirm = ref(false)
const instanceToDelete = ref(null)
const loading = ref(false)

// Computed properties
const instances = computed(() => {
  if (!props.compound) return []
  return instanceComposable.getInstancesForCompound(props.compound.id)
})

const summary = computed(() => {
  if (!props.compound) return {}
  return instanceComposable.getInstanceSummary(props.compound.id)
})

const allLocations = computed(() => {
  return [...new Set(instances.value.map(i => i.location).filter(Boolean))]
})

const filteredInstances = computed(() => {
  let filtered = instances.value

  // Text search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(instance =>
      instance.location.toLowerCase().includes(query) ||
      instance.batchNumber.toLowerCase().includes(query)
    )
  }

  // Location filter
  if (selectedLocation.value) {
    filtered = filtered.filter(instance => instance.location === selectedLocation.value)
  }

  // Status filter
  if (selectedStatus.value) {
    filtered = filtered.filter(instance => instance.status === selectedStatus.value)
  }

  return filtered
})

const hazardBadgeVariant = computed(() => {
  if (!props.compound) return 'secondary'
  return getHazardVariant(props.compound.hazardClass)
})

// Methods
const getQuantityClasses = (instance) => {
  return {
    'text-red-600 font-medium': instance.quantity <= 0,
    'text-amber-600 font-medium': instance.quantity > 0 && instance.quantity <= 10,
    'text-green-600': instance.quantity > 10
  }
}

const getExpiryClasses = (instance) => {
  if (!instance.expiryDate) return 'text-slate-400'
  
  const expiryDate = new Date(instance.expiryDate)
  const now = new Date()
  const threeMonthsFromNow = new Date()
  threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3)
  
  if (expiryDate <= now) return 'text-red-600 font-medium'
  if (expiryDate <= threeMonthsFromNow) return 'text-amber-600 font-medium'
  return 'text-slate-900'
}

const getStatusVariant = (status) => {
  switch (status) {
    case 'active': return 'success'
    case 'used_up': return 'secondary'
    case 'expired': return 'destructive'
    default: return 'secondary'
  }
}

const getStatusLabel = (status) => {
  switch (status) {
    case 'active': return t('compounds.instances.statusActive')
    case 'used_up': return t('compounds.instances.statusUsedUp')
    case 'expired': return t('compounds.instances.statusExpired')
    default: return status
  }
}

const editInstance = (instance) => {
  // TODO: Implement edit instance functionality
  console.log('Edit instance:', instance)
}

const confirmDeleteInstance = (instance) => {
  instanceToDelete.value = instance
  showDeleteConfirm.value = true
}

const deleteInstance = async () => {
  if (!instanceToDelete.value) return
  
  try {
    loading.value = true
    await instanceComposable.deleteInstance(instanceToDelete.value.id)
    showDeleteConfirm.value = false
    instanceToDelete.value = null
  } catch (error) {
    console.error('Failed to delete instance:', error)
  } finally {
    loading.value = false
  }
}

// Reset filters when modal opens
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    searchQuery.value = ''
    selectedLocation.value = ''
    selectedStatus.value = ''
  }
})
</script>
