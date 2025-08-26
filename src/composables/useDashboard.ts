import { ref, computed, reactive } from 'vue'
import type { DashboardStats, TopPage, RecentActivity, DashboardFilters } from '@/types'

export const useDashboard = () => {
  // Reactive state
  const filters = reactive<DashboardFilters>({
    dateRange: '30d',
    userType: 'all',
    category: 'all',
  })

  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Mock data - replace with API calls
  const stats = ref<DashboardStats[]>([
    {
      title: 'Total Revenue',
      value: '$342,650',
      change: 12.5,
      trend: 'up',
      iconBg: 'bg-success-100',
      iconColor: 'text-success-600',
      iconPath:
        'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1',
    },
    {
      title: 'Active Users',
      value: '24,893',
      change: 8.2,
      trend: 'up',
      iconBg: 'bg-primary-100',
      iconColor: 'text-primary-600',
      iconPath:
        'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z',
    },
    {
      title: 'Conversion Rate',
      value: '3.24%',
      change: -2.1,
      trend: 'down',
      iconBg: 'bg-warning-100',
      iconColor: 'text-warning-600',
      iconPath:
        'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
    },
    {
      title: 'Avg. Session',
      value: '4m 32s',
      change: 15.3,
      trend: 'up',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      iconPath: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
    },
  ])

  const topPages = ref<TopPage[]>([
    { path: '/dashboard', title: 'Main Dashboard', views: 15420 },
    { path: '/products', title: 'Product Catalog', views: 12350 },
    { path: '/analytics', title: 'Analytics Overview', views: 9870 },
    { path: '/settings', title: 'User Settings', views: 7650 },
    { path: '/reports', title: 'Reports Center', views: 5430 },
  ])

  const recentActivities = ref<RecentActivity[]>([
    {
      id: 1,
      action: 'New user registration',
      time: '2 minutes ago',
      iconBg: 'bg-success-100',
      iconColor: 'text-success-600',
      iconPath:
        'M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z',
    },
    {
      id: 2,
      action: 'Purchase completed',
      time: '5 minutes ago',
      iconBg: 'bg-primary-100',
      iconColor: 'text-primary-600',
      iconPath: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z',
    },
    {
      id: 3,
      action: 'Support ticket created',
      time: '12 minutes ago',
      iconBg: 'bg-warning-100',
      iconColor: 'text-warning-600',
      iconPath:
        'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    },
  ])

  // Computed properties
  const filteredStats = computed(() => {
    // Apply filters logic here when connected to real API
    return stats.value
  })

  const chartData = computed(() => ({
    revenue: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      data: [65000, 72000, 68000, 78000, 82000, 89000, 95000, 92000, 98000, 105000, 112000, 108000],
    },
    activity: {
      labels: [
        '12AM',
        '2AM',
        '4AM',
        '6AM',
        '8AM',
        '10AM',
        '12PM',
        '2PM',
        '4PM',
        '6PM',
        '8PM',
        '10PM',
      ],
      data: [1200, 1900, 3000, 5000, 2000, 3000, 4500, 3200, 2800, 4100, 3600, 2900],
    },
    category: {
      labels: ['Sales', 'Marketing', 'Support', 'Product', 'Other'],
      data: [35, 25, 20, 15, 5],
      colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
    },
  }))

  // Methods
  const applyFilters = async () => {
    isLoading.value = true
    error.value = null

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Here you would make actual API calls with filters
      console.log('Applying filters:', filters)

      // Update data based on filters
      // This is where you'd call your API service
    } catch (err) {
      error.value = 'Failed to apply filters'
      console.error(err)
    } finally {
      isLoading.value = false
    }
  }

  const refreshData = async () => {
    isLoading.value = true
    error.value = null

    try {
      // Simulate API call to refresh all data
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Refresh all dashboard data
      console.log('Refreshing dashboard data')
    } catch (err) {
      error.value = 'Failed to refresh data'
      console.error(err)
    } finally {
      isLoading.value = false
    }
  }

  const exportData = () => {
    // Export functionality
    console.log('Exporting dashboard data')

    const dataToExport = {
      stats: stats.value,
      topPages: topPages.value,
      recentActivities: recentActivities.value,
      filters: filters,
      exportDate: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
      type: 'application/json',
    })

    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `dashboard-export-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return {
    // State
    filters,
    isLoading,
    error,
    stats: filteredStats,
    topPages,
    recentActivities,
    chartData,

    // Methods
    applyFilters,
    refreshData,
    exportData,
  }
}
