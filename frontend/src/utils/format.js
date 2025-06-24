// src/utils/format.js
// Formatting utility for dates, times, and numbers using user preferences
// Reads preferences from useUserPreferences composable (to be created)

import { computed } from 'vue'
import { useUserPreferences } from '@/composables/useUserPreferences'

export function useFormat() {
  const prefs = useUserPreferences()

  // Date formatting
  function formatDate(date) {
    if (!date) return ''
    const options = { dateStyle: prefs.dateFormat.value || 'medium' }
    return new Intl.DateTimeFormat(prefs.locale.value, options).format(new Date(date))
  }

  // Time formatting
  function formatTime(date) {
    if (!date) return ''
    const options = { timeStyle: prefs.timeFormat.value || 'short' }
    return new Intl.DateTimeFormat(prefs.locale.value, options).format(new Date(date))
  }

  // Number formatting
  function formatNumber(number) {
    if (number === null || number === undefined) return ''
    return new Intl.NumberFormat(prefs.locale.value, { maximumFractionDigits: 2 }).format(number)
  }

  // Currency formatting (future)
  function formatCurrency(amount) {
    if (amount === null || amount === undefined) return ''
    return new Intl.NumberFormat(prefs.locale.value, {
      style: 'currency',
      currency: prefs.currency.value || 'USD',
    }).format(amount)
  }

  return { formatDate, formatTime, formatNumber, formatCurrency }
}
