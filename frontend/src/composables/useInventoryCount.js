import { ref, computed } from 'vue'
import { inventoryCountService } from '@/services/inventoryCountService'
import { useCompoundInstances } from '@/composables/useCompoundInstances'
import { useAuth } from '@/composables/useAuth'

// Shared state
const sessions = ref([])
const currentSession = ref(null)
const isLoading = ref(false)
const error = ref(null)
let isInitialized = false

export function useInventoryCount() {
  const { user } = useAuth()
  const { instances, getInstancesByLocation } = useCompoundInstances()

  // Load all count sessions from API
  const loadSessions = async () => {
    isLoading.value = true
    error.value = null
    try {
      sessions.value = await inventoryCountService.getAll()
    } catch (err) {
      error.value = 'Failed to load sessions: ' + err.message
    } finally {
      isLoading.value = false
    }
  }

  // Initialize on first use
  if (!isInitialized) {
    isInitialized = true
    loadSessions()
  }

  // Get available locations from instances
  const getAvailableLocations = () => {
    if (!instances.value || instances.value.length === 0) return []
    
    const locations = [...new Set(
      instances.value
        .filter(instance => instance.status === 'active')
        .map(instance => instance.location)
        .filter(location => location && location.trim())
    )]
    
    return locations.sort()
  }

  // Get instances for specific locations
  const getInstancesForLocations = (locations) => {
    if (!instances.value || !locations || locations.length === 0) return []
    
    return instances.value.filter(instance => 
      instance.status === 'active' && 
      locations.includes(instance.location)
    )
  }

  // Calculate session totals
  const calculateSessionTotals = (sessionData) => {
    const instancesInSession = getInstancesForLocations(sessionData.locations)
    const totalItems = instancesInSession.length
    const countedItems = sessionData.counts ? sessionData.counts.length : 0
    
    return {
      totalItems,
      countedItems,
      progress: totalItems > 0 ? (countedItems / totalItems) * 100 : 0
    }
  }

  // Computed properties
  const activeSessions = computed(() =>
    sessions.value.filter(session => session.status === 'active')
  )

  const completedSessions = computed(() =>
    sessions.value.filter(session => session.status === 'completed')
  )

  // Create new counting session
  const createSession = async (sessionData) => {
    isLoading.value = true
    error.value = null
    
    try {
      // Validate required fields
      if (!sessionData.name || !sessionData.locations || sessionData.locations.length === 0) {
        throw new Error('Session name and locations are required')
      }
      
      // Get instances for selected locations
      const instancesInSession = getInstancesForLocations(sessionData.locations)
      
      // Create session with proper structure
      const newSession = {
        id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: sessionData.name,
        description: sessionData.description || '',
        locations: sessionData.locations,
        status: 'active',
        createdBy: user.value?.id || 'unknown',
        createdByName: user.value?.name || 'Unknown User',
        startDate: new Date().toISOString(),
        completedDate: null,
        counts: [],
        newInstances: [],
        movedInstances: [],
        notes: '',
        totalItems: instancesInSession.length,
        countedItems: 0
      }
      
      // Save to API
      const createdSession = await inventoryCountService.create(newSession)
      sessions.value.push(createdSession)
      
      return createdSession
    } catch (err) {
      error.value = err.message || 'Failed to create session'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Start/continue a session
  const continueSession = (sessionId) => {
    const session = sessions.value.find(s => s.id === sessionId)
    if (session) {
      currentSession.value = session
      return session
    }
    return null
  }

  // Update session
  const updateSession = async (sessionId, updates) => {
    isLoading.value = true
    error.value = null
    
    try {
      const sessionIndex = sessions.value.findIndex(s => s.id === sessionId)
      if (sessionIndex === -1) {
        throw new Error('Session not found')
      }
      
      const updatedSession = { ...sessions.value[sessionIndex], ...updates }
      
      // Update totals if needed
      if (updates.counts) {
        const totals = calculateSessionTotals(updatedSession)
        updatedSession.countedItems = totals.countedItems
      }
      
      // Save to API
      await inventoryCountService.update(sessionId, updatedSession)
      sessions.value[sessionIndex] = updatedSession
      
      // Update current session if it's the one being updated
      if (currentSession.value?.id === sessionId) {
        currentSession.value = updatedSession
      }
      
      return updatedSession
    } catch (err) {
      error.value = err.message || 'Failed to update session'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Complete session
  const completeSession = async (sessionId, notes = '') => {
    return await updateSession(sessionId, {
      status: 'completed',
      completedDate: new Date().toISOString(),
      notes
    })
  }

  // Get session progress
  const getSessionProgress = (sessionId) => {
    const session = sessions.value.find(s => s.id === sessionId)
    if (!session) return { progress: 0, counted: 0, total: 0 }
    
    const totals = calculateSessionTotals(session)
    return {
      progress: totals.progress,
      counted: totals.countedItems,
      total: totals.totalItems
    }
  }

  // Delete session
  const deleteSession = async (sessionId) => {
    isLoading.value = true
    error.value = null
    
    try {
      await inventoryCountService.delete(sessionId)
      sessions.value = sessions.value.filter(s => s.id !== sessionId)
      
      // Clear current session if it's being deleted
      if (currentSession.value?.id === sessionId) {
        currentSession.value = null
      }
    } catch (err) {
      error.value = err.message || 'Failed to delete session'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    // State
    sessions,
    currentSession,
    isLoading,
    error,
    
    // Computed
    activeSessions,
    completedSessions,
    
    // Methods
    loadSessions,
    getAvailableLocations,
    getInstancesForLocations,
    createSession,
    continueSession,
    updateSession,
    completeSession,
    deleteSession,
    getSessionProgress,
    
    // Utility
    calculateSessionTotals
  }
}
