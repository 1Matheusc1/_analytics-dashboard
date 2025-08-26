<template>
  <div class="p-4 sm:p-6 max-w-7xl mx-auto">
    <!-- Page Header -->
    <div class="mb-6">
      <h1 class="text-2xl sm:text-3xl font-bold text-secondary-900 mb-2">Dashboard Overview</h1>
      <p class="text-secondary-600">Welcome back! Here's what's happening with your analytics.</p>
    </div>

    <!-- Quick Actions -->
    <div class="mb-6 flex flex-wrap gap-3">
      <button
        @click="dashboard.exportData"
        :disabled="dashboard.isLoading.value"
        class="btn-outline"
      >
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

      <button
        @click="dashboard.refreshData"
        :disabled="dashboard.isLoading.value"
        class="btn-secondary"
      >
        <svg
          class="w-4 h-4 mr-2"
          :class="{ 'animate-spin': dashboard.isLoading.value }"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
        Refresh Data
      </button>

      <router-link to="/reports" class="btn-primary">
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
        Create Report
      </router-link>
    </div>

    <!-- Filters Section -->
    <DashboardFilters
      v-model:filters="dashboard.filters"
      :is-loading="dashboard.isLoading.value"
      @apply-filters="dashboard.applyFilters"
    />

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 mb-6">
      <StatsCard
        v-for="(stat, index) in dashboard.stats.value"
        :key="stat.title"
        :title="stat.title"
        :value="stat.value"
        :change="stat.change"
        :trend="stat.trend"
        :icon-bg="stat.iconBg"
        :icon-color="stat.iconColor"
        :icon-path="stat.iconPath"
        :animation-delay="index * 100"
        class="cursor-pointer hover-lift"
        @click="navigateToDetails(stat.title)"
      />
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
      <!-- Revenue Chart -->
      <ChartCard
        title="Revenue Overview"
        :chart-type="revenueChartType"
        :data="dashboard.chartData.value.revenue.data"
        :labels="dashboard.chartData.value.revenue.labels"
        :is-loading="dashboard.isLoading.value"
        :error="dashboard.error.value"
        :animation-delay="200"
        :show-type-toggle="true"
        :chart-types="[
          { value: 'line', label: 'Line' },
          { value: 'bar', label: 'Bar' },
        ]"
        :current-type="revenueChartType"
        @chart-type-change="revenueChartType = $event"
        @retry="dashboard.refreshData"
      >
        <template #actions>
          <router-link to="/analytics" class="btn-outline !text-xs !px-2 !py-1">
            View Details
          </router-link>
        </template>
      </ChartCard>

      <!-- User Activity Chart -->
      <ChartCard
        title="User Activity"
        chart-type="bar"
        :data="dashboard.chartData.value.activity.data"
        :labels="dashboard.chartData.value.activity.labels"
        :is-loading="dashboard.isLoading.value"
        :error="dashboard.error.value"
        :animation-delay="300"
        @retry="dashboard.refreshData"
      >
        <template #actions>
          <router-link to="/users" class="btn-outline !text-xs !px-2 !py-1">
            Manage Users
          </router-link>
        </template>
      </ChartCard>
    </div>

    <!-- Additional Content -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Category Distribution -->
      <ChartCard
        title="Category Distribution"
        chart-type="pie"
        :data="dashboard.chartData.value.category.data"
        :labels="dashboard.chartData.value.category.labels"
        :colors="dashboard.chartData.value.category.colors"
        :is-loading="dashboard.isLoading.value"
        :error="dashboard.error.value"
        :animation-delay="400"
        :show-legend="true"
        :legend-items="categoryLegendItems"
        @retry="dashboard.refreshData"
      />

      <!-- Top Metrics -->
      <TopPagesList
        :pages="dashboard.topPages.value"
        :is-loading="dashboard.isLoading.value"
        :error="dashboard.error.value"
        :animation-delay="500"
        @page-click="navigateToPageDetail"
        @view-all="$router.push('/pages')"
        @retry="dashboard.refreshData"
      />

      <!-- Recent Activity -->
      <RecentActivitiesList
        :activities="dashboard.recentActivities.value"
        :is-loading="dashboard.isLoading.value"
        :error="dashboard.error.value"
        :animation-delay="600"
        :auto-refresh="true"
        :auto-refresh-interval="30"
        @activity-click="navigateToActivityDetail"
        @view-all="$router.push('/activities')"
        @refresh="refreshActivities"
        @retry="dashboard.refreshData"
      />
    </div>

    <!-- Recent Reports -->
    <div class="mt-8">
      <div class="card">
        <div class="card-header">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-secondary-900">Recent Reports</h3>
            <router-link to="/reports" class="btn-outline !text-sm"> View All Reports </router-link>
          </div>
        </div>
        <div class="card-content">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              v-for="report in recentReports"
              :key="report.id"
              class="p-4 border border-secondary-200 rounded-lg hover:border-primary-300 hover:shadow-sm transition-all cursor-pointer"
              @click="$router.push(`/reports/${report.id}`)"
            >
              <div class="flex items-center justify-between mb-2">
                <h4 class="font-medium text-secondary-900">{{ report.name }}</h4>
                <span class="text-xs px-2 py-1 bg-success-100 text-success-800 rounded-full">
                  {{ report.status }}
                </span>
              </div>
              <p class="text-sm text-secondary-600 mb-2">{{ report.description }}</p>
              <p class="text-xs text-secondary-500">{{ report.createdAt }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useDashboard } from '@/composables/useDashboard'
import DashboardFilters from '@/components/DashboardFilters.vue'
import StatsCard from '@/components/StatsCard.vue'
import ChartCard from '@/components/ChartCard.vue'
import TopPagesList from '@/components/TopPagesList.vue'
import RecentActivitiesList from '@/components/RecentActivitiesList.vue'
import type { TopPage, RecentActivity, ChartType } from '@/types'

const router = useRouter()
const dashboard = useDashboard()

// State
const revenueChartType = ref<ChartType>('line')

// Mock recent reports data
const recentReports = ref([
  {
    id: '1',
    name: 'Monthly Sales Report',
    description: 'Comprehensive sales analysis for October 2024',
    status: 'Complete',
    createdAt: '2 hours ago',
  },
  {
    id: '2',
    name: 'User Engagement Analysis',
    description: 'Detailed user behavior and engagement metrics',
    status: 'Processing',
    createdAt: '1 day ago',
  },
  {
    id: '3',
    name: 'Performance Dashboard',
    description: 'Website performance and optimization insights',
    status: 'Complete',
    createdAt: '3 days ago',
  },
])

// Computed
const categoryLegendItems = computed(() =>
  dashboard.chartData.value.category.labels.map((label, index) => ({
    label,
    color: dashboard.chartData.value.category.colors[index],
  })),
)

// Methods
const navigateToDetails = (statTitle: string) => {
  switch (statTitle) {
    case 'Total Revenue':
      router.push('/analytics?tab=revenue')
      break
    case 'Active Users':
      router.push('/users')
      break
    case 'Conversion Rate':
      router.push('/analytics?tab=conversion')
      break
    case 'Avg. Session':
      router.push('/analytics?tab=sessions')
      break
    default:
      router.push('/analytics')
  }
}

const navigateToPageDetail = (page: TopPage) => {
  router.push(`/pages/${encodeURIComponent(page.path.substring(1))}`)
}

const navigateToActivityDetail = (activity: RecentActivity) => {
  router.push(`/activities?filter=${activity.id}`)
}

const refreshActivities = () => {
  dashboard.refreshData()
}

// Initial data load
dashboard.refreshData()
</script>
