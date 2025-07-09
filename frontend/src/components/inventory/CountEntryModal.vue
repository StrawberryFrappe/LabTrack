<!--
  Count Entry Modal Component
  
  This modal provides a comprehensive interface for counting inventory instances
  during a count session. It displays all instances in a location and allows
  three-state verification (verified/discrepancy/not found).
  
  Features:
  - Display all instances in current location
  - Three-state verification workflow
  - Quantity adjustment controls
  - Notes for discrepancies
  - Progress tracking
  - Location navigation
-->

<template>
  <BaseModal
    v-model="isOpen"
    :title="`${$t('inventory.countEntry')}: ${currentLocation || ''}`"
    size="2xl"
    @close="handleClose"
  >
    <div class="flex flex-col h-full max-h-[90vh] min-h-[80vh]">
      <!-- Header with location info and progress -->
      <div class="flex-shrink-0 border-b border-gray-200 pb-4 mb-4">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-medium text-gray-900">
              {{ session?.name }}
            </h3>
            <p class="text-sm text-gray-500">
              {{ $t('inventory.countingLocation', { location: currentLocation }) }}
            </p>
          </div>
          <div class="text-right">
            <div class="text-sm text-gray-500">
              {{ $t('inventory.progress') }}
            </div>
            <div class="font-medium">
              {{ verifiedCount }} / {{ instancesInLocation.length }}
            </div>
          </div>
        </div>
        
        <!-- Progress bar -->
        <div class="mt-2 w-full bg-gray-200 rounded-full h-2">
          <div 
            class="bg-blue-500 h-2 rounded-full transition-all duration-300"
            :style="{ width: `${progressPercentage}%` }"
          />
        </div>
      </div>

      <!-- Instance list -->
      <div class="flex-1 overflow-y-auto">
        <!-- Action buttons -->
        <div class="mb-4 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            @click="showInstanceSelector = true"
          >
            {{ $t('inventory.findMisplacedInstance') }}
          </Button>
          <Button
            variant="outline"
            size="sm"
            @click="showInstanceFormModal = true"
          >
            {{ $t('inventory.createNewInstance') }}
          </Button>
        </div>

        <div class="space-y-6">
          <div 
            v-for="instance in instancesInLocation" 
            :key="instance.id"
            class="border border-gray-200 rounded-lg p-6 hover:bg-gray-50 transition-colors"
            :class="{
              'bg-green-50 border-green-200': getInstanceStatus(instance.id) === 'verified',
              'bg-yellow-50 border-yellow-200': getInstanceStatus(instance.id) === 'discrepancy', 
              'bg-red-50 border-red-200': getInstanceStatus(instance.id) === 'not_found'
            }"
          >
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
              <!-- Instance details -->
              <div class="lg:col-span-1">
                <h4 class="font-medium text-gray-900 text-base">
                  {{ getCompoundName(instance.compoundId) }}
                </h4>
                <div class="text-sm text-gray-500 space-y-1 mt-2">
                  <div>{{ $t('inventory.batchNumber') }}: {{ instance.batchNumber }}</div>
                  <div>{{ $t('inventory.expected') }}: {{ instance.quantity }} {{ instance.unit }}</div>
                  <div v-if="instance.expiryDate">
                    {{ $t('inventory.expiryDate') }}: {{ formatDate(instance.expiryDate) }}
                  </div>
                </div>
              </div>

              <!-- Verification controls -->
              <div class="lg:col-span-1">
                <div class="space-y-3">
                  <label class="block text-sm font-medium text-gray-700">
                    {{ $t('inventory.verificationStatus') }}
                  </label>
                  <div class="space-y-2">
                    <label class="flex items-center">
                      <input
                        type="radio"
                        :name="`status-${instance.id}`"
                        value="verified"
                        :checked="getInstanceStatus(instance.id) === 'verified'"
                        @change="updateInstanceStatus(instance.id, 'verified')"
                        class="mr-2"
                      />
                      <span class="text-sm">{{ $t('inventory.verified') }}</span>
                    </label>
                    <label class="flex items-center">
                      <input
                        type="radio"
                        :name="`status-${instance.id}`"
                        value="discrepancy"
                        :checked="getInstanceStatus(instance.id) === 'discrepancy'"
                        @change="updateInstanceStatus(instance.id, 'discrepancy')"
                        class="mr-2"
                      />
                      <span class="text-sm">{{ $t('inventory.discrepancy') }}</span>
                    </label>
                    <label class="flex items-center">
                      <input
                        type="radio"
                        :name="`status-${instance.id}`"
                        value="not_found"
                        :checked="getInstanceStatus(instance.id) === 'not_found'"
                        @change="updateInstanceStatus(instance.id, 'not_found')"
                        class="mr-2"
                      />
                      <span class="text-sm">{{ $t('inventory.notFound') }}</span>
                    </label>
                  </div>
                </div>
              </div>

              <!-- Quantity and notes -->
              <div class="lg:col-span-1">
                <div class="space-y-3">
                  <div>
                    <label class="block text-sm font-medium text-gray-700">
                      {{ $t('inventory.countedQuantity') }}
                    </label>
                    <Input
                      v-model.number="instanceCounts[instance.id]"
                      type="number"
                      min="0"
                      :placeholder="instance.quantity.toString()"
                      class="w-full"
                      @input="updateInstanceCount(instance.id, $event.target.value)"
                    />
                  </div>
                  <div v-if="getInstanceStatus(instance.id) === 'discrepancy'">
                    <label class="block text-sm font-medium text-gray-700">
                      {{ $t('inventory.notes') }}
                    </label>
                    <textarea
                      v-model="instanceNotes[instance.id]"
                      :placeholder="$t('inventory.discrepancyNotesPlaceholder')"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      rows="3"
                      @input="updateInstanceNotes(instance.id, $event.target.value)"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer actions -->
      <div class="flex-shrink-0 border-t border-gray-200 pt-4 mt-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <div class="text-sm text-gray-500">
              {{ $t('inventory.instancesVerified', { count: verifiedCount, total: instancesInLocation.length }) }}
            </div>
            <div v-if="isLocationComplete" class="flex items-center text-green-600">
              <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
              </svg>
              <span class="text-sm font-medium">{{ $t('inventory.locationComplete') }}</span>
            </div>
          </div>
          <div class="flex gap-2">
            <Button 
              variant="outline" 
              @click="handleClose"
            >
              {{ $t('common.close') }}
            </Button>
            <Button 
              variant="primary" 
              @click="saveProgress"
              :disabled="!hasChanges"
            >
              {{ $t('inventory.saveProgress') }}
            </Button>
          </div>
        </div>
      </div>
    </div>

    <!-- Instance Selector Modal -->
    <InstanceSelector
      v-if="showInstanceSelector"
      v-model="showInstanceSelector"
      :exclude-location="currentLocation"
      @select="handleInstanceFound"
    />

    <!-- New Instance Form Modal -->
    <InstanceFormModal
      v-if="showInstanceFormModal"
      v-model="showInstanceFormModal"
      :default-location="currentLocation"
      @created="handleInstanceCreated"
    />
  </BaseModal>
