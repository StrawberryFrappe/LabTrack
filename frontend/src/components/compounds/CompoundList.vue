<template>
  <div class="space-y-6">
    <CompoundFilters />
    
    <div v-if="filteredCompounds.length === 0" class="text-center py-12">
      <div class="text-slate-400 text-lg mb-2">🔍</div>
      <h3 class="text-lg font-medium text-slate-900 mb-2">No compounds found</h3>
      <p class="text-slate-500">Try adjusting your search filters.</p>
    </div>
    
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <CompoundCard
        v-for="compound in filteredCompounds"
        :key="compound.id"
        :compound="compound"
        @edit="handleEdit"
        @scan="handleScan"
      />
    </div>
  </div>
</template>

<script setup>
import CompoundCard from './CompoundCard.vue'
import CompoundFilters from './CompoundFilters.vue'
import { useCompounds } from '@/composables/useCompounds'

const { filteredCompounds } = useCompounds()

defineEmits(['edit-compound', 'scan-compound'])

const handleEdit = (compound) => {
  // TODO: Implement edit functionality
  console.log('Edit compound:', compound)
}

const handleScan = (compound) => {
  // TODO: Implement scan functionality
  console.log('Scan compound:', compound)
}
</script>
