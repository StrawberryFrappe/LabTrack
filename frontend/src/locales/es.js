import dashboard from './es/dashboard.js'
import compounds from './es/compounds.js'
import inventory from './es/inventory.js'
import inventorySessions from './es/inventorySessions.js'
import preferences from './es/preferences.js'
import settings from './es/settings.js'
import common from './es/common.js'
import navigation from './es/navigation.js'
import userMenu from './es/userMenu.js'
import validation from './es/validation.js'
import auth from './es/auth.js'

export default {
  dashboard: dashboard.dashboard,
  compounds: compounds.compounds,
  inventory: inventory.inventory,
  inventorySessions: inventorySessions.inventorySessions,
  preferences: preferences.preferences,
  settings: settings.settings,
  common: common.common,
  search: common.search,
  navigation: navigation.navigation,
  userMenu: userMenu.userMenu,
  validation: validation.validation,
  auth: auth.auth
}