</template>

<script setup>
import { computed, ref, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseModal from '@/components/ui/BaseModal.vue'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import InstanceSelector from '@/components/inventory/InstanceSelector.vue'
import InstanceFormModal from '@/components/compounds/InstanceFormModal.vue'
import { useCompounds } from '@/composables/useCompounds'
import { useCompoundInstances } from '@/composables/useCompoundInstances'
import { useInventoryCount } from '@/composables/useInventoryCount'
import { useToast } from '@/composables/useToast'

const { t } = useI18n()
const { compounds } = useCompounds()
const { instances } = useCompoundInstances() 
const { updateSession } = useInventoryCount()
const { success, error } = useToast()

const props = defineProps({
  modelValue: Boolean,
  session: Object,
  currentLocation: String
})

const emit = defineEmits(['update:modelValue', 'progress-updated'])

const isOpen = computed({
  get: () => props.modelValue,
  set: v => emit('update:modelValue', v)
})

// Local state for instance counts and statuses
const instanceCounts = ref({})
const instanceStatuses = ref({})
const instanceNotes = ref({})
const hasChanges = ref(false)

// Modal state
const showInstanceSelector = ref(false)
const showInstanceFormModal = ref(false)

// Get instances for current location
const instancesInLocation = computed(() => {
  if (!props.currentLocation || !instances.value) return []
  
  return instances.value.filter(instance => 
    instance.location === props.currentLocation && 
    instance.status === 'active'
  )
})

// Get compound name by ID
const getCompoundName = (compoundId) => {
  const compound = compounds.value.find(c => c.id === compoundId)
  return compound ? compound.name : 'Unknown Compound'
}

// Simple date formatting
const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString()
}

// Instance status management
const getInstanceStatus = (instanceId) => {
  return instanceStatuses.value[instanceId] || 'unverified'
}

const updateInstanceStatus = (instanceId, status) => {
  instanceStatuses.value[instanceId] = status
  hasChanges.value = true
  
  // Auto-fill quantity if verified
  if (status === 'verified') {
    const instance = instancesInLocation.value.find(i => i.id === instanceId)
    if (instance) {
      instanceCounts.value[instanceId] = instance.quantity
    }
  }
  
  // Set quantity to 0 if not found
  if (status === 'not_found') {
    instanceCounts.value[instanceId] = 0
  }
}

