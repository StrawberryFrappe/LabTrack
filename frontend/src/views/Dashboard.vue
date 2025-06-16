<template>
  <div class="min-h-screen bg-slate-50">
    <!-- Top Navigation -->
    <nav class="bg-white shadow-sm border-b border-slate-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <h1 class="text-xl font-semibold text-slate-900">LabTrack</h1>
          </div>
          <div class="flex items-center space-x-4">
            <Button
              v-for="view in views"
              :key="view.id"
              :variant="currentView === view.id ? 'primary' : 'outline'"
              size="sm"
              @click="currentView = view.id"
            >
              {{ view.label }}
            </Button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Dashboard View -->
      <div v-if="currentView === 'dashboard'" class="space-y-8">
        <div>
          <h2 class="text-2xl font-bold text-slate-900 mb-2">Dashboard</h2>
          <p class="text-slate-600">Overview of your laboratory inventory</p>
        </div>
        
        <DashboardCards />
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Low Stock Items -->
          <Card>
            <template #header>
              <h3 class="text-lg font-semibold text-slate-900">Low Stock Items</h3>
            </template>
            <div v-if="lowStockItems.length === 0" class="text-center py-8 text-slate-500">
              <div class="text-2xl mb-2">✅</div>
              <p>All items are adequately stocked</p>
            </div>
            <div v-else class="space-y-3">
              <div 
                v-for="item in lowStockItems.slice(0, 5)" 
                :key="item.id"
                class="flex items-center justify-between p-3 bg-red-50 rounded-lg"
              >
                <div>
                  <div class="font-medium text-slate-900">{{ item.name }}</div>
                  <div class="text-sm text-slate-600">{{ item.location }}</div>
                </div>
                <div class="text-right">
                  <div class="font-semibold text-red-600">{{ item.quantity }} {{ item.unit }}</div>
                  <div class="text-xs text-slate-500">Need: {{ item.threshold }} {{ item.unit }}</div>
                </div>
              </div>
              <div v-if="lowStockItems.length > 5" class="text-center text-sm text-slate-500">
                And {{ lowStockItems.length - 5 }} more items...
              </div>
            </div>
          </Card>
          
          <!-- Expiring Items -->
          <Card>
            <template #header>
              <h3 class="text-lg font-semibold text-slate-900">Expiring Soon</h3>
            </template>
            <div v-if="expiringItems.length === 0" class="text-center py-8 text-slate-500">
              <div class="text-2xl mb-2">📅</div>
              <p>No items expiring in the next 3 months</p>
            </div>
            <div v-else class="space-y-3">
              <div 
                v-for="item in expiringItems.slice(0, 5)" 
                :key="item.id"
                class="flex items-center justify-between p-3 bg-yellow-50 rounded-lg"
              >
                <div>
                  <div class="font-medium text-slate-900">{{ item.name }}</div>
                  <div class="text-sm text-slate-600">{{ item.location }}</div>
                </div>
                <div class="text-right">
                  <div class="font-semibold text-yellow-600">{{ formatDate(item.expiryDate) }}</div>
                  <div class="text-xs text-slate-500">{{ getDaysUntilExpiry(item.expiryDate) }} days</div>
                </div>
              </div>
              <div v-if="expiringItems.length > 5" class="text-center text-sm text-slate-500">
                And {{ expiringItems.length - 5 }} more items...
              </div>
            </div>
          </Card>
        </div>
      </div>

      <!-- Compounds View -->
      <div v-else-if="currentView === 'compounds'" class="space-y-8">
        <div>
          <h2 class="text-2xl font-bold text-slate-900 mb-2">Chemical Compounds</h2>
          <p class="text-slate-600">Manage your laboratory chemical inventory</p>
        </div>
        
        <CompoundList />
      </div>

      <!-- Inventory Count View -->
      <div v-else-if="currentView === 'inventory-count'" class="space-y-8">
        <div>
          <h2 class="text-2xl font-bold text-slate-900 mb-2">Inventory Count</h2>
          <p class="text-slate-600">Scan and count your laboratory inventory</p>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Button from '@/components/ui/Button.vue'
import Card from '@/components/ui/Card.vue'
import Input from '@/components/ui/Input.vue'
import DashboardCards from '@/components/dashboard/DashboardCards.vue'
import CompoundList from '@/components/compounds/CompoundList.vue'
import InventoryScanner from '@/components/inventory/InventoryScanner.vue'
import CountSession from '@/components/inventory/CountSession.vue'
import { useCompounds } from '@/composables/useCompounds'
import { useInventoryCount } from '@/composables/useInventoryCount'

// Navigation
const currentView = ref('dashboard')
const views = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'compounds', label: 'Compounds' },
  { id: 'inventory-count', label: 'Inventory Count' }
]

// Compounds data
const { lowStockItems, expiringItems } = useCompounds()

// Inventory count data
const { 
  activeSessions, 
  completedSessions, 
  createCountSession 
} = useInventoryCount()

// New session form
const newSessionName = ref('')
const newSessionDescription = ref('')
const newSessionLocation = ref('')

// Methods
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const getDaysUntilExpiry = (dateString) => {
  const expiryDate = new Date(dateString)
  const today = new Date()
  const diffTime = expiryDate - today
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

const createNewSession = () => {
  if (newSessionName.value.trim()) {
    createCountSession({
      name: newSessionName.value.trim(),
      description: newSessionDescription.value.trim(),
      location: newSessionLocation.value.trim() || 'Main Lab'
    })
    
    // Reset form
    newSessionName.value = ''
    newSessionDescription.value = ''
    newSessionLocation.value = ''
  }
}

const handleContinueSession = (session) => {
  // TODO: Implement session continuation
  console.log('Continue session:', session)
}

const handleViewSessionDetails = (session) => {
  // TODO: Implement session details view
  console.log('View session details:', session)
}

const handleCompleteSession = (session) => {
  // TODO: Implement session completion
  console.log('Complete session:', session)
}
</script>
