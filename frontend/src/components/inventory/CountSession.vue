<template>
  <Card>
    <template #header>
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold text-slate-900">{{ session.name }}</h3>
        <Badge :variant="session.completed ? 'success' : 'warning'">
          {{ session.completed ? $t('inventory.status.completed') : $t('inventory.status.inProgress') }}
        </Badge>
      </div>
    </template>
    
    <div class="space-y-4">
      <div class="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span class="text-slate-500">{{ $t('inventory.labels.location') }}:</span>
          <span class="ml-2">{{ session.location }}</span>
        </div>
        <div>
          <span class="text-slate-500">{{ $t('inventory.labels.createdBy') }}:</span>
          <span class="ml-2">{{ session.createdBy }}</span>
        </div>
        <div>
          <span class="text-slate-500">{{ $t('inventory.labels.startDate') }}:</span>
          <span class="ml-2">{{ formatDate(session.startDate) }}</span>
        </div>
        <div v-if="session.completedDate">
          <span class="text-slate-500">{{ $t('inventory.labels.completed') }}:</span>
          <span class="ml-2">{{ formatDate(session.completedDate) }}</span>
        </div>
      </div>
      
      <div v-if="session.description" class="text-sm text-slate-600">
        {{ session.description }}
      </div>
      
      <div class="space-y-2">
        <div class="flex items-center justify-between text-sm">
          <span class="text-slate-500">{{ $t('inventory.progress') }}</span>
          <span class="font-medium">{{ session.countedItems }} / {{ session.totalItems || $t('inventory.unknown') }}</span>
        </div>
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
          v-if="!session.completed"
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
          v-if="!session.completed"
          variant="outline"
          size="sm"
          @click="$emit('complete', session)"
        >
          {{ $t('inventory.sessionActions.complete') }}
        </Button>
      </div>
    </template>
  </Card>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Card from '@/components/ui/Card.vue'
import Badge from '@/components/ui/Badge.vue'
import Button from '@/components/ui/Button.vue'
import { useFormat } from '@/utils/format.js'

const { t } = useI18n()

const props = defineProps({
  session: {
    type: Object,
    required: true
  }
})

defineEmits(['continue', 'view-details', 'complete'])

const { formatDate } = useFormat()

const progressPercentage = computed(() => {
  if (!props.session.totalItems || props.session.totalItems === 0) return 0
  return (props.session.countedItems / props.session.totalItems) * 100
})
</script>
