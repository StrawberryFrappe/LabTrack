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
    :title="`${$t('inventory.countEntry')}: ${session?.name || ''}`"
    size="3xl"
    @close="handleClose"
  >
    <div class="flex flex-col h-full max-h-[90vh] min-h-[80vh]">
      <!-- Header with overall progress -->
      <div class="flex-shrink-0 border-b border-gray-200 pb-4 mb-4">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-medium text-gray-900">
              {{ session?.name }}
            </h3>
            <p class="text-sm text-gray-500">
              {{ $t('inventory.countingAllLocations') }}
            </p>
          </div>
          <div class="text-right">
            <div class="text-sm text-gray-500">
              {{ $t('inventory.overallProgress') }}
            </div>
            <div class="font-medium">
              {{ totalVerifiedCount }} / {{ totalInstancesCount }}
            </div>
          </div>
        </div>
        
        <!-- Overall progress bar -->
        <div class="mt-2 w-full bg-gray-200 rounded-full h-2">
          <div 
            class="bg-blue-500 h-2 rounded-full transition-all duration-300"
            :style="{ width: `${overallProgressPercentage}%` }"
          />
        </div>
      </div>

      <!-- Instance list grouped by location -->
      <div class="flex-1 overflow-y-auto">
        <!-- Global action buttons -->
        <div class="mb-6 flex gap-2">
          <Button
            variant="primary"
            size="sm"
            @click="verifyAllInstances"
            :disabled="totalVerifiedCount === totalInstancesCount"
          >
            {{ $t('inventory.verifyAllInstances') }}
          </Button>
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

        <!-- Location groups -->
        <div class="space-y-8">
          <div 
            v-for="locationGroup in locationGroups" 
            :key="locationGroup.location"
            class="border border-gray-300 rounded-lg overflow-hidden"
          >
            <!-- Location header with bulk actions -->
            <div class="bg-slate-50 px-6 py-4 border-b border-gray-200">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-4">
                  <h4 class="text-lg font-semibold text-gray-900">
                    📍 {{ locationGroup.location }}
                  </h4>
                  <div class="flex items-center space-x-2">
                    <span class="text-sm text-gray-500">
                      {{ getLocationVerifiedCount(locationGroup.location) }} / {{ locationGroup.instances.length }}
                    </span>
                    <div 
                      v-if="isLocationComplete(locationGroup.location)"
                      class="flex items-center text-green-600"
                    >
                      <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                      </svg>
                      <span class="text-sm font-medium">{{ $t('inventory.locationComplete') }}</span>
                    </div>
                  </div>
                </div>
                
                <!-- Location bulk actions -->
                <div class="flex gap-2">
                  <Button
                    variant="outline"
                    size="xs"
                    @click="verifyLocationInstances(locationGroup.location)"
                    :disabled="isLocationComplete(locationGroup.location)"
                  >
                    {{ $t('inventory.verifyAllInLocation') }}
                  </Button>
                  <Button
                    variant="outline"
                    size="xs"
                    @click="toggleLocationCollapse(locationGroup.location)"
                  >
                    {{ isLocationCollapsed(locationGroup.location) ? $t('common.expand') : $t('common.collapse') }}
                  </Button>
                </div>
              </div>
              
              <!-- Location progress bar -->
              <div class="mt-3 w-full bg-gray-200 rounded-full h-1.5">
                <div 
                  class="bg-green-500 h-1.5 rounded-full transition-all duration-300"
                  :style="{ width: `${getLocationProgressPercentage(locationGroup.location)}%` }"
                />
              </div>
            </div>

            <!-- Location instances (collapsible) -->
            <div 
              v-show="!isLocationCollapsed(locationGroup.location)"
              class="p-6 space-y-4"
            >
              <div 
                v-for="instance in locationGroup.instances" 
                :key="instance.id"
                class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                :class="{
                  'bg-green-50 border-green-200': getInstanceStatus(instance.id) === 'verified',
                  'bg-yellow-50 border-yellow-200': getInstanceStatus(instance.id) === 'discrepancy', 
                  'bg-red-50 border-red-200': getInstanceStatus(instance.id) === 'not_found'
                }"
              >
                <div class="grid grid-cols-1 lg:grid-cols-4 gap-4">
                  <!-- Instance details -->
                  <div class="lg:col-span-1">
                    <h5 class="font-medium text-gray-900 text-sm">
                      {{ getCompoundName(instance.compoundId) }}
                    </h5>
                    <div class="text-xs text-gray-500 space-y-1 mt-1">
                      <div>{{ $t('inventory.batchNumber') }}: {{ instance.batchNumber }}</div>
                      <div>{{ $t('inventory.expected') }}: {{ instance.quantity }} {{ instance.unit }}</div>
                    </div>
                  </div>

                  <!-- Quick verify button -->
                  <div class="lg:col-span-1 flex items-center">
                    <Button
                      variant="outline"
                      size="xs"
                      @click="quickVerifyInstance(instance.id)"
                      :disabled="getInstanceStatus(instance.id) === 'verified'"
                      class="w-full"
                    >
                      ✓ {{ $t('inventory.quickVerify') }}
                    </Button>
                  </div>

                  <!-- Status display -->
                  <div class="lg:col-span-1 flex items-center">
                    <div class="flex items-center space-x-2">
                      <div 
                        class="w-3 h-3 rounded-full"
                        :class="{
                          'bg-green-500': getInstanceStatus(instance.id) === 'verified',
                          'bg-yellow-500': getInstanceStatus(instance.id) === 'discrepancy',
                          'bg-red-500': getInstanceStatus(instance.id) === 'not_found',
                          'bg-gray-300': getInstanceStatus(instance.id) === 'unverified'
                        }"
                      />
                      <span class="text-sm text-gray-700">
                        {{ getStatusLabel(getInstanceStatus(instance.id)) }}
                      </span>
                    </div>
                  </div>

                  <!-- Expand for detailed verification -->
                  <div class="lg:col-span-1 flex items-center justify-end">
                    <Button
                      variant="ghost"
                      size="xs"
                      @click="toggleInstanceDetails(instance.id)"
                    >
                      {{ isInstanceExpanded(instance.id) ? $t('common.collapse') : $t('inventory.detailedCount') }}
                    </Button>
                  </div>
                </div>

                <!-- Expanded instance details -->
                <div 
                  v-show="isInstanceExpanded(instance.id)"
                  class="mt-4 pt-4 border-t border-gray-200"
                >
                  <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <!-- Verification controls -->
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
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

                    <!-- Quantity input -->
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        {{ $t('inventory.countedQuantity') }}
                      </label>
                      <Input
                        v-model.number="instanceCounts[instance.id]"
                        type="number"
                        min="0"
                        :placeholder="instance.quantity.toString()"
                        @input="updateInstanceCount(instance.id, $event.target.value)"
                      />
                    </div>

                    <!-- Notes -->
                    <div v-if="getInstanceStatus(instance.id) === 'discrepancy'">
                      <label class="block text-sm font-medium text-gray-700 mb-2">
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
      </div>

      <!-- Footer actions -->
      <div class="flex-shrink-0 border-t border-gray-200 pt-4 mt-4">
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-500">
            {{ $t('inventory.totalInstancesVerified', { 
              count: totalVerifiedCount, 
              total: totalInstancesCount,
              locations: locationGroups.length 
            }) }}
          </div>
          <div class="flex gap-2">
            <Button variant="outline" @click="handleClose">
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
      @select="handleInstanceFound"
    />

    <!-- New Instance Form Modal -->
    <InstanceFormModal
      v-if="showInstanceFormModal"
      v-model="showInstanceFormModal"
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

