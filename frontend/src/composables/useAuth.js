/**
 * Authentication Composable
 * 
 * This composable provides reactive authentication state and methods
 * throughout the Vue application. It's the main interface between
 * your Vue components and the authentication system.
 * 
 * Key Features:
 * - Reactive user state (automatically updates UI when user logs in/out)
 * - Loading states for better UX
 * - Error handling with user-friendly messages
 * - Role-based access helpers
 * 
 * Usage:
 * const { user, isAuthenticated, login, logout } = useAuth()
 */

import { ref, computed, readonly } from 'vue'
import { authService } from '../services/authService.js'

// Global reactive state for authentication
// This is shared across all components that use useAuth()
const user = ref(authService.getCurrentUser())
const loading = ref(false)
const error = ref(null)

// Computed properties for common checks
// These automatically update when user changes
const isAuthenticated = computed(() => !!user.value)
const isAdmin = computed(() => user.value?.role === 'admin')
const isVisitor = computed(() => user.value?.role === 'visitor')

/**
 * Authentication Composable Function
 * 
 * This is what components actually call to get auth functionality.
 * It returns reactive references and methods.
 */
export function useAuth() {
  /**
   * Login Function
   * 
   * Attempts to log in the user with provided credentials.
   * Updates global state on success/failure.
   * 
   * @param {Object} credentials - { username, password }
   * @returns {Promise<Object>} - User data on success
   */
  const login = async (credentials) => {
    // Clear any previous errors
    error.value = null
    loading.value = true
    
    try {
      // Call the auth service to perform login
      const result = await authService.login(credentials)
      
      // Update global user state
      user.value = result.user
      
      return result
    } catch (err) {
      // Set error message for UI to display
      error.value = err.message
      throw err
    } finally {
      // Always stop loading, whether success or failure
      loading.value = false
    }
  }

  /**
   * Logout Function
   * 
   * Logs out the current user and clears all auth state.
   */
  const logout = async () => {
    loading.value = true
    
    try {
      await authService.logout()
      // Clear user state
      user.value = null
      error.value = null
    } catch (err) {
      // Even if logout fails on server, clear local state
      user.value = null
      error.value = 'Logout failed, but you have been logged out locally'
    } finally {
      loading.value = false
    }
  }

  /**
   * Clear Error Function
   * 
   * Helper to clear error messages (useful for dismissing error alerts)
   */
  const clearError = () => {
    error.value = null
  }

  /**
   * Check if User Has Role
   * 
   * Helper function to check if user has a specific role.
   * Useful for conditional rendering or route guards.
   * 
   * @param {string} role - The role to check
   * @returns {boolean}
   */
  const hasRole = (role) => {
    return user.value?.role === role
  }

  // Return reactive references and methods
  // Using readonly() prevents components from directly modifying state
  return {
    // State
    user: readonly(user),
    loading: readonly(loading),
    error: readonly(error),
    
    // Computed properties
    isAuthenticated,
    isAdmin,
    isVisitor,
    
    // Methods
    login,
    logout,
    clearError,
    hasRole
  }
}
