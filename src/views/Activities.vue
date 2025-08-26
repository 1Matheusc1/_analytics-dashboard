<template>
  <div class="p-4 sm:p-6 max-w-7xl mx-auto">
    <!-- Page Header -->
    <div class="mb-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold text-secondary-900 mb-2">Activity Log</h1>
          <p class="text-secondary-600">
            Monitor all system activities and user actions in real-time.
          </p>
        </div>
        <div class="mt-4 sm:mt-0 flex space-x-3">
          <button @click="exportActivities" class="btn-outline">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z"
              />
            </svg>
            Export Log
          </button>
          <button @click="refreshActivities" class="btn-primary">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Refresh
          </button>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="card mb-6">
      <div class="card-content">
        <div class="flex flex-col lg:flex-row gap-4">
          <div class="flex-1">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search activities..."
              class="input w-full"
            />
          </div>
          <div class="flex flex-wrap gap-2">
            <select v-model="filters.type" class="select">
              <option value="all">All Types</option>
              <option value="login">Login</option>
              <option value="logout">Logout</option>
              <option value="create">Create</option>
              <option value="update">Update</option>
              <option value="delete">Delete</option>
              <option value="export">Export</option>
            </select>
            <select v-model="filters.user" class="select">
              <option value="all">All Users</option>
              <option value="system">System</option>
              <option value="admin">Admin</option>
              <option value="user">Regular User</option>
            </select>
            <select v-model="filters.timeRange" class="select">
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="all">All Time</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Activity Timeline -->
    <div class="space-y-6">
      <div v-for="(group, date) in groupedActivities" :key="date" class="card">
        <div class="card-header">
          <h2 class="text-lg font-semibold text-secondary-900">{{ formatDate(date) }}</h2>
        </div>
        <div class="card-content">
          <div class="flow-root">
            <ul class="-mb-8">
              <li v-for="(activity, index) in group" :key="activity.id" class="relative pb-8">
                <span
                  v-if="index !== group.length - 1"
                  class="absolute top-5 left-5 -ml-px h-full w-0.5 bg-secondary-200"
                ></span>

                <div class="relative flex items-start space-x-3">
                  <!-- Activity Icon -->
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

                    <!-- Status indicator -->
                    <div
                      :class="getStatusDotClass(activity.status)"
                      class="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white"
                    ></div>
                  </div>

                  <!-- Activity Details -->
                  <div class="min-w-0 flex-1">
                    <div class="text-sm">
                      <div class="flex items-center justify-between">
                        <div>
                          <span class="font-medium text-secondary-900">{{ activity.user }}</span>
                          <span class="text-secondary-600 ml-1">{{ activity.action }}</span>
                          <span v-if="activity.target" class="font-medium text-secondary-900 ml-1">
                            {{ activity.target }}
                          </span>
                        </div>
                        <time class="text-xs text-secondary-500">{{ activity.time }}</time>
                      </div>

                      <p v-if="activity.details" class="text-secondary-600 mt-1">
                        {{ activity.details }}
                      </p>

                      <!-- Additional metadata -->
                      <div v-if="activity.metadata" class="mt-2 flex flex-wrap gap-2">
                        <span
                          v-for="(value, key) in activity.metadata"
                          :key="key"
                          class="inline-flex items-center px-2 py-1 rounded-md text-xs bg-secondary-100 text-secondary-800"
                        >
                          {{ key }}: {{ value }}
                        </span>
                      </div>
                    </div>
                  </div>

                  <!-- Action Menu -->
                  <div class="flex-shrink-0">
                    <button
                      @click="showActivityDetails(activity)"
                      class="text-secondary-400 hover:text-secondary-600 transition-colors"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Load More -->
      <div v-if="hasMoreActivities" class="text-center">
        <button @click="loadMoreActivities" class="btn-outline">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Load More Activities
        </button>
      </div>
    </div>
  </div>

  <!-- Activity Details Modal -->
  <transition name="modal">
    <div
      v-if="selectedActivity"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-secondary-200">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-semibold text-secondary-900">Activity Details</h2>
            <button
              @click="selectedActivity = null"
              class="text-secondary-400 hover:text-secondary-600"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
        <div class="p-6">
          <div class="space-y-4">
            <div>
              <h3 class="text-sm font-medium text-secondary-700 mb-2">Activity Information</h3>
              <div class="bg-secondary-50 rounded-lg p-4">
                <div class="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span class="text-secondary-600">Type:</span>
                    <span class="ml-2 font-medium">{{ selectedActivity.type }}</span>
                  </div>
                  <div>
                    <span class="text-secondary-600">Status:</span>
                    <span class="ml-2 font-medium">{{ selectedActivity.status }}</span>
                  </div>
                  <div>
                    <span class="text-secondary-600">User:</span>
                    <span class="ml-2 font-medium">{{ selectedActivity.user }}</span>
                  </div>
                  <div>
                    <span class="text-secondary-600">Time:</span>
                    <span class="ml-2 font-medium">{{ selectedActivity.timestamp }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="selectedActivity.details">
              <h3 class="text-sm font-medium text-secondary-700 mb-2">Description</h3>
              <p class="text-sm text-secondary-600 bg-secondary-50 rounded-lg p-4">
                {{ selectedActivity.details }}
              </p>
            </div>

            <div v-if="selectedActivity.technical">
              <h3 class="text-sm font-medium text-secondary-700 mb-2">Technical Details</h3>
              <div
                class="bg-secondary-900 text-green-400 rounded-lg p-4 text-xs font-mono overflow-x-auto"
              >
                <pre>{{ JSON.stringify(selectedActivity.technical, null, 2) }}</pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'

// State
const searchQuery = ref('')
const selectedActivity = ref<any>(null)
const hasMoreActivities = ref(true)

const filters = reactive({
  type: 'all',
  user: 'all',
  timeRange: 'week',
})

// Mock activities data
const activities = ref([
  {
    id: '1',
    type: 'login',
    user: 'Marcos Silva',
    action: 'logged in',
    target: '',
    details: 'Successful login from Chrome browser',
    time: '2 minutes ago',
    timestamp: '2024-01-15 14:30:22',
    status: 'success',
    date: '2024-01-15',
    metadata: {
      IP: '192.168.1.100',
      Device: 'Chrome/Mac',
      Location: 'São Paulo, BR',
    },
    technical: {
      sessionId: 'sess_123456789',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      ip: '192.168.1.100',
    },
  },
  {
    id: '2',
    type: 'create',
    user: 'Ana Santos',
    action: 'created report',
    target: 'Monthly Analytics Report',
    details: 'Generated comprehensive monthly analytics report',
    time: '15 minutes ago',
    timestamp: '2024-01-15 14:17:45',
    status: 'success',
    date: '2024-01-15',
    metadata: {
      'Report Type': 'Analytics',
      Period: 'December 2024',
      Pages: '12',
    },
  },
  {
    id: '3',
    type: 'export',
    user: 'João Oliveira',
    action: 'exported data',
    target: 'User Database',
    details: 'Exported user data in CSV format',
    time: '1 hour ago',
    timestamp: '2024-01-15 13:30:12',
    status: 'success',
    date: '2024-01-15',
    metadata: {
      Format: 'CSV',
      Records: '1,247',
      Size: '2.3 MB',
    },
  },
  {
    id: '4',
    type: 'update',
    user: 'System',
    action: 'updated settings',
    target: 'Analytics Configuration',
    details: 'Auto-updated analytics tracking settings',
    time: '2 hours ago',
    timestamp: '2024-01-15 12:45:33',
    status: 'success',
    date: '2024-01-15',
    metadata: {
      Module: 'Analytics',
      Changed: '3 settings',
    },
  },
  {
    id: '5',
    type: 'delete',
    user: 'Maria Costa',
    action: 'deleted report',
    target: 'Test Report #234',
    details: 'Permanently deleted test report',
    time: '3 hours ago',
    timestamp: '2024-01-15 11:22:18',
    status: 'warning',
    date: '2024-01-15',
    metadata: {
      'Report ID': '#234',
      Type: 'Test Report',
    },
  },
])

// Computed
const filteredActivities = computed(() => {
  return activities.value.filter((activity) => {
    const matchesSearch =
      activity.user.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      activity.action.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (activity.target && activity.target.toLowerCase().includes(searchQuery.value.toLowerCase()))
    const matchesType = filters.type === 'all' || activity.type === filters.type
    const matchesUser =
      filters.user === 'all' ||
      (filters.user === 'system' && activity.user === 'System') ||
      (filters.user === 'admin' && activity.user !== 'System') ||
      (filters.user === 'user' && activity.user !== 'System')

    return matchesSearch && matchesType && matchesUser
  })
})

const groupedActivities = computed(() => {
  const grouped: Record<string, typeof filteredActivities.value> = {}
  filteredActivities.value.forEach((activity) => {
    const date = activity.date || 'unknown'
    if (!grouped[date]) {
      grouped[date] = []
    }
    grouped[date].push(activity)
  })
  return grouped
})

// Methods
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  if (date.toDateString() === today.toDateString()) {
    return 'Today'
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday'
  } else {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }
}

