import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import i18n from './locales'

// ✅ COMPLETED: Vue Router setup
//     - Router configured with authentication guards
//     - Nested routes with layout system
//     - Role-based access control implemented
//     - Replaced conditional rendering with proper routing
//     - Navigation guards prevent unauthorized access

// ✅ COMPLETED: i18n setup for internationalization
//     - Vue i18n configured with EN, ES, PT-BR
//     - Language preference persistence with localStorage
//     - Fallback locale set to English
//     - Composition API mode enabled

// TRL3 PRIORITIES:
// - Setup global error handler for production error tracking
// app.config.errorHandler = (err, vm, info) => { ... }

// POST-TRL3 ENHANCEMENTS:
// - Import and setup Pinia for complex state management
// - Setup performance monitoring and analytics tracking
// - Setup service worker registration for PWA capabilities

const app = createApp(App)

// ✅ COMPLETED: Vue Router integration
app.use(router)

// ✅ COMPLETED: i18n integration  
app.use(i18n)

// MODULARIZATION OPPORTUNITIES:
// - Use Pinia when implementing complex state management (post-TRL3)
// - Register global components when UI library is extracted (post-TRL3)

app.mount('#app')
