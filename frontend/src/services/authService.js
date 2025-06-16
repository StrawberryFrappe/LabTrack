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

export const authService = {
  /**
   * Login User
   * 
   * Currently simulates authentication with JSON Server.
   * For production, replace this with a real API call to /auth/login
   * 
   * @param {Object} credentials - { username, password }
   * @returns {Promise<Object>} - { token, user }
   */
  async login(credentials) {
    try {      // FOR DEVELOPMENT: Simulate auth by checking users in JSON Server
      // INSIGHT: This is speculative - assumes basic username/password auth
      // In production, this would be: const response = await api.post('/auth/login', credentials)
      // The speculative choice to use simple JSON comparison allows immediate testing
      // while maintaining the same interface that a real API would provide
      const response = await api.get('/users')
      const user = response.data.find(u => 
        u.username === credentials.username && 
        u.password === credentials.password
      )
      
      if (!user) {
        throw new Error('Invalid username or password')
      }      // FOR DEVELOPMENT: Generate a simple token
      // INSIGHT: This is highly speculative - real production would use JWT from backend
      // The choice to base64 encode user info creates a readable "token" for development
      // that contains the data we need while mimicking real token behavior
      // In production, the token would come from the backend and be opaque to the frontend
      const token = btoa(JSON.stringify({ 
        userId: user.id, 
        role: user.role,
        timestamp: Date.now()
      }))
      
      // Store authentication data in localStorage
      // This persists across browser sessions
      localStorage.setItem('authToken', token)
      localStorage.setItem('user', JSON.stringify({
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
        role: user.role
      }))
      
      return { token, user }
    } catch (error) {
      // Make error messages user-friendly
      if (error.message === 'Invalid username or password') {
        throw error
      }
      throw new Error('Login failed. Please try again.')
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
    return userJson ? JSON.parse(userJson) : null
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
