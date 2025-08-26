<template>
  <div class="p-4 sm:p-6 max-w-7xl mx-auto">
    <!-- Page Header -->
    <div class="mb-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold text-secondary-900 mb-2">Reports</h1>
          <p class="text-secondary-600">Generate, manage, and schedule your analytics reports.</p>
        </div>
        <div class="mt-4 sm:mt-0 flex space-x-3">
          <button @click="showTemplateModal = true" class="btn-outline">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Use Template
          </button>
          <button @click="showCreateModal = true" class="btn-primary">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Create Report
          </button>
        </div>
      </div>
    </div>

    <!-- Filter Bar -->
    <div class="mb-6 flex flex-col sm:flex-row gap-4">
      <div class="flex-1">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search reports..."
          class="input w-full"
        />
      </div>
      <select v-model="statusFilter" class="select">
        <option value="all">All Status</option>
        <option value="draft">Draft</option>
        <option value="scheduled">Scheduled</option>
        <option value="processing">Processing</option>
        <option value="completed">Completed</option>
        <option value="failed">Failed</option>
      </select>
      <select v-model="typeFilter" class="select">
        <option value="all">All Types</option>
        <option value="analytics">Analytics</option>
        <option value="sales">Sales</option>
        <option value="marketing">Marketing</option>
        <option value="performance">Performance</option>
      </select>
    </div>

    <!-- Reports Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <div
        v-for="report in filteredReports"
        :key="report.id"
        class="card hover:shadow-medium transition-all duration-200 cursor-pointer"
        @click="viewReport(report)"
      >
        <div class="card-content">
          <div class="flex items-start justify-between mb-3">
            <div class="flex-1">
              <h3 class="font-semibold text-secondary-900 mb-1">{{ report.name }}</h3>
              <p class="text-sm text-secondary-600 line-clamp-2">{{ report.description }}</p>
            </div>
            <div class="ml-3 flex-shrink-0">
              <span
                :class="getStatusClass(report.status)"
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
              >
                {{ report.status }}
              </span>
            </div>
          </div>

          <div class="flex items-center justify-between text-sm text-secondary-500 mb-3">
            <span>{{ report.type }}</span>
            <span>{{ report.createdAt }}</span>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <img
                :src="report.creator.avatar"
                :alt="report.creator.name"
                class="w-6 h-6 rounded-full"
              />
              <span class="text-sm text-secondary-600">{{ report.creator.name }}</span>
            </div>

            <div class="flex space-x-1">
              <button
                @click.stop="downloadReport(report)"
                :disabled="report.status !== 'completed'"
                class="p-1 rounded hover:bg-secondary-100 transition-colors"
                :class="{ 'opacity-50 cursor-not-allowed': report.status !== 'completed' }"
              >
                <svg
                  class="w-4 h-4 text-secondary-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                  />
                </svg>
              </button>
              <button
                @click.stop="duplicateReport(report)"
                class="p-1 rounded hover:bg-secondary-100 transition-colors"
              >
                <svg
                  class="w-4 h-4 text-secondary-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2M8 12h8a2 2 0 012 2v8a2 2 0 01-2 2h-8a2 2 0 01-2-2v-8a2 2 0 012-2z"
                  />
                </svg>
              </button>
              <button
                @click.stop="deleteReport(report)"
                class="p-1 rounded hover:bg-danger-100 transition-colors text-danger-600"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Scheduled Reports Section -->
    <div class="card">
      <div class="card-header">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold text-secondary-900">Scheduled Reports</h2>
          <button @click="showScheduleModal = true" class="btn-outline !text-sm">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Schedule Report
          </button>
        </div>
      </div>
      <div class="card-content">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-secondary-200">
            <thead class="bg-secondary-50">
              <tr>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider"
                >
                  Report Name
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider"
                >
                  Frequency
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider"
                >
                  Next Run
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider"
                >
                  Recipients
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-secondary-200">
              <tr v-for="schedule in scheduledReports" :key="schedule.id">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-secondary-900">
                  {{ schedule.name }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">
                  {{ schedule.frequency }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">
                  {{ schedule.nextRun }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">
                  {{ schedule.recipients }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="
                      schedule.active
                        ? 'bg-success-100 text-success-800'
                        : 'bg-secondary-100 text-secondary-800'
                    "
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  >
                    {{ schedule.active ? 'Active' : 'Paused' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    @click="toggleSchedule(schedule)"
                    class="text-primary-600 hover:text-primary-900 mr-3"
                  >
                    {{ schedule.active ? 'Pause' : 'Resume' }}
                  </button>
                  <button
                    @click="editSchedule(schedule)"
                    class="text-secondary-600 hover:text-secondary-900 mr-3"
                  >
                    Edit
                  </button>
                  <button
                    @click="deleteSchedule(schedule)"
                    class="text-danger-600 hover:text-danger-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>

  <!-- Create Report Modal -->
  <transition name="modal">
    <div
      v-if="showCreateModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-secondary-200">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-semibold text-secondary-900">Create New Report</h2>
            <button @click="closeCreateModal" class="text-secondary-400 hover:text-secondary-600">
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
          <form @submit.prevent="createReport">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-secondary-700 mb-2">Report Name</label>
                <input
                  v-model="newReport.name"
                  type="text"
                  class="input w-full"
                  placeholder="Enter report name"
                  required
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-secondary-700 mb-2">Description</label>
                <textarea
                  v-model="newReport.description"
                  class="input w-full h-20"
                  placeholder="Describe your report..."
                ></textarea>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-secondary-700 mb-2"
                    >Report Type</label
                  >
                  <select v-model="newReport.type" class="select w-full" required>
                    <option value="">Select type</option>
                    <option value="analytics">Analytics</option>
                    <option value="sales">Sales</option>
                    <option value="marketing">Marketing</option>
                    <option value="performance">Performance</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-secondary-700 mb-2">Format</label>
                  <select v-model="newReport.format" class="select w-full" required>
                    <option value="">Select format</option>
                    <option value="pdf">PDF</option>
                    <option value="excel">Excel</option>
                    <option value="csv">CSV</option>
                    <option value="powerpoint">PowerPoint</option>
                  </select>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-secondary-700 mb-2">Date Range</label>
                <div class="grid grid-cols-2 gap-4">
                  <input v-model="newReport.startDate" type="date" class="input" required />
                  <input v-model="newReport.endDate" type="date" class="input" required />
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-secondary-700 mb-2"
                  >Include Metrics</label
                >
                <div class="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                  <label
                    v-for="metric in availableMetrics"
                    :key="metric.id"
                    class="flex items-center"
                  >
                    <input
                      v-model="newReport.metrics"
                      :value="metric.id"
                      type="checkbox"
                      class="mr-2"
                    />
                    <span class="text-sm">{{ metric.name }}</span>
                  </label>
                </div>
              </div>
            </div>

            <div class="mt-6 flex justify-end space-x-3">
              <button type="button" @click="closeCreateModal" class="btn-secondary">Cancel</button>
              <button type="submit" class="btn-primary">Create Report</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </transition>

  <!-- Template Modal -->
  <transition name="modal">
    <div
      v-if="showTemplateModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-xl shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-secondary-200">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-semibold text-secondary-900">Choose Report Template</h2>
            <button
              @click="showTemplateModal = false"
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
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div
              v-for="template in reportTemplates"
              :key="template.id"
              class="border border-secondary-200 rounded-lg p-4 hover:border-primary-300 hover:shadow-sm transition-all cursor-pointer"
              @click="useTemplate(template)"
            >
              <div class="flex items-start">
                <div
                  :class="template.iconBg"
                  class="w-12 h-12 rounded-lg flex items-center justify-center mr-4"
                >
                  <svg
                    class="w-6 h-6"
                    :class="template.iconColor"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      :d="template.iconPath"
                    />
                  </svg>
                </div>
                <div class="flex-1">
                  <h3 class="font-semibold text-secondary-900 mb-1">{{ template.name }}</h3>
                  <p class="text-sm text-secondary-600 mb-2">{{ template.description }}</p>
                  <div class="flex flex-wrap gap-1">
                    <span
                      v-for="tag in template.tags"
                      :key="tag"
                      class="text-xs px-2 py-1 bg-secondary-100 text-secondary-600 rounded"
                    >
                      {{ tag }}
                    </span>
                  </div>
                </div>
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
import { useRouter } from 'vue-router'

const router = useRouter()

// State
const showCreateModal = ref(false)
const showTemplateModal = ref(false)
const showScheduleModal = ref(false)
const searchQuery = ref('')
const statusFilter = ref('all')
const typeFilter = ref('all')

const newReport = reactive({
  name: '',
  description: '',
  type: '',
  format: '',
  startDate: '',
  endDate: '',
  metrics: [],
})

// Mock data
const reports = ref([
  {
    id: '1',
    name: 'Monthly Analytics Report',
    description:
      'Comprehensive monthly analytics with traffic, conversions, and user behavior insights.',
    type: 'analytics',
    status: 'completed',
    createdAt: '2 hours ago',
    creator: {
      name: 'Marcos',
      avatar: 'https://ui-avatars.com/api/?name=Marcos&background=3b82f6&color=fff',
    },
  },
  {
    id: '2',
    name: 'Sales Performance Q4',
    description: 'Quarterly sales performance analysis with revenue breakdowns and forecasting.',
    type: 'sales',
    status: 'processing',
    createdAt: '1 day ago',
    creator: {
      name: 'Ana Silva',
      avatar: 'https://ui-avatars.com/api/?name=Ana+Silva&background=10b981&color=fff',
    },
  },
  {
    id: '3',
    name: 'Campaign ROI Analysis',
    description: 'Marketing campaign return on investment analysis across all channels.',
    type: 'marketing',
    status: 'scheduled',
    createdAt: '3 days ago',
    creator: {
      name: 'João Santos',
      avatar: 'https://ui-avatars.com/api/?name=João+Santos&background=f59e0b&color=fff',
    },
  },
])

const scheduledReports = ref([
  {
    id: '1',
    name: 'Weekly Traffic Summary',
    frequency: 'Weekly',
    nextRun: 'Mon, 10:00 AM',
    recipients: 'team@company.com',
    active: true,
  },
  {
    id: '2',
    name: 'Monthly Revenue Report',
    frequency: 'Monthly',
    nextRun: '1st of month',
    recipients: 'executives@company.com',
    active: true,
  },
])

const reportTemplates = ref([
  {
    id: '1',
    name: 'Executive Summary',
    description: 'High-level overview perfect for stakeholders and executives.',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    iconPath:
      'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z',
    tags: ['KPIs', 'Summary', 'Executive'],
  },
  {
    id: '2',
    name: 'Traffic Analysis',
    description: 'Detailed website traffic analysis with source breakdowns.',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    iconPath: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
    tags: ['Traffic', 'Analytics', 'Sources'],
  },
  {
    id: '3',
    name: 'Conversion Funnel',
    description: 'Step-by-step conversion analysis and optimization insights.',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    iconPath:
      'M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z',
    tags: ['Conversion', 'Funnel', 'Optimization'],
  },
  {
    id: '4',
    name: 'Revenue Dashboard',
    description: 'Financial performance with revenue streams and forecasting.',
    iconBg: 'bg-yellow-100',
    iconColor: 'text-yellow-600',
    iconPath:
      'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1',
    tags: ['Revenue', 'Financial', 'Forecast'],
  },
])

const availableMetrics = ref([
  { id: 'pageviews', name: 'Page Views' },
  { id: 'users', name: 'Users' },
  { id: 'sessions', name: 'Sessions' },
  { id: 'bounceRate', name: 'Bounce Rate' },
  { id: 'conversion', name: 'Conversion Rate' },
  { id: 'revenue', name: 'Revenue' },
  { id: 'traffic', name: 'Traffic Sources' },
  { id: 'devices', name: 'Device Types' },
  { id: 'location', name: 'Geographic Data' },
  { id: 'performance', name: 'Page Performance' },
])

// Computed
const filteredReports = computed(() => {
  return reports.value.filter((report) => {
    const matchesSearch =
      report.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      report.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesStatus = statusFilter.value === 'all' || report.status === statusFilter.value
    const matchesType = typeFilter.value === 'all' || report.type === typeFilter.value

    return matchesSearch && matchesStatus && matchesType
  })
})

// Methods
const getStatusClass = (status: string) => {
  const statusClasses = {
    draft: 'bg-secondary-100 text-secondary-800',
    scheduled: 'bg-blue-100 text-blue-800',
    processing: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-success-100 text-success-800',
    failed: 'bg-danger-100 text-danger-800',
  }
  return statusClasses[status] || statusClasses.draft
}

const viewReport = (report: any) => {
  router.push(`/reports/${report.id}`)
}

const downloadReport = (report: any) => {
  console.log('Downloading report:', report.name)
  // Download logic here
}

const duplicateReport = (report: any) => {
  console.log('Duplicating report:', report.name)
  // Duplicate logic here
}

const deleteReport = (report: any) => {
  if (confirm('Are you sure you want to delete this report?')) {
    const index = reports.value.findIndex((r) => r.id === report.id)
    if (index > -1) {
      reports.value.splice(index, 1)
    }
  }
}

const closeCreateModal = () => {
  showCreateModal.value = false
  Object.assign(newReport, {
    name: '',
    description: '',
    type: '',
    format: '',
    startDate: '',
    endDate: '',
    metrics: [],
  })
}

const createReport = () => {
  console.log('Creating report:', newReport)
  // Create report logic here
  closeCreateModal()
}

const useTemplate = (template: any) => {
  console.log('Using template:', template.name)
  showTemplateModal.value = false
  showCreateModal.value = true
  // Pre-fill form with template data
}

const toggleSchedule = (schedule: any) => {
  schedule.active = !schedule.active
}

const editSchedule = (schedule: any) => {
  console.log('Editing schedule:', schedule.name)
  // Edit schedule logic here
}

const deleteSchedule = (schedule: any) => {
  if (confirm('Are you sure you want to delete this scheduled report?')) {
    const index = scheduledReports.value.findIndex((s) => s.id === schedule.id)
    if (index > -1) {
      scheduledReports.value.splice(index, 1)
    }
  }
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

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
