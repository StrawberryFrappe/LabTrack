<!--
  Settings View Component
  
  This view handles application settings and configuration.
  Only accessible by admin users.
  
  Features:
  - User management
  - System configuration  - Lab settings
  - Data export/import
  
  TRL3 PRIORITIES:
  - Implement user management interface (add/edit/delete users)
  - Add system backup and restore functionality  
  - Implement audit log viewer for security and compliance
  - Add notification settings for system alerts
-->

<template>
  <div class="space-y-8">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-slate-900">Settings</h1>
        <p class="text-slate-600 mt-1">Manage system configuration and preferences</p>
      </div>
    </div>
    
    <!-- Settings Content -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- User Management -->
      <Card>
        <template #header>
          <h3 class="text-lg font-semibold text-slate-900">User Management</h3>
        </template>
        <div class="space-y-4">
          <p class="text-slate-600">Manage user accounts and permissions</p>
          <!-- TRL3: User management interface placeholder -->
          <div class="text-center py-8 text-slate-500">
            <div class="text-2xl mb-2">👥</div>
            <p>User management interface coming soon</p>
          </div>
        </div>
      </Card>
      
      <!-- System Configuration -->
      <Card>
        <template #header>
          <h3 class="text-lg font-semibold text-slate-900">System Configuration</h3>
        </template>
        <div class="space-y-4">
          <p class="text-slate-600">Configure system-wide settings</p>
          <!-- TRL3: System configuration options placeholder -->
          <div class="text-center py-8 text-slate-500">
            <div class="text-2xl mb-2">⚙️</div>
            <p>System configuration coming soon</p>
          </div>
        </div>
      </Card>
      
      <!-- Lab Settings -->
      <Card>
        <template #header>
          <h3 class="text-lg font-semibold text-slate-900">Laboratory Settings</h3>
        </template>
        <div class="space-y-4">
          <p class="text-slate-600">Configure lab-specific settings</p>
          <!-- TRL3: Lab settings interface placeholder -->
          <div class="text-center py-8 text-slate-500">
            <div class="text-2xl mb-2">🧪</div>
            <p>Lab settings interface coming soon</p>
          </div>
        </div>
      </Card>
      
      <!-- Data Management -->
      <Card>
        <template #header>
          <h3 class="text-lg font-semibold text-slate-900">Data Management</h3>
        </template>
        <div class="space-y-4">
          <p class="text-slate-600">Export, import, and backup data</p>
          <!-- TRL3: Data management tools placeholder -->
          <div class="text-center py-8 text-slate-500">
            <div class="text-2xl mb-2">💾</div>
            <p>Data management tools coming soon</p>
          </div>
        </div>
      </Card>
    </div>
  </div>
</template>

<script setup>
import Card from '@/components/ui/Card.vue'
import { useAuth } from '@/composables/useAuth.js'

// Ensure admin access (handled by router guard, but good to have as backup)
const { isAdmin } = useAuth()

if (!isAdmin.value) {
  // This shouldn't happen due to router guard, but just in case
  console.warn('Settings view accessed by non-admin user')
}
</script>
