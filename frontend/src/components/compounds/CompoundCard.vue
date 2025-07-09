<template>
  <Card 
    class="cursor-pointer hover:shadow-lg transition-shadow duration-200 flex flex-col"
    @click="handleCardClick"
  >
    <template #header>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <h3 class="text-lg font-semibold text-slate-900">{{ compound.name }}</h3>
          <Badge v-if="compound.casNumber" variant="secondary" class="font-mono text-sm">
            {{ $t('compounds.labels.cas') }}: {{ compound.casNumber }}
          </Badge>
        </div>
        <Badge :variant="hazardBadgeVariant">{{ translatedHazardClass }}</Badge>
      </div>
    </template>
    
    <div class="space-y-4 flex-1 flex flex-col">
      <!-- Stock Progress and Summary -->
      <div class="flex-1 flex items-center gap-4">
        <!-- Circular Progress Bar -->
        <div class="flex-shrink-0">
          <CircularProgressBar
            :percentage="stockPercentage"
            :progress-color="progressColor"
            :size="90"
            :stroke-width="12"
          />
        </div>
        
        <!-- Summary -->
        <div class="flex-1 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <div class="text-slate-500">{{ $t('compounds.summary.locations') }}</div>
          <div class="font-semibold text-slate-800 text-right">{{ instanceSummary.uniqueLocationCount }}</div>
          
          <div class="text-slate-500">{{ $t('compounds.summary.instances') }}</div>
          <div class="font-semibold text-slate-800 text-right">{{ instanceSummary.totalInstances }}</div>

          <div class="text-slate-500">{{ $t('compounds.summary.totalQuantity') }}</div>
          <div class="font-semibold text-slate-800 text-right">
            {{ instanceSummary.totalQuantity }} 
            <span class="text-xs">{{ translatedUnit }}</span>
          </div>

          <div class="text-slate-500">{{ $t('compounds.labels.threshold') }}</div>
          <div class="font-semibold text-slate-800 text-right">
            {{ compound.threshold }}
            <span class="text-xs">{{ translatedUnit }}</span>
          </div>
        </div>
      </div>
    </div>
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
import CircularProgressBar from '@/components/ui/CircularProgressBar.vue'
import { useFormat } from '@/utils/format.js'
import { useInventory } from '@/composables/useInventory.js'
import { useCompoundInstances } from '@/composables/useCompoundInstances.js'
import { useHazardStyles } from '@/composables/useHazardStyles.js'
import { convertUnit, areUnitsCompatible } from '@/utils/units.js'

const { t } = useI18n()
const router = useRouter()
const { calculateCurrentStock } = useInventory()
const { getInstancesForCompound } = useCompoundInstances()
const { getHazardVariant } = useHazardStyles()

const props = defineProps({
  compound: {
    type: Object,
    required: true
  }
})

const instances = ref([])

const instanceSummary = computed(() => {
  const totalInstances = instances.value.length
  
  const uniqueLocations = new Set(instances.value.map(i => i.location))
  
  const totalQuantity = instances.value.reduce((total, instance) => {
    // Only sum if units are compatible
    if (areUnitsCompatible(instance.unit, props.compound.unit)) {
      const convertedValue = convertUnit(instance.quantity, instance.unit, props.compound.unit)
      return total + (convertedValue || 0)
    }
    return total
  }, 0)

  return {
    totalInstances,
    uniqueLocationCount: uniqueLocations.size,
    totalQuantity: parseFloat(totalQuantity.toFixed(3)) // Round to 3 decimal places
  }
})

const stockPercentage = computed(() => {
  if (!props.compound.threshold || props.compound.threshold === 0) {
    return 100; // Treat as 100% if no threshold is set
  }
  const percentage = (instanceSummary.value.totalQuantity / props.compound.threshold) * 100;
  return parseFloat(percentage.toFixed(1));
});


const progressColor = computed(() => {
  const percentage = stockPercentage.value;
  if (percentage < 50) return '#ef4444'; // red-500: Critically low
  if (percentage < 100) return '#f97316'; // orange-500: Low, below threshold
  return '#22c55e'; // green-500: At or above threshold
});


onMounted(async () => {
  instances.value = getInstancesForCompound(props.compound.id)
})

const emit = defineEmits(['edit', 'scan', 'delete', 'view-detail'])

// Card click handler
const handleCardClick = () => {
  console.log('Card clicked, emitting view-detail with compound:', props.compound)
  emit('view-detail', props.compound)
}

const { formatDate } = useFormat()

// Real-time stock calculation
const stockLoading = ref(false)

// Load real-time stock on mount
onMounted(async () => {
  // This onMounted is duplicated, let's merge them. The previous call will handle this.
})

const hazardBadgeVariant = computed(() => {
  return getHazardVariant(props.compound.hazardClass)
})

const translatedHazardClass = computed(() => {
  const hazardClassMap = {
    'Non-hazardous': 'compounds.hazardClassNonHazardous',
    'Flammable': 'compounds.hazardClassFlammable',
    'Corrosive': 'compounds.hazardClassCorrosive',
    'Toxic': 'compounds.hazardClassToxic',
    'Oxidizing': 'compounds.hazardClassOxidizing',
    'Explosive': 'compounds.hazardClassExplosive',
    'Carcinogenic': 'compounds.hazardClassCarcinogenic',
    'Radioactive': 'compounds.hazardClassRadioactive'
  }
  
  const translationKey = hazardClassMap[props.compound.hazardClass]
  return translationKey ? t(translationKey) : props.compound.hazardClass
})

const translatedUnit = computed(() => {
  const unitKey = `compounds.units.${props.compound.unit}`
  return t(unitKey, props.compound.unit) // fallback to original unit if translation not found
})

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
