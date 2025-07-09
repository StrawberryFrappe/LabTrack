<!--
  Alert Cards Component - Displays low stock and expiring items alerts
-->

<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">      
    <!-- Low Stock Items -->
    <AlertList
      :items="lowStockItems"
      :title="$t('dashboard.lowStock')"
      :empty-message="$t('dashboard.allItemsStocked')"
      variant="red"
      link-to="/compounds"
      :link-text="$t('dashboard.viewAllLowStock', { count: lowStockItems.length })"
    >
      <template #item="{ item }">
        <div>
          <p class="font-medium text-red-900">{{ item.name }}</p>
          <p class="text-sm text-red-700">{{ item.quantity }} {{ item.unit }} {{ $t('dashboard.remaining') }}</p>
        </div>
        <div class="flex items-center space-x-2">
          <span class="text-red-600 font-medium">{{ item.quantity }}</span>
          <span class="text-xs text-red-500">{{ item.unit }}</span>
        </div>
      </template>
    </AlertList>
    
    <!-- Expiring Items -->
    <AlertList
      :items="expiringItems"
      :title="$t('dashboard.expiring')"
      :empty-message="$t('dashboard.noItemsExpiring')"
      variant="amber"
      link-to="/compounds"
      :link-text="$t('dashboard.viewAllExpiring', { count: expiringItems.length })"
    >
      <template #item="{ item }">
        <div>
          <p class="font-medium text-amber-900">{{ item.name }}</p>
          <p class="text-sm text-amber-700">{{ $t('dashboard.expires') }} {{ formatDate(item.expiryDate) }}</p>
        </div>
        <div class="flex items-center space-x-2">
          <span class="text-amber-600 font-medium">{{ getDaysUntilExpiry(item.expiryDate) }}</span>
          <span class="text-xs text-amber-500">{{ $t('dashboard.days') }}</span>
        </div>
      </template>
    </AlertList>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import AlertList from './AlertList.vue'
import { useCompounds } from '@/composables/useCompounds.js'

// i18n
const { t: $t } = useI18n()

// Compounds data
const { lowStockItems, expiringItems } = useCompounds()

// Utility methods
const formatDate = (dateString) => {
  // Format date utility - Enhanced with locale support for internationalization
  // TODO: Implement locale-specific date formatting based on user preferences
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const getDaysUntilExpiry = (dateString) => {
  const expiryDate = new Date(dateString)
  const today = new Date()
  const diffTime = expiryDate - today
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}
</script>
