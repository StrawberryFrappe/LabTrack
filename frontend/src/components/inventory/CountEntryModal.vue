<template>
  <BaseModal
    v-model="isOpen"
    :title="compound ? `${$t('inventory.countEntry')}: ${compound.name}` : $t('inventory.countEntry')"
    size="sm"
    @close="handleCancel"
  >
    <form @submit.prevent="handleConfirm">
      <div class="space-y-4">
        <div v-if="compound" class="space-y-1">
          <div class="text-sm text-slate-600">{{ $t('inventory.cas') }}: {{ compound.casNumber }}</div>
          <div class="text-sm text-slate-600">{{ $t('inventory.location') }}: {{ compound.location }}</div>
          <div class="text-sm text-slate-600">{{ $t('inventory.expected') }}: {{ compound.quantity }} {{ compound.unit }}</div>
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">{{ $t('inventory.countedQuantity') }}</label>
          <Input
            v-model.number="localCount"
            type="number"
            min="0"
            :placeholder="$t('inventory.countedQuantityPlaceholder')"
            class="w-full"
            required
          />
        </div>
        <div v-if="discrepancy !== 0" class="p-2 rounded text-sm" :class="discrepancyClass">
          {{ $t('inventory.discrepancyFound') }}: 
          <span>{{ discrepancy > 0 ? '+' : '' }}{{ discrepancy }} {{ compound.unit }}</span>
          <span class="ml-2 font-medium">
            ({{ discrepancy > 0 ? $t('inventory.overageFound') : $t('inventory.shortageFound') }})
          </span>
        </div>
        <div v-else-if="compound" class="p-2 rounded text-sm bg-green-50 text-green-700">
          {{ $t('inventory.noDiscrepancy') }}
        </div>
      </div>
      <div class="flex justify-end gap-2 mt-6">
        <Button variant="outline" type="button" @click="handleCancel">
          {{ $t('inventory.cancelCountAction') }}
        </Button>
        <Button variant="primary" type="submit">
          {{ $t('inventory.confirmCountAction') }}
        </Button>
      </div>
    </form>
  </BaseModal>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseModal from '@/components/ui/BaseModal.vue'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'

const { t } = useI18n()

const props = defineProps({
  modelValue: Boolean,
  compound: Object,
  initialCount: Number
})
const emit = defineEmits(['update:modelValue', 'confirm', 'cancel'])

const isOpen = computed({
  get: () => props.modelValue,
  set: v => emit('update:modelValue', v)
})

const localCount = ref(props.initialCount ?? 0)
watch(() => props.initialCount, v => { localCount.value = v ?? 0 })

const discrepancy = computed(() => {
  if (!props.compound) return 0
  return localCount.value - (props.compound.quantity ?? 0)
})
const discrepancyClass = computed(() =>
  discrepancy.value === 0 ? 'bg-green-50 text-green-700' :
  discrepancy.value > 0 ? 'bg-blue-50 text-blue-700' :
  'bg-red-50 text-red-700'
)

function handleConfirm() {
  emit('confirm', localCount.value)
  isOpen.value = false
}
function handleCancel() {
  emit('cancel')
  isOpen.value = false
}
</script>
