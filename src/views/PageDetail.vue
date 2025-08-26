<template>
  <div class="p-4 sm:p-6 max-w-7xl mx-auto">
    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center min-h-96">
      <div class="text-center">
        <div
          class="animate-spin w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full mx-auto mb-4"
        ></div>
        <p class="text-secondary-600">Loading page analytics...</p>
      </div>
    </div>

    <!-- Page Analytics -->
    <div v-else-if="pageData" class="space-y-6">
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
          <div>
            <h1 class="text-2xl font-bold text-secondary-900">{{ pageData.title }}</h1>
            <p class="text-secondary-600">{{ pageData.path }}</p>
          </div>
        </div>

        <div class="flex space-x-3">
          <a :href="pageData.fullUrl" target="_blank" class="btn-outline">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
            Visit Page
          </a>
          <button @click="exportPageAnalytics" class="btn-primary">
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

      <!-- Key Metrics -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="metric in pageData.metrics" :key="metric.name" class="card">
          <div class="card-content">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-secondary-600">{{ metric.name }}</p>
                <p class="text-2xl font-bold text-secondary-900 mt-1">{{ metric.value }}</p>
                <div class="flex items-center mt-2">
                  <span
                    :class="metric.trend === 'up' ? 'text-success-600' : 'text-danger-600'"
                    class="text-sm font-medium"
                  >
                    {{ metric.change }}%
                  </span>
                  <span class="text-secondary-500 text-xs ml-1">vs last period</span>
                </div>
              </div>
              <div
                :class="metric.iconBg"
                class="w-12 h-12 rounded-xl flex items-center justify-center"
              >
                <svg
                  class="w-6 h-6"
                  :class="metric.iconColor"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    :d="metric.iconPath"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Page Views Over Time"
          chart-type="line"
          :data="pageData.chartData.views.data"
          :labels="pageData.chartData.views.labels"
        />

        <ChartCard
          title="Traffic Sources"
          chart-type="pie"
          :data="pageData.chartData.sources.data"
          :labels="pageData.chartData.sources.labels"
          :colors="pageData.chartData.sources.colors"
          :show-legend="true"
        />
      </div>

      <!-- Performance Details -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Page Performance -->
        <div class="card">
          <div class="card-header">
            <h2 class="text-lg font-semibold text-secondary-900">Performance Metrics</h2>
          </div>
          <div class="card-content">
            <div class="space-y-4">
              <div
                v-for="perf in pageData.performance"
                :key="perf.name"
                class="flex items-center justify-between"
              >
                <div>
                  <p class="text-sm font-medium text-secondary-900">{{ perf.name }}</p>
                  <p class="text-xs text-secondary-500">{{ perf.description }}</p>
                </div>
                <div class="flex items-center space-x-2">
                  <span class="text-sm font-bold text-secondary-900">{{ perf.value }}</span>
                  <div
                    :class="getPerformanceColor(perf.score)"
                    class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  >
                    {{ perf.score }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- User Behavior -->
        <div class="card">
          <div class="card-header">
            <h2 class="text-lg font-semibold text-secondary-900">User Behavior</h2>
          </div>
          <div class="card-content">
            <div class="space-y-4">
              <div
                v-for="behavior in pageData.userBehavior"
                :key="behavior.metric"
                class="flex items-center justify-between"
              >
                <div>
                  <p class="text-sm font-medium text-secondary-900">{{ behavior.metric }}</p>
                  <p class="text-xs text-secondary-500">{{ behavior.description }}</p>
                </div>
                <div class="text-right">
                  <p class="text-sm font-bold text-secondary-900">{{ behavior.value }}</p>
                  <div class="w-24 bg-secondary-200 rounded-full h-2 mt-1">
                    <div
                      class="h-2 rounded-full bg-primary-500"
                      :style="{ width: `${behavior.percentage}%` }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Content Analysis -->
      <div class="card">
        <div class="card-header">
          <h2 class="text-lg font-semibold text-secondary-900">Content Analysis</h2>
        </div>
        <div class="card-content">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Top Keywords -->
            <div>
              <h3 class="text-md font-medium text-secondary-900 mb-3">Top Keywords</h3>
              <div class="space-y-2">
                <div
                  v-for="keyword in pageData.topKeywords"
                  :key="keyword.word"
                  class="flex items-center justify-between"
                >
                  <span class="text-sm text-secondary-700">{{ keyword.word }}</span>
                  <div class="flex items-center space-x-2">
                    <div class="w-12 bg-secondary-200 rounded-full h-1">
                      <div
                        class="h-1 rounded-full bg-primary-500"
                        :style="{ width: `${keyword.frequency}%` }"
                      ></div>
                    </div>
                    <span class="text-xs text-secondary-500">{{ keyword.count }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Content Stats -->
            <div>
              <h3 class="text-md font-medium text-secondary-900 mb-3">Content Statistics</h3>
              <div class="space-y-2">
                <div
                  v-for="stat in pageData.contentStats"
                  :key="stat.label"
                  class="flex justify-between"
                >
                  <span class="text-sm text-secondary-600">{{ stat.label }}</span>
                  <span class="text-sm font-medium text-secondary-900">{{ stat.value }}</span>
                </div>
              </div>
            </div>

            <!-- Recommendations -->
            <div>
              <h3 class="text-md font-medium text-secondary-900 mb-3">Recommendations</h3>
              <div class="space-y-2">
                <div
                  v-for="rec in pageData.recommendations"
                  :key="rec.id"
                  class="p-2 rounded-lg bg-secondary-50"
                >
                  <p class="text-sm font-medium text-secondary-900">{{ rec.title }}</p>
                  <p class="text-xs text-secondary-600">{{ rec.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Historical Data -->
      <div class="card">
        <div class="card-header">
          <h2 class="text-lg font-semibold text-secondary-900">Historical Performance</h2>
        </div>
        <div class="card-content">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-secondary-200">
              <thead class="bg-secondary-50">
                <tr>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider"
                  >
                    Period
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider"
                  >
                    Page Views
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider"
                  >
                    Unique Visitors
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
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-secondary-200">
                <tr v-for="period in pageData.historicalData" :key="period.period">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-secondary-900">
                    {{ period.period }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">
                    {{ period.pageViews.toLocaleString() }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">
                    {{ period.uniqueVisitors.toLocaleString() }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">
                    {{ period.avgTime }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">
                    {{ period.bounceRate }}%
                  </td>
                </tr>
              </tbody>
            </table>
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
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
      <h2 class="text-xl font-semibold text-secondary-900 mb-2">Page Not Found</h2>
      <p class="text-secondary-600">The page analytics you're looking for doesn't exist.</p>
      <button @click="$router.push('/pages')" class="btn-primary mt-4">Back to Pages</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import ChartCard from '@/components/ChartCard.vue'

const route = useRoute()

// State
const isLoading = ref(true)
const pageData = ref<any>(null)

// Mock page data
const mockPageData = {
  title: 'Homepage',
  path: '/',
  fullUrl: 'https://example.com/',
  metrics: [
    {
      name: 'Page Views',
      value: '25,420',
      change: 12.5,
      trend: 'up',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      iconPath: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z',
    },
    {
      name: 'Unique Visitors',
      value: '18,500',
      change: 8.2,
      trend: 'up',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      iconPath:
        'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z',
    },
    {
      name: 'Avg. Session Time',
      value: '3m 45s',
      change: 15.3,
      trend: 'up',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      iconPath: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
    },
    {
      name: 'Bounce Rate',
      value: '28%',
      change: -5.2,
      trend: 'down',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
      iconPath: 'M13 10V3L4 14h7v7l9-11h-7z',
    },
  ],
  chartData: {
    views: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      data: [3200, 3800, 3500, 4100, 4600, 2800, 2200],
    },
    sources: {
      labels: ['Organic Search', 'Direct', 'Social Media', 'Referral'],
      data: [45, 30, 15, 10],
      colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'],
    },
  },
  performance: [
    {
      name: 'Core Web Vitals',
      description: 'Overall performance score',
      value: '92/100',
      score: 92,
    },
    {
      name: 'Page Load Speed',
      description: 'First Contentful Paint',
      value: '1.2s',
      score: 89,
    },
    {
      name: 'SEO Score',
      description: 'Search engine optimization',
      value: '96/100',
      score: 96,
    },
    {
      name: 'Accessibility',
      description: 'Web accessibility compliance',
      value: '88/100',
      score: 88,
    },
  ],
  userBehavior: [
    {
      metric: 'Click-through Rate',
      description: 'Percentage of users who click on links',
      value: '3.2%',
      percentage: 32,
    },
    {
      metric: 'Scroll Depth',
      description: 'How far users scroll down the page',
      value: '68%',
      percentage: 68,
    },
    {
      metric: 'Form Completion',
      description: 'Users who complete forms on this page',
      value: '12%',
      percentage: 12,
    },
    {
      metric: 'Return Visitors',
      description: 'Users who return to this page',
      value: '42%',
      percentage: 42,
    },
  ],
  topKeywords: [
    { word: 'analytics', count: 45, frequency: 100 },
    { word: 'dashboard', count: 32, frequency: 71 },
    { word: 'data', count: 28, frequency: 62 },
    { word: 'metrics', count: 21, frequency: 47 },
    { word: 'reporting', count: 18, frequency: 40 },
  ],
  contentStats: [
    { label: 'Word Count', value: '1,247' },
    { label: 'Reading Time', value: '5 min' },
    { label: 'Images', value: '8' },
    { label: 'Links', value: '23' },
    { label: 'Headings', value: '12' },
  ],
  recommendations: [
    {
      id: 1,
      title: 'Optimize Images',
      description: 'Compress images to improve load speed',
    },
    {
      id: 2,
      title: 'Add Meta Description',
      description: 'Include compelling meta description for SEO',
    },
    {
      id: 3,
      title: 'Improve CTA',
      description: 'Make call-to-action buttons more prominent',
    },
  ],
  historicalData: [
    {
      period: 'This Week',
      pageViews: 25420,
      uniqueVisitors: 18500,
      avgTime: '3m 45s',
      bounceRate: 28,
    },
    {
      period: 'Last Week',
      pageViews: 22800,
      uniqueVisitors: 17200,
      avgTime: '3m 20s',
      bounceRate: 32,
    },
    {
      period: 'This Month',
      pageViews: 98500,
      uniqueVisitors: 72300,
      avgTime: '3m 35s',
      bounceRate: 30,
    },
    {
      period: 'Last Month',
      pageViews: 87600,
      uniqueVisitors: 66800,
      avgTime: '3m 15s',
      bounceRate: 35,
    },
  ],
}

// Methods
const loadPageData = async () => {
  isLoading.value = true
  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    pageData.value = mockPageData
  } catch (error) {
    console.error('Failed to load page data:', error)
  } finally {
    isLoading.value = false
  }
}

const getPerformanceColor = (score: number) => {
  if (score >= 90) return 'bg-success-500'
  if (score >= 70) return 'bg-warning-500'
  return 'bg-danger-500'
}

const exportPageAnalytics = () => {
  console.log('Exporting page analytics...')
}

// Lifecycle
onMounted(() => {
  loadPageData()
})
</script>
