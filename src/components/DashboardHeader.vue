<template>
  <header class="bg-white border-b border-secondary-200 sticky top-0 z-50 shadow-sm">
    <div class="px-4 sm:px-6 py-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <div class="flex items-center space-x-3">
            <div
              class="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center shadow-md"
            >
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <div class="hidden sm:block">
              <h1 class="text-xl font-bold text-secondary-900">{{ title }}</h1>
              <p class="text-sm text-secondary-500">{{ subtitle }}</p>
            </div>
          </div>
        </div>

        <div class="flex items-center space-x-2 sm:space-x-4">
          <button
            @click="$emit('export')"
            :disabled="isLoading"
            class="btn-outline text-xs sm:text-sm px-3 sm:px-4"
          >
            <svg class="w-4 h-4 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z"
              />
            </svg>
            <span class="hidden sm:inline">Export</span>
          </button>

          <button
            @click="$emit('refresh')"
            :disabled="isLoading"
            class="btn-secondary text-xs sm:text-sm px-3 sm:px-4"
          >
            <svg
              class="w-4 h-4 mr-1 sm:mr-2"
              :class="{ 'animate-spin': isLoading }"
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
            <span class="hidden sm:inline">Refresh</span>
          </button>

          <button @click="$emit('new-report')" class="btn-primary text-xs sm:text-sm px-3 sm:px-4">
            <svg class="w-4 h-4 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            <span class="hidden sm:inline">New Report</span>
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
interface Props {
  title?: string
  subtitle?: string
  isLoading?: boolean
}

withDefaults(defineProps<Props>(), {
  title: 'Analytics Dashboard',
  subtitle: 'Monitor your business metrics in real-time',
  isLoading: false,
})

defineEmits<{
  export: []
  refresh: []
  'new-report': []
}>()
</script>
