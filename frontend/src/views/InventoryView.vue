<!--
  Inventory View Component
  
  This view handles inventory counting functionality including
  creating count sessions, managing ongoing counts, and viewing
  count history.
  
  Features:
  - Create new count sessions
  - Manage active count sessions
  - View completed count history
  - Barcode scanning integration
  
  TODO: Add count session templates
  TODO: Implement bulk count operations
  TODO: Add count variance analysis
  TODO: Implement count scheduling
-->

<template>
  <div class="space-y-8">    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <!-- TODO i18n: Internationalize "Inventory Counts" -->
        <h1 class="text-2xl font-bold text-slate-900">Inventory Counts</h1>
        <!-- TODO i18n: Internationalize "Manage physical inventory counting sessions" -->
        <p class="text-slate-600 mt-1">Manage physical inventory counting sessions</p>
      </div>
    </div>
    
    <!-- Inventory Management Content -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Inventory Scanner -->
      <InventoryScanner />
      
      <div class="space-y-6">
        <!-- Active Sessions -->
        <div v-if="activeSessions.length > 0">
          <h3 class="text-lg font-semibold text-slate-900 mb-4">Active Count Sessions</h3>
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
          <h3 class="text-lg font-semibold text-slate-900 mb-4">Recent Sessions</h3>
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
            <h3 class="text-lg font-semibold text-slate-900">Create New Count Session</h3>
          </template>
          <div class="space-y-4">
            <Input
              v-model="newSessionName"
              placeholder="Session name"
              label="Name"
            />
            <Input
              v-model="newSessionDescription"
              placeholder="Session description"
              label="Description"
            />
            <Input
              v-model="newSessionLocation"
              placeholder="Location to count"
              label="Location"
            />
          </div>
          <template #footer>
            <Button 
              variant="primary"
              @click="createNewSession"
              :disabled="!newSessionName.trim()"
            >
              Create Session
            </Button>
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Card from '@/components/ui/Card.vue'
import Input from '@/components/ui/Input.vue'
import Button from '@/components/ui/Button.vue'
import InventoryScanner from '@/components/inventory/InventoryScanner.vue'
import CountSession from '@/components/inventory/CountSession.vue'
import { useInventoryCount } from '@/composables/useInventoryCount.js'

// Inventory count composable
const { 
  activeSessions, 
  completedSessions, 
  createSession,
  continueSession,
  completeSession 
} = useInventoryCount()

// New session form
const newSessionName = ref('')
const newSessionDescription = ref('')
const newSessionLocation = ref('')

// Session management methods
const createNewSession = async () => {
  if (!newSessionName.value.trim()) return
  
  try {
    await createSession({
      name: newSessionName.value,
      description: newSessionDescription.value,
      location: newSessionLocation.value
    })
    
    // Clear form
    newSessionName.value = ''
    newSessionDescription.value = ''
    newSessionLocation.value = ''
  } catch (error) {
    console.error('Error creating session:', error)
    // TODO: Show error notification
  }
}

const handleContinueSession = (sessionId) => {
  continueSession(sessionId)
  // TODO: Navigate to count session details
}

const handleViewSessionDetails = (sessionId) => {
  // TODO: Navigate to count session details
  console.log('Viewing session details:', sessionId)
}

const handleCompleteSession = async (sessionId) => {
  try {
    await completeSession(sessionId)
    // TODO: Show success notification
  } catch (error) {
    console.error('Error completing session:', error)
    // TODO: Show error notification
  }
}
</script>
