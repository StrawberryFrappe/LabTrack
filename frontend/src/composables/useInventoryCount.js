import { ref, computed } from 'vue'
import { countSessions as mockCountSessions } from '@/data/mockData'

export function useInventoryCount() {
  const countSessions = ref(mockCountSessions)
  const currentSession = ref(null)
  const scannedItems = ref([])
  const isScanning = ref(false)

  const activeSessions = computed(() =>
    countSessions.value.filter(session => !session.completed)
  )

  const completedSessions = computed(() =>
    countSessions.value.filter(session => session.completed)
  )

  const createCountSession = (sessionData) => {
    const newSession = {
      id: Date.now().toString(),
      ...sessionData,
      createdBy: 'Current User', // TODO: Get from auth context
      startDate: new Date().toISOString().split('T')[0],
      completedDate: null,
      completed: false,
      countedItems: 0,
      totalItems: 0,
      duration: '0 minutes',
      notes: ''
    }
    countSessions.value.push(newSession)
    return newSession
  }

  const startCountSession = (sessionId) => {
    const session = countSessions.value.find(s => s.id === sessionId)
    if (session) {
      currentSession.value = session
      scannedItems.value = []
    }
  }

  const addScannedItem = (compound, countedQuantity) => {
    const existingItem = scannedItems.value.find(item => item.id === compound.id)
    
    if (existingItem) {
      existingItem.countedQuantity = countedQuantity
      existingItem.lastUpdated = new Date().toISOString()
    } else {
      scannedItems.value.push({
        ...compound,
        countedQuantity,
        originalQuantity: compound.quantity,
        discrepancy: countedQuantity - compound.quantity,
        lastUpdated: new Date().toISOString()
      })
    }
  }

  const completeCountSession = (notes = '') => {
    if (currentSession.value) {
      const session = countSessions.value.find(s => s.id === currentSession.value.id)
      if (session) {
        session.completed = true
        session.completedDate = new Date().toISOString().split('T')[0]
        session.countedItems = scannedItems.value.length
        session.notes = notes
        
        // TODO: Update compound quantities in the system
        // TODO: Generate audit trail
        
        currentSession.value = null
        scannedItems.value = []
      }
    }
  }

  const getSessionProgress = (sessionId) => {
    const session = countSessions.value.find(s => s.id === sessionId)
    if (!session) return { progress: 0, counted: 0, total: 0 }
    
    return {
      progress: session.totalItems > 0 ? (session.countedItems / session.totalItems) * 100 : 0,
      counted: session.countedItems,
      total: session.totalItems
    }
  }

  return {
    countSessions,
    currentSession,
    scannedItems,
    isScanning,
    activeSessions,
    completedSessions,
    createCountSession,
    startCountSession,
    addScannedItem,
    completeCountSession,
    getSessionProgress
  }
}
