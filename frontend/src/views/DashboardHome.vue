<!--
  Dashboard Home View
-->

<template>
  <div class="space-y-8">
    <!-- Dashboard Cards -->
    <DashboardCards />
    
    <!-- Alert Cards -->
    <AlertCards />
  </div>
</template>

<script setup>
import DashboardCards from '@/components/dashboard/DashboardCards.vue'
import AlertCards from '@/components/dashboard/AlertCards.vue'
</script>