const getActivityIconBg = (type: string) => {
  const iconBgs: Record<string, string> = {
    login: 'bg-green-100',
    logout: 'bg-red-100',
    create: 'bg-blue-100',
    update: 'bg-yellow-100',
    delete: 'bg-red-100',
    export: 'bg-purple-100',
  }
  return iconBgs[type] || 'bg-secondary-100'
}

const getActivityIconColor = (type: string) => {
  const iconColors: Record<string, string> = {
    login: 'text-green-600',
    logout: 'text-red-600',
    create: 'text-blue-600',
    update: 'text-yellow-600',
    delete: 'text-red-600',
    export: 'text-purple-600',
  }
  return iconColors[type] || 'text-secondary-600'
}

const getActivityIconPath = (type: string) => {
  const iconPaths: Record<string, string> = {
    login:
      'M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1',
    logout:
      'M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1',
    create: 'M12 6v6m0 0v6m0-6h6m-6 0H6',
    update:
      'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15',
    delete:
      'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16',
    export:
      'M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z',
  }
  return iconPaths[type] || 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
}

const getStatusDotClass = (status: string) => {
  const statusClasses: Record<string, string> = {
    success: 'bg-green-400',
    warning: 'bg-yellow-400',
    error: 'bg-red-400',
    info: 'bg-blue-400',
  }
  return statusClasses[status] || 'bg-secondary-400'
}

const showActivityDetails = (activity: any) => {
  selectedActivity.value = activity
}

const exportActivities = () => {
  console.log('Exporting activities...')
  // Implement export logic
}

const refreshActivities = () => {
  console.log('Refreshing activities...')
  // Implement refresh logic
}

const loadMoreActivities = () => {
  console.log('Loading more activities...')
  // Implement load more logic
  hasMoreActivities.value = false
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
