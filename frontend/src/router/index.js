/**
 * Vue Router Configuration
 * 
 * This file sets up all the routes for the LabTrack application
 * and includes navigation guards for authentication and role-based access.
 * 
 * Route Structure:
 * - /login - Authentication page (guest only)
 * - / - Redirects to dashboard
 * - /dashboard - Main dashboard (authenticated users)
 * - /compounds - Compound management (authenticated users)
 * - /inventory - Inventory counts (authenticated users)
 * - /settings - Settings page (admin only)
 * 
 * Navigation Guards:
 * - requireAuth: Redirects to login if not authenticated
 * - requireAdmin: Redirects to dashboard if not admin
 * - requireGuest: Redirects to dashboard if already authenticated
 */

import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '../composables/useAuth.js'

// Lazy-loaded components for better performance
const LoginForm = () => import('../components/auth/LoginForm.vue')
const DashboardLayout = () => import('../components/layout/DashboardLayout.vue')
const DashboardHome = () => import('../views/DashboardHome.vue')
const CompoundsView = () => import('../views/CompoundsView.vue')
const InventoryView = () => import('../views/InventoryView.vue')
const SettingsView = () => import('../views/SettingsView.vue')

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
      },
      {
        path: 'inventory',
        name: 'Inventory',
        component: InventoryView,
        meta: { 
          requiresAuth: true,
          title: 'Inventory - LabTrack'
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
  
  console.log(`Router: Navigating from ${from.path} to ${to.path}`)
  console.log(`Router: User authenticated: ${isAuthenticated.value}`)
  console.log(`Router: User is admin: ${isAdmin.value}`)
  
  // Set document title
  if (to.meta.title) {
    document.title = to.meta.title
  }
  
  // Handle guest-only routes (like login)
  if (to.meta.requiresGuest && isAuthenticated.value) {
    console.log('Router: Redirecting authenticated user from guest-only route to dashboard')
    next('/dashboard')
    return
  }
  
  // Handle authentication-required routes
  if (to.meta.requiresAuth && !isAuthenticated.value) {
    console.log('Router: Redirecting unauthenticated user to login')
    next('/login')
    return
  }
  
  // Handle admin-only routes
  if (to.meta.requiresAdmin && !isAdmin.value) {
    console.log('Router: Redirecting non-admin user to dashboard')
    next('/dashboard')
    return
  }
  
  console.log('Router: Navigation allowed')
  next()
})

export default router
