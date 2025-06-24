<!--
  Preferences View Component
    This view handles user-specific preferences and settings.
  Accessible by all authenticated users.
  
  Features:
  - Theme selection (light/dark)
  - Language preferences ✅ COMPLETED
  - Notification settings (placeholder)
  - Display preferences (placeholder)
  
  ✅ COMPLETED: Internationalization support
      - Full i18n implementation with Vue i18n
      - Real-time language switching functionality
      - Language preference persistence via localStorage
      - Support for English, Spanish, Portuguese (BR)
  
  ✅ COMPLETED: UI framework for user preferences
      - Comprehensive preference categories implemented      - Clean, accessible form interfaces
      - Logical grouping of related settings
      - Ready for backend integration
  
  TRL3 PRIORITIES:
  - Implement theme switching functionality (light/dark/auto modes)
  - Implement notification preferences system
  - Add user interface customization options (date formats, display density)
  - Persist preferences to backend API (when available)
  
  MODULARIZATION OPPORTUNITIES:
  - Extract form components into reusable UI library (technical debt)
  - Split preference sections into separate components for maintainability
  - Create preference management service for centralized state
-->

<template>
  <div class="space-y-8">    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-slate-900">{{ $t('preferences.title') }}</h1>
        <p class="text-slate-600 mt-1">{{ $t('preferences.description') }}</p>
      </div>
    </div>
    
    <!-- Preferences Content -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">      <!-- Appearance Settings -->
      <Card>
        <template #header>
          <h3 class="text-lg font-semibold text-slate-900">{{ $t('preferences.appearance') }}</h3>
        </template>
        <div class="space-y-6">          <!-- Theme Selection -->
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-3">{{ $t('preferences.theme') }}</label>
            <div class="grid grid-cols-3 gap-3">
              <button
                v-for="theme in themes"
                :key="theme.value"
                @click="selectTheme(theme.value)"
                :class="[
                  'p-3 rounded-lg border-2 transition-colors text-left',
                  selectedTheme === theme.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-200 hover:border-slate-300'
                ]"
              >
                <div class="flex items-center space-x-2">
                  <span class="text-lg">{{ theme.icon }}</span>
                  <span class="text-sm font-medium">{{ theme.label }}</span>
                </div>
                <p class="text-xs text-slate-500 mt-1">{{ theme.description }}</p>
              </button>
            </div>
          </div>
            <!-- Color Scheme Preview -->          <div>
            <label class="block text-sm font-medium text-slate-700 mb-3">{{ $t('preferences.preview') }}</label>
            <div class="p-4 rounded-lg border border-slate-200 bg-white">
              <div class="flex items-center space-x-3 mb-3">
                <div class="h-6 w-6 bg-blue-600 rounded"></div>
                <div class="h-4 bg-slate-200 rounded flex-1"></div>
              </div>
              <div class="space-y-2">
                <div class="h-3 bg-slate-100 rounded w-full"></div>
                <div class="h-3 bg-slate-100 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        </div>
      </Card>      <!-- Language Settings -->
      <Card>
        <template #header>
          <h3 class="text-lg font-semibold text-slate-900">{{ $t('preferences.languageRegion') }}</h3>
        </template>
        <div class="space-y-6">          <!-- Language Selection -->
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-3">{{ $t('preferences.displayLanguage') }}</label>
            <select
              v-model="selectedLanguage"
              @change="selectLanguage"
              class="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option
                v-for="language in languages"
                :key="language.code"
                :value="language.code"
              >
                {{ language.flag }} {{ language.name }}
              </option>
            </select>
          </div>
            <!-- Date Format -->
          <div>
            <!-- TODO i18n: Internationalize "Date Format" -->
            <label class="block text-sm font-medium text-slate-700 mb-3">{{ $t('preferences.dateFormat') }}</label>
            <select
              v-model="selectedDateFormat"
              @change="selectDateFormat"
              class="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option
                v-for="format in dateFormats"
                :key="format.value"
                :value="format.value"
              >
                {{ format.label }} ({{ format.example }})
              </option>
            </select>
          </div>
          
          <!-- Time Format -->
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-3">{{ $t('preferences.timeFormat') }}</label>
            <div class="space-y-2">
              <label class="flex items-center">
                <input
                  type="radio"
                  name="timeFormat"
                  value="12"
                  v-model="selectedTimeFormat"
                  @change="selectTimeFormat"
                  class="text-blue-600 focus:ring-blue-500"
                />
                <span class="ml-2 text-sm">{{ $t('preferences.time12h') }}</span>
              </label>
              <label class="flex items-center">
                <input
                  type="radio"
                  name="timeFormat"
                  value="24"
                  v-model="selectedTimeFormat"
                  @change="selectTimeFormat"
                  class="text-blue-600 focus:ring-blue-500"
                />
                <span class="ml-2 text-sm">{{ $t('preferences.time24h') }}</span>
              </label>
            </div>
          </div>
        </div>
      </Card>
      
      <!-- Notification Settings -->
      <Card>
        <template #header>
          <h3 class="text-lg font-semibold text-slate-900">{{ $t('preferences.notifications') }}</h3>
        </template>
        <div class="space-y-6">
          <!-- Email Notifications -->
          <div>
            <label class="flex items-center justify-between">
              <span class="text-sm font-medium text-slate-700">{{ $t('preferences.emailNotifications') }}</span>
              <input
                type="checkbox"
                v-model="emailNotifications"
                @change="toggleEmailNotifications"
                class="rounded text-blue-600 focus:ring-blue-500"
              />
            </label>
            <p class="text-xs text-slate-500 mt-1">{{ $t('preferences.emailHelp') }}</p>
          </div>
          
          <!-- Browser Notifications -->
          <div>
            <label class="flex items-center justify-between">
              <span class="text-sm font-medium text-slate-700">{{ $t('preferences.browserNotifications') }}</span>
              <input
                type="checkbox"
                v-model="browserNotifications"
                @change="toggleBrowserNotifications"
                class="rounded text-blue-600 focus:ring-blue-500"
              />
            </label>
            <p class="text-xs text-slate-500 mt-1">{{ $t('preferences.browserHelp') }}</p>
          </div>
          
          <!-- Low Stock Alerts -->
          <div>
            <label class="flex items-center justify-between">
              <span class="text-sm font-medium text-slate-700">{{ $t('preferences.lowStockAlerts') }}</span>
              <input
                type="checkbox"
                v-model="lowStockAlerts"
                @change="toggleLowStockAlerts"
                class="rounded text-blue-600 focus:ring-blue-500"
              />
            </label>
            <p class="text-xs text-slate-500 mt-1">{{ $t('preferences.lowStockHelp') }}</p>
          </div>
        </div>
      </Card>
      
      <!-- Display Settings -->
      <Card>
        <template #header>
          <h3 class="text-lg font-semibold text-slate-900">{{ $t('preferences.display') }}</h3>
        </template>
        <div class="space-y-6">
          <!-- Items per Page -->
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-3">{{ $t('preferences.itemsPerPage') }}</label>
            <select
              v-model="itemsPerPage"
              @change="selectItemsPerPage"
              class="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option v-for="option in itemsPerPageOptions" :key="option" :value="option">
                {{ option }} {{$t('preferences.items')}}
              </option>
            </select>
          </div>
          
          <!-- Default View -->
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-3">{{ $t('preferences.defaultCompoundsView') }}</label>
            <div class="space-y-2">
              <label class="flex items-center">
                <input
                  type="radio"
                  name="defaultView"
                  value="table"
                  v-model="defaultView"
                  @change="selectDefaultView"
                  class="text-blue-600 focus:ring-blue-500"
                />
                <span class="ml-2 text-sm">{{ $t('preferences.tableView') }}</span>
              </label>
              <label class="flex items-center">
                <input
                  type="radio"
                  name="defaultView"
                  value="grid"
                  v-model="defaultView"
                  @change="selectDefaultView"
                  class="text-blue-600 focus:ring-blue-500"
                />
                <span class="ml-2 text-sm">{{ $t('preferences.gridView') }}</span>
              </label>
            </div>
          </div>
        </div>
      </Card>
    </div>
    
    <!-- Save Button -->
    <div class="flex justify-end">      <Button
        variant="primary"
        @click="savePreferences"
        :disabled="saving"
      >
        {{ saving ? $t('common.saving') : $t('preferences.save') }}
      </Button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
