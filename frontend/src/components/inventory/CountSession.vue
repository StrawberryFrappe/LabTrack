<template>
  <Card>
    <template #header>
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold text-slate-900">{{ session.name }}</h3>
        <Badge :variant="session.status === 'completed' ? 'success' : 'warning'">
          {{ session.status === 'completed' ? $t('inventory.status.completed') : $t('inventory.status.inProgress') }}
        </Badge>
      </div>
    </template>
    
    <div class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <span class="text-slate-500">{{ $t('inventory.labels.createdBy') }}:</span>
          <span class="ml-2">{{ session.createdByName || session.createdBy }}</span>
        </div>
        <div>
          <span class="text-slate-500">{{ $t('inventory.labels.startDate') }}:</span>
          <span class="ml-2">{{ formatDate(session.startDate) }}</span>
        </div>
        <div v-if="session.completedDate">
          <span class="text-slate-500">{{ $t('inventory.labels.completed') }}:</span>
          <span class="ml-2">{{ formatDate(session.completedDate) }}</span>
        </div>
        <div v-if="session.status === 'active'">
          <span class="text-slate-500">{{ $t('inventory.labels.status') }}:</span>
          <span class="ml-2">{{ $t('inventory.status.inProgress') }}</span>
        </div>
      </div>
      
      <!-- Locations -->
      <div>
        <span class="text-slate-500 text-sm">{{ $t('inventory.labels.locations') }}:</span>
        <div class="mt-1 flex flex-wrap gap-1">
          <span 
            v-for="location in session.locations" 
            :key="location"
            class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
          >
            {{ location }}
          </span>
        </div>
      </div>
      
      <div v-if="session.description" class="text-sm text-slate-600">
        {{ session.description }}
      </div>
      
      <div class="space-y-2">
        <div class="flex items-center justify-between text-sm">
          <span class="text-slate-500">{{ $t('inventory.progress') }}</span>
          <span class="font-medium">{{ progressText }}</span>
        </div>
        
        <!-- Progress bars for each location -->
        <div class="space-y-1">
          <div class="w-full bg-slate-200 rounded-full h-2">
            <div 
              class="bg-blue-500 h-2 rounded-full transition-all duration-300"
              :style="{ width: `${progressPercentage}%` }"
            />
          </div>
          <div class="text-xs text-slate-500 text-right">
            {{ progressPercentage.toFixed(0) }}{{ $t('inventory.status.percentComplete') }}
          </div>
        </div>
        
        <!-- Location-specific progress -->
        <div v-if="session.status === 'active' && session.locations.length > 1" class="text-xs text-slate-500 space-y-1">
          <div v-for="location in session.locations" :key="location" class="flex items-center justify-between">
            <span class="truncate">{{ location }}</span>
            <span>{{ getLocationProgress(location) }}</span>
          </div>
        </div>
      </div>
      
      <div v-if="session.duration" class="text-sm">
        <span class="text-slate-500">{{ $t('inventory.labels.duration') }}:</span>
        <span class="ml-2">{{ session.duration }}</span>
      </div>
      
      <div v-if="session.notes" class="p-3 bg-slate-50 rounded-md text-sm">
        <div class="font-medium text-slate-700 mb-1">{{ $t('inventory.labels.notes') }}:</div>
        <div class="text-slate-600">{{ session.notes }}</div>
      </div>
    </div>
    
    <template #footer>
      <div class="flex gap-2">
        <Button 
          v-if="session.status === 'active'"
          variant="primary"
          size="sm"
          @click="$emit('continue', session)"
        >
          {{ $t('inventory.sessionActions.continueCount') }}
        </Button>
        <Button 
          variant="outline"
          size="sm"
          @click="$emit('view-details', session)"
        >
          {{ $t('inventory.sessionActions.viewDetails') }}
        </Button>
        <Button 
          v-if="session.status === 'active'"
          :variant="canComplete ? 'primary' : 'outline'"
          size="sm"
          :disabled="!canComplete"
          @click="$emit('complete', session)"
        >
          {{ canComplete ? $t('inventory.sessionActions.complete') : $t('inventory.sessionActions.incompleteSession') }}
        </Button>
      </div>
    </template>
  </Card>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useInventoryCount } from '@/composables/useInventoryCount'
import Card from '@/components/ui/Card.vue'
import Badge from '@/components/ui/Badge.vue'
import Button from '@/components/ui/Button.vue'

const { t } = useI18n()
const { getLocationProgressInSession, canCompleteSession } = useInventoryCount()

const props = defineProps({
  session: {
    type: Object,
    required: true
  }
})

defineEmits(['continue', 'view-details', 'complete'])

// Simple date formatting for now
const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString()
}

const progressPercentage = computed(() => {
  if (!props.session.totalItems || props.session.totalItems === 0) return 0
  
  // Use the progress from the session which is based on verified items
  return props.session.progress || 0
})

const progressText = computed(() => {
  const verifiedItems = props.session.verifiedItems || 0
  const totalItems = props.session.totalItems || 0
  
  if (totalItems === 0) return t('inventory.unknown')
  
  return `${verifiedItems} / ${totalItems}`
})

const getLocationProgress = (location) => {
  const progress = getLocationProgressInSession(props.session.id, location)
  return `${progress.verified}/${progress.total}`
}

const canComplete = computed(() => {
  return canCompleteSession(props.session.id)
})
</script>
