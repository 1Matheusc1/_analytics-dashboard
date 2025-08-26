<template>
  <div class="p-4 sm:p-6 max-w-7xl mx-auto">
    <!-- Page Header -->
    <div class="mb-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold text-secondary-900 mb-2">Page Analytics</h1>
          <p class="text-secondary-600">Analyze individual page performance and user engagement.</p>
        </div>
        <div class="mt-4 sm:mt-0 flex space-x-3">
          <button @click="exportPageData" class="btn-outline">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z"
              />
            </svg>
            Export Data
          </button>
        </div>
      </div>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <div v-for="stat in pageSummary" :key="stat.title" class="card">
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
                <span class="text-secondary-500 text-xs ml-1">from last period</span>
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

    <!-- Filters -->
    <div class="card mb-6">
      <div class="card-content">
        <div class="flex flex-col lg:flex-row gap-4">
          <div class="flex-1">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search pages by URL or title..."
              class="input w-full"
            />
          </div>
          <div class="flex flex-wrap gap-2">
            <select v-model="filters.sortBy" class="select">
              <option value="views">Page Views</option>
              <option value="users">Unique Users</option>
              <option value="bounce">Bounce Rate</option>
              <option value="time">Avg. Time</option>
            </select>
            <select v-model="filters.order" class="select">
              <option value="desc">Highest to Lowest</option>
              <option value="asc">Lowest to Highest</option>
            </select>
            <select v-model="filters.category" class="select">
              <option value="all">All Categories</option>
              <option value="landing">Landing Pages</option>
              <option value="product">Product Pages</option>
              <option value="blog">Blog Posts</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Pages Table -->
    <div class="card">
      <div class="card-header">
        <h2 class="text-lg font-semibold text-secondary-900">
          Page Performance ({{ filteredPages.length }} pages)
        </h2>
      </div>
      <div class="card-content !p-0">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-secondary-200">
            <thead class="bg-secondary-50">
              <tr>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider"
                >
                  Page
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider"
                >
                  Page Views
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider"
                >
                  Unique Users
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider"
                >
                  Avg. Time
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider"
                >
                  Bounce Rate
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider"
                >
                  Performance
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
                v-for="page in paginatedPages"
                :key="page.id"
                class="hover:bg-secondary-50 transition-colors"
              >
                <td class="px-6 py-4">
                  <div>
                    <div class="text-sm font-medium text-secondary-900 truncate max-w-xs">
                      {{ page.title }}
                    </div>
                    <div class="text-sm text-secondary-500 truncate max-w-xs">
                      {{ page.path }}
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-secondary-900">
                  {{ page.views.toLocaleString() }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-secondary-900">
                  {{ page.users.toLocaleString() }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-secondary-900">
                  {{ page.avgTime }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <span class="text-sm text-secondary-900">{{ page.bounceRate }}%</span>
                    <div class="ml-2 w-16 bg-secondary-200 rounded-full h-2">
                      <div
                        class="h-2 rounded-full"
                        :class="
                          page.bounceRate > 70
                            ? 'bg-danger-500'
                            : page.bounceRate > 40
                              ? 'bg-warning-500'
                              : 'bg-success-500'
                        "
                        :style="{ width: `${Math.min(page.bounceRate, 100)}%` }"
                      ></div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div
                      :class="getPerformanceColor(page.performance)"
                      class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                    >
                      {{ page.performance }}
                    </div>
                    <span class="ml-2 text-sm text-secondary-600">
                      {{ getPerformanceLabel(page.performance) }}
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex space-x-2">
                    <button
                      @click="viewPageDetails(page)"
                      class="text-primary-600 hover:text-primary-900"
                    >
                      View
                    </button>
                    <button
                      @click="analyzePage(page)"
                      class="text-secondary-600 hover:text-secondary-900"
                    >
                      Analyze
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
            {{ Math.min(currentPage * pageSize, filteredPages.length) }} of
            {{ filteredPages.length }} pages
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
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// State
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(10)

const filters = reactive({
  sortBy: 'views',
  order: 'desc',
  category: 'all',
})

// Mock data
const pageSummary = ref([
  {
    title: 'Total Pages',
    value: '247',
    change: 5.2,
    trend: 'up',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    iconPath:
      'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  },
  {
    title: 'Top Performing',
    value: '32',
    change: 8.1,
    trend: 'up',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    iconPath: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
  },
  {
    title: 'Needs Attention',
    value: '12',
    change: -15.3,
    trend: 'down',
    iconBg: 'bg-warning-100',
    iconColor: 'text-warning-600',
    iconPath:
      'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z',
  },
  {
    title: 'Avg. Load Time',
    value: '1.2s',
    change: 12.5,
    trend: 'up',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    iconPath: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
  },
])

const pages = ref([
  {
    id: '1',
    title: 'Homepage',
    path: '/',
    views: 25420,
    users: 18500,
    avgTime: '3m 45s',
    bounceRate: 28,
    performance: 94,
    category: 'landing',
  },
  {
    id: '2',
    title: 'Product Catalog',
    path: '/products',
    views: 18750,
    users: 12800,
    avgTime: '5m 12s',
    bounceRate: 35,
    performance: 87,
    category: 'product',
  },
  {
    id: '3',
    title: 'About Us',
    path: '/about',
    views: 8420,
    users: 6200,
    avgTime: '2m 30s',
    bounceRate: 55,
    performance: 92,
    category: 'other',
  },
  {
    id: '4',
    title: 'Contact Page',
    path: '/contact',
    views: 5680,
    users: 4100,
    avgTime: '1m 45s',
    bounceRate: 72,
    performance: 89,
    category: 'other',
  },
  {
    id: '5',
    title: 'Blog - Getting Started',
    path: '/blog/getting-started',
    views: 12300,
    users: 9800,
    avgTime: '6m 20s',
    bounceRate: 42,
    performance: 91,
    category: 'blog',
  },
])

// Computed
const filteredPages = computed(() => {
  let filtered = pages.value.filter((page) => {
    const matchesSearch =
      page.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      page.path.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesCategory = filters.category === 'all' || page.category === filters.category

    return matchesSearch && matchesCategory
  })

  // Sort
  filtered.sort((a, b) => {
    let aVal, bVal
    switch (filters.sortBy) {
      case 'views':
        aVal = a.views
        bVal = b.views
        break
      case 'users':
        aVal = a.users
        bVal = b.users
        break
      case 'bounce':
        aVal = a.bounceRate
        bVal = b.bounceRate
        break
      case 'time':
        aVal = parseInt(a.avgTime)
        bVal = parseInt(b.avgTime)
        break
      default:
        aVal = a.views
        bVal = b.views
    }

    return filters.order === 'desc' ? bVal - aVal : aVal - bVal
  })

  return filtered
})

const totalPages = computed(() => Math.ceil(filteredPages.value.length / pageSize.value))

const paginatedPages = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredPages.value.slice(start, start + pageSize.value)
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
const getPerformanceColor = (score: number) => {
  if (score >= 90) return 'bg-success-500'
  if (score >= 70) return 'bg-warning-500'
  return 'bg-danger-500'
}

const getPerformanceLabel = (score: number) => {
  if (score >= 90) return 'Excellent'
  if (score >= 70) return 'Good'
  return 'Needs Work'
}

const viewPageDetails = (page: any) => {
  router.push(`/pages/${encodeURIComponent(page.path.substring(1) || 'home')}`)
}

const analyzePage = (page: any) => {
  console.log('Analyzing page:', page.title)
  // Implement page analysis
}

const exportPageData = () => {
  console.log('Exporting page data...')
  // Implement export functionality
}
</script>
