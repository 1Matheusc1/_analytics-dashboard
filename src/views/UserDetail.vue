<template>
  <div class="p-4 sm:p-6 max-w-7xl mx-auto">
    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center min-h-96">
      <div class="text-center">
        <div
          class="animate-spin w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full mx-auto mb-4"
        ></div>
        <p class="text-secondary-600">Loading user details...</p>
      </div>
    </div>

    <!-- User Details -->
    <div v-else-if="user" class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <button @click="$router.go(-1)" class="btn-outline !p-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </button>
          <div class="flex items-center space-x-4">
            <img :src="user.avatar" :alt="user.name" class="w-16 h-16 rounded-full" />
            <div>
              <h1 class="text-2xl font-bold text-secondary-900">{{ user.name }}</h1>
              <p class="text-secondary-600">{{ user.email }}</p>
            </div>
          </div>
        </div>

        <div class="flex space-x-3">
          <button @click="sendMessage" class="btn-outline">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            Send Message
          </button>
          <button @click="editUser" class="btn-primary">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            Edit User
          </button>
        </div>
      </div>

      <!-- User Info Cards -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- User Profile -->
        <div class="card">
          <div class="card-header">
            <h2 class="text-lg font-semibold text-secondary-900">Profile Information</h2>
          </div>
          <div class="card-content space-y-4">
            <div>
              <label class="text-sm text-secondary-600">Role</label>
              <p class="font-medium text-secondary-900">{{ user.role }}</p>
            </div>
            <div>
              <label class="text-sm text-secondary-600">Department</label>
              <p class="font-medium text-secondary-900">{{ user.department }}</p>
            </div>
            <div>
              <label class="text-sm text-secondary-600">Status</label>
              <span
                :class="getStatusClass(user.status)"
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
              >
                {{ user.status }}
              </span>
            </div>
            <div>
              <label class="text-sm text-secondary-600">Joined</label>
              <p class="font-medium text-secondary-900">{{ user.joinedAt }}</p>
            </div>
            <div>
              <label class="text-sm text-secondary-600">Last Login</label>
              <p class="font-medium text-secondary-900">{{ user.lastLogin }}</p>
            </div>
          </div>
        </div>

        <!-- Activity Stats -->
        <div class="card">
          <div class="card-header">
            <h2 class="text-lg font-semibold text-secondary-900">Activity Statistics</h2>
          </div>
          <div class="card-content space-y-4">
            <div
              v-for="stat in user.stats"
              :key="stat.label"
              class="flex justify-between items-center"
            >
              <span class="text-sm text-secondary-600">{{ stat.label }}</span>
              <span class="font-bold text-secondary-900">{{ stat.value }}</span>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="card">
          <div class="card-header">
            <h2 class="text-lg font-semibold text-secondary-900">Quick Actions</h2>
          </div>
          <div class="card-content space-y-3">
            <button @click="resetPassword" class="w-full btn-outline text-left">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 7a2 2 0 012 2m0 0a2 2 0 01-2 2m2-2h.01M9 9h.01M6 19c0-2.5 3-5 9-5s9 2.5 9 5M12 3h.01M5 3h.01"
                />
              </svg>
              Reset Password
            </button>
            <button @click="toggleStatus" class="w-full btn-outline text-left">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
                />
              </svg>
              {{ user.status === 'active' ? 'Suspend User' : 'Activate User' }}
            </button>
            <button @click="viewPermissions" class="w-full btn-outline text-left">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              Manage Permissions
            </button>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="card">
        <div class="card-header">
          <h2 class="text-lg font-semibold text-secondary-900">Recent Activity</h2>
        </div>
        <div class="card-content">
          <div class="flow-root">
            <ul class="-mb-8">
              <li
                v-for="(activity, index) in user.recentActivity"
                :key="activity.id"
                class="relative pb-8"
              >
                <span
                  v-if="index !== user.recentActivity.length - 1"
                  class="absolute top-5 left-5 -ml-px h-full w-0.5 bg-secondary-200"
                ></span>

                <div class="relative flex items-start space-x-3">
                  <div class="relative">
                    <div
                      :class="getActivityIconBg(activity.type)"
                      class="h-10 w-10 rounded-full flex items-center justify-center"
                    >
                      <svg
                        class="w-5 h-5"
                        :class="getActivityIconColor(activity.type)"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          :d="getActivityIconPath(activity.type)"
                        />
                      </svg>
                    </div>
                  </div>

                  <div class="min-w-0 flex-1">
                    <div class="text-sm">
                      <span class="font-medium text-secondary-900">{{ activity.action }}</span>
                    </div>
                    <p class="text-sm text-secondary-600 mt-1">{{ activity.description }}</p>
                    <div class="text-xs text-secondary-500 mt-2">{{ activity.timestamp }}</div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else class="text-center py-12">
      <svg
        class="w-16 h-16 text-secondary-400 mx-auto mb-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
      <h2 class="text-xl font-semibold text-secondary-900 mb-2">User Not Found</h2>
      <p class="text-secondary-600">The user you're looking for doesn't exist.</p>
      <button @click="$router.push('/users')" class="btn-primary mt-4">Back to Users</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// State
