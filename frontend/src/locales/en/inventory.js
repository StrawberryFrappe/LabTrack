export default {
  inventory: {
    title: 'Inventory Count',
    startCount: 'Start New Count',
    activeCount: 'Active Count Session',
    scanBarcode: 'Scan Barcode',
    manualEntry: 'Manual Entry',
    manualEntryPlaceHolder: "Enter inventory details...",
    saveCount: 'Save Count',
    completeCount: 'Complete Count',
    countsTitle: "Inventory Counts",
    countsSubtitle: "Manage physical inventory counting sessions",
    activeSessions: "Active Count Sessions",
    recentSessions: "Recent Sessions",
    createSessionTitle: "Create New Count Session",
    sessionNamePlaceholder: "Session name",
    sessionNameLabel: "Name",
    sessionDescriptionPlaceholder: "Session description",
    sessionDescriptionLabel: "Description",
    sessionLocationPlaceholder: "Location to count",
    sessionLocationLabel: "Location",
    sessionLocationsLabel: "Locations to Count",
    selectAllLocations: "Select All Locations",
    locationsSelected: "{count} of {total} locations selected",
    noLocationsAvailable: "No locations available (no active instances found)",
    createSessionButton: "Create Session",
    scannerTitle: "Inventory Scanner",
    scannerPrompt: "Scan barcode or enter manually",
    enableCamera: "Enable Camera Scanner",
    findButton: "Find",
    expectedQuantity: "Expected Quantity",
    discrepancy: "Discrepancy",
    confirmCount: "Confirm Count",
    cancel: "Cancel",
    recentScans: "Recent Scans",
    counted: "Counted",
    
    // Count Entry Modal
    countEntry: "Count Entry",
    countingLocation: "Counting location: {location}",
    countedQuantity: "Counted Quantity",
    countedQuantityPlaceholder: "Enter counted quantity",
    discrepancyFound: "Discrepancy Found",
    overageFound: "Overage",
    shortageFound: "Shortage",
    noDiscrepancy: "No Discrepancy",
    verificationStatus: "Verification Status",
    verified: "Verified",
    discrepancy: "Discrepancy",
    notFound: "Not Found",
    batchNumber: "Batch Number",
    expiryDate: "Expiry Date",
    notes: "Notes",
    discrepancyNotesPlaceholder: "Enter notes about discrepancy...",
    instancesVerified: "{count} of {total} instances verified",
    saveProgress: "Save Progress",
    
    // Count Entry Labels
    cas: "CAS",
    location: "Location", 
    expected: "Expected",
    
    // Count Entry Actions
    confirmCount: "Confirm Count",
    confirmCountAction: "Confirm",
    cancelCountAction: "Cancel",
    
    // Count Session Progress
    progress: "Progress",
    unknown: "Unknown",
    
    // Count Session Labels
    labels: {
      location: "Location",
      locations: "Locations",
      createdBy: "Created by",
      startDate: "Start Date", 
      completed: "Completed",
      duration: "Duration",
      notes: "Notes",
      status: "Status"
    },
    
    // Count Session Actions
    sessionActions: {
      continueCount: "Continue Count",
      viewDetails: "View Details", 
      complete: "Complete"
    },
    
    // Count Session Status
    status: {
      completed: "Completed",
      inProgress: "In Progress",
      percentComplete: "% Complete"
    }
  },
  
  // Transactions (Transaction Management)
  inventorySessions: {
    title: 'Transactions',
    subtitle: 'Record and track inventory transactions in real-time',
    
    // Quick Transaction Form
    quickTransaction: {
      title: 'Quick Transaction',
      selectCompound: 'Select Compound',
      compoundPlaceholder: 'Search compounds...',
      transactionType: 'Transaction Type',
      quantity: 'Quantity',
      notes: 'Notes (Optional)',
      notesPlaceholder: 'Add notes...',
      location: 'Location',
      locationPlaceholder: 'Enter location...',
      record: 'Record Transaction',
      
      // Transaction Types
      types: {
        use: 'Use',
        restock: 'Restock',
        adjust: 'Adjust',
        transfer: 'Transfer',
        waste: 'Waste'
      },
      
      // Stock Preview
      stockPreview: {
        current: 'Current Stock',
        after: 'After Transaction',
        loading: 'Calculating...'
      }
    },
    
    // Transaction History
    history: {
      title: 'Transaction History',
      today: 'Today',
      thisWeek: 'This Week',
      total: 'Total',
      allTypes: 'All Types',
      allTime: 'All Time',
      last7Days: 'Last 7 Days',
      last30Days: 'Last 30 Days',
      thisMonth: 'This Month',
      
      // Table Headers
      compound: 'Compound',
      type: 'Type',
      quantity: 'Quantity',
      user: 'User',
      timestamp: 'Date & Time',
      notes: 'Notes',
      actions: 'Actions'
    },
    
    // Actions
    actions: {
      refresh: 'Refresh',
      bulkAction: 'Bulk Actions',
      edit: 'Edit',
      delete: 'Delete',
      export: 'Export'
    },
    
    // Bulk Operations
    bulk: {
      title: 'Bulk Operations',
      description: 'Import or export inventory transactions in bulk',
      import: 'Import Transactions',
      export: 'Export to CSV'
    },
    
    // Messages
    messages: {
      transactionRecorded: 'Transaction recorded successfully',
      transactionFailed: 'Failed to record transaction',
      deleteTransactionConfirm: 'Are you sure you want to delete this transaction?',
      noTransactions: 'No transactions found',
      loadingTransactions: 'Loading transactions...',
      
      // Session messages
      sessionCreated: 'Count session created successfully',
      sessionCreationFailed: 'Failed to create count session',
      sessionContinued: 'Count session resumed',
      sessionCompleted: 'Count session completed successfully',
      sessionCompletionFailed: 'Failed to complete count session',
      nameAndLocationsRequired: 'Session name and at least one location are required',
      progressSaved: 'Progress saved successfully',
      progressSaveFailed: 'Failed to save progress',
      unsavedChanges: 'You have unsaved changes. Are you sure you want to close?',
      allLocationsCompleted: 'All locations have been counted'
    }
  }
}