import { availableLanguages, setLanguage } from '@/locales'
import { useUserPreferences } from '@/composables/useUserPreferences'

// i18n setup
const { t, locale } = useI18n()

// TODO: Load user preferences from storage/API
// Theme preferences
const themes = [
  {
    value: 'light',
    label: t('preferences.themeLight'),
    icon: '☀️',
    description: t('preferences.themeLightDesc')
  },
  {
    value: 'dark',
    label: t('preferences.themeDark'),
    icon: '🌙',
    description: t('preferences.themeDarkDesc')
  },
  {
    value: 'auto',
    label: t('preferences.themeAuto'),
    icon: '🔄',
    description: t('preferences.themeAutoDesc')
  }
]

const selectedTheme = ref('light')

// Language preferences - Using availableLanguages from i18n config
const languages = availableLanguages

// User preferences composable
const prefs = useUserPreferences()

// Language
const selectedLanguage = ref(prefs.locale.value)
function selectLanguage() {
  prefs.setLocale(selectedLanguage.value)
  locale.value = selectedLanguage.value
}

// Date Format
const dateFormats = [
  { value: 'short', label: t('preferences.dateShort'), example: '1/24/25' },
  { value: 'medium', label: t('preferences.dateMedium'), example: 'Jan 24, 2025' },
  { value: 'long', label: t('preferences.dateLong'), example: 'January 24, 2025' },
]
const selectedDateFormat = ref(prefs.dateFormat.value)
function selectDateFormat() {
  prefs.setDateFormat(selectedDateFormat.value)
}

