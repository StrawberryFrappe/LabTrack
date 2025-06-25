/**
 * Data Migration Script
 * 
 * This script migrates existing compound data to the new instance-based structure.
 * It creates compound instances from existing compound data while preserving
 * all information and transaction history.
 * 
 * Usage:
 * 1. Make sure the development server is running (npm run dev)
 * 2. Run this script in the browser console or as a Node.js script
 * 3. Verify the migration by checking the compound instances
 * 
 * What this script does:
 * - Creates compound instances from existing compound quantity/location data
 * - Updates transaction records to reference the new instances
 * - Preserves all existing data integrity
 * - Provides rollback capability
 */

class CompoundInstanceMigration {
  constructor(apiBaseUrl = 'http://localhost:3001') {
    this.apiBaseUrl = apiBaseUrl
    this.migrationLog = []
    this.createdInstances = []
    this.updatedTransactions = []
  }

  /**
   * Main migration function
   */
  async migrate() {
    console.log('🚀 Starting compound instance migration...')
    
    try {
      // Step 1: Fetch existing data
      console.log('📊 Fetching existing data...')
      const compounds = await this.fetchCompounds()
      const transactions = await this.fetchTransactions()
      
      // Step 2: Create instances from compounds
      console.log('🏗️ Creating compound instances...')
      await this.createInstancesFromCompounds(compounds)
      
      // Step 3: Update transactions to reference instances
      console.log('🔄 Updating transaction references...')
      await this.updateTransactionReferences(transactions)
      
      // Step 4: Verify migration
      console.log('✅ Verifying migration...')
      await this.verifyMigration()
      
      console.log('🎉 Migration completed successfully!')
      this.printSummary()
      
    } catch (error) {
      console.error('❌ Migration failed:', error)
      console.log('🔄 Rolling back changes...')
      await this.rollback()
      throw error
    }
  }

  /**
   * Fetch all compounds
   */
  async fetchCompounds() {
    const response = await fetch(`${this.apiBaseUrl}/compounds`)
    if (!response.ok) throw new Error('Failed to fetch compounds')
    return response.json()
  }

  /**
   * Fetch all transactions
   */
  async fetchTransactions() {
    const response = await fetch(`${this.apiBaseUrl}/transactions`)
    if (!response.ok) throw new Error('Failed to fetch transactions')
    return response.json()
  }

