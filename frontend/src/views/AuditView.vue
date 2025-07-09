<!--
  Inventory View Component
  
  This view handles inventory counting functionality including
  creating count sessions, managing ongoing counts, and viewing
  count history.
  
  Features:
  - Create new count sessions ⏳ PARTIAL
  - Manage active count sessions ⏳ PARTIAL
  - View completed count history ✅ BASIC
  - Manual count entry (no barcode for TRL3) 
  
  🚨 TRL3 CRITICAL TODOS - WEEK 2-3 PRIORITY:
  1. TODO TRL3-CRITICAL: Complete CountSession.vue workflow implementation
  2. TODO TRL3-CRITICAL: Finish CountEntryModal.vue for manual count entry
  3. TODO TRL3-CRITICAL: Implement count discrepancy detection and reporting
  4. TODO TRL3-CRITICAL: Connect to useInventoryCount.js composable completely
  5. TODO TRL3-CRITICAL: Add count session persistence and management
  
  📋 TRL3 SECONDARY TODOS:
  - TODO TRL3: Add count session templates for common areas
  - TODO TRL3: Implement basic count variance analysis
  - TODO TRL3: Add count reports (PDF/Excel export)
  - TODO TRL3: Implement count scheduling (weekly/monthly)
  
-->

<template>
  <div class="space-y-8">    <!-- Page Header -->
    
    <!-- Inventory Management Content -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      
      <div class="space-y-6">
        <!-- Active Sessions -->
        <div v-if="activeSessions.length > 0">
          <h3 class="text-lg font-semibold text-slate-900 mb-4">{{$t('inventory.activeSessions')}}</h3>
          <div class="space-y-4">
            <CountSession
              v-for="session in activeSessions"
              :key="session.id"
              :session="session"
              @continue="handleContinueSession"
              @view-details="handleViewSessionDetails"
              @complete="handleCompleteSession"
            />
          </div>
        </div>
        
        <!-- Recent Sessions -->
        <div v-if="completedSessions.length > 0">
          <h3 class="text-lg font-semibold text-slate-900 mb-4">{{$t('inventory.recentSessions')}}</h3>
          <div class="space-y-4">
            <CountSession
              v-for="session in completedSessions.slice(0, 3)"
              :key="session.id"
              :session="session"
              @view-details="handleViewSessionDetails"
            />
          </div>
        </div>
        
        <!-- Create New Session -->
        <Card>
          <template #header>
            <h3 class="text-lg font-semibold text-slate-900">{{$t('inventory.createSessionTitle')}}</h3>
          </template>
          <div class="space-y-4">
            <Input
              v-model="newSessionName"
              :placeholder="$t('inventory.sessionNamePlaceholder')"
              :label="$t('inventory.sessionNameLabel')"
              required
            />
            <Input
              v-model="newSessionDescription"
              :placeholder="$t('inventory.sessionDescriptionPlaceholder')"
              :label="$t('inventory.sessionDescriptionLabel')"
            />
            
            <!-- Location Selection -->
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">
                {{$t('inventory.sessionLocationsLabel')}}
              </label>
              <div v-if="availableLocations.length > 0" class="space-y-2">
                <!-- Select All Toggle -->
                <div class="flex items-center">
                  <input
                    id="select-all-locations"
                    type="checkbox"
                    :checked="selectedLocations.length === availableLocations.length"
                    :indeterminate="selectedLocations.length > 0 && selectedLocations.length < availableLocations.length"
                    @change="toggleAllLocations"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label for="select-all-locations" class="ml-2 text-sm font-medium text-slate-700">
                    {{$t('inventory.selectAllLocations')}}
                  </label>
                </div>
                
                <!-- Location Grid -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-48 overflow-y-auto border border-slate-200 rounded p-3 bg-slate-50">
                  <div 
                    v-for="location in availableLocations" 
                    :key="location"
                    class="flex items-center justify-between p-2 hover:bg-slate-100 rounded"
                  >
                    <div class="flex items-center min-w-0">
                      <input
                        :id="`location-${location}`"
                        type="checkbox"
                        :value="location"
                        :checked="selectedLocations.includes(location)"
                        @change="toggleLocation(location)"
                        class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded flex-shrink-0"
                      />
                      <label 
                        :for="`location-${location}`" 
                        class="ml-2 text-sm text-slate-700 cursor-pointer truncate"
                      >
                        {{ location }}
                      </label>
                    </div>
                    <div class="text-xs text-slate-500 flex-shrink-0 ml-2">
                      {{ getLocationStats(location).totalInstances }} {{ $t('inventory.itemsShort') }}
                    </div>
                  </div>
                </div>
                
                <!-- Selected Count -->
                <div class="text-sm text-slate-500">
                  {{$t('inventory.locationsSelected', { count: selectedLocations.length, total: availableLocations.length })}}
                </div>
              </div>
              <div v-else class="text-sm text-slate-500 italic">
                {{$t('inventory.noLocationsAvailable')}}
              </div>
            </div>
          </div>
          <template #footer>
            <Button 
              variant="primary"
              @click="createNewSession"
              :disabled="!newSessionName.trim() || selectedLocations.length === 0 || isCreatingSession"
              :loading="isCreatingSession"
            >
              {{$t('inventory.createSessionButton')}}
            </Button>
          </template>
        </Card>
      </div>
    </div>
    
    <!-- Count Entry Modal -->
    <CountEntryModal
      v-model="showCountEntryModal"
      :session="currentCountSession"
      :current-location="currentCountLocation"
      @progress-updated="loadAvailableLocations"
      @location-complete="handleLocationComplete"
      @close="handleModalClose"
    />
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import Card from '@/components/ui/Card.vue'
import Input from '@/components/ui/Input.vue'
import Button from '@/components/ui/Button.vue'
import CountSession from '@/components/inventory/CountSession.vue'
import CountEntryModal from '@/components/inventory/CountEntryModal.vue'
import { useToast } from '@/composables/useToast'
import { useAuth } from '@/composables/useAuth'
import { useInventoryCount } from '@/composables/useInventoryCount'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { isAdmin } = useAuth()
const { success, error, warning } = useToast()

