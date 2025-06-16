<!--
  Login Form Component
  
  This is the main login interface for the LabTrack application.
  It provides a clean, accessible form for user authentication.
  
  Features:
  - Simple username/password authentication
  - Loading states during login
  - Error message display
  - Demo account information
  - Mobile-responsive design
  
  The component emits a 'login-success' event when login is successful,
  allowing the parent component to handle the transition to the main app.
-->

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!-- Header Section -->
      <div>
        <div class="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100">
          <!-- Simple flask icon using emoji -->
          <span class="text-2xl">🧪</span>
        </div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to LabTrack
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Laboratory Inventory Management System
        </p>
      </div>
      
      <!-- Login Form -->
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <!-- Username and Password Fields -->
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="username" class="sr-only">Username</label>
            <input
              id="username"
              v-model="form.username"
              name="username"
              type="text"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Username"
              :disabled="loading"
            />
          </div>
          <div>
            <label for="password" class="sr-only">Password</label>
            <input
              id="password"
              v-model="form.password"
              name="password"
              type="password"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Password"
              :disabled="loading"
            />
          </div>
        </div>

        <!-- Error Message Display -->
        <div v-if="error" class="rounded-md bg-red-50 p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <!-- Error icon -->
              <span class="text-red-400">⚠️</span>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">
                Login Failed
              </h3>
              <p class="text-sm text-red-700 mt-1">
                {{ error }}
              </p>
            </div>
          </div>
        </div>

        <!-- Submit Button -->
        <div>
          <button
            type="submit"
            :disabled="loading || !form.username || !form.password"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <!-- Loading spinner -->
            <span v-if="loading" class="absolute left-0 inset-y-0 flex items-center pl-3">
              <div class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
            </span>
            {{ loading ? 'Signing in...' : 'Sign in' }}
          </button>
        </div>

        <!-- Demo Account Information -->
        <div class="text-xs text-gray-500 text-center space-y-1 border-t border-gray-200 pt-4">
          <p class="font-medium text-gray-700">Demo Accounts:</p>
          <div class="grid grid-cols-2 gap-2 text-xs">
            <div class="bg-blue-50 rounded p-2">
              <p class="font-semibold text-blue-800">Administrator</p>
              <p class="text-blue-600">admin / admin</p>
              <p class="text-blue-500 text-xs">Full access</p>
            </div>
            <div class="bg-green-50 rounded p-2">
              <p class="font-semibold text-green-800">Visitor</p>
              <p class="text-green-600">visitor / visitor</p>
              <p class="text-green-500 text-xs">Read-only access</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../../composables/useAuth.js'

// Router for navigation
const router = useRouter()

// Get authentication composable
const { login, loading, error } = useAuth()

// Form data
const form = reactive({
  username: '',
  password: ''
})

/**
 * Handle Login Form Submission
 * 
 * This function is called when the user submits the login form.
 * It uses the auth composable to attempt login and navigates to dashboard on success.
 */
const handleLogin = async () => {
  try {
    // Attempt login with form data
    await login(form)
    
    // If successful, navigate to dashboard
    router.push('/dashboard')
    
    // Clear form for security
    form.username = ''
    form.password = ''
  } catch (err) {
    // Error is already handled by the composable and displayed in template
    console.log('Login attempt failed:', err.message)
  }
}
</script>
