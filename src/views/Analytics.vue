<template>
  <div class="p-4 sm:p-6 max-w-7xl mx-auto">
    <!-- Page Header -->
    <div class="mb-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold text-secondary-900 mb-2">Advanced Analytics</h1>
          <p class="text-secondary-600">
            Deep dive into your data with advanced metrics and insights.
          </p>
        </div>
        <div class="mt-4 sm:mt-0 flex space-x-3">
          <button @click="exportAnalytics" class="btn-outline">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z"
              />
            </svg>
            Export
          </button>
          <button @click="openCustomReport" class="btn-primary">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            Custom Report
          </button>
        </div>
      </div>
    </div>

    <!-- Advanced Filters -->
    <div class="card mb-6">
      <div class="card-header">
        <h2 class="text-lg font-semibold text-secondary-900">Advanced Filters</h2>
      </div>
      <div class="card-content">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-secondary-700 mb-2">Date Range</label>
            <div class="relative">
              <input v-model="filters.startDate" type="date" class="input w-full" />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-secondary-700 mb-2">End Date</label>
            <input v-model="filters.endDate" type="date" class="input w-full" />
          </div>
          <div>
            <label class="block text-sm font-medium text-secondary-700 mb-2">Traffic Source</label>
            <select v-model="filters.trafficSource" class="select w-full">
              <option value="all">All Sources</option>
              <option value="organic">Organic Search</option>
              <option value="paid">Paid Search</option>
              <option value="social">Social Media</option>
              <option value="direct">Direct Traffic</option>
              <option value="referral">Referral</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-secondary-700 mb-2">Device Type</label>
            <select v-model="filters.deviceType" class="select w-full">
              <option value="all">All Devices</option>
              <option value="desktop">Desktop</option>
              <option value="mobile">Mobile</option>
              <option value="tablet">Tablet</option>
            </select>
          </div>
        </div>
        <div class="mt-4 flex justify-end">
          <button @click="applyFilters" class="btn-primary">Apply Filters</button>
        </div>
      </div>
    </div>

    <!-- Tab Navigation -->
    <div class="mb-6">
      <nav class="flex space-x-1 bg-secondary-100 p-1 rounded-lg">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="
            activeTab === tab.id
              ? 'bg-white text-secondary-900 shadow-sm'
              : 'text-secondary-600 hover:text-secondary-900'
          "
          class="px-3 py-2 text-sm font-medium rounded-md transition-all duration-200"
        >
          {{ tab.name }}
        </button>
      </nav>
    </div>

    <!-- Tab Content -->
    <div v-if="activeTab === 'overview'" class="space-y-6">
      <!-- KPI Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="kpi in kpis" :key="kpi.name" class="card">
          <div class="card-content">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-secondary-600">{{ kpi.name }}</p>
                <p class="text-2xl font-bold text-secondary-900 mt-1">{{ kpi.value }}</p>
                <div class="flex items-center mt-2">
                  <span
                    :class="kpi.change >= 0 ? 'text-success-600' : 'text-danger-600'"
                    class="text-sm font-medium"
                  >
                    {{ kpi.change >= 0 ? '+' : '' }}{{ kpi.change }}%
                  </span>
                  <span class="text-secondary-500 text-xs ml-1">vs last period</span>
                </div>
              </div>
              <div
                :class="kpi.iconBg"
                class="w-12 h-12 rounded-xl flex items-center justify-center"
              >
                <svg
                  class="w-6 h-6"
                  :class="kpi.iconColor"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    :d="kpi.iconPath"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Traffic Trends"
          chart-type="line"
          :data="trafficData.data"
          :labels="trafficData.labels"
          :animation-delay="100"
        />

        <ChartCard
          title="Conversion Funnel"
          chart-type="bar"
          :data="conversionData.data"
          :labels="conversionData.labels"
          :animation-delay="200"
        />
      </div>
    </div>

    <div v-if="activeTab === 'audience'" class="space-y-6">
      <!-- Audience Demographics -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ChartCard
          title="Age Distribution"
          chart-type="pie"
          :data="audienceData.age.data"
          :labels="audienceData.age.labels"
          :colors="['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']"
          :show-legend="true"
        />

        <ChartCard
          title="Gender Split"
          chart-type="doughnut"
          :data="audienceData.gender.data"
          :labels="audienceData.gender.labels"
          :colors="['#06b6d4', '#ec4899']"
          :show-legend="true"
        />

        <ChartCard
          title="Geographic Distribution"
          chart-type="bar"
          :data="audienceData.location.data"
          :labels="audienceData.location.labels"
        />
      </div>

      <!-- User Behavior Table -->
      <div class="card">
        <div class="card-header">
          <h3 class="text-lg font-semibold text-secondary-900">User Behavior Insights</h3>
        </div>
        <div class="card-content">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-secondary-200">
              <thead class="bg-secondary-50">
                <tr>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider"
                  >
                    Metric
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider"
                  >
                    Desktop
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider"
                  >
                    Mobile
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider"
                  >
                    Tablet
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-secondary-200">
                <tr v-for="row in behaviorData" :key="row.metric">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-secondary-900">
                    {{ row.metric }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">
                    {{ row.desktop }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">
                    {{ row.mobile }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">
                    {{ row.tablet }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <div v-if="activeTab === 'performance'" class="space-y-6">
      <!-- Performance Metrics -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="metric in performanceMetrics" :key="metric.name" class="card">
          <div class="card-content text-center">
            <div class="text-3xl font-bold mb-2" :class="getPerformanceColor(metric.score)">
              {{ metric.score }}
            </div>
            <h3 class="text-sm font-medium text-secondary-900">{{ metric.name }}</h3>
            <p class="text-xs text-secondary-500 mt-1">{{ metric.description }}</p>
          </div>
        </div>
      </div>

      <!-- Performance Charts -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Page Load Times"
          chart-type="line"
          :data="performanceData.loadTimes.data"
          :labels="performanceData.loadTimes.labels"
        />

        <ChartCard
          title="Core Web Vitals"
          chart-type="bar"
          :data="performanceData.webVitals.data"
          :labels="performanceData.webVitals.labels"
        />
      </div>
    </div>
  </div>

  <!-- Custom Report Modal -->
  <transition name="modal">
    <div
      v-if="showCustomReportModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-secondary-200">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-semibold text-secondary-900">Create Custom Report</h2>
            <button @click="closeCustomReport" class="text-secondary-400 hover:text-secondary-600">
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
          <form @submit.prevent="createCustomReport">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-secondary-700 mb-2">Report Name</label>
                <input
                  v-model="customReport.name"
                  type="text"
                  class="input w-full"
                  placeholder="Enter report name"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-secondary-700 mb-2">Metrics</label>
                <div class="grid grid-cols-2 gap-2">
                  <label
                    v-for="metric in availableMetrics"
                    :key="metric.id"
                    class="flex items-center"
                  >
                    <input
                      v-model="customReport.metrics"
                      :value="metric.id"
                      type="checkbox"
                      class="mr-2"
                    />
                    <span class="text-sm">{{ metric.name }}</span>
                  </label>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-secondary-700 mb-2">Time Period</label>
                <select v-model="customReport.timePeriod" class="select w-full">
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                  <option value="1y">Last year</option>
                </select>
              </div>
            </div>

            <div class="mt-6 flex justify-end space-x-3">
              <button type="button" @click="closeCustomReport" class="btn-secondary">Cancel</button>
              <button type="submit" class="btn-primary">Generate Report</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import ChartCard from '@/components/ChartCard.vue'

const router = useRouter()

// State
const activeTab = ref('overview')
const showCustomReportModal = ref(false)

const filters = reactive({
  startDate: '',
  endDate: '',
  trafficSource: 'all',
  deviceType: 'all',
})

const customReport = reactive({
  name: '',
  metrics: [],
  timePeriod: '30d',
})

// Data
const tabs = [
  { id: 'overview', name: 'Overview' },
  { id: 'audience', name: 'Audience' },
  { id: 'acquisition', name: 'Acquisition' },
  { id: 'behavior', name: 'Behavior' },
  { id: 'performance', name: 'Performance' },
]

const kpis = ref([
  {
    name: 'Page Views',
    value: '2.4M',
    change: 15.3,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    iconPath: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z',
  },
  {
    name: 'Unique Visitors',
    value: '847K',
    change: 8.1,
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    iconPath:
      'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z',
  },
  {
    name: 'Bounce Rate',
    value: '24.3%',
    change: -3.2,
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-600',
    iconPath: 'M13 10V3L4 14h7v7l9-11h-7z',
  },
  {
    name: 'Avg. Session Duration',
    value: '3m 45s',
    change: 12.7,
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    iconPath: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
  },
])

const trafficData = ref({
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  data: [12000, 15000, 18000, 22000, 25000, 28000],
})

const conversionData = ref({
  labels: ['Visitors', 'Leads', 'Prospects', 'Customers'],
  data: [10000, 3000, 1500, 500],
})

const audienceData = ref({
  age: {
    labels: ['18-24', '25-34', '35-44', '45-54', '55+'],
    data: [20, 35, 25, 15, 5],
  },
  gender: {
    labels: ['Male', 'Female'],
    data: [52, 48],
  },
  location: {
    labels: ['Brazil', 'USA', 'Canada', 'UK', 'Germany'],
    data: [45, 25, 12, 10, 8],
  },
})

const behaviorData = ref([
  { metric: 'Avg. Session Duration', desktop: '4m 32s', mobile: '2m 15s', tablet: '3m 8s' },
  { metric: 'Pages per Session', desktop: '3.2', mobile: '2.1', tablet: '2.8' },
  { metric: 'Bounce Rate', desktop: '22%', mobile: '35%', tablet: '28%' },
  { metric: 'Goal Conversion Rate', desktop: '4.2%', mobile: '2.8%', tablet: '3.5%' },
])

const performanceMetrics = ref([
  { name: 'Performance Score', score: 94, description: 'Overall site speed' },
  { name: 'Accessibility', score: 88, description: 'Site accessibility' },
  { name: 'Best Practices', score: 92, description: 'Development standards' },
  { name: 'SEO', score: 96, description: 'Search optimization' },
])

const performanceData = ref({
  loadTimes: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    data: [2.1, 1.8, 1.9, 1.6, 1.4, 1.3],
  },
  webVitals: {
    labels: ['LCP', 'FID', 'CLS', 'FCP', 'TTFB'],
    data: [1.2, 50, 0.08, 0.9, 180],
  },
})

const availableMetrics = ref([
  { id: 'pageviews', name: 'Page Views' },
  { id: 'users', name: 'Users' },
  { id: 'sessions', name: 'Sessions' },
  { id: 'bounceRate', name: 'Bounce Rate' },
  { id: 'conversion', name: 'Conversion Rate' },
  { id: 'revenue', name: 'Revenue' },
])

// Methods
const applyFilters = () => {
  console.log('Applying filters:', filters)
  // Apply filters logic here
}

const exportAnalytics = () => {
  console.log('Exporting analytics data...')
  // Export logic here
}

const openCustomReport = () => {
  showCustomReportModal.value = true
}

const closeCustomReport = () => {
  showCustomReportModal.value = false
  customReport.name = ''
  customReport.metrics = []
  customReport.timePeriod = '30d'
}

const createCustomReport = () => {
  console.log('Creating custom report:', customReport)
  // Create report logic here
  closeCustomReport()
  router.push('/reports')
}

const getPerformanceColor = (score: number) => {
  if (score >= 90) return 'text-success-600'
  if (score >= 70) return 'text-warning-600'
  return 'text-danger-600'
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
