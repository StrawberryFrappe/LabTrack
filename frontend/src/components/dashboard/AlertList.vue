<template>
  <Card>
    <template #header>
      <h3 class="text-lg font-semibold text-slate-900">{{ title }}</h3>
    </template>
    
    <div v-if="items.length === 0" class="text-center py-8 text-slate-500">
      <div class="text-2xl mb-2">✅</div>
      <p>{{ emptyMessage }}</p>
    </div>
    
    <div v-else class="space-y-3">
      <div 
        v-for="item in displayItems" 
        :key="item.id"
        :class="itemClasses"
      >
        <slot name="item" :item="item" />
      </div>
      
      <div v-if="hasMore" :class="footerClasses">
        <router-link 
          :to="linkTo" 
          :class="linkClasses"
        >
          {{ linkText }} →
        </router-link>
      </div>
    </div>
  </Card>
</template>

<script setup>
import { computed } from 'vue'
import Card from '../ui/Card.vue'

const props = defineProps({
  items: {
    type: Array,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  emptyMessage: {
    type: String,
    required: true
  },
  maxDisplay: {
    type: Number,
    default: 5
  },
  variant: {
    type: String,
    default: 'red',
    validator: (value) => ['red', 'amber', 'blue', 'green'].includes(value)
  },
  linkTo: {
    type: String,
    required: true
  },
  linkText: {
    type: String,
    required: true
  }
})

// Color variants for different alert types
const variants = {
  red: {
    item: 'flex items-center justify-between p-3 bg-red-50 rounded-lg',
    footer: 'text-center pt-3 border-t border-red-200',
    link: 'text-sm text-red-600 hover:text-red-800 font-medium'
  },
  amber: {
    item: 'flex items-center justify-between p-3 bg-amber-50 rounded-lg',
    footer: 'text-center pt-3 border-t border-amber-200',
    link: 'text-sm text-amber-600 hover:text-amber-800 font-medium'
  },
  blue: {
    item: 'flex items-center justify-between p-3 bg-blue-50 rounded-lg',
    footer: 'text-center pt-3 border-t border-blue-200',
    link: 'text-sm text-blue-600 hover:text-blue-800 font-medium'
  },
  green: {
    item: 'flex items-center justify-between p-3 bg-green-50 rounded-lg',
    footer: 'text-center pt-3 border-t border-green-200',
    link: 'text-sm text-green-600 hover:text-green-800 font-medium'
  }
}

const displayItems = computed(() => props.items.slice(0, props.maxDisplay))
const hasMore = computed(() => props.items.length > props.maxDisplay)
const currentVariant = computed(() => variants[props.variant])
const itemClasses = computed(() => currentVariant.value.item)
const footerClasses = computed(() => currentVariant.value.footer)
const linkClasses = computed(() => currentVariant.value.link)
</script>
