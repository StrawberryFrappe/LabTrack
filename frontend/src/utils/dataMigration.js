/**
 * Data Migration Utilities
 * 
 * Functions to normalize and fix data inconsistencies in the database.
 */

import { instanceService } from '../services/instanceService.js'
import { compoundService } from '../services/compoundService.js'

/**
 * Migrate Instance Data
 * 
 * Normalizes all compound instances to ensure consistent structure.
 * This fixes instances that may be missing required fields.
 */
export async function migrateInstanceData() {
  console.log('Starting instance data migration...')
  
  try {
    // Get all instances (this will already normalize them through the service)
    const instances = await instanceService.getAll()
    
    console.log(`Found ${instances.length} instances to check`)
    
    // Get all compounds for reference
    const compounds = await compoundService.getAll()
    const compoundMap = new Map(compounds.map(c => [c.id, c]))
    
    let migratedCount = 0
    
    // Process each instance
    for (const instance of instances) {
      const needsUpdate = await checkInstanceNeedsUpdate(instance, compoundMap)
      
      if (needsUpdate) {
        const normalizedInstance = instanceService.normalizeInstance(instance)
        
        // Ensure compoundId is set if missing
        if (!normalizedInstance.compoundId && instance.id) {
          // Try to find compound by matching transaction data
          const possibleCompound = findCompoundForInstance(instance, compoundMap)
          if (possibleCompound) {
            normalizedInstance.compoundId = possibleCompound.id
          }
        }
        
        // Update the instance
        await instanceService.update(instance.id, normalizedInstance)
        migratedCount++
        
        console.log(`Migrated instance ${instance.id}`)
      }
    }
    
    console.log(`Migration completed. Updated ${migratedCount} instances.`)
    return { success: true, migratedCount }
    
  } catch (error) {
    console.error('Migration failed:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Check if Instance Needs Update
 * 
 * Determines if an instance is missing required fields or has incorrect data.
 */
async function checkInstanceNeedsUpdate(instance, compoundMap) {
  // Check for missing required fields
  const requiredFields = ['compoundId', 'location', 'batchNumber', 'status']
  
  for (const field of requiredFields) {
    if (!instance[field] || instance[field] === '') {
      return true
    }
  }
  
  // Check if quantity is properly formatted
  if (typeof instance.quantity !== 'number' || isNaN(instance.quantity)) {
    return true
  }
  
  // Check if status matches quantity
  if (instance.quantity <= 0 && instance.status !== 'used_up') {
    return true
  }
  
  if (instance.quantity > 0 && instance.status === 'used_up') {
    return true
  }
  
  // Check if compoundId exists in compounds
  if (instance.compoundId && !compoundMap.has(instance.compoundId)) {
    return true
  }
  
  return false
}

/**
 * Find Compound for Instance
 * 
 * Attempts to find the correct compound for an instance based on available data.
 */
function findCompoundForInstance(instance, compoundMap) {
  // For now, we'll need to use transaction data or other heuristics
  // This is a placeholder - in a real scenario, you'd need to implement
  // logic based on your specific data relationships
  
  // If we have transaction data, we could use that
  // For now, return null and let manual assignment happen
  return null
}

/**
 * Validate Database Consistency
 * 
 * Checks for common data inconsistencies and reports them.
 */
export async function validateDatabaseConsistency() {
  console.log('Validating database consistency...')
  
  const issues = []
  
  try {
    // Check instances
    const instances = await instanceService.getAll()
    const compounds = await compoundService.getAll()
    const compoundMap = new Map(compounds.map(c => [c.id, c]))
    
    for (const instance of instances) {
      // Check for orphaned instances
      if (instance.compoundId && !compoundMap.has(instance.compoundId)) {
        issues.push({
          type: 'orphaned_instance',
          instance: instance.id,
          compoundId: instance.compoundId,
          message: `Instance ${instance.id} references non-existent compound ${instance.compoundId}`
        })
      }
      
      // Check for missing required fields
      if (!instance.compoundId) {
        issues.push({
          type: 'missing_compound_id',
          instance: instance.id,
          message: `Instance ${instance.id} is missing compoundId`
        })
      }
      
      // Check quantity vs status consistency
      if (instance.quantity <= 0 && instance.status !== 'used_up') {
        issues.push({
          type: 'inconsistent_status',
          instance: instance.id,
          message: `Instance ${instance.id} has zero quantity but status is not 'used_up'`
        })
      }
    }
    
    console.log(`Validation completed. Found ${issues.length} issues.`)
    return { success: true, issues }
    
  } catch (error) {
    console.error('Validation failed:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Export Database Data
 * 
 * Creates a backup of the current database state.
 */
export async function exportDatabaseData() {
  try {
    const [instances, compounds] = await Promise.all([
      instanceService.getAll(),
      compoundService.getAll()
    ])
    
    const backup = {
      timestamp: new Date().toISOString(),
      instances,
      compounds
    }
    
    return backup
  } catch (error) {
    console.error('Export failed:', error)
    throw error
  }
}
