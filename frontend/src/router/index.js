/**
 * Vue Router Configuration
 * 
 * ✅ COMPLETED: Comprehensive routing system for LabTrack
 * 
 * This file implements a complete Vue Router 4 setup with:
 * - Nested route structure using DashboardLayout
 * - Authentication guards for route protection
 * - Role-based access control for admin routes  
 * - Guest-only routes for unauthenticated users
 * - Automatic redirects and proper navigation flow
 * 
 * Route Structure:
 * - /login - Authentication page (guest only)
 * - / - Redirects to dashboard
 * - /dashboard - Main dashboard (authenticated users)
 * - /compounds - Compound management (authenticated users)
 * - /inventory - Inventory counts (authenticated users)
 * - /preferences - User preferences (authenticated users)
 * - /settings - System settings (admin only)
 *  * Navigation Guards Implementation:
 * - requiresAuth: Redirects to login if not authenticated
 * - requiresAdmin: Redirects to dashboard if not admin
 * - requiresGuest: Redirects to dashboard if already authenticated
 * - Document title management for better UX
 * - Scroll behavior management for consistent navigation
 * 
 * Key Benefits:
 * - Eliminates complex conditional rendering in components
 * - Provides clean URL structure for better user experience
 * - Enables browser back/forward navigation
 * - Centralizes authentication logic in one place
 * - Supports lazy loading for better performance
 */

import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '../composables/useAuth.js'

// Lazy-loaded components for better performance
const LoginForm = () => import('../components/auth/LoginForm.vue')
const DashboardLayout = () => import('../components/layout/DashboardLayout.vue')
const DashboardHome = () => import('../views/DashboardHome.vue')
const CompoundsView = () => import('../views/CompoundsView.vue')
const AuditView = () => import('../views/AuditView.vue')
const InventoryTransactionsView = () => import('../views/InventoryTransactionsView.vue')
const SettingsView = () => import('../views/SettingsView.vue')
const PreferencesView = () => import('../views/PreferencesView.vue')

const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginForm,
    meta: { 
      requiresGuest: true,
      title: 'Login - LabTrack'
    }
  },
  {
    path: '/',
    component: DashboardLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: DashboardHome,
        meta: { 
          requiresAuth: true,
          title: 'Dashboard - LabTrack'
        }
      },
      {
        path: 'compounds',
        name: 'Compounds',
        component: CompoundsView,
        meta: { 
          requiresAuth: true,
          title: 'Compounds - LabTrack'
        }
      },      {
        path: 'inventory',
        name: 'Inventory',
        component: AuditView,
        meta: { 
          requiresAuth: true,
          title: 'Inventory - LabTrack'
        }
      },
      {
        path: 'inventory-sessions',
        name: 'InventorySessions',
        component: InventoryTransactionsView,
        meta: { 
          requiresAuth: true,
          title: 'Inventory Sessions - LabTrack'
        }
      },
      {
        path: 'preferences',
        name: 'Preferences',
        component: PreferencesView,
        meta: { 
          requiresAuth: true,
          title: 'Preferences - LabTrack'
        }
      },
      {
        path: 'settings',
        name: 'Settings',
        component: SettingsView,
        meta: { 
          requiresAuth: true,
          requiresAdmin: true,
          title: 'Settings - LabTrack'
        }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    redirect: '/dashboard'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // Always scroll to top when changing routes
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// Navigation Guards
router.beforeEach((to, from, next) => {
  const { isAuthenticated, isAdmin } = useAuth()
  
  // Set document title
  if (to.meta.title) {
    document.title = to.meta.title
  }
  
  // Handle guest-only routes (like login)
  if (to.meta.requiresGuest && isAuthenticated.value) {
    next('/dashboard')
    return
  }
  
  // Handle authentication-required routes
  if (to.meta.requiresAuth && !isAuthenticated.value) {
    next('/login')
    return
  }
  
  // Handle admin-only routes
  if (to.meta.requiresAdmin && !isAdmin.value) {
    next('/dashboard')
    return
  }
  
  next()
})

export default router
