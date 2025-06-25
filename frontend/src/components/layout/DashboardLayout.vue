<!--
  Dashboard Layout Component
  
  This component provides the main layout structure for authenticated pages
  including the sidebar navigation, top header, and router-view for content.
  
  Features:
  - Responsive sidebar navigation with Vue Router links ✅
  - Mobile-friendly hamburger menu ✅
  - User menu integration ✅
  - Role-based navigation items ✅
  - Clean sidebar footer with version info ✅
  - Internationalization support ✅ COMPLETED
    ✅ COMPLETED: Router-based navigation system
      - Sidebar uses router-link instead of manual view switching
      - Active route highlighting with $route.name comparison
      - Role-based navigation filtering through availableViews computed
      - Clean URL structure with proper navigation flow
      
    ✅ COMPLETED: Internationalization implementation  
      - Navigation labels fully internationalized
      - Page titles dynamically translated
      - Real-time language switching support
      
    ✅ COMPLETED: UI restructuring for better UX
      - Removed settings dropdown from sidebar
      - Replaced with clean version/info display
      - Settings moved to user menu for better discoverability
      - Improved mobile responsiveness and touch targets      
  Used by: All authenticated routes as nested route container
  
  TRL3 PRIORITIES:
  - Add breadcrumb navigation system for better user orientation
  - Add global search functionality across all data types
  - Add notification center integration for user alerts
  
  MODULARIZATION OPPORTUNITIES:
  - Extract sidebar into separate component (SidebarNavigation.vue)
  - Create navigation composable for reusable navigation logic
  - Extract header section into TopBar.vue component
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
              <h1 class="text-xl font-semibold text-slate-900">{{ $t('dashboard.appTitle') }}</h1>
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
            <div class="flex items-center space-x-2">
              <span 
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
            <router-link
              v-for="view in availableViews"
              :key="view.id"
              :to="view.path"
              :class="[
                'w-full flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors text-left',
                $route.name === view.routeName
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              ]"
              @click="mobileMenuOpen = false"            >
              <span class="mr-3 text-lg">{{ view.icon }}</span>
              {{ $t(view.labelKey) }}
              <!-- Visual indicator for future features -->
              <span v-if="view.disabled" class="ml-auto text-xs text-slate-400">{{ $t('common.soon') }}</span>
            </router-link>
          </nav>
        </div>
          <!-- Settings Section -->
        <div class="mt-auto p-6 border-t border-slate-200">
          <!-- Version/Info Display -->          <div class="text-center">
            <div class="text-xs text-slate-500">
              <p class="font-medium text-slate-600">{{ $t('dashboard.appTitle') }} {{ $t('dashboard.appVersion') }}</p>
              <p>{{ $t('dashboard.laboratoryManagement') }}</p>
            </div>
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
              <span class="text-xl">☰</span>
            </button>              <!-- Page Title -->
            <div class="flex items-center space-x-3">
              <h2 class="text-lg font-semibold text-slate-900">
                {{ getPageTitle($route.name) }}
              </h2>
              <!-- TRL3: Breadcrumb navigation system placeholder -->
            </div>
          </div>
            <div class="flex items-center space-x-4">
            <!-- TRL3: Global search functionality placeholder -->
            <!-- <SearchBar /> -->
            
            <!-- TRL3: Notification center integration placeholder -->
            <!-- <NotificationBell /> -->
            
            <!-- User Menu -->
            <UserMenu />
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="flex-1 p-4 lg:p-6 overflow-auto">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import UserMenu from '@/components/auth/UserMenu.vue'
import { useAuth } from '@/composables/useAuth.js'

// i18n
const { t: $t } = useI18n()

// Authentication
const { user, isAdmin, isVisitor } = useAuth()

// Navigation
const route = useRoute()
const mobileMenuOpen = ref(false)

// Navigation menu items based on user role
const allViews = [
  {
    id: 'dashboard',
    routeName: 'Dashboard',
    path: '/dashboard',
    labelKey: 'navigation.dashboard', // Using translation key
    icon: '📊',
    roles: ['admin', 'user', 'visitor'],
    disabled: false
  },
  {
    id: 'compounds',
    routeName: 'Compounds',
    path: '/compounds',
    labelKey: 'navigation.compounds', // Using translation key
    icon: '🧪',
    roles: ['admin', 'user', 'visitor'],
    disabled: false
  },
  {
    id: 'inventory-count',
    routeName: 'Inventory',
    path: '/inventory',
    labelKey: 'navigation.inventory', // Using translation key
    icon: '📦',
    roles: ['admin', 'user'],
    disabled: false
  },
  {
    id: 'inventory-sessions',
    routeName: 'InventorySessions',
    path: '/inventory-sessions',
    labelKey: 'navigation.inventorySessions', // Using translation key
    icon: '📋',
    roles: ['admin', 'user'],
    disabled: false
  }
]

// Filter views based on user role
const availableViews = computed(() => {
  if (!user.value) return []
  
  return allViews.filter(view => 
    view.roles.includes(user.value.role)
  )
})

// Get page title based on route name
const getPageTitle = (routeName) => {
  const titleKeys = {
    'Dashboard': 'navigation.dashboard',
    'Compounds': 'compounds.title',
    'Inventory': 'navigation.inventory',
    'InventorySessions': 'navigation.inventorySessions',
    'Preferences': 'navigation.preferences',
    'Settings': 'navigation.settings'
  }
  
  const titleKey = titleKeys[routeName]
  return titleKey ? $t(titleKey) : 'LabTrack'
}
</script>
