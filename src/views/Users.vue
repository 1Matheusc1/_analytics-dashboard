<template>
  <div class="p-4 sm:p-6 max-w-7xl mx-auto">
    <!-- Page Header -->
    <div class="mb-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold text-secondary-900 mb-2">User Management</h1>
          <p class="text-secondary-600">
            Manage and analyze your user base with detailed insights.
          </p>
        </div>
        <div class="mt-4 sm:mt-0 flex space-x-3">
          <button @click="exportUsers" class="btn-outline">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z"
              />
            </svg>
            Export Users
          </button>
          <button @click="showInviteModal = true" class="btn-primary">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Invite Users
          </button>
        </div>
      </div>
    </div>

    <!-- Stats Overview -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <div v-for="stat in userStats" :key="stat.title" class="card">
        <div class="card-content">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-secondary-600">{{ stat.title }}</p>
              <p class="text-2xl font-bold text-secondary-900 mt-1">{{ stat.value }}</p>
              <div class="flex items-center mt-2">
                <span
                  :class="stat.trend === 'up' ? 'text-success-600' : 'text-danger-600'"
                  class="text-sm font-medium"
                >
                  {{ stat.change }}%
                </span>
                <span class="text-secondary-500 text-xs ml-1">from last month</span>
              </div>
            </div>
            <div :class="stat.iconBg" class="w-12 h-12 rounded-xl flex items-center justify-center">
              <svg
                class="w-6 h-6"
                :class="stat.iconColor"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  :d="stat.iconPath"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters and Search -->
    <div class="card mb-6">
      <div class="card-content">
        <div class="flex flex-col lg:flex-row gap-4">
          <div class="flex-1">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search users by name, email, or ID..."
              class="input w-full"
            />
          </div>
          <div class="flex flex-wrap gap-2">
            <select v-model="filters.status" class="select">
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
            <select v-model="filters.role" class="select">
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="editor">Editor</option>
              <option value="viewer">Viewer</option>
            </select>
            <select v-model="filters.subscription" class="select">
              <option value="all">All Plans</option>
              <option value="free">Free</option>
              <option value="pro">Pro</option>
              <option value="enterprise">Enterprise</option>
            </select>
            <button @click="resetFilters" class="btn-outline">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Users Table -->
    <div class="card">
      <div class="card-header">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold text-secondary-900">
            Users ({{ filteredUsers.length }})
          </h2>
          <div class="flex items-center space-x-2">
            <button
              @click="toggleSelectAll"
              class="btn-outline !text-sm"
              :class="{ '!bg-primary-50 !border-primary-300': selectedUsers.length > 0 }"
            >
              {{ selectedUsers.length > 0 ? `${selectedUsers.length} selected` : 'Select All' }}
            </button>
            <div v-if="selectedUsers.length > 0" class="flex space-x-1">
              <button @click="bulkAction('activate')" class="btn-success !text-sm">Activate</button>
              <button @click="bulkAction('deactivate')" class="btn-secondary !text-sm">
                Deactivate
              </button>
              <button @click="bulkAction('delete')" class="btn-danger !text-sm">Delete</button>
            </div>
          </div>
        </div>
      </div>
      <div class="card-content !p-0">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-secondary-200">
            <thead class="bg-secondary-50">
              <tr>
                <th class="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    :checked="
                      selectedUsers.length === filteredUsers.length && filteredUsers.length > 0
                    "
                    :indeterminate="
                      selectedUsers.length > 0 && selectedUsers.length < filteredUsers.length
                    "
                    @change="toggleSelectAll"
                    class="rounded"
                  />
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider"
                >
                  User
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider"
                >
                  Role
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider"
                >
                  Last Active
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider"
                >
                  Subscription
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-secondary-200">
              <tr
                v-for="user in paginatedUsers"
                :key="user.id"
                class="hover:bg-secondary-50 transition-colors"
                :class="{ 'bg-primary-25': selectedUsers.includes(user.id) }"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <input type="checkbox" :value="user.id" v-model="selectedUsers" class="rounded" />
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <img :src="user.avatar" :alt="user.name" class="w-10 h-10 rounded-full mr-3" />
                    <div>
                      <div class="text-sm font-medium text-secondary-900">{{ user.name }}</div>
                      <div class="text-sm text-secondary-500">{{ user.email }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="getRoleClass(user.role)"
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  >
                    {{ user.role }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="getStatusClass(user.status)"
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  >
                    <div
                      class="w-1.5 h-1.5 rounded-full mr-1.5"
                      :class="getStatusDotClass(user.status)"
                    ></div>
                    {{ user.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">
                  {{ user.lastActive }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="getSubscriptionClass(user.subscription)"
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  >
                    {{ user.subscription }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex space-x-2">
                    <button @click="viewUser(user)" class="text-primary-600 hover:text-primary-900">
                      View
                    </button>
                    <button
                      @click="editUser(user)"
                      class="text-secondary-600 hover:text-secondary-900"
                    >
                      Edit
                    </button>
                    <button
                      @click="suspendUser(user)"
                      class="text-warning-600 hover:text-warning-900"
                    >
                      {{ user.status === 'suspended' ? 'Unsuspend' : 'Suspend' }}
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="px-6 py-3 border-t border-secondary-200 flex items-center justify-between">
          <div class="text-sm text-secondary-500">
            Showing {{ (currentPage - 1) * pageSize + 1 }} to
            {{ Math.min(currentPage * pageSize, filteredUsers.length) }} of
            {{ filteredUsers.length }} users
          </div>
          <div class="flex space-x-1">
            <button
              @click="currentPage--"
              :disabled="currentPage === 1"
              class="btn-outline !text-sm !px-3 !py-1"
              :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }"
            >
              Previous
            </button>
            <button
              v-for="page in visiblePages"
              :key="page"
              @click="currentPage = page"
              :class="page === currentPage ? 'btn-primary' : 'btn-outline'"
              class="!text-sm !px-3 !py-1"
            >
              {{ page }}
            </button>
            <button
              @click="currentPage++"
              :disabled="currentPage === totalPages"
              class="btn-outline !text-sm !px-3 !py-1"
              :class="{ 'opacity-50 cursor-not-allowed': currentPage === totalPages }"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Invite Users Modal -->
  <transition name="modal">
    <div
      v-if="showInviteModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-xl shadow-xl max-w-lg w-full mx-4">
        <div class="p-6 border-b border-secondary-200">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-semibold text-secondary-900">Invite Users</h2>
            <button @click="closeInviteModal" class="text-secondary-400 hover:text-secondary-600">
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
          <form @submit.prevent="sendInvites">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-secondary-700 mb-2">
                  Email Addresses
                </label>
                <textarea
                  v-model="inviteForm.emails"
                  class="input w-full h-24"
                  placeholder="Enter email addresses separated by commas or new lines..."
                  required
                ></textarea>
                <p class="text-xs text-secondary-500 mt-1">
                  Separate multiple emails with commas or new lines
                </p>
              </div>

              <div>
                <label class="block text-sm font-medium text-secondary-700 mb-2">Role</label>
                <select v-model="inviteForm.role" class="select w-full" required>
                  <option value="">Select role</option>
                  <option value="viewer">Viewer</option>
                  <option value="editor">Editor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-secondary-700 mb-2">
                  Custom Message (Optional)
                </label>
                <textarea
                  v-model="inviteForm.message"
                  class="input w-full h-20"
                  placeholder="Add a personal message to the invitation..."
                ></textarea>
              </div>
            </div>

            <div class="mt-6 flex justify-end space-x-3">
              <button type="button" @click="closeInviteModal" class="btn-secondary">Cancel</button>
              <button type="submit" class="btn-primary">Send Invitations</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// State
const showInviteModal = ref(false)
const searchQuery = ref('')
const selectedUsers = ref<string[]>([])
const currentPage = ref(1)
const pageSize = ref(10)

const filters = reactive({
  status: 'all',
  role: 'all',
  subscription: 'all',
})

const inviteForm = reactive({
  emails: '',
  role: '',
  message: '',
})

// Mock data
const userStats = ref([
  {
    title: 'Total Users',
    value: '12,483',
    change: 8.2,
    trend: 'up',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    iconPath:
      'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z',
  },
  {
    title: 'Active Users',
    value: '9,847',
    change: 12.1,
    trend: 'up',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    iconPath:
      'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z',
  },
  {
    title: 'Pro Users',
    value: '2,156',
    change: -3.2,
    trend: 'down',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    iconPath:
      'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z',
  },
  {
    title: 'New This Month',
    value: '324',
    change: 15.8,
    trend: 'up',
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-600',
    iconPath:
      'M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z',
  },
])

const users = ref([
  {
    id: '1',
    name: 'Marcos Silva',
    email: 'marcos@company.com',
    avatar: 'https://ui-avatars.com/api/?name=Marcos+Silva&background=3b82f6&color=fff',
    role: 'admin',
    status: 'active',
    lastActive: '2 minutes ago',
    subscription: 'enterprise',
  },
  {
    id: '2',
    name: 'Ana Santos',
    email: 'ana@company.com',
    avatar: 'https://ui-avatars.com/api/?name=Ana+Santos&background=10b981&color=fff',
    role: 'editor',
    status: 'active',
    lastActive: '1 hour ago',
    subscription: 'pro',
  },
  {
    id: '3',
    name: 'João Oliveira',
    email: 'joao@company.com',
    avatar: 'https://ui-avatars.com/api/?name=João+Oliveira&background=f59e0b&color=fff',
    role: 'viewer',
    status: 'inactive',
    lastActive: '2 days ago',
    subscription: 'free',
  },
  {
    id: '4',
    name: 'Maria Costa',
    email: 'maria@company.com',
    avatar: 'https://ui-avatars.com/api/?name=Maria+Costa&background=ef4444&color=fff',
    role: 'editor',
    status: 'suspended',
    lastActive: '1 week ago',
    subscription: 'pro',
  },
  // Add more mock users...
])

// Computed
const filteredUsers = computed(() => {
  return users.value.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesStatus = filters.status === 'all' || user.status === filters.status
    const matchesRole = filters.role === 'all' || user.role === filters.role
    const matchesSubscription =
      filters.subscription === 'all' || user.subscription === filters.subscription

    return matchesSearch && matchesStatus && matchesRole && matchesSubscription
  })
})

const totalPages = computed(() => Math.ceil(filteredUsers.value.length / pageSize.value))

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredUsers.value.slice(start, start + pageSize.value)
})

const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, start + 4)

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

