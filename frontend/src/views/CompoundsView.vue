<!--
  Compounds View Component
  
  This view handles compound management functionality including
  listing, filtering, and managing chemical compounds in the lab.
  
  Features:
  - Compound list and table views
  - Search and filtering
  - Add/edit/delete compounds
  - Role-based access controls
  
  TODO: Add compound batch management
  TODO: Implement compound categories
  TODO: Add compound expiry tracking
  TODO: Implement compound usage history
-->

<template>
  <div class="space-y-8">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-slate-900">Chemical Compounds</h1>
        <p class="text-slate-600 mt-1">Manage your laboratory's chemical inventory</p>
      </div>
      <!-- TODO: Add compound management actions -->
      <div class="flex items-center space-x-3">
        <!-- <Button variant="primary" @click="showAddCompound = true">
          Add Compound
        </Button> -->
      </div>
    </div>
    
    <!-- Compounds List -->
    <CompoundList />
  </div>
</template>

<script setup>
import CompoundList from '@/components/compounds/CompoundList.vue'
// TODO: Import Button component when ready to implement add functionality
// import Button from '@/components/ui/Button.vue'

// TODO: Add compound management state
// const showAddCompound = ref(false)
</script>
