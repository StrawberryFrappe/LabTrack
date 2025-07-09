import dashboard from './en/dashboard.js'
import compounds from './en/compounds.js'
import inventory from './en/inventory.js'
import inventorySessions from './en/inventorySessions.js'
import instances from './en/instances.js'
import preferences from './en/preferences.js'
import settings from './en/settings.js'
import common from './en/common.js'
import navigation from './en/navigation.js'
import userMenu from './en/userMenu.js'
import validation from './en/validation.js'
import { admin } from './en/admin.js'
import auth from './en/auth.js'

export default {
  dashboard: dashboard.dashboard,
  compounds: compounds.compounds,
  inventory: inventory.inventory,
  inventorySessions: inventorySessions.inventorySessions,
  instances: instances.instances,
  preferences: preferences.preferences,
  settings: settings.settings,
  common: common.common,
  search: common.search,
  navigation: navigation.navigation,
  userMenu: userMenu.userMenu,
  validation: validation.validation,
  auth: auth.auth,
  admin: admin
}
