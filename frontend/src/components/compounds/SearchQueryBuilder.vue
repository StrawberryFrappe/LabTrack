<template>
  <div class="space-y-4">
    <!-- Header with toggle -->
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-medium text-slate-900">{{ $t('search.queryBuilder') }}</h3>
      <button
        @click="toggleAdvancedMode"
        class="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md border transition-colors"
        :class="isAdvancedMode 
          ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100' 
          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'"
      >
        <span class="mr-2">{{ isAdvancedMode ? '⚙️' : '🔍' }}</span>
        {{ isAdvancedMode ? $t('search.switchToSimple') : $t('search.switchToAdvanced') }}
      </button>
    </div>

    <!-- Simple Search Mode -->
    <div v-if="!isAdvancedMode" class="space-y-3">
      <div class="relative">
        <Input
          v-model="searchQuery"
          :placeholder="$t('search.simplePlaceholder')"
          class="pr-20"
        />
        <div class="absolute inset-y-0 right-0 flex items-center pr-3">
          <button
            @click="isRegexMode = !isRegexMode"
            :title="$t('search.toggleRegex')"
            class="p-1 text-sm rounded transition-colors"
            :class="isRegexMode 
              ? 'bg-blue-100 text-blue-700' 
              : 'text-slate-400 hover:text-slate-600'"
          >
            .*
          </button>
        </div>
      </div>
      
      <div v-if="isRegexMode" class="text-xs text-slate-500 bg-blue-50 p-2 rounded">
        {{ $t('search.regexHelp') }}
      </div>
    </div>

    <!-- Advanced Search Mode -->
    <div v-else class="space-y-4">
      <!-- Search Conditions -->
      <div class="space-y-3">
        <div
          v-for="(condition, index) in searchConditions"
          :key="condition.id"
          class="flex items-start gap-3 p-3 bg-slate-50 rounded-lg"
        >
          <!-- Logic operator (except for first condition) -->
          <div v-if="index > 0" class="flex items-center pt-2">
            <select
              v-model="searchConditions[index - 1].logic"
              class="text-xs px-2 py-1 border border-slate-300 rounded bg-white"
            >
              <option value="AND">{{ $t('search.and') }}</option>
              <option value="OR">{{ $t('search.or') }}</option>
            </select>
          </div>

          <!-- Field selector -->
          <div class="flex-1">
            <label class="block text-xs font-medium text-slate-700 mb-1">
              {{ $t('search.field') }}
            </label>
            <select
              v-model="condition.field"
              @change="updateConditionOperator(condition)"
              class="w-full px-3 py-2 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option
                v-for="(field, key) in SEARCH_FIELDS"
                :key="key"
                :value="key"
              >
                {{ $t(`search.fields.${key}`, field.label) }}
              </option>
            </select>
          </div>

          <!-- Operator selector -->
          <div class="flex-1">
            <label class="block text-xs font-medium text-slate-700 mb-1">
              {{ $t('search.operator') }}
            </label>
            <select
              v-model="condition.operator"
              class="w-full px-3 py-2 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option
                v-for="operator in getOperatorsForField(condition.field)"
                :key="operator.key"
                :value="operator.key"
              >
                {{ $t(`search.operators.${operator.key}`, operator.label) }}
              </option>
            </select>
          </div>

          <!-- Value input -->
          <div class="flex-1">
            <label class="block text-xs font-medium text-slate-700 mb-1">
              {{ $t('search.value') }}
            </label>
            <component
              :is="getInputComponent(condition)"
              v-model="condition.value"
              v-bind="getInputProps(condition)"
              class="w-full px-3 py-2 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div v-if="getInputHint(condition)" class="text-xs text-slate-500 mt-1">
              {{ getInputHint(condition) }}
            </div>
          </div>

          <!-- Remove button -->
          <div class="pt-6">
            <button
              @click="removeCondition(condition.id)"
              :title="$t('search.removeCondition')"
              class="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Add condition button -->
      <button
        @click="addCondition"
        class="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        {{ $t('search.addCondition') }}
      </button>
    </div>

    <!-- Search Actions -->
    <div v-if="hasActiveSearch" class="flex items-center justify-between pt-3 border-t border-slate-200">
      <div class="text-sm text-slate-600">
        {{ searchSummary }}
      </div>
      <div class="flex items-center gap-2">
        <button
          @click="clearConditions"
          class="px-3 py-1 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
        >
          {{ $t('search.clear') }}
        </button>
        <button
          @click="showSaveDialog = true"
          class="px-3 py-1 text-sm text-blue-700 bg-blue-50 hover:bg-blue-100 rounded transition-colors"
        >
          {{ $t('search.saveSearch') }}
        </button>
      </div>
    </div>

    <!-- Save Search Dialog -->
    <BaseModal v-model="showSaveDialog" :title="$t('search.saveSearchTitle')">
      <div class="space-y-4">
        <Input
          v-model="saveSearchName"
          :label="$t('search.searchName')"
          :placeholder="$t('search.enterSearchName')"
          @keyup.enter="handleSaveSearch"
        />
        <div class="flex justify-end gap-3">
          <Button variant="outline" @click="showSaveDialog = false">
            {{ $t('common.cancel') }}
          </Button>
          <Button @click="handleSaveSearch" :disabled="!saveSearchName.trim()">
            {{ $t('common.save') }}
          </Button>
        </div>
      </div>
    </BaseModal>
  </div>
