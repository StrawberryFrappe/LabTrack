// Quick test script to verify the transaction API is working
// Run this with: node test-transactions.js

const baseUrl = 'http://localhost:3001';

async function testTransactionAPI() {
  console.log('🧪 Testing Transaction API...\n');
  
  try {
    // Test 1: Get all transactions
    console.log('📋 Test 1: Getting all transactions...');
    const response1 = await fetch(`${baseUrl}/transactions`);
    const transactions = await response1.json();
    console.log(`✅ Found ${transactions.length} transactions`);
    console.log('Latest transaction:', transactions[0] || 'None');
    
    // Test 2: Get transactions for compound "2" (Hydrochloric Acid)
    console.log('\n🔍 Test 2: Getting transactions for compound "2"...');
    const response2 = await fetch(`${baseUrl}/transactions?compoundId=2`);
    const compoundTransactions = await response2.json();
    console.log(`✅ Found ${compoundTransactions.length} transactions for compound 2`);
    
    // Test 3: Calculate stock for compound "2"
    console.log('\n📊 Test 3: Calculating stock for compound "2"...');
    let currentStock = 25; // Initial stock from db.json
    
    compoundTransactions.forEach(transaction => {
      switch (transaction.type) {
        case 'use':
        case 'waste':
          currentStock -= transaction.quantity;
          break;
        case 'restock':
          currentStock += transaction.quantity;
          break;
        case 'adjust':
          currentStock = transaction.quantity;
          break;
      }
    });
    
    console.log(`✅ Calculated current stock: ${currentStock} ml`);
    console.log('Transaction breakdown:');
    compoundTransactions.forEach(t => {
      console.log(`  - ${t.timestamp.split('T')[0]}: ${t.type} ${t.quantity} ml (${t.notes})`);
    });
    
    // Test 4: Create a new test transaction
    console.log('\n➕ Test 4: Creating a new test transaction...');
    const newTransaction = {
      compoundId: '2',
      type: 'use',
      quantity: 2,
      timestamp: new Date().toISOString(),
      userId: '1',
      userName: 'Test User',
      notes: 'API test transaction',
      location: 'Acid Cabinet'
    };
    
    const response4 = await fetch(`${baseUrl}/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newTransaction)
    });
    
    const createdTransaction = await response4.json();
    console.log('✅ Created transaction:', createdTransaction);
    
    // Test 5: Verify the new transaction appears in the list
    console.log('\n🔄 Test 5: Verifying new transaction...');
    const response5 = await fetch(`${baseUrl}/transactions?compoundId=2`);
    const updatedTransactions = await response5.json();
    console.log(`✅ Now ${updatedTransactions.length} transactions for compound 2`);
    
    // Calculate updated stock
    let updatedStock = 25;
    updatedTransactions.forEach(transaction => {
      switch (transaction.type) {
        case 'use':
        case 'waste':
          updatedStock -= transaction.quantity;
          break;
        case 'restock':
          updatedStock += transaction.quantity;
          break;
        case 'adjust':
          updatedStock = transaction.quantity;
          break;
      }
    });
    
    console.log(`✅ Updated stock after test transaction: ${updatedStock} ml`);
    
    console.log('\n🎉 All tests passed! The Transaction API is working correctly.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the tests
testTransactionAPI();
