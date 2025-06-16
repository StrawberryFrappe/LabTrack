<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    <StatsCard
      title="Total Compounds"
      :value="compounds.length"
      icon="beaker"
      variant="default"
    />
    
    <StatsCard
      title="Low Stock Items"
      :value="lowStockItems.length"
      :subtitle="`Below threshold levels`"
      icon="warning"
      variant="warning"
    />
    
    <StatsCard
      title="Expiring Soon"
      :value="expiringItems.length"
      :subtitle="`Within 3 months`"
      icon="clock"
      variant="error"
    />
    
    <StatsCard
      title="Locations"
      :value="locations.length"
      :subtitle="`Storage locations`"
      icon="info"
      variant="success"
    />
  </div>
</template>

<script setup>
import StatsCard from './StatsCard.vue'
import { useCompounds } from '@/composables/useCompounds'

const { compounds, lowStockItems, expiringItems, locations } = useCompounds()
</script>
