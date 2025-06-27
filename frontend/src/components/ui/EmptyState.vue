<template>
  <div class="text-center py-8 px-4">
    <div class="text-6xl mb-4" v-if="icon">{{ icon }}</div>
    <div class="text-4xl mb-4 text-slate-400" v-else>📋</div>
    
    <h3 class="text-lg font-medium text-slate-900 mb-2">
      {{ title }}
    </h3>
    
    <p class="text-sm text-slate-600 mb-6 max-w-sm mx-auto" v-if="description">
      {{ description }}
    </p>
    
    <div class="space-y-3" v-if="showActions">
      <Button 
        v-if="primaryAction"
        :variant="primaryAction.variant || 'primary'"
        @click="$emit('primary-action')"
      >
        {{ primaryAction.text }}
      </Button>
      
      <Button 
        v-if="secondaryAction"
        variant="outline"
        @click="$emit('secondary-action')"
      >
        {{ secondaryAction.text }}
      </Button>
    </div>
  </div>
</template>

<script setup>
import Button from '@/components/ui/Button.vue'

defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: ''
  },
  primaryAction: {
    type: Object,
    default: null
    // { text: 'Action Text', variant: 'primary' }
  },
  secondaryAction: {
    type: Object,
    default: null
    // { text: 'Action Text' }
  },
  showActions: {
    type: Boolean,
    default: true
  }
})

defineEmits(['primary-action', 'secondary-action'])
</script>
