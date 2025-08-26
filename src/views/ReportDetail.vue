<template>
  <div class="p-4 sm:p-6 max-w-7xl mx-auto">
    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center min-h-96">
      <div class="text-center">
        <div
          class="animate-spin w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full mx-auto mb-4"
        ></div>
        <p class="text-secondary-600">Loading report...</p>
      </div>
    </div>

    <!-- Report Content -->
    <div v-else-if="report" class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div class="flex items-center space-x-4 mb-4 lg:mb-0">
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
            <h1 class="text-2xl sm:text-3xl font-bold text-secondary-900">{{ report.name }}</h1>
            <p class="text-secondary-600 mt-1">{{ report.description }}</p>
          </div>
        </div>

        <div class="flex space-x-3">
          <button @click="shareReport" class="btn-outline">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
              />
            </svg>
            Share
          </button>
          <button @click="downloadReport" class="btn-outline">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z"
              />
            </svg>
            Download
          </button>
          <button @click="editReport" class="btn-primary">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            Edit
          </button>
        </div>
      </div>

      <!-- Report Meta -->
      <div class="card">
        <div class="card-content">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p class="text-sm text-secondary-600">Created</p>
              <p class="font-medium text-secondary-900">{{ report.createdAt }}</p>
            </div>
            <div>
              <p class="text-sm text-secondary-600">Author</p>
              <p class="font-medium text-secondary-900">{{ report.author }}</p>
            </div>
            <div>
              <p class="text-sm text-secondary-600">Status</p>
              <span
                :class="getStatusClass(report.status)"
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
              >
                {{ report.status }}
              </span>
            </div>
            <div>
              <p class="text-sm text-secondary-600">Last Updated</p>
              <p class="font-medium text-secondary-900">{{ report.updatedAt }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Report Content -->
      <div class="space-y-6">
        <!-- Executive Summary -->
        <div class="card">
          <div class="card-header">
            <h2 class="text-lg font-semibold text-secondary-900">Executive Summary</h2>
          </div>
          <div class="card-content">
            <div class="prose max-w-none">
              <p class="text-secondary-700 leading-relaxed">
                {{ report.summary }}
              </p>
            </div>
          </div>
        </div>

        <!-- Key Metrics -->
        <div class="card">
          <div class="card-header">
            <h2 class="text-lg font-semibold text-secondary-900">Key Metrics</h2>
          </div>
          <div class="card-content">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div v-for="metric in report.keyMetrics" :key="metric.name" class="text-center">
                <div class="text-3xl font-bold text-secondary-900 mb-1">{{ metric.value }}</div>
                <div class="text-sm text-secondary-600 mb-2">{{ metric.name }}</div>
                <div class="flex items-center justify-center">
                  <span
                    :class="metric.change >= 0 ? 'text-success-600' : 'text-danger-600'"
                    class="text-sm font-medium"
                  >
                    {{ metric.change >= 0 ? '+' : '' }}{{ metric.change }}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Charts -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard
            v-for="chart in report.charts"
            :key="chart.id"
            :title="chart.title"
            :chart-type="chart.type"
            :data="chart.data"
            :labels="chart.labels"
            :colors="chart.colors"
          />
        </div>

        <!-- Insights -->
        <div class="card">
          <div class="card-header">
            <h2 class="text-lg font-semibold text-secondary-900">Key Insights</h2>
          </div>
          <div class="card-content">
            <div class="space-y-4">
              <div
                v-for="insight in report.insights"
                :key="insight.id"
                class="flex items-start space-x-3"
              >
                <div
                  :class="getInsightIconBg(insight.type)"
                  class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                >
                  <svg
                    class="w-4 h-4"
                    :class="getInsightIconColor(insight.type)"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      :d="getInsightIconPath(insight.type)"
                    />
                  </svg>
                </div>
                <div class="flex-1">
                  <h3 class="font-medium text-secondary-900">{{ insight.title }}</h3>
                  <p class="text-sm text-secondary-600 mt-1">{{ insight.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recommendations -->
        <div class="card">
          <div class="card-header">
            <h2 class="text-lg font-semibold text-secondary-900">Recommendations</h2>
          </div>
          <div class="card-content">
            <div class="space-y-4">
              <div
                v-for="(recommendation, index) in report.recommendations"
                :key="index"
                class="flex items-start space-x-3"
              >
                <div
                  class="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold"
                >
                  {{ index + 1 }}
                </div>
                <div class="flex-1">
                  <h3 class="font-medium text-secondary-900">{{ recommendation.title }}</h3>
                  <p class="text-sm text-secondary-600 mt-1">{{ recommendation.description }}</p>
                  <div class="mt-2 flex items-center text-xs text-secondary-500">
                    <span>Priority: {{ recommendation.priority }}</span>
                    <span class="mx-2">•</span>
                    <span>Effort: {{ recommendation.effort }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Report Actions -->
        <div class="card">
          <div class="card-header">
            <h2 class="text-lg font-semibold text-secondary-900">Actions</h2>
          </div>
          <div class="card-content">
            <div class="flex flex-wrap gap-3">
              <button @click="scheduleReport" class="btn-outline">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Schedule Recurring
              </button>
              <button @click="duplicateReport" class="btn-outline">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2M8 12h8a2 2 0 012 2v8a2 2 0 01-2 2h-8a2 2 0 01-2-2v-8a2 2 0 012-2z"
                  />
                </svg>
                Duplicate
              </button>
              <button @click="exportToPdf" class="btn-outline">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                  />
                </svg>
                Export to PDF
              </button>
              <button @click="shareViaMail" class="btn-primary">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                Email Report
              </button>
            </div>
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
      <h2 class="text-xl font-semibold text-secondary-900 mb-2">Report Not Found</h2>
      <p class="text-secondary-600">
        The report you're looking for doesn't exist or has been deleted.
      </p>
      <button @click="$router.push('/reports')" class="btn-primary mt-4">Back to Reports</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ChartCard from '@/components/ChartCard.vue'

const route = useRoute()
const router = useRouter()

// State
const isLoading = ref(true)
const report = ref<any>(null)

// Mock report data
const mockReport = {
  id: '1',
  name: 'Monthly Analytics Report - January 2024',
  description:
    'Comprehensive analysis of website traffic, user behavior, and conversion metrics for January 2024.',
  status: 'completed',
  author: 'Marcos Silva',
  createdAt: 'January 15, 2024',
  updatedAt: '2 hours ago',
  summary:
    'January 2024 showed significant growth across all key metrics. Website traffic increased by 23% compared to December, with particular strength in organic search (+34%) and social media (+28%). User engagement improved notably, with average session duration increasing to 4 minutes 32 seconds and bounce rate decreasing to 28%. Conversion rates reached an all-time high of 3.8%, driven by improved landing page performance and streamlined checkout process.',
  keyMetrics: [
    { name: 'Page Views', value: '2.4M', change: 23 },
    { name: 'Users', value: '847K', change: 18 },
    { name: 'Conversion Rate', value: '3.8%', change: 12 },
    { name: 'Revenue', value: '$125K', change: 34 },
  ],
  charts: [
    {
      id: 'traffic',
      title: 'Traffic Trends',
      type: 'line',
      data: [65000, 72000, 68000, 78000, 82000, 89000, 95000],
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7'],
    },
    {
      id: 'sources',
      title: 'Traffic Sources',
      type: 'pie',
      data: [40, 25, 20, 15],
      labels: ['Organic', 'Direct', 'Social', 'Paid'],
      colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'],
    },
  ],
  insights: [
    {
      id: '1',
      type: 'success',
      title: 'Strong Organic Growth',
      description:
        'Organic search traffic increased by 34%, indicating improved SEO performance and content relevance.',
    },
    {
      id: '2',
      type: 'warning',
      title: 'Mobile Bounce Rate',
      description:
        'Mobile users show a higher bounce rate (35%) compared to desktop (22%), requiring mobile optimization.',
    },
    {
      id: '3',
      type: 'info',
      title: 'Peak Traffic Hours',
      description:
        'Traffic peaks between 2-4 PM, suggesting optimal timing for content publishing and campaigns.',
    },
  ],
  recommendations: [
    {
      title: 'Optimize Mobile Experience',
      description:
        'Focus on improving mobile page load speed and user interface to reduce bounce rate.',
      priority: 'High',
      effort: 'Medium',
    },
    {
      title: 'Expand Content Marketing',
      description:
        'Increase content production to capitalize on strong organic search performance.',
      priority: 'Medium',
      effort: 'High',
    },
    {
      title: 'A/B Test Landing Pages',
      description: 'Test different landing page variations to further improve conversion rates.',
      priority: 'Medium',
      effort: 'Low',
    },
  ],
}

// Methods
const loadReport = async () => {
  isLoading.value = true
  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    report.value = mockReport
  } catch (error) {
    console.error('Failed to load report:', error)
  } finally {
    isLoading.value = false
  }
}

const getStatusClass = (status: string) => {
  const statusClasses: Record<string, string> = {
    completed: 'bg-success-100 text-success-800',
    processing: 'bg-warning-100 text-warning-800',
    draft: 'bg-secondary-100 text-secondary-800',
    failed: 'bg-danger-100 text-danger-800',
  }
  return statusClasses[status] || statusClasses.draft
}

const getInsightIconBg = (type: string) => {
  const iconBgs: Record<string, string> = {
    success: 'bg-success-100',
    warning: 'bg-warning-100',
    info: 'bg-blue-100',
    error: 'bg-danger-100',
  }
  return iconBgs[type] || iconBgs.info
}

const getInsightIconColor = (type: string) => {
  const iconColors: Record<string, string> = {
    success: 'text-success-600',
    warning: 'text-warning-600',
    info: 'text-blue-600',
    error: 'text-danger-600',
  }
  return iconColors[type] || iconColors.info
}

const getInsightIconPath = (type: string) => {
  const iconPaths: Record<string, string> = {
    success:
      'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z',
    warning:
      'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z',
    info: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    error: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
  }
  return iconPaths[type] || iconPaths.info
}

const shareReport = () => {
  console.log('Sharing report...')
}

const downloadReport = () => {
  console.log('Downloading report...')
}

const editReport = () => {
  console.log('Editing report...')
}

const scheduleReport = () => {
  console.log('Scheduling report...')
}

const duplicateReport = () => {
  console.log('Duplicating report...')
}

const exportToPdf = () => {
  console.log('Exporting to PDF...')
}

const shareViaMail = () => {
  console.log('Sharing via email...')
}

// Lifecycle
onMounted(() => {
  loadReport()
})
</script>
