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
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import Card from '@/components/ui/Card.vue'
import Badge from '@/components/ui/Badge.vue'
import CircularProgressBar from '@/components/ui/CircularProgressBar.vue'
import { useFormat } from '@/utils/format.js'
import { useCompoundInstances } from '@/composables/useCompoundInstances.js'
import { useHazardStyles } from '@/composables/useHazardStyles.js'
import { convertUnit, areUnitsCompatible } from '@/utils/units.js'

const { t } = useI18n()
const router = useRouter()
const { getInstancesForCompound } = useCompoundInstances()
const { getHazardVariant } = useHazardStyles()

const props = defineProps({
  compound: {
    type: Object,
    required: true
  }
})

// Get reactive instances for this compound
const instances = computed(() => {
  return getInstancesForCompound(props.compound.id)
})

const instanceSummary = computed(() => {
  const allInstances = instances.value
  const totalInstances = allInstances.length
  
  const uniqueLocations = new Set(allInstances.map(i => i.location))
  
  console.log(`[CompoundCard] Computing stock for compound ${props.compound.name}:`)
  console.log(`- Compound unit: ${props.compound.unit}`)
  console.log(`- Instances:`, allInstances.map(i => ({
    id: i.id,
    quantity: i.quantity,
    unit: i.unit,
    location: i.location
  })))
  
  const totalQuantity = allInstances.reduce((total, instance) => {
    const isCompatible = areUnitsCompatible(instance.unit, props.compound.unit)
    console.log(`- Instance ${instance.id}: ${instance.quantity} ${instance.unit} -> compatible: ${isCompatible}`)
    
    // Only sum if units are compatible
    if (isCompatible) {
      const convertedValue = convertUnit(instance.quantity, instance.unit, props.compound.unit)
      console.log(`  -> converted to: ${convertedValue} ${props.compound.unit}`)
      return total + (convertedValue || 0)
    } else {
      console.log(`  -> skipped (incompatible units)`)
      return total
    }
  }, 0)

  console.log(`- Total quantity: ${totalQuantity} ${props.compound.unit}`)
  console.log(`- Threshold: ${props.compound.threshold} ${props.compound.unit}`)

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

const emit = defineEmits(['edit', 'scan', 'delete', 'view-detail'])

// Card click handler
const handleCardClick = () => {
  console.log('Card clicked, emitting view-detail with compound:', props.compound)
  emit('view-detail', props.compound)
}

const { formatDate } = useFormat()

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

// Navigation methods
const navigateToInventorySessions = (compound) => {
  // Navigate to inventory sessions with compound pre-selected
  router.push({
    name: 'InventorySessions',
    query: { compound: compound.id }
  })
}
</script>
