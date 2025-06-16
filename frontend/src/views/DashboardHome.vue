<!--
  Dashboard Home View
    ✅ COMPLETED: Extracted from legacy Dashboard.vue component
      - Successfully separated layout concerns from content
      - Migrated from conditional rendering to dedicated route
      - Improved component modularity and maintainability
  
  This is the main dashboard view that shows summary information
  and quick access to key features. Created as part of the router
  migration to separate layout from content.
  
  Features:
  - Dashboard summary cards from DashboardCards component
  - Low stock alerts with router links to compounds  
  - Expiring items alerts with proper date formatting
  - Quick action cards with router navigation
  - Role-based action visibility (admin settings)
    ✅ COMPLETED: Router integration for navigation
      - Quick action cards use router-link for navigation
      - Conditional admin settings card based on user role
      - Proper navigation to /compounds, /inventory, /settings
      - Eliminates need for custom event handling and view switching
  
  TODO: Add customizable dashboard widgets
  TODO: Implement dashboard preferences  
  TODO: Add real-time updates
-->

<template>
  <div class="space-y-8">
    <!-- Dashboard Cards -->
    <DashboardCards />
    
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Low Stock Items -->
      <Card>
        <template #header>
          <h3 class="text-lg font-semibold text-slate-900">Low Stock Items</h3>
        </template>
        <div v-if="lowStockItems.length === 0" class="text-center py-8 text-slate-500">
          <div class="text-2xl mb-2">✅</div>
          <p>All items are adequately stocked</p>
        </div>
        <div v-else class="space-y-3">
          <div 
            v-for="item in lowStockItems.slice(0, 5)" 
            :key="item.id"
            class="flex items-center justify-between p-3 bg-red-50 rounded-lg"
          >
            <div>
              <p class="font-medium text-red-900">{{ item.name }}</p>
              <p class="text-sm text-red-700">{{ item.quantity }} {{ item.unit }} remaining</p>
            </div>
            <div class="flex items-center space-x-2">
              <span class="text-red-600 font-medium">{{ item.quantity }}</span>
              <span class="text-xs text-red-500">{{ item.unit }}</span>
            </div>
          </div>
          <div v-if="lowStockItems.length > 5" class="text-center pt-3 border-t border-red-200">
            <router-link 
              to="/compounds" 
              class="text-sm text-red-600 hover:text-red-800 font-medium"
            >
              View all {{ lowStockItems.length }} low stock items →
            </router-link>
          </div>
        </div>
      </Card>
      
      <!-- Expiring Items -->
      <Card>
        <template #header>
          <h3 class="text-lg font-semibold text-slate-900">Expiring Soon</h3>
        </template>
        <div v-if="expiringItems.length === 0" class="text-center py-8 text-slate-500">
          <div class="text-2xl mb-2">✅</div>
          <p>No items expiring soon</p>
        </div>
        <div v-else class="space-y-3">
          <div 
            v-for="item in expiringItems.slice(0, 5)" 
            :key="item.id"
            class="flex items-center justify-between p-3 bg-amber-50 rounded-lg"
          >
            <div>
              <p class="font-medium text-amber-900">{{ item.name }}</p>
              <p class="text-sm text-amber-700">Expires {{ formatDate(item.expiryDate) }}</p>
            </div>
            <div class="flex items-center space-x-2">
              <span class="text-amber-600 font-medium">{{ getDaysUntilExpiry(item.expiryDate) }}</span>
              <span class="text-xs text-amber-500">days</span>
            </div>
          </div>
          <div v-if="expiringItems.length > 5" class="text-center pt-3 border-t border-amber-200">
            <router-link 
              to="/compounds" 
              class="text-sm text-amber-600 hover:text-amber-800 font-medium"
            >
              View all {{ expiringItems.length }} expiring items →
            </router-link>
          </div>
        </div>
      </Card>
    </div>
    
    <!-- Quick Actions -->
    <Card>
      <template #header>
        <h3 class="text-lg font-semibold text-slate-900">Quick Actions</h3>
      </template>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <router-link
          to="/compounds"
          class="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors group"
        >
          <div class="flex-shrink-0 w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center group-hover:bg-blue-600 transition-colors">
            <span class="text-white text-lg">🧪</span>
          </div>
          <div class="ml-4">
            <p class="font-medium text-blue-900">Manage Compounds</p>
            <p class="text-sm text-blue-700">View and update chemical inventory</p>
          </div>
        </router-link>
        
        <router-link
          to="/inventory"
          class="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors group"
        >
          <div class="flex-shrink-0 w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center group-hover:bg-green-600 transition-colors">
            <span class="text-white text-lg">📦</span>
          </div>
          <div class="ml-4">
            <p class="font-medium text-green-900">Start Count Session</p>
            <p class="text-sm text-green-700">Begin physical inventory counting</p>
          </div>
        </router-link>
        
        <router-link
          v-if="isAdmin"
          to="/settings"
          class="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors group"
        >
          <div class="flex-shrink-0 w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center group-hover:bg-purple-600 transition-colors">
            <span class="text-white text-lg">⚙️</span>
          </div>
          <div class="ml-4">
            <p class="font-medium text-purple-900">System Settings</p>
            <p class="text-sm text-purple-700">Configure users and system</p>
          </div>
        </router-link>
      </div>
    </Card>
  </div>
</template>

<script setup>
import Card from '@/components/ui/Card.vue'
import DashboardCards from '@/components/dashboard/DashboardCards.vue'
import { useCompounds } from '@/composables/useCompounds.js'
import { useAuth } from '@/composables/useAuth.js'

// Authentication
const { isAdmin } = useAuth()

// Compounds data
const { lowStockItems, expiringItems } = useCompounds()

// Utility methods
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const getDaysUntilExpiry = (dateString) => {
  const expiryDate = new Date(dateString)
  const today = new Date()
  const diffTime = expiryDate - today
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}
</script>
