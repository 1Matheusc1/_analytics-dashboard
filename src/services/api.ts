import type {
  DashboardStats,
  TopPage,
  RecentActivity,
  DashboardFilters,
  ApiResponse,
} from '@/types'

// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return {
        data,
        success: true,
      }
    } catch (error) {
      console.error('API request failed:', error)
      return {
        data: null as any,
        success: false,
        message: error instanceof Error ? error.message : 'An error occurred',
      }
    }
  }

  // Dashboard Stats
  async getDashboardStats(filters?: DashboardFilters): Promise<ApiResponse<DashboardStats[]>> {
    const params = filters ? new URLSearchParams(filters as any).toString() : ''
    return this.request<DashboardStats[]>(`/dashboard/stats?${params}`)
  }

  // Chart Data
  async getRevenueData(
    filters?: DashboardFilters,
  ): Promise<ApiResponse<{ labels: string[]; data: number[] }>> {
    const params = filters ? new URLSearchParams(filters as any).toString() : ''
    return this.request(`/dashboard/revenue?${params}`)
  }

  async getUserActivityData(
    filters?: DashboardFilters,
  ): Promise<ApiResponse<{ labels: string[]; data: number[] }>> {
    const params = filters ? new URLSearchParams(filters as any).toString() : ''
    return this.request(`/dashboard/activity?${params}`)
  }

  async getCategoryData(
    filters?: DashboardFilters,
  ): Promise<ApiResponse<{ labels: string[]; data: number[]; colors: string[] }>> {
    const params = filters ? new URLSearchParams(filters as any).toString() : ''
    return this.request(`/dashboard/categories?${params}`)
  }

  // Top Pages
  async getTopPages(filters?: DashboardFilters): Promise<ApiResponse<TopPage[]>> {
    const params = filters ? new URLSearchParams(filters as any).toString() : ''
    return this.request<TopPage[]>(`/dashboard/top-pages?${params}`)
  }

  // Recent Activities
  async getRecentActivities(limit: number = 10): Promise<ApiResponse<RecentActivity[]>> {
    return this.request<RecentActivity[]>(`/dashboard/activities?limit=${limit}`)
  }

  // Export Data
  async exportDashboardData(format: 'json' | 'csv' | 'pdf' = 'json'): Promise<ApiResponse<Blob>> {
    const response = await fetch(`${API_BASE_URL}/dashboard/export?format=${format}`, {
      method: 'GET',
      headers: {
        Accept:
          format === 'json'
            ? 'application/json'
            : format === 'csv'
              ? 'text/csv'
              : 'application/pdf',
      },
    })

    if (!response.ok) {
      return {
        data: null as any,
        success: false,
        message: `Export failed: ${response.status}`,
      }
    }

    const blob = await response.blob()
    return {
      data: blob,
      success: true,
    }
  }

  // Real-time updates (WebSocket connection)
  connectToUpdates(onUpdate: (data: any) => void): WebSocket | null {
    try {
      const wsUrl = API_BASE_URL.replace(/^http/, 'ws') + '/dashboard/live'
      const ws = new WebSocket(wsUrl)

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data)
        onUpdate(data)
      }

      ws.onerror = (error) => {
        console.error('WebSocket error:', error)
      }

      return ws
    } catch (error) {
      console.error('Failed to connect to WebSocket:', error)
      return null
    }
  }
}

// Singleton instance
export const apiService = new ApiService()

// Mock data service (for development)
export class MockApiService {
  private delay(ms: number = 500) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  async getDashboardStats(): Promise<ApiResponse<DashboardStats[]>> {
    await this.delay()
    return {
      data: [
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
      ],
      success: true,
    }
  }

  async getRevenueData(): Promise<ApiResponse<{ labels: string[]; data: number[] }>> {
    await this.delay()
    return {
      data: {
        labels: [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ],
        data: [
          65000, 72000, 68000, 78000, 82000, 89000, 95000, 92000, 98000, 105000, 112000, 108000,
        ],
      },
      success: true,
    }
  }
}

// Use mock service in development
export const dashboardApi =
  import.meta.env.MODE === 'development' ? new MockApiService() : apiService
