<!--
  User Menu Component
  
  This component displays the current user information and provides
  access to user-related actions like logout. It's typically shown
  in the top navigation bar.
  
  Features:
  - User avatar (using initials)
  - User name and role display  
  - Dropdown menu with user actions
  - Logout functionality
  - Role-based visual indicators
    ✅ COMPLETED: Router integration and menu restructuring
      - Logout now uses router.push('/login') instead of events
      - Added Preferences link for all users (router-link to /preferences)
      - System Settings moved here for admin users (router-link to /settings)
      - Removed event-based communication in favor of router navigation
      - Improved separation of user vs system settings for better UX
-->

<template>
  <div class="relative" v-if="isAuthenticated">
    <!-- User Menu Button -->
    <button
      @click="isMenuOpen = !isMenuOpen"
      class="flex items-center space-x-3 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 p-2 hover:bg-gray-50 transition-colors duration-200"
      :class="isMenuOpen ? 'bg-gray-50' : ''"
    >
      <!-- User Avatar (using initials) -->
      <div 
        class="h-8 w-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
        :class="user?.role === 'admin' ? 'bg-blue-600' : 'bg-green-600'"
      >
        {{ getUserInitials() }}
      </div>
      
      <!-- User Info (hidden on mobile) -->
      <div class="hidden md:block text-left">
        <p class="text-sm font-medium text-gray-900">{{ user?.name }}</p>
        <p class="text-xs text-gray-500 capitalize">{{ user?.role }}</p>
      </div>
      
      <!-- Dropdown Arrow -->
      <svg
        class="h-4 w-4 text-gray-400 transition-transform duration-200"
        :class="isMenuOpen ? 'rotate-180' : ''"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <!-- Dropdown Menu -->
    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        v-if="isMenuOpen"
        class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
        @click="isMenuOpen = false"
      >
        <div class="py-1">
          <!-- User Info (visible on mobile) -->
          <div class="md:hidden px-4 py-2 border-b border-gray-200">
            <p class="text-sm font-medium text-gray-900">{{ user?.name }}</p>
            <p class="text-xs text-gray-500">{{ user?.email }}</p>
            <div class="flex items-center mt-1">
              <span 
                class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize"
                :class="user?.role === 'admin' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'"
              >
                {{ user?.role }}
              </span>
            </div>
          </div>
          
          <!-- Menu Items -->          <a
            href="#"
            @click.prevent="handleProfileClick"
            class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
          >
            <span class="flex items-center">
              <span class="mr-3">👤</span>
              {{ $t('userMenu.profile') }}
            </span>
          </a>
          
          <router-link
            to="/preferences"
            @click="isMenuOpen = false"
            class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
          >
            <span class="flex items-center">
              <span class="mr-3">⚙️</span>
              {{ $t('userMenu.preferences') }}
            </span>
          </router-link>
          
          <!-- Admin-only menu items -->
          <template v-if="isAdmin">
            <div class="border-t border-gray-200"></div>
            <router-link
              to="/settings"
              @click="isMenuOpen = false"
              class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
            >              <span class="flex items-center">
                <span class="mr-3">🔧</span>
                {{ $t('userMenu.systemSettings') }}
              </span>
            </router-link>
          </template>
          
          <!-- Logout -->
          <div class="border-t border-gray-200"></div>
          <button
            @click="handleLogout"
            :disabled="loading"
            class="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50 transition-colors duration-200 disabled:opacity-50"
          >
            <span class="flex items-center">
              <span class="mr-3">🚪</span>
              {{ loading ? $t('userMenu.signingOut') : $t('userMenu.signOut') }}
            </span>
          </button>
        </div>
      </div>
    </transition>

    <!-- Click outside to close menu -->
    <div
      v-if="isMenuOpen"
      class="fixed inset-0 z-40"
      @click="isMenuOpen = false"
    ></div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuth } from '../../composables/useAuth.js'

// i18n
const { t: $t } = useI18n()

// Router for navigation
const router = useRouter()

// Get authentication state
const { user, isAuthenticated, isAdmin, logout, loading } = useAuth()

// Component state
const isMenuOpen = ref(false)

/**
 * Get User Initials
 * 
 * Creates initials from the user's name for the avatar.
 * Falls back to username if name is not available.
 */
const getUserInitials = () => {
  if (!user.value) return '?'
  
  const name = user.value.name || user.value.username || 'User'
  const names = name.split(' ')
  
  if (names.length === 1) {
    return names[0].charAt(0).toUpperCase()
  }
  
  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase()
}

/**
 * Handle Logout
 * 
 * Logs out the user and navigates to login page.
 */
const handleLogout = async () => {
  try {
    await logout()
    router.push('/login')
  } catch (error) {
    console.error('Logout failed:', error)
  }
}

/**
 * Menu Item Handlers
 * 
 * These are placeholder handlers for menu items.
 * In a real application, these would navigate to actual pages
 * or open modals/dialogs.
 */
const handleProfileClick = () => {
  console.log('Profile clicked - TODO: Implement profile page')
  // TODO: Navigate to profile page or open profile modal
  isMenuOpen.value = false
}
</script>
