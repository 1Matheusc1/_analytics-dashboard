<template>
  <div class="p-4 sm:p-6 max-w-4xl mx-auto">
    <!-- Page Header -->
    <div class="mb-6">
      <h1 class="text-2xl sm:text-3xl font-bold text-secondary-900 mb-2">Profile Settings</h1>
      <p class="text-secondary-600">Manage your account information and preferences.</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Profile Card -->
      <div class="card">
        <div class="card-content text-center">
          <div class="relative inline-block">
            <img
              :src="profile.avatar"
              :alt="profile.name"
              class="w-24 h-24 rounded-full mx-auto mb-4"
            />
            <button
              @click="showAvatarModal = true"
              class="absolute bottom-2 right-2 bg-primary-600 text-white rounded-full p-2 hover:bg-primary-700 transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>
          </div>

          <h2 class="text-xl font-bold text-secondary-900 mb-1">{{ profile.name }}</h2>
          <p class="text-secondary-600 mb-2">{{ profile.email }}</p>
          <span
            :class="getRoleClass(profile.role)"
            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
          >
            {{ profile.role }}
          </span>

          <div class="mt-4 pt-4 border-t border-secondary-200">
            <div class="grid grid-cols-2 gap-4 text-center">
              <div>
                <p class="text-lg font-bold text-secondary-900">
                  {{ profile.stats.reportsCreated }}
                </p>
                <p class="text-xs text-secondary-500">Reports Created</p>
              </div>
              <div>
                <p class="text-lg font-bold text-secondary-900">{{ profile.stats.lastLogin }}</p>
                <p class="text-xs text-secondary-500">Last Login</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Personal Information -->
        <div class="card">
          <div class="card-header">
            <h3 class="text-lg font-semibold text-secondary-900">Personal Information</h3>
          </div>
          <div class="card-content">
            <form @submit.prevent="savePersonalInfo">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-secondary-700 mb-2">
                    First Name
                  </label>
                  <input
                    v-model="personalInfo.firstName"
                    type="text"
                    class="input w-full"
                    required
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-secondary-700 mb-2">
                    Last Name
                  </label>
                  <input
                    v-model="personalInfo.lastName"
                    type="text"
                    class="input w-full"
                    required
                  />
                </div>

                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-secondary-700 mb-2">
                    Email Address
                  </label>
                  <input v-model="personalInfo.email" type="email" class="input w-full" required />
                </div>

                <div>
                  <label class="block text-sm font-medium text-secondary-700 mb-2">
                    Phone Number
                  </label>
                  <input v-model="personalInfo.phone" type="tel" class="input w-full" />
                </div>

                <div>
                  <label class="block text-sm font-medium text-secondary-700 mb-2">
                    Department
                  </label>
                  <select v-model="personalInfo.department" class="select w-full">
                    <option value="">Select Department</option>
                    <option value="analytics">Analytics</option>
                    <option value="marketing">Marketing</option>
                    <option value="sales">Sales</option>
                    <option value="it">IT</option>
                    <option value="hr">Human Resources</option>
                  </select>
                </div>

                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-secondary-700 mb-2"> Bio </label>
                  <textarea
                    v-model="personalInfo.bio"
                    class="input w-full h-20"
                    placeholder="Tell us about yourself..."
                  ></textarea>
                </div>
              </div>

              <div class="mt-6 flex justify-end">
                <button type="submit" class="btn-primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>

        <!-- Preferences -->
        <div class="card">
          <div class="card-header">
            <h3 class="text-lg font-semibold text-secondary-900">Preferences</h3>
          </div>
          <div class="card-content">
            <form @submit.prevent="savePreferences">
              <div class="space-y-6">
                <!-- Language & Region -->
                <div>
                  <h4 class="text-md font-medium text-secondary-900 mb-4">Language & Region</h4>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-secondary-700 mb-2">
                        Language
                      </label>
                      <select v-model="preferences.language" class="select w-full">
                        <option value="en">English</option>
                        <option value="pt">Português</option>
                        <option value="es">Español</option>
                        <option value="fr">Français</option>
                      </select>
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-secondary-700 mb-2">
                        Time Zone
                      </label>
                      <select v-model="preferences.timezone" class="select w-full">
                        <option value="UTC">UTC</option>
                        <option value="America/Sao_Paulo">São Paulo (GMT-3)</option>
                        <option value="America/New_York">New York (GMT-5)</option>
                        <option value="Europe/London">London (GMT+0)</option>
                        <option value="Asia/Tokyo">Tokyo (GMT+9)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <!-- Dashboard Preferences -->
                <div>
                  <h4 class="text-md font-medium text-secondary-900 mb-4">Dashboard Preferences</h4>
                  <div class="space-y-4">
                    <div class="flex items-center justify-between">
                      <div>
                        <label class="text-sm font-medium text-secondary-700">Dark Mode</label>
                        <p class="text-xs text-secondary-500">Use dark theme for the interface</p>
                      </div>
                      <label class="relative inline-flex items-center cursor-pointer">
                        <input
                          v-model="preferences.darkMode"
                          type="checkbox"
                          class="sr-only peer"
                        />
                        <div
                          class="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"
                        ></div>
                      </label>
                    </div>

                    <div class="flex items-center justify-between">
                      <div>
                        <label class="text-sm font-medium text-secondary-700"
                          >Auto-refresh Dashboard</label
                        >
                        <p class="text-xs text-secondary-500">
                          Automatically refresh data every 30 seconds
                        </p>
                      </div>
                      <label class="relative inline-flex items-center cursor-pointer">
                        <input
                          v-model="preferences.autoRefresh"
                          type="checkbox"
                          class="sr-only peer"
                        />
                        <div
                          class="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"
                        ></div>
                      </label>
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-secondary-700 mb-2">
                        Default Chart Type
                      </label>
                      <select v-model="preferences.defaultChartType" class="select w-full">
                        <option value="line">Line Chart</option>
                        <option value="bar">Bar Chart</option>
                        <option value="pie">Pie Chart</option>
                        <option value="area">Area Chart</option>
                      </select>
                    </div>
                  </div>
                </div>

                <!-- Email Notifications -->
                <div>
                  <h4 class="text-md font-medium text-secondary-900 mb-4">Email Notifications</h4>
                  <div class="space-y-4">
                    <div
                      v-for="notification in emailNotifications"
                      :key="notification.id"
                      class="flex items-center justify-between"
                    >
                      <div>
                        <label class="text-sm font-medium text-secondary-700">{{
                          notification.title
                        }}</label>
                        <p class="text-xs text-secondary-500">{{ notification.description }}</p>
                      </div>
                      <label class="relative inline-flex items-center cursor-pointer">
                        <input
                          v-model="notification.enabled"
                          type="checkbox"
                          class="sr-only peer"
                        />
                        <div
                          class="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"
                        ></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div class="mt-6 flex justify-end">
                <button type="submit" class="btn-primary">Save Preferences</button>
              </div>
            </form>
          </div>
        </div>

        <!-- Account Actions -->
        <div class="card">
          <div class="card-header">
            <h3 class="text-lg font-semibold text-secondary-900">Account Actions</h3>
          </div>
          <div class="card-content">
            <div class="space-y-4">
              <div
                class="flex items-center justify-between p-4 border border-secondary-200 rounded-lg"
              >
                <div>
                  <h4 class="text-sm font-medium text-secondary-900">Download Your Data</h4>
                  <p class="text-xs text-secondary-500">Get a copy of all your account data</p>
                </div>
                <button @click="downloadData" class="btn-outline !text-sm">Download</button>
              </div>

              <div
                class="flex items-center justify-between p-4 border border-warning-200 rounded-lg bg-warning-50"
              >
                <div>
                  <h4 class="text-sm font-medium text-warning-900">Deactivate Account</h4>
                  <p class="text-xs text-warning-700">Temporarily disable your account</p>
                </div>
                <button @click="deactivateAccount" class="btn-secondary !text-sm">
                  Deactivate
                </button>
              </div>

              <div
                class="flex items-center justify-between p-4 border border-danger-200 rounded-lg bg-danger-50"
              >
                <div>
                  <h4 class="text-sm font-medium text-danger-900">Delete Account</h4>
                  <p class="text-xs text-danger-700">
                    Permanently delete your account and all data
                  </p>
                </div>
                <button @click="showDeleteModal = true" class="btn-danger !text-sm">Delete</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Delete Account Confirmation Modal -->
  <transition name="modal">
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
        <div class="p-6">
          <div class="flex items-center mb-4">
            <div class="w-12 h-12 bg-danger-100 rounded-full flex items-center justify-center mr-4">
              <svg
                class="w-6 h-6 text-danger-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-secondary-900">Delete Account</h3>
              <p class="text-sm text-secondary-600">This action cannot be undone</p>
            </div>
          </div>

          <p class="text-sm text-secondary-600 mb-4">
            Are you sure you want to delete your account? All of your data will be permanently
            removed. This action cannot be undone.
          </p>

          <div class="flex justify-end space-x-3">
            <button @click="showDeleteModal = false" class="btn-secondary">Cancel</button>
            <button @click="deleteAccount" class="btn-danger">Delete Account</button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

