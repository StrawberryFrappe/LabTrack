<!--
  Dashboard Component
  
  This is the main dashboard view that users see after logging in.
  It provides navigation between different features and shows
  user-specific content based on their role.
  
  Features:
  - Responsive sidebar navigation
  - Role-based view access
  - User menu integration
  - Mobile-friendly design
    ✅ COMPLETED: Role-based view access
  ✅ COMPLETED: User menu integration  
  ✅ COMPLETED: Authentication-based navigation
  
  TODO: Implement proper routing with Vue Router
  TODO: Add breadcrumb navigation
  TODO: Add dashboard customization features
  TODO: Implement user preferences storage
-->

<template>
  <div class="min-h-screen bg-slate-50 flex" @click="settingsMenuOpen = false">
    <!-- Mobile menu overlay -->
    <div 
      v-if="mobileMenuOpen"
      class="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
      @click="mobileMenuOpen = false; settingsMenuOpen = false"
    ></div>

    <!-- Left Sidebar - Fixed Position, No Scroll -->
    <aside :class="[
      'fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-sm border-r border-slate-200 flex-shrink-0 transform transition-transform duration-300 ease-in-out',
      mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
    ]" @click.stop>
      <div class="flex flex-col h-full">
        <!-- Logo and Brand -->
        <div class="p-6">
          <div class="flex items-center justify-between mb-8">
            <div class="flex items-center space-x-3">
              <div class="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span class="text-white text-lg">🧪</span>
              </div>
              <h1 class="text-xl font-semibold text-slate-900">LabTrack</h1>
            </div>
            <!-- Mobile close button -->
            <button
              class="lg:hidden p-1 rounded-md text-slate-400 hover:text-slate-600"
              @click="mobileMenuOpen = false"
            >
              <span class="text-lg">✕</span>
            </button>
          </div>
          
          <!-- User Role Indicator -->
          <div class="mb-6 p-3 rounded-lg" :class="isAdmin ? 'bg-blue-50' : 'bg-green-50'">
            <div class="flex items-center space-x-2">              <span 
                class="inline-flex items-center px-2 py-1 rounded text-xs font-medium capitalize"
                :class="isAdmin ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'"
              >
                {{ user && user.role }}
              </span>
              <span class="text-sm text-slate-600">{{ user && user.name }}</span>
            </div>
          </div>
          
          <!-- Navigation Menu -->
          <nav class="space-y-2">
            <button
              v-for="view in availableViews"
              :key="view.id"
              :class="[
                'w-full flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors text-left',
                currentView === view.id
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              ]"
              @click="selectView(view.id)"
              :disabled="view.disabled"
              :title="view.disabled ? 'Feature coming soon' : ''"
            >
              <span class="mr-3 text-lg">{{ view.icon }}</span>
              {{ view.label }}
              <!-- TODO indicator for disabled features -->
              <span v-if="view.disabled" class="ml-auto text-xs text-slate-400">Soon</span>
            </button>
          </nav>
        </div>
        
        <!-- Settings Section -->
        <div class="mt-auto p-6 border-t border-slate-200">
          <div class="mb-4 flex items-center justify-between">
            <!-- Settings Dropdown -->
            <div class="relative">
              <button 
                class="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                @click.stop="settingsMenuOpen = !settingsMenuOpen"
                title="Settings"
              >
                <span class="text-lg">⚙️</span>
              </button>
              
              <!-- Settings Dropdown Menu -->
              <div 
                v-if="settingsMenuOpen"
                class="absolute bottom-12 left-0 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-2 z-50"
                @click.stop
              >
                <button 
                  class="w-full flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors text-left"
                  @click="toggleTheme"
                >
                  <span class="mr-3 text-base">🎨</span>
                  Theme Settings
                </button>
                
                <button 
                  class="w-full flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors text-left"
                  @click="changeLanguage"
                >
                  <span class="mr-3 text-base">🌐</span>
                  Language
                </button>
                
                <!-- Admin-only settings -->
                <template v-if="isAdmin">
                  <div class="border-t border-slate-200 my-2"></div>
                  <button 
                    class="w-full flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors text-left"
                    @click="openSystemSettings"
                  >
                    <span class="mr-3 text-base">🛠️</span>
                    System Settings
                  </button>
                </template>
              </div>
            </div>
          </div>
          
          <!-- Version Info -->
          <div class="text-xs text-slate-500 text-center">
            <div>Version 1.0.0-beta</div>
            <div class="mt-1">Lab Inventory System</div>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col min-w-0 lg:ml-64">
      <!-- Top Header Bar -->
      <header class="bg-white shadow-sm border-b border-slate-200 px-4 lg:px-6 py-4 sticky top-0 z-10">
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <!-- Mobile menu button -->
            <button
              class="lg:hidden p-2 mr-3 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              @click="mobileMenuOpen = true"
            >
              <span class="text-xl">☰</span>            </button>
            
            <!-- Page Title -->            <div class="flex items-center space-x-3">
              <h2 class="text-lg font-semibold text-slate-900">
                {{ currentViewData && currentViewData.label || 'Dashboard' }}
              </h2>
              <!-- TODO: Add breadcrumb navigation -->
            </div>
          </div>
          
          <div class="flex items-center space-x-4">
            <!-- TODO: Add search functionality -->
            <!-- <SearchBar /> -->
            
            <!-- TODO: Add notifications -->
            <!-- <NotificationBell /> -->
            
            <!-- User Menu -->
            <UserMenu @logout="handleLogout" />
          </div>
        </div>      </header>      <!-- Main Content -->
      <main class="flex-1 p-4 lg:p-6 overflow-auto">
        <!-- Dashboard View -->
      <div v-if="currentView === 'dashboard'" class="space-y-8">
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
          </Card>        </div>
      </div>
      
      <!-- Compounds View -->
      <div v-else-if="currentView === 'compounds'" class="space-y-8">
        <CompoundList />
      </div>
      
      <!-- Inventory Count View -->
      <div v-else-if="currentView === 'inventory-count'" class="space-y-8">
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
                  Create Session                </Button>
              </template>
            </Card>
          </div>
        </div>
      </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import Button from '@/components/ui/Button.vue'
