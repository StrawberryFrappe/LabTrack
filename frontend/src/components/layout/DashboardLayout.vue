<!--
  Dashboard Layout Component
  
  This component provides the main layout structure for authenticated pages
  including the sidebar navigation, top header, and router-view for content.
  
  Features:
  - Responsive sidebar navigation with Vue Router links
  - Mobile-friendly hamburger menu
  - User menu integration
  - Role-based navigation items
  - Breadcrumb support (TODO)
  
  Used by: All authenticated routes
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
              @click="mobileMenuOpen = false"
            >
              <span class="mr-3 text-lg">{{ view.icon }}</span>
              {{ view.label }}
              <!-- TODO indicator for disabled features -->
              <span v-if="view.disabled" class="ml-auto text-xs text-slate-400">Soon</span>
            </router-link>
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
                class="absolute bottom-full left-0 mb-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-2 z-50"
                @click.stop
              >
                <button 
                  class="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center"
                  @click="toggleTheme"
                >
                  <span class="mr-3">🌙</span>
                  Toggle Theme
                  <span class="ml-auto text-xs text-slate-400">Soon</span>
                </button>
                <button 
                  class="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center"
                  @click="changeLanguage"
                >
                  <span class="mr-3">🌐</span>
                  Language
                  <span class="ml-auto text-xs text-slate-400">Soon</span>
                </button>
                <router-link
                  v-if="isAdmin"
                  to="/settings"
                  class="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center"
                  @click="settingsMenuOpen = false"
                >
                  <span class="mr-3">🔧</span>
                  System Settings
                </router-link>
              </div>
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
            </button>
            
            <!-- Page Title -->
            <div class="flex items-center space-x-3">
              <h2 class="text-lg font-semibold text-slate-900">
                {{ getPageTitle($route.name) }}
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
import UserMenu from '@/components/auth/UserMenu.vue'
import { useAuth } from '@/composables/useAuth.js'

// Authentication
const { user, isAdmin, isVisitor } = useAuth()

// Navigation
const route = useRoute()
const mobileMenuOpen = ref(false)
const settingsMenuOpen = ref(false)

// Navigation menu items based on user role
const allViews = [
  {
    id: 'dashboard',
    routeName: 'Dashboard',
    path: '/dashboard',
    label: 'Dashboard',
    icon: '📊',
    roles: ['admin', 'user', 'visitor'],
    disabled: false
  },
  {
    id: 'compounds',
    routeName: 'Compounds',
    path: '/compounds',
    label: 'Compounds',
    icon: '🧪',
    roles: ['admin', 'user', 'visitor'],
    disabled: false
  },
  {
    id: 'inventory-count',
    routeName: 'Inventory',
    path: '/inventory',
    label: 'Inventory Count',
    icon: '📦',
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
  const titles = {
    'Dashboard': 'Dashboard',
    'Compounds': 'Chemical Compounds',
    'Inventory': 'Inventory Count',
    'Settings': 'Settings'
  }
  return titles[routeName] || 'LabTrack'
}

// Methods
const toggleTheme = () => {
  // TODO: Implement theme switching functionality
  settingsMenuOpen.value = false
  console.log('Toggle theme - TODO: Implement theme switching')
}

const changeLanguage = () => {
  // TODO: Implement language switching functionality
  settingsMenuOpen.value = false
  console.log('Change language - TODO: Implement i18n')
}
</script>
