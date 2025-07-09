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

  // Get location statistics
  const getLocationStats = (location) => {
    const locationInstances = instances.value.filter(instance => 
      instance.status === 'active' && instance.location === location
    )
    
    return {
      totalInstances: locationInstances.length,
      totalQuantity: locationInstances.reduce((sum, instance) => sum + (instance.quantity || 0), 0),
      compounds: [...new Set(locationInstances.map(i => i.compoundId))].length
    }
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
    const sessionCounts = sessionData.counts || []
    
    // Count verified instances (not unverified)
    const verifiedCounts = sessionCounts.filter(count => 
      count.status === 'verified' || count.status === 'discrepancy' || count.status === 'not_found'
    )
    
    return {
      totalItems,
      countedItems: sessionCounts.length,
      verifiedItems: verifiedCounts.length,
      progress: totalItems > 0 ? (verifiedCounts.length / totalItems) * 100 : 0
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
      
      // Build location summary
      const locationSummary = sessionData.locations.map(location => ({
        location,
        ...getLocationStats(location)
      }))
      
      // Create session with proper structure
      const newSession = {
        id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: sessionData.name,
        description: sessionData.description || '',
        locations: sessionData.locations,
        locationSummary,
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
        countedItems: 0,
        progress: 0
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
      
      const updatedSession = { ...sessions.value[sessionIndex], ...updates }        // Update totals and progress if counts are updated
        if (updates.counts) {
          const totals = calculateSessionTotals(updatedSession)
          updatedSession.countedItems = totals.countedItems
          updatedSession.verifiedItems = totals.verifiedItems
          updatedSession.progress = totals.progress
        
        // Update per-location progress
        updatedSession.locationProgress = updatedSession.locations.map(location => {
          const instancesInLocation = getInstancesForLocations([location])
          const locationCounts = updates.counts.filter(count => count.location === location)
          const verifiedCounts = locationCounts.filter(count => 
            count.status === 'verified' || count.status === 'discrepancy' || count.status === 'not_found'
          )
          
          return {
            location,
            total: instancesInLocation.length,
            counted: locationCounts.length,
            verified: verifiedCounts.length,
            progress: instancesInLocation.length > 0 ? (verifiedCounts.length / instancesInLocation.length) * 100 : 0,
            isComplete: verifiedCounts.length >= instancesInLocation.length
          }
        })
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

  // Check if session can be completed
  const canCompleteSession = (sessionId) => {
    const session = sessions.value.find(s => s.id === sessionId)
    if (!session || session.status !== 'active') return false
    
    const instancesInSession = getInstancesForLocations(session.locations)
    const sessionCounts = session.counts || []
    
    // Check if all instances have been accounted for and verified
    const verifiedCounts = sessionCounts.filter(count => 
      count.status === 'verified' || count.status === 'discrepancy' || count.status === 'not_found'
    )
    
    // Session can be completed if:
    // 1. We have counts for all instances in the session
    // 2. All those counts have been verified (not 'unverified')
    return sessionCounts.length >= instancesInSession.length && 
           verifiedCounts.length >= instancesInSession.length
  }

  // Get session completion status
  const getSessionCompletionStatus = (sessionId) => {
    const session = sessions.value.find(s => s.id === sessionId)
    if (!session) return { canComplete: false, reason: 'Session not found' }
    
    if (session.status !== 'active') {
      return { canComplete: false, reason: 'Session is not active' }
    }
    
    const instancesInSession = getInstancesForLocations(session.locations)
    const sessionCounts = session.counts || []
    const verifiedCounts = sessionCounts.filter(count => 
      count.status === 'verified' || count.status === 'discrepancy' || count.status === 'not_found'
    )
    
    const totalInstances = instancesInSession.length
    const countedInstances = sessionCounts.length
    const verifiedInstances = verifiedCounts.length
    
    // Check different completion requirements
    if (countedInstances < totalInstances) {
      const missingCount = totalInstances - countedInstances
      return {
        canComplete: false,
        reason: `${missingCount} instances not yet counted`,
        totalInstances,
        countedInstances,
        verifiedInstances,
        missingInstances: missingCount
      }
    }
    
    if (verifiedInstances < totalInstances) {
      const unverifiedCount = totalInstances - verifiedInstances
      return {
        canComplete: false,
        reason: `${unverifiedCount} instances not yet verified`,
        totalInstances,
        countedInstances,
        verifiedInstances,
        unverifiedInstances: unverifiedCount
      }
    }
    
    return {
      canComplete: true,
      reason: null,
      totalInstances,
      countedInstances,
      verifiedInstances,
      unverifiedInstances: 0
    }
  }

  // Complete session
  const completeSession = async (sessionId, notes = '') => {
    // Validate session is ready for completion
    const session = sessions.value.find(s => s.id === sessionId)
    if (!session) {
      throw new Error('Session not found')
    }
    
    // Check completion status
    const completionStatus = getSessionCompletionStatus(sessionId)
    if (!completionStatus.canComplete) {
      throw new Error(`Cannot complete session: ${completionStatus.reason}`)
    }
    
    return await updateSession(sessionId, {
      status: 'completed',
      completedDate: new Date().toISOString(),
      notes,
      completedBy: user.value?.id || 'unknown'
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

  // Get location progress within a session
  const getLocationProgressInSession = (sessionId, location) => {
    const session = sessions.value.find(s => s.id === sessionId)
    if (!session) return { progress: 0, counted: 0, verified: 0, total: 0 }
    
    const instancesInLocation = getInstancesForLocations([location])
    const locationCounts = session.counts?.filter(count => count.location === location) || []
    const verifiedCounts = locationCounts.filter(count => 
      count.status === 'verified' || count.status === 'discrepancy' || count.status === 'not_found'
    )
    
    return {
      progress: instancesInLocation.length > 0 ? (verifiedCounts.length / instancesInLocation.length) * 100 : 0,
      counted: locationCounts.length,
      verified: verifiedCounts.length,
      total: instancesInLocation.length,
      isComplete: verifiedCounts.length >= instancesInLocation.length
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
    getLocationStats,
    getInstancesForLocations,
    createSession,
    continueSession,
    updateSession,
    completeSession,
    deleteSession,
    getSessionProgress,
    getLocationProgressInSession,
    canCompleteSession,
    getSessionCompletionStatus,
    
    // Utility
    calculateSessionTotals
  }
}
