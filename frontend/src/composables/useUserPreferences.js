// src/composables/useUserPreferences.js
// Reactive user preferences composable for locale, date/time/number formatting
import { ref, computed } from 'vue'

// Load from localStorage or defaults
function getStored(key, fallback) {
  try {
    return localStorage.getItem(key) || fallback
  } catch {
    return fallback
  }
}

const locale = ref(getStored('locale', 'en'))
const dateFormat = ref(getStored('dateFormat', 'medium'))
const timeFormat = ref(getStored('timeFormat', 'short'))
const currency = ref(getStored('currency', 'USD'))

export function useUserPreferences() {
  // Save to localStorage when changed
  function setLocale(val) {
    locale.value = val
    localStorage.setItem('locale', val)
  }
  function setDateFormat(val) {
    dateFormat.value = val
    localStorage.setItem('dateFormat', val)
  }
  function setTimeFormat(val) {
    timeFormat.value = val
    localStorage.setItem('timeFormat', val)
  }
  function setCurrency(val) {
    currency.value = val
    localStorage.setItem('currency', val)
  }

  return {
    locale,
    dateFormat,
    timeFormat,
    currency,
    setLocale,
    setDateFormat,
    setTimeFormat,
    setCurrency,
  }
}
