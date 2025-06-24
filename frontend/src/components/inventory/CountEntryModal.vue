<template>
  <BaseModal
    v-model="isOpen"
    :title="compound ? `Count: ${compound.name}` : 'Count Entry'"
    size="sm"
    @close="handleCancel"
  >
    <form @submit.prevent="handleConfirm">
      <div class="space-y-4">
        <div v-if="compound" class="space-y-1">
          <div class="text-sm text-slate-600">CAS: {{ compound.casNumber }}</div>
          <div class="text-sm text-slate-600">Location: {{ compound.location }}</div>
          <div class="text-sm text-slate-600">Expected: {{ compound.quantity }} {{ compound.unit }}</div>
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">{{$t('inventory.countedQuantity')}}</label>
          <Input
            v-model.number="localCount"
            type="number"
            min="0"
            class="w-full"
            required
          />
        </div>
        <div v-if="discrepancy !== 0" class="p-2 rounded text-sm" :class="discrepancyClass">
          Discrepancy: <span>{{ discrepancy > 0 ? '+' : '' }}{{ discrepancy }} {{ compound.unit }}</span>
        </div>
      </div>
      <div class="flex justify-end gap-2 mt-6">
        <Button variant="outline" type="button" @click="handleCancel">Cancel</Button>
        <Button variant="primary" type="submit">Confirm</Button>
      </div>
    </form>
  </BaseModal>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'

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
