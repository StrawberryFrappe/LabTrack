<!--
  Main Application Component
  
  This is the root component that handles the authentication flow
  and displays either the login form or the main dashboard based
  on the user's authentication status.
  
  Features:
  - Authentication-based routing (login vs dashboard)
  - Global loading states
  - Error handling
  - Responsive design
  
  TODO: Implement Vue Router for proper navigation
  TODO: Add authentication guards and route protection
  TODO: Implement layout system with different page layouts
  TODO: Add global error boundary
  TODO: Add notification/toast system
-->

<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <!-- Global Loading Overlay -->
    <div 
      v-if="authLoading" 
      class="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50"
    >
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto"></div>
        <p class="mt-4 text-gray-600">Loading LabTrack...</p>
      </div>
    </div>

    <!-- Authentication Flow: Show Login or Dashboard -->
    <template v-else>
      <!-- Login Form - shown when user is not authenticated -->
      <LoginForm 
        v-if="!isAuthenticated" 
        @login-success="handleLoginSuccess" 
      />
      
      <!-- Main Dashboard - shown when user is authenticated -->
      <Dashboard 
        v-else 
        @logout="handleLogout" 
      />
    </template>

    <!-- TODO: Add global notification/toast container -->
    <!-- <NotificationContainer /> -->
    
    <!-- TODO: Add global error boundary component -->
    <!-- <ErrorBoundary /> -->
    
    <!-- TODO: Add global loading spinner for API calls -->
    <!-- <GlobalLoader /> -->
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import LoginForm from './components/auth/LoginForm.vue'
import Dashboard from './views/Dashboard.vue'
import { useAuth } from './composables/useAuth.js'

// Get authentication state and methods
const { isAuthenticated, loading } = useAuth()

// Local loading state for initial app load
const authLoading = ref(true)

/**
 * Handle Successful Login
 * 
 * Called when user successfully logs in through LoginForm.
 * The authentication state will automatically update and
 * trigger the dashboard to show.
 */
const handleLoginSuccess = () => {
  console.log('Login successful, switching to dashboard')
  // TODO: Add login analytics/tracking
  // TODO: Initialize user preferences
  // TODO: Load user-specific data
}

/**
 * Handle Logout
 * 
 * Called when user logs out from the dashboard.
 * The authentication state will automatically update and
 * trigger the login form to show.
 */
const handleLogout = () => {
  console.log('User logged out, switching to login')
  // TODO: Clear user-specific cached data
  // TODO: Add logout analytics/tracking
  // TODO: Show logout confirmation message
}

/**
 * Initialize Application
 * 
 * Called when the app is first mounted.
 * Checks if user is already logged in and handles initial loading.
 */
onMounted(async () => {
  try {
    // Simulate initial loading time for better UX
    // In production, this could be used for:
    // - Loading user preferences
    // - Checking token validity
    // - Loading critical app data
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // TODO: Validate stored authentication token
    // TODO: Load user preferences and settings
    // TODO: Initialize app-wide services
    
  } catch (error) {
    console.error('App initialization failed:', error)
    // TODO: Show error message to user
    // TODO: Provide recovery options
  } finally {
    authLoading.value = false
  }
})
</script>

<style>
/* Global Styles */
/* TODO: Add global styles and CSS custom properties for theming */
/* TODO: Import and configure icon library styles */
/* TODO: Add print media queries */

/* Ensure the app takes full height */
html, body {
  height: 100%;
}

#app {
  font-family: 'Inter', system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Custom scrollbar styles */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Focus styles for accessibility */
.focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Animation classes */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