const updateInstanceCount = (instanceId, count) => {
  instanceCounts.value[instanceId] = parseFloat(count) || 0
  hasChanges.value = true
  
  // Auto-update status based on quantity
  const instance = instancesInLocation.value.find(i => i.id === instanceId)
  if (instance) {
    const countedQuantity = parseFloat(count) || 0
    if (countedQuantity === 0) {
      instanceStatuses.value[instanceId] = 'not_found'
    } else if (countedQuantity === instance.quantity) {
      instanceStatuses.value[instanceId] = 'verified'
    } else {
      instanceStatuses.value[instanceId] = 'discrepancy'
    }
  }
}

const updateInstanceNotes = (instanceId, notes) => {
  instanceNotes.value[instanceId] = notes
  hasChanges.value = true
}

// Progress calculation
const verifiedCount = computed(() => {
  // Count instances that have been verified (not unverified)
  return Object.values(instanceStatuses.value).filter(status => 
    status === 'verified' || status === 'discrepancy' || status === 'not_found'
  ).length
})

const progressPercentage = computed(() => {
  if (instancesInLocation.value.length === 0) return 0
  return (verifiedCount.value / instancesInLocation.value.length) * 100
})

// Check if location counting is complete
const isLocationComplete = computed(() => {
  return instancesInLocation.value.length > 0 && 
         verifiedCount.value === instancesInLocation.value.length
})

// Save progress to session
const saveProgress = async () => {
  if (!props.session) return
  
  try {
    // Save ALL instances in the location, not just interacted ones
    // This ensures proper tracking for session completion
    const locationCounts = instancesInLocation.value.map(instance => ({
      instanceId: instance.id,
      expectedQuantity: instance.quantity,
      countedQuantity: instanceCounts.value[instance.id] !== undefined 
        ? instanceCounts.value[instance.id] 
        : instance.quantity, // Default to expected quantity if not set
      status: instanceStatuses.value[instance.id] || 'unverified',
      notes: instanceNotes.value[instance.id] || '',
      location: props.currentLocation,
      countedAt: new Date().toISOString(),
      interacted: Boolean(instanceStatuses.value[instance.id] || instanceCounts.value[instance.id] !== undefined)
    }))
    
    // Update session with new counts
    const existingCounts = props.session.counts || []
    const updatedCounts = existingCounts.filter(count => 
      count.location !== props.currentLocation
    )
    updatedCounts.push(...locationCounts)
    
    await updateSession(props.session.id, {
      counts: updatedCounts
    })
    
    hasChanges.value = false
    success(t('inventory.messages.progressSaved'))
    emit('progress-updated')
  } catch (err) {
    console.error('Error saving progress:', err)
    error(t('inventory.messages.progressSaveFailed'))
  }
}

// Load existing data when modal opens
const loadExistingData = () => {
  if (!props.session || !props.currentLocation) return
  
  // Load existing counts for this location
  const existingCounts = props.session.counts?.filter(count => 
    count.location === props.currentLocation
  ) || []
  
  // Reset state
  instanceCounts.value = {}
  instanceStatuses.value = {}
  instanceNotes.value = {}
  
  // Load existing data
  existingCounts.forEach(count => {
    instanceCounts.value[count.instanceId] = count.countedQuantity
    instanceStatuses.value[count.instanceId] = count.status
    instanceNotes.value[count.instanceId] = count.notes
  })
  
  hasChanges.value = false
}

// Handle modal close
const handleClose = () => {
  if (hasChanges.value) {
    if (confirm(t('inventory.messages.unsavedChanges'))) {
      isOpen.value = false
    }
  } else {
    isOpen.value = false
  }
}

// Handle finding misplaced instance
const handleInstanceFound = (instance) => {
  // Add instance to current location's count
  const countedQuantity = instance.quantity || 0
  instanceCounts.value[instance.id] = countedQuantity
  instanceStatuses.value[instance.id] = 'verified'
  instanceNotes.value[instance.id] = `Found from ${instance.location}`
  
  // Update instance location
  // This would typically update the instance's location in the database
  hasChanges.value = true
  
  success(t('inventory.messages.instanceFoundAdded'))
  showInstanceSelector.value = false
}

// Handle new instance creation
const handleInstanceCreated = (instance) => {
  // Add new instance to current location's count
  const countedQuantity = instance.quantity || 0
  instanceCounts.value[instance.id] = countedQuantity
  instanceStatuses.value[instance.id] = 'verified'
  instanceNotes.value[instance.id] = t('inventory.newInstanceCreated')
  
  hasChanges.value = true
  
  success(t('inventory.messages.instanceCreatedAdded'))
  showInstanceFormModal.value = false
}

// Watch for modal open/close
watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    loadExistingData()
  }
})

// Load data when location changes
watch(() => props.currentLocation, () => {
  if (props.modelValue) {
    loadExistingData()
  }
})

onMounted(() => {
  if (props.modelValue) {
    loadExistingData()
  }
})
</script>