const isLoading = ref(true)
const user = ref(null)

// Mock user data
const mockUser = {
  id: '1',
  name: 'Marcos Silva',
  email: 'marcos@company.com',
  avatar: 'https://ui-avatars.com/api/?name=Marcos+Silva&background=3b82f6&color=fff&size=200',
  role: 'Admin',
  department: 'Analytics',
  status: 'active',
  joinedAt: 'March 15, 2023',
  lastLogin: '2 hours ago',
  stats: [
    { label: 'Reports Created', value: '47' },
    { label: 'Login Sessions', value: '1,234' },
    { label: 'Data Exports', value: '23' },
    { label: 'Days Active', value: '298' },
  ],
  recentActivity: [
    {
      id: '1',
      type: 'login',
      action: 'Logged in',
      description: 'Successful login from Chrome browser',
      timestamp: '2 hours ago',
    },
    {
      id: '2',
      type: 'create',
      action: 'Created report',
      description: 'Generated Monthly Analytics Report',
      timestamp: '1 day ago',
    },
    {
      id: '3',
      type: 'export',
      action: 'Exported data',
      description: 'Downloaded user analytics CSV',
      timestamp: '3 days ago',
    },
  ],
}

// Methods
const loadUser = async () => {
  isLoading.value = true
  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    user.value = mockUser
  } catch (error) {
    console.error('Failed to load user:', error)
  } finally {
    isLoading.value = false
  }
}

const getStatusClass = (status: string) => {
  const statusClasses = {
    active: 'bg-success-100 text-success-800',
    inactive: 'bg-secondary-100 text-secondary-800',
    suspended: 'bg-danger-100 text-danger-800',
  }
  return statusClasses[status] || statusClasses.inactive
}

const getActivityIconBg = (type: string) => {
  const iconBgs = {
    login: 'bg-green-100',
    create: 'bg-blue-100',
    export: 'bg-purple-100',
    update: 'bg-yellow-100',
  }
  return iconBgs[type] || 'bg-secondary-100'
}

const getActivityIconColor = (type: string) => {
  const iconColors = {
    login: 'text-green-600',
    create: 'text-blue-600',
    export: 'text-purple-600',
    update: 'text-yellow-600',
  }
  return iconColors[type] || 'text-secondary-600'
}

const getActivityIconPath = (type: string) => {
  const iconPaths = {
    login:
      'M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1',
    create: 'M12 6v6m0 0v6m0-6h6m-6 0H6',
    export:
      'M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z',
    update:
      'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15',
  }
  return iconPaths[type] || 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
}

const sendMessage = () => {
  console.log('Sending message to user...')
}

const editUser = () => {
  console.log('Editing user...')
}

const resetPassword = () => {
  console.log('Resetting password...')
}

const toggleStatus = () => {
  user.value.status = user.value.status === 'active' ? 'suspended' : 'active'
}

const viewPermissions = () => {
  console.log('Viewing permissions...')
}

// Lifecycle
onMounted(() => {
  loadUser()
})
</script>
