<template>
  <div class="card animate-fade-in" :style="{ animationDelay: `${animationDelay}ms` }">
    <div class="card-header">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold text-secondary-900">{{ title }}</h3>
        <button
          v-if="showViewAll"
          @click="$emit('view-all')"
          class="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
        >
          View all
        </button>
      </div>
    </div>
    <div class="card-content">
      <div v-if="isLoading" class="space-y-4">
        <div v-for="i in 5" :key="i" class="flex items-center justify-between animate-pulse">
          <div class="flex-1">
            <div class="h-4 bg-secondary-200 rounded w-3/4 mb-2"></div>
            <div class="h-3 bg-secondary-200 rounded w-1/2"></div>
          </div>
          <div class="h-4 bg-secondary-200 rounded w-16"></div>
        </div>
      </div>

      <div v-else-if="error" class="text-center py-8">
        <svg
          class="w-8 h-8 text-secondary-400 mx-auto mb-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
        <p class="text-sm text-secondary-600">{{ error }}</p>
        <button @click="$emit('retry')" class="btn-outline !text-xs mt-2">Retry</button>
      </div>

      <div v-else-if="pages.length === 0" class="text-center py-8">
        <svg
          class="w-8 h-8 text-secondary-400 mx-auto mb-2"
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
        <p class="text-sm text-secondary-600">No pages data available</p>
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="(page, index) in pages"
          :key="page.path"
          class="flex items-center justify-between p-3 rounded-lg hover:bg-secondary-50 transition-colors cursor-pointer group"
          @click="$emit('page-click', page)"
        >
          <div class="flex items-center space-x-3 flex-1 min-w-0">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                <span class="text-xs font-bold text-primary-600">{{ index + 1 }}</span>
              </div>
            </div>
            <div class="flex-1 min-w-0">
              <p
                class="text-sm font-medium text-secondary-900 truncate group-hover:text-primary-600 transition-colors"
              >
                {{ page.path }}
              </p>
              <p class="text-xs text-secondary-500 truncate">{{ page.title }}</p>
            </div>
          </div>

          <div class="text-right flex-shrink-0 ml-4">
            <p class="text-sm font-bold text-secondary-900">
              {{ formatNumber(page.views) }}
            </p>
            <p class="text-xs text-secondary-500">views</p>
          </div>

          <svg
            class="w-4 h-4 text-secondary-400 ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TopPage } from '@/types'

interface Props {
  title?: string
  pages: TopPage[]
  isLoading?: boolean
  error?: string | null
  animationDelay?: number
  showViewAll?: boolean
}

withDefaults(defineProps<Props>(), {
  title: 'Top Performing Pages',
  isLoading: false,
  error: null,
  animationDelay: 0,
  showViewAll: true,
})

defineEmits<{
  'page-click': [page: TopPage]
  'view-all': []
  retry: []
}>()

const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toLocaleString()
}
</script>
