/**
 * HTTP Client for API Communication
 * 
 * This is the main HTTP client that handles all API requests.
 * It's configured to work with both JSON Server (development) 
 * and real backend APIs (production).
 * 
 * Features:
 * - Automatic token injection for authenticated requests
 * - Request/response interceptors for error handling
 * - Configurable base URL via environment variables
 * - Automatic logout on 401 (unauthorized) responses
 */

import axios from 'axios'

// Create the main API client instance
// Base URL comes from environment variables (.env file)
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json'
  }
})

/**
 * Request Interceptor
 * 
 * Automatically adds authentication token to all requests
 * if user is logged in. This means you don't have to manually
 * add the token to every API call.
 */
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage (where auth service stores it)
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    // If there's an error before sending the request
    return Promise.reject(error)
  }
)

/**
 * Response Interceptor
 * 
 * Handles common response scenarios:
 * - Successful responses: just pass them through
 * - 401 Unauthorized: automatically log user out and redirect to login
 * - Other errors: pass them to the calling code to handle
 */
api.interceptors.response.use(
  (response) => {
    // For successful responses, just return the response
    return response
  },
  (error) => {
    // If we get a 401 (Unauthorized), the user's session has expired
    if (error.response?.status === 401) {
      // Clear stored auth data
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')
      
      // Redirect to login (this will trigger the app to show login form)
      window.location.href = '/login'
    }
    
    // For other errors, let the calling code handle them
    return Promise.reject(error)
  }
)

export default api