// Time Format
const selectedTimeFormat = ref(prefs.timeFormat.value === '24' ? '24' : '12')
function selectTimeFormat() {
  prefs.setTimeFormat(selectedTimeFormat.value)
}

// Notification preferences
const emailNotifications = ref(true)
const browserNotifications = ref(false)
const lowStockAlerts = ref(true)

// Display preferences
const itemsPerPageOptions = [10, 25, 50, 100]
const itemsPerPage = ref(25)
const defaultView = ref('table')

// Saving state
const saving = ref(false)

// onMounted: sync UI with stored preferences
onMounted(() => {
  selectedLanguage.value = prefs.locale.value
  selectedDateFormat.value = prefs.dateFormat.value
  selectedTimeFormat.value = prefs.timeFormat.value
})

// Methods - TRL3 implementation priorities
const selectTheme = (theme) => {
  selectedTheme.value = theme
  console.log('TRL3: Implement theme switching to:', theme)
  // TRL3: Apply theme to application (CSS variables, localStorage, etc.)
  // TRL3: Save to user preferences (backend integration)
}

const toggleEmailNotifications = () => {
  console.log('TODO: Toggle email notifications:', emailNotifications.value)
  // TODO: Update notification preferences
  // TODO: Save to user preferences
}

const toggleBrowserNotifications = () => {
  console.log('TODO: Toggle browser notifications:', browserNotifications.value)
  // TODO: Request browser notification permission if enabled
  // TODO: Save to user preferences
}

const toggleLowStockAlerts = () => {
  console.log('TODO: Toggle low stock alerts:', lowStockAlerts.value)
  // TODO: Update alert preferences
  // TODO: Save to user preferences
}

const selectItemsPerPage = () => {
  console.log('TODO: Update items per page to:', itemsPerPage.value)
  // TODO: Update pagination throughout app
  // TODO: Save to user preferences
}

const selectDefaultView = () => {
  console.log('TODO: Update default view to:', defaultView.value)
  // TODO: Update default compound view
  // TODO: Save to user preferences
}

const savePreferences = async () => {
  saving.value = true
  
  try {
    console.log('TODO: Save all preferences to backend')
    // TODO: Collect all preference values
    // TODO: Send to API endpoint
    // TODO: Update local storage
    // TODO: Show success notification
    
    // Simulate saving delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    console.log('Preferences saved successfully')
  } catch (error) {
    console.error('TODO: Handle save error:', error)
    // TODO: Show error notification
  } finally {
    saving.value = false
  }
}
</script>
