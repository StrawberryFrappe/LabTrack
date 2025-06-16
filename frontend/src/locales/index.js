import { createI18n } from 'vue-i18n'
import en from './en.js'
import es from './es.js'
import pt from './pt.js'

const messages = {
  en,
  es,
  pt
}

// Get saved language from localStorage or default to 'en'
const savedLanguage = localStorage.getItem('labtrack-language') || 'en'

const i18n = createI18n({
  locale: savedLanguage,
  fallbackLocale: 'en',
  messages,
  legacy: false, // Use Composition API mode
  globalInjection: true // Allow $t in templates
})

export default i18n

export const availableLanguages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'pt', name: 'Português (BR)', flag: '🇧🇷' }
]

export const setLanguage = (locale) => {
  i18n.global.locale.value = locale
  localStorage.setItem('labtrack-language', locale)
  document.documentElement.lang = locale
}
