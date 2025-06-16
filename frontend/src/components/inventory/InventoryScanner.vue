<template>
  <Card>
    <template #header>
      <h3 class="text-lg font-semibold text-slate-900">Inventory Scanner</h3>
    </template>
    
    <div class="space-y-6">
      <!-- Scanner Input -->
      <div class="space-y-4">        <div class="text-center p-6 border-2 border-dashed border-slate-300 rounded-lg">
          <div class="text-4xl mb-2">📱</div>
          <p class="text-slate-600 mb-4">Scan barcode or enter manually</p>
          <!-- TODO: Implement camera scanning -->
          <!-- TODO: Add barcode scanning library (QuaggaJS or similar) -->
          <!-- TODO: Handle camera permissions and errors -->
          <!-- TODO: Support multiple barcode formats -->
          <Button variant="outline" disabled>
            Enable Camera Scanner
          </Button>
        </div>
        
        <div class="space-y-2">
          <label class="block text-sm font-medium text-slate-700">
            Manual Entry
          </label>
          <div class="flex gap-2">
            <Input
              v-model="manualCode"
              placeholder="Enter barcode, CAS number, or compound name"
              class="flex-1"
            />
            <Button @click="processCode" :disabled="!manualCode.trim()">
              Find
            </Button>
          </div>
        </div>
      </div>
      
      <!-- Scanned Item Display -->
      <div v-if="scannedItem" class="border rounded-lg p-4 bg-slate-50">
        <div class="flex items-start justify-between mb-4">
          <div>
            <h4 class="font-semibold text-slate-900">{{ scannedItem.name }}</h4>
            <p class="text-sm text-slate-600">{{ scannedItem.casNumber }}</p>
            <p class="text-sm text-slate-600">{{ scannedItem.location }}</p>
          </div>
          <Badge :variant="hazardBadgeVariant">
            {{ scannedItem.hazardClass }}
          </Badge>
        </div>
        
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <span class="text-sm text-slate-600">Expected Quantity</span>
            <span class="font-medium">{{ scannedItem.quantity }} {{ scannedItem.unit }}</span>
          </div>
          
          <div class="space-y-2">
            <label class="block text-sm font-medium text-slate-700">
              Counted Quantity
            </label>
            <div class="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                @click="adjustQuantity(-1)"
                :disabled="countedQuantity <= 0"
              >
                -
              </Button>
              <Input
                v-model.number="countedQuantity"
                type="number"
                min="0"
                class="w-24 text-center"
              />
              <Button 
                variant="outline" 
                size="sm"
                @click="adjustQuantity(1)"
              >
                +
              </Button>
              <span class="text-sm text-slate-600 ml-2">{{ scannedItem.unit }}</span>
            </div>
          </div>
          
          <div v-if="discrepancy !== 0" class="p-3 rounded-md" :class="discrepancyClasses">
            <div class="flex items-center gap-2">
              <span class="font-medium">Discrepancy:</span>
              <span>{{ discrepancy > 0 ? '+' : '' }}{{ discrepancy }} {{ scannedItem.unit }}</span>
            </div>
          </div>
          
          <div class="flex gap-2 pt-2">
            <Button 
              variant="primary" 
              @click="confirmCount"
              class="flex-1"
              :disabled="countedQuantity === null"
            >
              Confirm Count
            </Button>
            <Button 
              variant="outline" 
              @click="cancelScan"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
      
      <!-- Recent Scans -->
      <div v-if="recentScans.length > 0" class="space-y-2">
        <h4 class="font-medium text-slate-900">Recent Scans</h4>
        <div class="space-y-2 max-h-48 overflow-y-auto">
          <div 
            v-for="scan in recentScans" 
            :key="scan.id"
            class="flex items-center justify-between p-2 rounded border"
          >
            <div class="flex-1">
              <div class="font-medium">{{ scan.name }}</div>
              <div class="text-sm text-slate-600">
                Counted: {{ scan.countedQuantity }} {{ scan.unit }}
                <span v-if="scan.discrepancy !== 0" :class="scan.discrepancy > 0 ? 'text-green-600' : 'text-red-600'">
                  ({{ scan.discrepancy > 0 ? '+' : '' }}{{ scan.discrepancy }})
                </span>
              </div>
            </div>
            <Badge variant="success">✓</Badge>
          </div>
        </div>
      </div>
    </div>
  </Card>
</template>

<script setup>
import { ref, computed } from 'vue'
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import Badge from '@/components/ui/Badge.vue'
import { useCompounds } from '@/composables/useCompounds'

const { findCompound } = useCompounds()

const manualCode = ref('')
const scannedItem = ref(null)
const countedQuantity = ref(null)
const recentScans = ref([])

const discrepancy = computed(() => {
  if (!scannedItem.value || countedQuantity.value === null) return 0
  return countedQuantity.value - scannedItem.value.quantity
})

const hazardBadgeVariant = computed(() => {
  if (!scannedItem.value) return 'secondary'
  
  const hazard = scannedItem.value.hazardClass.toLowerCase()
  if (hazard.includes('toxic') || hazard.includes('carcinogenic')) return 'destructive'
  if (hazard.includes('flammable') || hazard.includes('corrosive')) return 'warning'
  return 'secondary'
})

const discrepancyClasses = computed(() => ({
  'bg-red-50 border border-red-200 text-red-800': discrepancy.value < 0,
  'bg-green-50 border border-green-200 text-green-800': discrepancy.value > 0
}))

const processCode = () => {
  const compound = findCompound(manualCode.value.trim())
  if (compound) {
    scannedItem.value = compound
    countedQuantity.value = compound.quantity
  } else {
    // TODO: Show error toast/notification
    // TODO: Implement "compound not found" dialog with option to add new compound
    // TODO: Suggest similar compounds based on partial matches
    console.log('Compound not found:', manualCode.value)
  }
}

const adjustQuantity = (change) => {
  if (countedQuantity.value === null) {
    countedQuantity.value = 0
  }
  countedQuantity.value = Math.max(0, countedQuantity.value + change)
}

const confirmCount = () => {
  if (scannedItem.value && countedQuantity.value !== null) {
    const scanResult = {
      ...scannedItem.value,
      countedQuantity: countedQuantity.value,
      discrepancy: discrepancy.value,
      timestamp: new Date().toISOString()
    }
    
    recentScans.value.unshift(scanResult)
    if (recentScans.value.length > 10) {
      recentScans.value.pop()
    }
    
    // TODO: Save to inventory count session
    // TODO: Update compound quantity if needed
    // TODO: Show success notification
    // TODO: Emit event to parent components
    // TODO: Handle discrepancy alerts if difference is significant
    
    resetScanner()
  }
}

const cancelScan = () => {
  resetScanner()
}

const resetScanner = () => {
  scannedItem.value = null
  countedQuantity.value = null
  manualCode.value = ''
}
</script>
