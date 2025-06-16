<template>
  <div class="space-y-4">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Input
        v-model="searchQuery"
        placeholder="Search compounds..."
        label="Search"
      />
      
      <div class="space-y-2">
        <label class="block text-sm font-medium text-slate-700">Hazard Class</label>
        <select
          v-model="selectedHazardClass"
          class="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2"
        >
          <option value="">All hazard classes</option>
          <option v-for="hazardClass in hazardClasses" :key="hazardClass" :value="hazardClass">
            {{ hazardClass }}
          </option>
        </select>
      </div>
      
      <div class="space-y-2">
        <label class="block text-sm font-medium text-slate-700">Location</label>
        <select
          v-model="selectedLocation"
          class="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2"
        >
          <option value="">All locations</option>
          <option v-for="location in locations" :key="location" :value="location">
            {{ location }}
          </option>
        </select>
      </div>
    </div>
    
    <div class="flex items-center gap-4">
      <div class="text-sm text-slate-600">
        Showing {{ filteredCompounds.length }} of {{ compounds.length }} compounds
      </div>
      
      <div class="flex gap-2">
        <Badge variant="warning" v-if="lowStockItems.length > 0">
          {{ lowStockItems.length }} Low Stock
        </Badge>
        <Badge variant="destructive" v-if="expiringItems.length > 0">
          {{ expiringItems.length }} Expiring Soon
        </Badge>
      </div>
    </div>
  </div>
</template>

<script setup>
import Input from '@/components/ui/Input.vue'
import Badge from '@/components/ui/Badge.vue'
import { useCompounds } from '@/composables/useCompounds'

const {
  compounds,
  searchQuery,
  selectedHazardClass,
  selectedLocation,
  hazardClasses,
  locations,
  filteredCompounds,
  lowStockItems,
  expiringItems
} = useCompounds()
</script>