import Card from '@/components/ui/Card.vue'
import Input from '@/components/ui/Input.vue'
import DashboardCards from '@/components/dashboard/DashboardCards.vue'
import CompoundList from '@/components/compounds/CompoundList.vue'
import InventoryScanner from '@/components/inventory/InventoryScanner.vue'
import CountSession from '@/components/inventory/CountSession.vue'
import UserMenu from '@/components/auth/UserMenu.vue'
import { useCompounds } from '@/composables/useCompounds'
import { useInventoryCount } from '@/composables/useInventoryCount'
import { useAuth } from '@/composables/useAuth'

// Define events this component can emit
const emit = defineEmits(['logout'])

// Authentication
const { user, isAdmin, isVisitor } = useAuth()

// Navigation
const currentView = ref('dashboard')
const mobileMenuOpen = ref(false)
const settingsMenuOpen = ref(false)

// All available views
const allViews = [
  { 
    id: 'dashboard', 
    label: 'Dashboard', 
    icon: '📊',
    description: 'Overview of your laboratory inventory',
    roles: ['admin', 'visitor']
  },
  { 
    id: 'compounds', 
    label: 'Compounds', 
    icon: '🧪',
    description: 'Manage your laboratory chemical inventory',
    roles: ['admin', 'visitor']
  },
  { 
    id: 'inventory-count', 
    label: 'Inventory Count', 
    icon: '📝',
    description: 'Scan and count your laboratory inventory',
    roles: ['admin', 'visitor']
  },
  { 
    id: 'reports', 
    label: 'Reports', 
    icon: '📈',
    description: 'Generate inventory and usage reports',
    roles: ['admin'],
    disabled: true // TODO: Implement reports feature
  },
  { 
    id: 'admin', 
    label: 'Admin Panel', 
    icon: '🛡️',
    description: 'System administration and user management',
    roles: ['admin'],
    disabled: true // TODO: Implement admin panel
  }
]

// Filter views based on user role
// INSIGHT: This is speculative - assumes simple role-based access control
// The choice to filter views client-side provides immediate UI feedback
// but shouldn't be the only access control mechanism in production
const availableViews = computed(() => {
  if (!user.value) return []
  
  return allViews.filter(view => 
    view.roles.includes(user.value.role)
  )
})

// Current view data
const currentViewData = computed(() => 
  availableViews.value.find(v => v.id === currentView.value)
)

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
const selectView = (viewId) => {
  currentView.value = viewId
  mobileMenuOpen.value = false // Close mobile menu when selecting a view
}

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
  // TODO: Load session state and scanned items
  // TODO: Navigate to scanning interface
  console.log('Continue session:', session)
}

const handleViewSessionDetails = (session) => {
  // TODO: Implement session details view
  // TODO: Show detailed session information, scanned items, discrepancies
  // TODO: Allow editing session notes and completion
  console.log('View session details:', session)
}

const handleCompleteSession = (session) => {
  // TODO: Implement session completion
  // TODO: Show completion confirmation dialog
  // TODO: Allow final notes entry
  // TODO: Update compound quantities based on count results
  console.log('Complete session:', session)
}

const toggleTheme = () => {
  // TODO: Implement theme switching functionality
  // This should toggle between light and dark themes
  // TODO: Persist theme preference in localStorage
  // TODO: Apply theme classes to document root
  settingsMenuOpen.value = false
  console.log('Toggle theme - TODO: Implement theme switching')
}

const changeLanguage = () => {
  // TODO: Implement language switching functionality
  // This should show a dropdown/modal with available languages
  // TODO: Implement i18n internationalization
  // TODO: Load language files dynamically
  // TODO: Persist language preference
  settingsMenuOpen.value = false
  console.log('Change language - TODO: Implement i18n')
}

const openSystemSettings = () => {
  // TODO: Implement system settings for admin users
  // This should open a modal or navigate to system settings page
  // TODO: Add system configuration options
  // TODO: User management interface
  // TODO: Backup and restore functionality
  settingsMenuOpen.value = false
  console.log('Open system settings - TODO: Implement admin panel')
}

/**
 * Handle Logout
 * 
 * Called when user clicks logout from UserMenu.
 * Emits logout event to parent App component.
 */
const handleLogout = () => {
  console.log('Logout requested from dashboard')
  emit('logout')
}
</script>
