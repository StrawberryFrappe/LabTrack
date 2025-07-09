// Simple test script to verify count session functionality

async function testCountSession() {
  try {
    // Test 1: Check if server is running
    const response = await fetch('http://localhost:3001/countSessions')
    const sessions = await response.json()
    console.log('✓ Server is running')
    console.log('Current sessions:', sessions.length)
    
    // Test 2: Create a test session
    const testSession = {
      id: 'test_session_123',
      name: 'Test Session',
      description: 'Test session for validation',
      locations: ['micasa', 'La casa de mi bro'],
      status: 'active',
      createdBy: 'test_user',
      createdByName: 'Test User',
      startDate: new Date().toISOString(),
      completedDate: null,
      counts: [],
      newInstances: [],
      movedInstances: [],
      notes: '',
      totalItems: 2,
      countedItems: 0
    }
    
    const createResponse = await fetch('http://localhost:3001/countSessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testSession)
    })
    
    if (createResponse.ok) {
      const createdSession = await createResponse.json()
      console.log('✓ Test session created:', createdSession.id)
      
      // Clean up
      await fetch(`http://localhost:3001/countSessions/${createdSession.id}`, {
        method: 'DELETE'
      })
      console.log('✓ Test session cleaned up')
    } else {
      console.error('✗ Failed to create test session')
    }
    
  } catch (error) {
    console.error('✗ Test failed:', error.message)
  }
}

testCountSession()