// State
const showAvatarModal = ref(false)
const showDeleteModal = ref(false)

const profile = ref({
  name: 'Marcos Silva',
  email: 'marcos@company.com',
  avatar: 'https://ui-avatars.com/api/?name=Marcos+Silva&background=3b82f6&color=fff&size=200',
  role: 'admin',
  stats: {
    reportsCreated: 47,
    lastLogin: '2 hours ago',
  },
})

const personalInfo = reactive({
  firstName: 'Marcos',
  lastName: 'Silva',
  email: 'marcos@company.com',
  phone: '+55 11 99999-9999',
  department: 'analytics',
  bio: 'Analytics specialist with 5+ years of experience in data visualization and business intelligence.',
})

const preferences = reactive({
  language: 'en',
  timezone: 'America/Sao_Paulo',
  darkMode: false,
  autoRefresh: true,
  defaultChartType: 'line',
})

const emailNotifications = ref([
  {
    id: 'reports',
    title: 'Weekly Reports',
    description: 'Receive weekly analytics summary',
    enabled: true,
  },
  {
    id: 'alerts',
    title: 'Alert Notifications',
    description: 'Get notified when metrics exceed thresholds',
    enabled: true,
  },
  {
    id: 'updates',
    title: 'Product Updates',
    description: 'Information about new features',
    enabled: false,
  },
])

// Methods
const getRoleClass = (role: string) => {
  const roleClasses: Record<string, string> = {
    admin: 'bg-danger-100 text-danger-800',
    editor: 'bg-warning-100 text-warning-800',
    viewer: 'bg-secondary-100 text-secondary-800',
  }
  return roleClasses[role] || roleClasses.viewer
}

const savePersonalInfo = () => {
  console.log('Saving personal info:', personalInfo)
  // Implement save logic
}

const savePreferences = () => {
  console.log('Saving preferences:', preferences)
  console.log('Email notifications:', emailNotifications.value)
  // Implement save logic
}

const downloadData = () => {
  console.log('Downloading user data...')
  // Implement download logic
}

const deactivateAccount = () => {
  if (confirm('Are you sure you want to deactivate your account?')) {
    console.log('Deactivating account...')
    // Implement deactivation logic
  }
}

const deleteAccount = () => {
  console.log('Deleting account...')
  showDeleteModal.value = false
  // Implement deletion logic
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease-in-out;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>