</template>

<script setup>
/**
 * Search Query Builder Component
 * 
 * Advanced search interface with field selectors, operators, and value inputs.
 * Supports both simple text search and complex multi-criteria queries.
 * 
 * Features:
 * - Simple/Advanced mode toggle
 * - Dynamic field and operator selection
 * - AND/OR logic between conditions
 * - Input validation and hints
 * - Save/load search functionality
 * - Regex support for text searches
 */
import { ref, computed } from 'vue'
import Input from '@/components/ui/Input.vue'
import Button from '@/components/ui/Button.vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import { useAdvancedSearch } from '@/composables/useAdvancedSearch'
import { useToast } from '@/composables/useToast'

const {
  isAdvancedMode,
  searchQuery,
  searchConditions,
  isRegexMode,
  SEARCH_FIELDS,
  hasActiveSearch,
  searchSummary,
  addCondition,
  removeCondition,
  clearConditions,
  getOperatorsForField,
  saveCurrentSearch,
  toggleAdvancedMode
} = useAdvancedSearch()

const { showToast } = useToast()

// Local state
const showSaveDialog = ref(false)
const saveSearchName = ref('')

// Get appropriate input component for condition
const getInputComponent = (condition) => {
  const field = SEARCH_FIELDS[condition.field]
  const needsRange = condition.operator === 'between'
  
  if (needsRange) return 'input'
  
  switch (field.type) {
    case 'date':
      return 'input'
    case 'number':
      return 'input'
    case 'select':
      return 'select'
    default:
      return 'input'
  }
}

// Get input props for condition
const getInputProps = (condition) => {
  const field = SEARCH_FIELDS[condition.field]
  const props = {
    placeholder: getInputPlaceholder(condition)
  }
  
  if (field.type === 'date') {
    props.type = 'date'
  } else if (field.type === 'number') {
    props.type = 'number'
    props.step = 'any'
  } else {
    props.type = 'text'
  }
  
  return props
}

// Get input placeholder
const getInputPlaceholder = (condition) => {
  const field = SEARCH_FIELDS[condition.field]
  
  if (condition.operator === 'between') {
    return field.type === 'date' 
      ? 'YYYY-MM-DD,YYYY-MM-DD' 
      : 'min,max'
  }
  
  if (condition.operator === 'isEmpty' || condition.operator === 'isNotEmpty') {
    return ''
  }
  
  switch (field.type) {
    case 'date':
      return 'YYYY-MM-DD'
    case 'number':
      return 'Enter number'
    default:
      return `Enter ${field.label.toLowerCase()}`
  }
}

// Get input hint text
const getInputHint = (condition) => {
  if (condition.operator === 'between') {
    return 'Separate values with comma (e.g., 10,100)'
  }
  
  if (condition.operator === 'isEmpty' || condition.operator === 'isNotEmpty') {
    return 'No value needed for this operator'
  }
  
  return null
}

// Update operator when field changes
const updateConditionOperator = (condition) => {
  const operators = getOperatorsForField(condition.field)
  if (!operators.find(op => op.key === condition.operator)) {
    condition.operator = operators[0]?.key || 'contains'
  }
}

// Handle save search
const handleSaveSearch = () => {
  if (!saveSearchName.value.trim()) return
  
  const success = saveCurrentSearch(saveSearchName.value)
  if (success) {
    showToast({
      type: 'success',
      message: `Search "${saveSearchName.value}" saved successfully`
    })
    showSaveDialog.value = false
    saveSearchName.value = ''
  } else {
    showToast({
      type: 'error', 
      message: 'Failed to save search'
    })
  }
}

// Initialize with default condition if none exist
if (searchConditions.value.length === 0 && isAdvancedMode.value) {
  addCondition()
}
</script>
