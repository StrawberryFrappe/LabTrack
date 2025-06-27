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
        <h1 class="text-2xl font-bold text-slate-900">{{ $t('settings.title') }}</h1>
        <p class="text-slate-600 mt-1">{{ $t('settings.description') }}</p>
      </div>
    </div>
    
    <!-- Settings Content -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- User Management -->
      <Card>
        <template #header>
          <h3 class="text-lg font-semibold text-slate-900">{{ $t('settings.userManagement.title') }}</h3>
        </template>
        <div class="space-y-4">
          <p class="text-slate-600">{{ $t('settings.userManagement.description') }}</p>
          <!-- TRL3: User management interface placeholder -->
          <div class="text-center py-8 text-slate-500">
            <div class="text-2xl mb-2">👥</div>
            <p>{{ $t('settings.userManagement.comingSoon') }}</p>
          </div>
        </div>
      </Card>
      
      <!-- System Configuration -->
      <Card>
        <template #header>
          <h3 class="text-lg font-semibold text-slate-900">{{ $t('settings.systemConfig.title') }}</h3>
        </template>
        <div class="space-y-4">
          <p class="text-slate-600">{{ $t('settings.systemConfig.description') }}</p>
          <!-- TRL3: System configuration options placeholder -->
          <div class="text-center py-8 text-slate-500">
            <div class="text-2xl mb-2">⚙️</div>
            <p>{{ $t('settings.systemConfig.comingSoon') }}</p>
          </div>
        </div>
      </Card>
      
      <!-- Lab Settings -->
      <Card>
        <template #header>
          <h3 class="text-lg font-semibold text-slate-900">{{ $t('settings.labSettings.title') }}</h3>
        </template>
        <div class="space-y-4">
          <p class="text-slate-600">{{ $t('settings.labSettings.description') }}</p>
          <!-- TRL3: Lab settings interface placeholder -->
          <div class="text-center py-8 text-slate-500">
            <div class="text-2xl mb-2">🧪</div>
            <p>{{ $t('settings.labSettings.comingSoon') }}</p>
          </div>
        </div>
      </Card>
      
      <!-- Data Management -->
      <Card>
        <template #header>
          <h3 class="text-lg font-semibold text-slate-900">{{ $t('settings.dataManagement.title') }}</h3>
        </template>
        <div class="space-y-4">
          <p class="text-slate-600">{{ $t('settings.dataManagement.description') }}</p>
          <!-- TRL3: Data management tools placeholder -->
          <div class="text-center py-8 text-slate-500">
            <div class="text-2xl mb-2">💾</div>
            <p>{{ $t('settings.dataManagement.comingSoon') }}</p>
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
