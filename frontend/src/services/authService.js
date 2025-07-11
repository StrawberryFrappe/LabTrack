/**
 * Authentication Service
 * 
 * This service handles all authentication-related operations.
 * It's designed to work with JSON Server for development but
 * can easily be adapted for real backend APIs.
 * 
 * Key Features:
 * - Login/logout functionality
 * - Token management
 * - User role checking (admin vs visitor)
 * - Persistent authentication state
 * 
 * For Production: 
 * Just change the login method to call your real API endpoint.
 * Everything else stays the same!
 */

import api from './api.js'

// Import utility to get i18n translations outside Vue components
let getTranslation = null
export function setAuthI18nInstance(i18n) {
  getTranslation = (key, params) => i18n.global.t(key, params)
}

// Helper function to get translated error messages
function t(key, params) {
  if (getTranslation) {
    return getTranslation(key, params)
  }
  // Fallback to English if i18n is not available
  const fallbacks = {
    'errors.invalidCredentials': 'Invalid username or password',
    'errors.loginFailed': 'Login failed. Please try again.'
  }
  return fallbacks[key] || key
}

export const authService = {
  /**
   * Login User
   * 
   * Now calls your real API endpoint /users/login
   * 
   * @param {Object} credentials - { username, password }
   * @returns {Promise<Object>} - { token, user }
   */
  async login(credentials) {
    try {
      // Real API call to backend
      const response = await api.post('/users/login', credentials)
      
      // Backend returns access_token and user data
      const { access_token, user } = response.data
      
      // Store authentication data in localStorage
      // This persists across browser sessions
      localStorage.setItem('authToken', access_token)
      if (user) {
      localStorage.setItem('user', JSON.stringify(user))
      }

      
      return { token: access_token, user }
    } catch (error) {
      // Make error messages user-friendly
      if (error.response && error.response.status === 401) {
        throw new Error(t('errors.invalidCredentials'))
      }
      throw new Error(t('errors.loginFailed'))
    }
  },

  /**
   * Logout User
   * 
   * Clears all authentication data from localStorage.
   * For production, you might also want to call an API endpoint
   * to invalidate the token on the server side.
   */
  async logout() {
    // Clear local storage
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
    
    // FOR PRODUCTION: Uncomment this to invalidate token on server
    // try {
    //   await api.post('/auth/logout')
    // } catch (error) {
    //   // Logout failed on server, but we still clear local data
    //   console.warn('Server logout failed:', error)
    // }
  },

  /**
   * Get Current User
   * 
   * Retrieves user data from localStorage.
   * Returns null if no user is logged in.
   */
  getCurrentUser() {
    const userJson = localStorage.getItem('user')
    if (!userJson || userJson === "undefined") {
      return null
    }
    try {
      return JSON.parse(userJson)
    } catch {
      return null
    }
  },

  /**
   * Check if User is Authenticated
   * 
   * Simple check to see if we have a token stored.
   * For more security, you might want to validate the token
   * with the server periodically.
   */
  isAuthenticated() {
    return !!localStorage.getItem('authToken')
  },

  /**
   * Check if User is Admin
   * 
   * Helper method to check user role.
   * Useful for showing/hiding admin-only features.
   */
  isAdmin() {
    const user = this.getCurrentUser()
    return user?.role === 'admin'
  },

  /**
   * Check if User is Visitor
   * 
   * Helper method to check for visitor role.
   */
  isVisitor() {
    const user = this.getCurrentUser()
    return user?.role === 'visitor'
  }
}