// New reactive state for UI controls
const collapsedLocations = ref(new Set())
const expandedInstances = ref(new Set())

// Modal state
const showInstanceSelector = ref(false)
const showInstanceFormModal = ref(false)

// Updated computed properties for location-grouped interface
const locationGroups = computed(() => {
  if (!props.session?.locations || !instances.value) return []
  
  return props.session.locations.map(location => ({
    location,
    instances: instances.value.filter(instance => 
      instance.location === location && instance.status === 'active'
    )
  })).filter(group => group.instances.length > 0)
})

const totalInstancesCount = computed(() => {
  return locationGroups.value.reduce((total, group) => total + group.instances.length, 0)
})

const totalVerifiedCount = computed(() => {
  return Object.values(instanceStatuses.value).filter(status => 
    status === 'verified' || status === 'discrepancy' || status === 'not_found'
  ).length
})

const overallProgressPercentage = computed(() => {
  if (totalInstancesCount.value === 0) return 0
  return (totalVerifiedCount.value / totalInstancesCount.value) * 100
})

// Get instances for current location (kept for backward compatibility)
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
    const instance = instances.value.find(i => i.id === instanceId)
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
  const instance = instances.value.find(i => i.id === instanceId)
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

// Location-specific helper methods
const getLocationVerifiedCount = (location) => {
  const locationInstances = instances.value.filter(i => 
    i.location === location && i.status === 'active'
  )
  return locationInstances.filter(instance => {
    const status = instanceStatuses.value[instance.id]
    return status === 'verified' || status === 'discrepancy' || status === 'not_found'
  }).length
}

