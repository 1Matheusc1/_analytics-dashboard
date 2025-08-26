// Dashboard Stats
export interface DashboardStats {
  title: string
  value: string
  change: number
  trend: 'up' | 'down'
  iconBg: string
  iconColor: string
  iconPath: string
}

// Page Analytics
export interface TopPage {
  path: string
  title: string
  views: number
}

export interface PageDetail {
  id: string
  title: string
  path: string
  views: number
  users: number
  avgTime: string
  bounceRate: number
  performance: number
  category: string
}

// User Management
export interface User {
  id: string
  name: string
  email: string
  avatar: string
  role: 'admin' | 'editor' | 'viewer'
  status: 'active' | 'inactive' | 'suspended'
  lastActive: string
  subscription: 'free' | 'pro' | 'enterprise'
  department?: string
  joinedAt?: string
}

export interface UserDetail extends User {
  stats: UserStat[]
  recentActivity: UserActivity[]
}

export interface UserStat {
  label: string
  value: string
}

export interface UserActivity {
  id: string
  type: 'login' | 'create' | 'update' | 'delete' | 'export'
  action: string
  description: string
  timestamp: string
}

// Activity Log
export interface RecentActivity {
  id: number
  action: string
  time: string
  iconBg: string
  iconColor: string
  iconPath: string
  user?: string
  target?: string
  details?: string
  metadata?: Record<string, any>
  technical?: Record<string, any>
  status?: 'success' | 'warning' | 'error' | 'info'
  date?: string
}

// Reports
export interface Report {
  id: string
  name: string
  description: string
  type: 'analytics' | 'sales' | 'marketing' | 'performance'
  status: 'draft' | 'scheduled' | 'processing' | 'completed' | 'failed'
  format: 'pdf' | 'excel' | 'csv' | 'powerpoint'
  createdAt: string
  updatedAt: string
  author: string
  creator: {
    name: string
    avatar: string
  }
}

export interface ReportDetail extends Report {
  summary: string
  keyMetrics: ReportMetric[]
  charts: ReportChart[]
  insights: ReportInsight[]
  recommendations: ReportRecommendation[]
}

export interface ReportMetric {
  name: string
  value: string
  change: number
}

export interface ReportChart {
  id: string
  title: string
  type: ChartType
  data: number[]
  labels: string[]
  colors?: string[]
}

export interface ReportInsight {
  id: string
  type: 'success' | 'warning' | 'info' | 'error'
  title: string
  description: string
}

export interface ReportRecommendation {
  title: string
  description: string
  priority: 'High' | 'Medium' | 'Low'
  effort: 'High' | 'Medium' | 'Low'
}

export interface ReportTemplate {
  id: string
  name: string
  description: string
  iconBg: string
  iconColor: string
  iconPath: string
  tags: string[]
}

export interface ScheduledReport {
  id: string
  name: string
  frequency: string
  nextRun: string
  recipients: string
  active: boolean
}

// Dashboard Filters
export interface DashboardFilters {
  dateRange: '7d' | '30d' | '90d' | '1y' | 'custom'
  userType: 'all' | 'new' | 'returning' | 'premium'
  category: 'all' | 'sales' | 'marketing' | 'support' | 'product'
}

// Charts
export interface ChartData {
  labels: string[]
  datasets: ChartDataset[]
}

export interface ChartDataset {
  label: string
  data: number[]
  backgroundColor?: string | string[]
  borderColor?: string
  borderWidth?: number
}

export type ChartType = 'line' | 'bar' | 'pie' | 'doughnut'

// Settings
export interface GeneralSettings {
  organizationName: string
  websiteUrl: string
  description: string
  timezone: string
  language: string
}

export interface AnalyticsSettings {
  enableTracking: boolean
  anonymousTracking: boolean
  realTimeData: boolean
  dataRetention: string
  autoCleanup: string
  googleAnalyticsId: string
  facebookPixelId: string
}

export interface NotificationSettings {
  reportFrequency: string
  alertThreshold: string
}

export interface EmailNotification {
  id: string
  title: string
  description: string
  enabled: boolean
}

export interface SecuritySettings {
  twoFactorEnabled: boolean
}

export interface UserSession {
  id: string
  device: string
  location: string
  lastActive: string
  current: boolean
  iconBg: string
  iconColor: string
  iconPath: string
}

// Profile
export interface UserProfile {
  name: string
  email: string
  avatar: string
  role: string
  stats: {
    reportsCreated: number
    lastLogin: string
  }
}

export interface PersonalInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
  department: string
  bio: string
}

export interface UserPreferences {
  language: string
  timezone: string
  darkMode: boolean
  autoRefresh: boolean
  defaultChartType: ChartType
}

// Navigation & Router
export interface NavigationRoute {
  name: string
  path: string
  meta?: {
    title?: string
    icon?: string
    description?: string
    showInSidebar?: boolean
  }
}

// API
export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
}

// Page Analytics
export interface PageAnalytics {
  title: string
  path: string
  fullUrl: string
  metrics: PageMetric[]
  chartData: {
    views: { labels: string[]; data: number[] }
    sources: { labels: string[]; data: number[]; colors: string[] }
  }
  performance: PerformanceMetric[]
  userBehavior: BehaviorMetric[]
  topKeywords: Keyword[]
  contentStats: ContentStat[]
  recommendations: PageRecommendation[]
  historicalData: HistoricalPeriod[]
}

export interface PageMetric {
  name: string
  value: string
  change: number
  trend: 'up' | 'down'
  iconBg: string
  iconColor: string
  iconPath: string
}

export interface PerformanceMetric {
  name: string
  description: string
  value: string
  score: number
}

export interface BehaviorMetric {
  metric: string
  description: string
  value: string
  percentage: number
}

export interface Keyword {
  word: string
  count: number
  frequency: number
}

export interface ContentStat {
  label: string
  value: string
}

export interface PageRecommendation {
  id: number
  title: string
  description: string
}

export interface HistoricalPeriod {
  period: string
  pageViews: number
  uniqueVisitors: number
  avgTime: string
  bounceRate: number
}

// Form Types
export interface InviteForm {
  emails: string
  role: string
  message: string
}

export interface PasswordForm {
  current: string
  new: string
  confirm: string
}

export interface CustomReportForm {
  name: string
  metrics: string[]
  timePeriod: string
}

// Utilities
export interface PaginationInfo {
  currentPage: number
  pageSize: number
  totalItems: number
  totalPages: number
}

export interface SortOptions {
  sortBy: string
  order: 'asc' | 'desc'
}

export interface FilterOptions {
  [key: string]: string | boolean | number
}

// Error Handling
export interface AppError {
  code: string
  message: string
  details?: any
}

// Notification System
export interface NotificationItem {
  id: string
  type: 'success' | 'warning' | 'error' | 'info'
  title: string
  message: string
  timestamp: Date
  read: boolean
  actions?: NotificationAction[]
}

export interface NotificationAction {
  label: string
  action: () => void
  primary?: boolean
}

// Search & Filter
export interface SearchResult {
  id: string
  type: 'page' | 'user' | 'report' | 'activity'
  title: string
  description: string
  url: string
  relevance: number
}

// Export & Import
export interface ExportOptions {
  format: 'json' | 'csv' | 'pdf' | 'excel'
  dateRange?: {
    start: Date
    end: Date
  }
  includeCharts?: boolean
  includeRawData?: boolean
}

export interface ImportResult {
  success: boolean
  importedRecords: number
  errors: ImportError[]
}

export interface ImportError {
  row: number
  field: string
  message: string
}