  /**
   * Create instances from existing compounds
   */
  async createInstancesFromCompounds(compounds) {
    for (const compound of compounds) {
      // Skip if no quantity or location data
      if (!compound.quantity && !compound.location) {
        this.log(`Skipped compound ${compound.name} - no quantity/location data`)
        continue
      }

      const instance = {
        id: `inst-${compound.id}-1`,
        compoundId: compound.id,
        batchNumber: compound.batchNumber || 'MIGRATED-001',
        quantity: compound.quantity || 0,
        unit: compound.unit || 'units',
        location: compound.location || 'Unknown Location',
        expiryDate: compound.expiryDate || null,
        receivedDate: compound.receivedDate || null,
        openedDate: null,
        status: 'active',
        createdAt: new Date().toISOString(),
        migrated: true
      }

      try {
        const response = await fetch(`${this.apiBaseUrl}/compoundInstances`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(instance)
        })

        if (!response.ok) {
          throw new Error(`Failed to create instance for compound ${compound.name}`)
        }

        const createdInstance = await response.json()
        this.createdInstances.push(createdInstance)
        this.log(`Created instance ${createdInstance.id} for compound ${compound.name}`)

      } catch (error) {
        this.log(`Error creating instance for compound ${compound.name}: ${error.message}`)
        throw error
      }
    }
  }

  /**
   * Update transactions to reference instances
   */
  async updateTransactionReferences(transactions) {
    for (const transaction of transactions) {
      // Find the corresponding instance for this compound
      const instance = this.createdInstances.find(inst => 
        inst.compoundId === transaction.compoundId
      )

      if (!instance) {
        this.log(`No instance found for transaction ${transaction.id}`)
        continue
      }

      // Update transaction with instance reference
      const updatedTransaction = {
        ...transaction,
        instanceId: instance.id
      }

      try {
        const response = await fetch(`${this.apiBaseUrl}/transactions/${transaction.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updatedTransaction)
        })

        if (!response.ok) {
          throw new Error(`Failed to update transaction ${transaction.id}`)
        }

        this.updatedTransactions.push(transaction.id)
        this.log(`Updated transaction ${transaction.id} to reference instance ${instance.id}`)

      } catch (error) {
        this.log(`Error updating transaction ${transaction.id}: ${error.message}`)
        throw error
      }
    }
  }

  /**
   * Verify migration integrity
   */
  async verifyMigration() {
    // Check that all created instances exist
    for (const instance of this.createdInstances) {
      const response = await fetch(`${this.apiBaseUrl}/compoundInstances/${instance.id}`)
      if (!response.ok) {
        throw new Error(`Instance ${instance.id} not found after migration`)
      }
    }

    // Check that all updated transactions have instanceId
    for (const transactionId of this.updatedTransactions) {
      const response = await fetch(`${this.apiBaseUrl}/transactions/${transactionId}`)
      if (!response.ok) {
        throw new Error(`Transaction ${transactionId} not found after migration`)
      }
      
      const transaction = await response.json()
      if (!transaction.instanceId) {
        throw new Error(`Transaction ${transactionId} missing instanceId after migration`)
      }
    }

    this.log('✅ Migration verification completed successfully')
  }

  /**
   * Rollback migration changes
   */
  async rollback() {
    console.log('🔄 Rolling back migration changes...')

    // Delete created instances
    for (const instance of this.createdInstances) {
      try {
        await fetch(`${this.apiBaseUrl}/compoundInstances/${instance.id}`, {
          method: 'DELETE'
        })
        this.log(`Deleted instance ${instance.id}`)
      } catch (error) {
        this.log(`Error deleting instance ${instance.id}: ${error.message}`)
      }
    }

    // Remove instanceId from transactions (revert to original state)
    for (const transactionId of this.updatedTransactions) {
      try {
        const response = await fetch(`${this.apiBaseUrl}/transactions/${transactionId}`)
        if (response.ok) {
          const transaction = await response.json()
          delete transaction.instanceId
          
          await fetch(`${this.apiBaseUrl}/transactions/${transactionId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(transaction)
          })
          this.log(`Reverted transaction ${transactionId}`)
        }
      } catch (error) {
        this.log(`Error reverting transaction ${transactionId}: ${error.message}`)
      }
    }

    console.log('🔄 Rollback completed')
  }

  /**
   * Log migration activity
   */
  log(message) {
    const timestamp = new Date().toISOString()
    const logEntry = `[${timestamp}] ${message}`
    this.migrationLog.push(logEntry)
    console.log(logEntry)
  }

  /**
   * Print migration summary
   */
  printSummary() {
    console.log('\n📋 Migration Summary:')
    console.log(`✅ Created ${this.createdInstances.length} compound instances`)
    console.log(`✅ Updated ${this.updatedTransactions.length} transactions`)
    console.log(`📝 Total log entries: ${this.migrationLog.length}`)
    
    console.log('\n🏗️ Created Instances:')
    this.createdInstances.forEach(instance => {
      console.log(`  - ${instance.id}: ${instance.location} (${instance.quantity} ${instance.unit})`)
    })
  }

  /**
   * Export migration log
   */
  exportLog() {
    const logData = {
      timestamp: new Date().toISOString(),
      createdInstances: this.createdInstances.length,
      updatedTransactions: this.updatedTransactions.length,
      log: this.migrationLog
    }

    const blob = new Blob([JSON.stringify(logData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `compound-migration-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }
}

// Usage example:
// const migration = new CompoundInstanceMigration()
// await migration.migrate()

// Export for use in browser or Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CompoundInstanceMigration
} else if (typeof window !== 'undefined') {
  window.CompoundInstanceMigration = CompoundInstanceMigration
}

console.log('📦 Compound Instance Migration script loaded. Usage:')
console.log('const migration = new CompoundInstanceMigration()')
console.log('await migration.migrate()')