// Inventory count composable
const { 
  activeSessions, 
  completedSessions, 
  createSession,
  continueSession,
  completeSession,
  getAvailableLocations,
  getLocationStats,
  canCompleteSession,
  getSessionCompletionStatus,
  isLoading,
  error: composableError
} = useInventoryCount()

// New session form
const newSessionName = ref('')
const newSessionDescription = ref('')
const selectedLocations = ref([])
const availableLocations = ref([])
const isCreatingSession = ref(false)

// Count entry modal state
const showCountEntryModal = ref(false)
const currentCountSession = ref(null)
const currentCountLocation = ref(null)
const currentLocationIndex = ref(0)

// Load available locations
const loadAvailableLocations = () => {
  availableLocations.value = getAvailableLocations()
}

// Watch for location changes
watch(() => availableLocations.value, loadAvailableLocations, { immediate: true })

// Session management methods
const createNewSession = async () => {
  if (!newSessionName.value.trim() || selectedLocations.value.length === 0) {
    warning(t('inventory.messages.nameAndLocationsRequired'))
    return
  }
  
  // Check for duplicate session names
  const existingSession = activeSessions.value.find(session => 
    session.name.toLowerCase() === newSessionName.value.trim().toLowerCase()
  )
  if (existingSession) {
    warning(t('inventory.messages.duplicateSessionName'))
    return
  }
  
  isCreatingSession.value = true
  
  try {
    await createSession({
      name: newSessionName.value.trim(),
      description: newSessionDescription.value,
      locations: selectedLocations.value
    })
    
    // Clear form
    newSessionName.value = ''
    newSessionDescription.value = ''
    selectedLocations.value = []
    
    success(t('inventory.messages.sessionCreated'))
  } catch (err) {
    console.error('Error creating session:', err)
    error(t('inventory.messages.sessionCreationFailed'))
  } finally {
    isCreatingSession.value = false
  }
}

const toggleLocation = (location) => {
  const index = selectedLocations.value.indexOf(location)
  if (index > -1) {
    selectedLocations.value.splice(index, 1)
  } else {
    selectedLocations.value.push(location)
  }
}

const toggleAllLocations = () => {
  if (selectedLocations.value.length === availableLocations.value.length) {
    selectedLocations.value = []
  } else {
    selectedLocations.value = [...availableLocations.value]
  }
}

const handleContinueSession = (session) => {
  const continuedSession = continueSession(session.id)
  if (continuedSession) {
    currentCountSession.value = session
    currentLocationIndex.value = 0
    
    // Start with first location
    if (session.locations && session.locations.length > 0) {
      currentCountLocation.value = session.locations[0]
      showCountEntryModal.value = true
    }
    
    success(t('inventory.messages.sessionContinued'))
  }
}

const handleLocationComplete = () => {
  if (!currentCountSession.value) return
  
  // Move to next location
  currentLocationIndex.value++
  
  if (currentLocationIndex.value < currentCountSession.value.locations.length) {
    currentCountLocation.value = currentCountSession.value.locations[currentLocationIndex.value]
  } else {
    // All locations completed
    showCountEntryModal.value = false
    currentCountSession.value = null
    currentCountLocation.value = null
    success(t('inventory.messages.allLocationsCompleted'))
  }
}

const handleModalClose = () => {
  showCountEntryModal.value = false
  currentCountSession.value = null
  currentCountLocation.value = null
}

const handleViewSessionDetails = (session) => {
  // TODO: Navigate to count session details
  console.log('Viewing session details:', session.id)
}

const handleCompleteSession = async (session) => {
  try {
    // Check if session can be completed
    const completionStatus = getSessionCompletionStatus(session.id)
    
    if (!completionStatus.canComplete) {
      warning(t('inventory.messages.cannotCompleteSession', { 
        reason: completionStatus.reason 
      }))
      return
    }
    
    // Confirm completion
    const confirmMessage = t('inventory.messages.confirmCompleteSession', {
      name: session.name,
      verified: completionStatus.verifiedInstances,
      total: completionStatus.totalInstances
    })
    
    if (!confirm(confirmMessage)) {
      return
    }
    
    await completeSession(session.id)
    success(t('inventory.messages.sessionCompleted'))
  } catch (err) {
    console.error('Error completing session:', err)
    error(t('inventory.messages.sessionCompletionFailed'))
  }
}

// Load locations when component mounts
onMounted(() => {
  loadAvailableLocations()
})

// TODO TRL3-CRITICAL: Complete inventory count workflow integration
// Key integration points needed:
// 1. Complete count session creation workflow
// 2. Implement manual count entry via CountEntryModal
// 3. Add count completion and discrepancy reporting
// 4. Connect all operations to useInventoryCount composable
// 5. Add count reports and export functionality

// TODO TRL3-CRITICAL: Fix missing workflow connections
// Current status: Components exist but not fully integrated
// - CountSession.vue: Basic structure ✅, workflow incomplete ❌
// - CountEntryModal.vue: Exists but not connected ❌  
// - useInventoryCount.js: Partial implementation ❌
// - Count persistence: Not implemented ❌
// - Discrepancy logic: Exists but not integrated ❌
</script>