const getLocationProgressPercentage = (location) => {
  const locationInstances = instances.value.filter(i => 
    i.location === location && i.status === 'active'
  )
  if (locationInstances.length === 0) return 0
  return (getLocationVerifiedCount(location) / locationInstances.length) * 100
}

const isLocationComplete = (location) => {
  const locationInstances = instances.value.filter(i => 
    i.location === location && i.status === 'active'
  )
  return locationInstances.length > 0 && 
         getLocationVerifiedCount(location) === locationInstances.length
}

// Bulk verification methods
const verifyAllInstances = () => {
  locationGroups.value.forEach(group => {
    group.instances.forEach(instance => {
      if (!instanceStatuses.value[instance.id] || instanceStatuses.value[instance.id] === 'unverified') {
        instanceStatuses.value[instance.id] = 'verified'
        instanceCounts.value[instance.id] = instance.quantity
      }
    })
  })
  hasChanges.value = true
}

const verifyLocationInstances = (location) => {
  const locationInstances = instances.value.filter(i => 
    i.location === location && i.status === 'active'
  )
  
  locationInstances.forEach(instance => {
    if (!instanceStatuses.value[instance.id] || instanceStatuses.value[instance.id] === 'unverified') {
      instanceStatuses.value[instance.id] = 'verified'
      instanceCounts.value[instance.id] = instance.quantity
    }
  })
  hasChanges.value = true
}

const quickVerifyInstance = (instanceId) => {
  const instance = instances.value.find(i => i.id === instanceId)
  if (instance) {
    instanceStatuses.value[instanceId] = 'verified'
    instanceCounts.value[instanceId] = instance.quantity
    hasChanges.value = true
  }
}

// UI state management
const isLocationCollapsed = (location) => {
  return collapsedLocations.value.has(location)
}

const toggleLocationCollapse = (location) => {
  if (collapsedLocations.value.has(location)) {
    collapsedLocations.value.delete(location)
  } else {
    collapsedLocations.value.add(location)
  }
}

const isInstanceExpanded = (instanceId) => {
  return expandedInstances.value.has(instanceId)
}

const toggleInstanceDetails = (instanceId) => {
  if (expandedInstances.value.has(instanceId)) {
    expandedInstances.value.delete(instanceId)
  } else {
    expandedInstances.value.add(instanceId)
  }
}

const getStatusLabel = (status) => {
  const labels = {
    'verified': t('inventory.verified'),
    'discrepancy': t('inventory.discrepancy'), 
    'not_found': t('inventory.notFound'),
    'unverified': t('inventory.unverified')
  }
  return labels[status] || status
}

// Save progress to session
const saveProgress = async () => {
  if (!props.session) return
  
  try {
    // Save ALL instances across all locations
    const allLocationCounts = []
    
    locationGroups.value.forEach(group => {
      const locationCounts = group.instances.map(instance => ({
        instanceId: instance.id,
        expectedQuantity: instance.quantity,
        countedQuantity: instanceCounts.value[instance.id] !== undefined 
          ? instanceCounts.value[instance.id] 
          : instance.quantity, // Default to expected quantity if not set
        status: instanceStatuses.value[instance.id] || 'unverified',
        notes: instanceNotes.value[instance.id] || '',
        location: group.location,
        countedAt: new Date().toISOString(),
        interacted: Boolean(instanceStatuses.value[instance.id] || instanceCounts.value[instance.id] !== undefined)
      }))
      
      allLocationCounts.push(...locationCounts)
    })
    
    // Update session with new counts
    await updateSession(props.session.id, {
      counts: allLocationCounts
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
  if (!props.session) return
  
  // Load existing counts for all locations
  const existingCounts = props.session.counts || []
  
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

// Load data when session changes
watch(() => props.session, () => {
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