// Methods
const getRoleClass = (role: string) => {
  const roleClasses = {
    admin: 'bg-danger-100 text-danger-800',
    editor: 'bg-warning-100 text-warning-800',
    viewer: 'bg-secondary-100 text-secondary-800',
  }
  return roleClasses[role] || roleClasses.viewer
}

const getStatusClass = (status: string) => {
  const statusClasses = {
    active: 'bg-success-100 text-success-800',
    inactive: 'bg-secondary-100 text-secondary-800',
    suspended: 'bg-danger-100 text-danger-800',
  }
  return statusClasses[status] || statusClasses.inactive
}

const getStatusDotClass = (status: string) => {
  const dotClasses = {
    active: 'bg-success-400',
    inactive: 'bg-secondary-400',
    suspended: 'bg-danger-400',
  }
  return dotClasses[status] || dotClasses.inactive
}

const getSubscriptionClass = (subscription: string) => {
  const subscriptionClasses = {
    free: 'bg-secondary-100 text-secondary-800',
    pro: 'bg-blue-100 text-blue-800',
    enterprise: 'bg-purple-100 text-purple-800',
  }
  return subscriptionClasses[subscription] || subscriptionClasses.free
}

const resetFilters = () => {
  filters.status = 'all'
  filters.role = 'all'
  filters.subscription = 'all'
  searchQuery.value = ''
}

const toggleSelectAll = () => {
  if (selectedUsers.value.length === filteredUsers.value.length) {
    selectedUsers.value = []
  } else {
    selectedUsers.value = filteredUsers.value.map((user) => user.id)
  }
}

const bulkAction = (action: string) => {
  console.log(`Performing ${action} on users:`, selectedUsers.value)
  // Implement bulk actions
  selectedUsers.value = []
}

const viewUser = (user: any) => {
  router.push(`/users/${user.id}`)
}

const editUser = (user: any) => {
  console.log('Editing user:', user)
  // Implement edit user functionality
}

const suspendUser = (user: any) => {
  user.status = user.status === 'suspended' ? 'active' : 'suspended'
}

const exportUsers = () => {
  console.log('Exporting users...')
  // Implement export functionality
}

const closeInviteModal = () => {
  showInviteModal.value = false
  inviteForm.emails = ''
  inviteForm.role = ''
  inviteForm.message = ''
}

const sendInvites = () => {
  console.log('Sending invites:', inviteForm)
  // Implement invite functionality
  closeInviteModal()
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
