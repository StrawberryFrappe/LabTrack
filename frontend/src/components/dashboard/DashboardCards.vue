<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    <StatsCard
      :title="$t('dashboard.totalCompounds')"
      :value="compounds.length"
      icon="beaker"
      variant="default"
    />
    
    <StatsCard
      :title="$t('dashboard.lowStock')"
      :value="lowStockItems.length"
      :subtitle="$t('dashboard.belowThreshold')"
      icon="warning"
      variant="warning"
    />
    
    <StatsCard
      :title="$t('dashboard.expiring')"
      :value="expiringItems.length"
      :subtitle="$t('dashboard.withinThreeMonths')"
      icon="clock"
      variant="error"
    />
    
    <StatsCard
      :title="$t('dashboard.locations')"
      :value="locations.length"
      :subtitle="$t('dashboard.storageLocations')"
      icon="info"
      variant="success"
    />
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import StatsCard from './StatsCard.vue'
import { useCompounds } from '@/composables/useCompounds'

// i18n
const { t: $t } = useI18n()

const { compounds, lowStockItems, expiringItems, locations } = useCompounds()
</script>
