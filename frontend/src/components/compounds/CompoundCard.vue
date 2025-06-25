<template>
  <Card 
    class="cursor-pointer hover:shadow-lg transition-shadow duration-200"
    @click="handleCardClick"
  >
    <template #header>
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold text-slate-900">{{ compound.name }}</h3>
        <Badge :variant="hazardBadgeVariant">{{ compound.hazardClass }}</Badge>
      </div>
    </template>
    
    <div class="space-y-3">
      <div class="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span class="text-slate-500">{{ $t('compounds.labels.casNumber') }}:</span>
          <span class="ml-2 font-mono">{{ compound.casNumber }}</span>
        </div>
        <div>
          <span class="text-slate-500">{{ $t('compounds.labels.batch') }}:</span>
          <span class="ml-2 font-mono">{{ compound.batchNumber }}</span>
        </div>
        <div>
          <span class="text-slate-500">{{ $t('compounds.labels.location') }}:</span>
          <span class="ml-2">{{ compound.location }}</span>
        </div>
        <div>
          <span class="text-slate-500">{{ $t('compounds.labels.supplier') }}:</span>
          <span class="ml-2">{{ compound.supplier }}</span>
        </div>
      </div>
      
      <div class="pt-3 border-t border-slate-200">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm text-slate-500">{{ $t('compounds.currentStock') }}</span>
          <div class="flex items-center gap-2">
            <LoadingSpinner v-if="stockLoading" size="xs" />
            <span :class="stockStatusClasses">
              {{ currentStock }} {{ compound.unit }}
            </span>
          </div>
        </div>
        <div class="w-full bg-slate-200 rounded-full h-2">
          <div 
            class="h-2 rounded-full transition-all duration-300"
            :class="progressBarClasses"
            :style="{ width: `${Math.min(stockPercentage, 100)}%` }"
          />
        </div>
        <div class="flex justify-between text-xs text-slate-500 mt-1">
          <span>{{ $t('compounds.labels.threshold') }}: {{ compound.threshold }} {{ compound.unit }}</span>
          <span>{{ stockPercentage.toFixed(0) }}%</span>
        </div>
      </div>
      
      <div class="pt-3 border-t border-slate-200">
        <div class="flex items-center justify-between text-sm">
          <span class="text-slate-500">{{ $t('compounds.labels.expires') }}:</span>
          <span :class="expiryClasses">{{ formatDate(compound.expiryDate) }}</span>
        </div>
      </div>
    </div>
      <template #footer>
      <div class="flex gap-2">
        <!-- TODO: Add more action buttons (View Details, Duplicate, Delete) -->
        <!-- TODO: Add context menu for additional actions -->
        <!-- TODO: Add confirmation dialogs for destructive actions -->
        <Button variant="outline" size="sm" @click="$emit('edit', compound)">
          {{ $t('compounds.actions.edit') }}
        </Button>
        <Button variant="outline" size="sm" @click="$emit('scan', compound)">
          {{ $t('compounds.actions.count') }}
        </Button>
        <Button 
          variant="primary" 
          size="sm" 
          @click="navigateToInventorySessions(compound)"
        >
          {{ $t('compounds.actions.recordTransaction') }}
        </Button>
        <Button variant="destructive" size="sm" @click="$emit('delete', compound)">
          {{ $t('compounds.actions.delete') }}
        </Button>
        <!-- TODO: Add quick quantity adjust buttons -->
        <!-- TODO: Add barcode generation/print button -->
      </div>
    </template>
  </Card>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import Card from '@/components/ui/Card.vue'
import Badge from '@/components/ui/Badge.vue'
import Button from '@/components/ui/Button.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import { useFormat } from '@/utils/format'
import { useInventory } from '@/composables/useInventory'

const { t } = useI18n()
const router = useRouter()
const { calculateCurrentStock } = useInventory()

const props = defineProps({
  compound: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['edit', 'scan', 'delete', 'view-detail'])

// Card click handler
const handleCardClick = () => {
  console.log('Card clicked, emitting view-detail with compound:', props.compound)
  emit('view-detail', props.compound)
}

const { formatDate } = useFormat()

// Real-time stock calculation
const currentStock = ref(props.compound.quantity)
const stockLoading = ref(false)

// Load real-time stock on mount
onMounted(async () => {
  try {
    stockLoading.value = true
    const realStock = await calculateCurrentStock(props.compound.id, props.compound.quantity)
    currentStock.value = realStock
  } catch (error) {
    console.error('Failed to calculate current stock:', error)
    // Keep initial quantity as fallback
  } finally {
    stockLoading.value = false
  }
})

const stockPercentage = computed(() => 
  (currentStock.value / props.compound.threshold) * 100
)

const hazardBadgeVariant = computed(() => {
  const hazard = props.compound.hazardClass.toLowerCase()
  if (hazard.includes('toxic') || hazard.includes('carcinogenic')) return 'destructive'
  if (hazard.includes('flammable') || hazard.includes('corrosive')) return 'warning'
  return 'secondary'
})

const stockStatusClasses = computed(() => [
  'font-semibold',
  {
    'text-red-600': stockPercentage.value < 50,
    'text-yellow-600': stockPercentage.value >= 50 && stockPercentage.value < 100,
    'text-green-600': stockPercentage.value >= 100
  }
])

const progressBarClasses = computed(() => ({
  'bg-red-500': stockPercentage.value < 50,
  'bg-yellow-500': stockPercentage.value >= 50 && stockPercentage.value < 100,
  'bg-green-500': stockPercentage.value >= 100
}))

const expiryClasses = computed(() => {
  const expiryDate = new Date(props.compound.expiryDate)
  const threeMonthsFromNow = new Date()
  threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3)
  
  return [
    'font-medium',
    {
      'text-red-600': expiryDate <= threeMonthsFromNow,
      'text-slate-900': expiryDate > threeMonthsFromNow
    }
  ]
})

// Navigation methods
const navigateToInventorySessions = (compound) => {
  // Navigate to inventory sessions with compound pre-selected
  router.push({
    name: 'InventorySessions',
    query: { compound: compound.id }
  })
}
</script>
