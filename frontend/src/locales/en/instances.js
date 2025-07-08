export default {
  instances: {
    title: 'Compound Instances',
    subtitle: 'Manage individual batches and containers',
    
    // Labels
    labels: {
      batch: 'Batch',
      batchNumber: 'Batch Number',
      noBatch: 'No Batch',
      expiryDate: 'Expiry Date',
      expires: 'Expires',
      quantity: 'Quantity',
      location: 'Location',
      status: 'Status',
      compound: 'Compound',
      supplier: 'Supplier',
      cost: 'Cost',
      notes: 'Notes'
    },
    
    // Status values
    status: {
      active: 'Active',
      used_up: 'Used Up',
      expired: 'Expired',
      disposed: 'Disposed',
      transferred: 'Transferred'
    },
    
    // Actions
    actions: {
      view: 'View Details',
      edit: 'Edit Instance',
      delete: 'Delete Instance',
      markUsedUp: 'Mark as Used Up',
      transfer: 'Transfer',
      split: 'Split Instance'
    },
    
    // Messages
    messages: {
      created: 'Instance created successfully',
      updated: 'Instance updated successfully',
      deleted: 'Instance deleted successfully',
      markedUsedUp: 'Instance marked as used up',
      transferred: 'Instance transferred successfully',
      split: 'Instance split successfully',
      error: 'An error occurred',
      noInstances: 'No instances found',
      noInstancesForCompound: 'No instances found for this compound'
    },
    
    // Form fields
    form: {
      batchNumber: 'Batch Number',
      batchNumberPlaceholder: 'Enter batch number',
      quantity: 'Quantity',
      quantityPlaceholder: 'Enter quantity',
      location: 'Location',
      locationPlaceholder: 'Enter storage location',
      expiryDate: 'Expiry Date',
      supplier: 'Supplier',
      supplierPlaceholder: 'Enter supplier name',
      cost: 'Cost',
      costPlaceholder: 'Enter cost',
      notes: 'Notes',
      notesPlaceholder: 'Add any additional notes...'
    }
  }
}
