import dashboard from './pt/dashboard.js'
import compounds from './pt/compounds.js'
import inventory from './pt/inventory.js'
import inventorySessions from './pt/inventorySessions.js'
import preferences from './pt/preferences.js'
import settings from './pt/settings.js'
import common from './pt/common.js'
import navigation from './pt/navigation.js'
import userMenu from './pt/userMenu.js'
import validation from './pt/validation.js'

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
  validation: validation.validation
}
