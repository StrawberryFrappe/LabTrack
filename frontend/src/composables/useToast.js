/**
 * Toast Notifications Composable
 * 
 * Provides a centralized system for showing toast notifications.
 * Manages the display and cleanup of notification components.
 * 
 * ✅ IMPLEMENTED FEATURES:
 * - Programmatic toast creation with Vue 3 composition API
 * - Multiple toast types (success, error, warning, info)
 * - Auto-dismissal with configurable duration
 * - Manual dismissal with close button
 * - Proper cleanup of DOM elements and Vue instances
 * - Error toasts are persistent by default for critical feedback
 * 
 * Technical Implementation:
 * - Creates individual Vue app instances for each toast
 * - Uses Teleport for proper positioning outside component tree
 * - Manages lifecycle with cleanup callbacks
 * - Provides convenience methods for common toast types
 */

import { ref, createApp } from 'vue'
import Toast from '../components/ui/Toast.vue'

const toasts = ref([])
let toastId = 0

export function useToast() {
  /**
   * Show a toast notification
   * 
   * @param {Object} options - Toast configuration
   * @param {string} options.type - Type of toast ('success', 'error', 'warning', 'info')
   * @param {string} options.title - Optional title
   * @param {string} options.message - Toast message
   * @param {number} options.duration - Auto-close duration in ms (default: 5000)
   * @param {boolean} options.persistent - Whether toast stays until manually closed
   */
  const showToast = (options) => {
    const id = ++toastId
    
    // Create a container for this toast
    const container = document.createElement('div')
    document.body.appendChild(container)
    
    // Create Vue app instance for the toast
    const app = createApp(Toast, {
      ...options,
      onClose: () => removeToast(id, app, container)
    })
    
    // Mount the toast
    app.mount(container)
    
    // Store toast reference
    toasts.value.push({
      id,
      app,
      container
    })
    
    return id
  }

  /**
   * Remove a toast by ID
   */
  const removeToast = (id, app, container) => {
    // Remove from toasts array
    const index = toasts.value.findIndex(t => t.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
    
    // Cleanup Vue app and DOM
    setTimeout(() => {
      app.unmount()
      if (container.parentNode) {
        container.parentNode.removeChild(container)
      }
    }, 300) // Wait for transition to complete
  }

  /**
   * Convenience methods for different toast types
   */
  const success = (message, options = {}) => {
    return showToast({
      type: 'success',
      message,
      ...options
    })
  }

  const error = (message, options = {}) => {
    return showToast({
      type: 'error',
      message,
      persistent: true, // Error toasts are persistent by default
      ...options
    })
  }

  const warning = (message, options = {}) => {
    return showToast({
      type: 'warning',
      message,
      ...options
    })
  }

  const info = (message, options = {}) => {
    return showToast({
      type: 'info',
      message,
      ...options
    })
  }

  /**
   * Clear all toasts
   */
  const clearAll = () => {
    toasts.value.forEach(({ app, container }) => {
      app.unmount()
      if (container.parentNode) {
        container.parentNode.removeChild(container)
      }
    })
    toasts.value = []
  }

  return {
    showToast,
    success,
    error,
    warning,
    info,
    clearAll,
    toasts: toasts.value
  }
}
