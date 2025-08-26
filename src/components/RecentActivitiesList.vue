<template>
  <div class="card animate-fade-in" :style="{ animationDelay: `${animationDelay}ms` }">
    <div class="card-header">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold text-secondary-900">{{ title }}</h3>
        <div class="flex items-center space-x-2">
          <button
            v-if="showRefresh"
            @click="$emit('refresh')"
            :disabled="isLoading"
            class="text-secondary-400 hover:text-secondary-600 transition-colors"
          >
            <svg
              class="w-4 h-4"
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
          </button>
          <button
            v-if="showViewAll"
            @click="$emit('view-all')"
            class="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
          >
            View all
          </button>
        </div>
      </div>
    </div>
    <div class="card-content">
      <div v-if="isLoading" class="space-y-4">
        <div
          v-for="i in 3"
          :key="i"
          class="flex items-center space-x-3 p-3 rounded-lg bg-secondary-50 animate-pulse"
        >
          <div class="w-8 h-8 bg-secondary-200 rounded-full flex-shrink-0"></div>
          <div class="flex-1 min-w-0">
            <div class="h-4 bg-secondary-200 rounded w-3/4 mb-1"></div>
            <div class="h-3 bg-secondary-200 rounded w-1/2"></div>
          </div>
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

      <div v-else-if="activities.length === 0" class="text-center py-8">
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
            d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
        <p class="text-sm text-secondary-600">No recent activities</p>
      </div>

      <div v-else class="space-y-3">
        <div
          v-for="activity in activities"
          :key="activity.id"
          class="flex items-center space-x-3 p-3 rounded-lg bg-secondary-50 hover:bg-secondary-100 transition-colors cursor-pointer group"
          @click="$emit('activity-click', activity)"
        >
          <div
            :class="activity.iconBg"
            class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm"
          >
            <svg
              class="w-4 h-4"
              :class="activity.iconColor"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                :d="activity.iconPath"
              />
            </svg>
          </div>

          <div class="flex-1 min-w-0">
            <p
              class="text-sm font-medium text-secondary-900 group-hover:text-primary-600 transition-colors"
            >
              {{ activity.action }}
            </p>
            <p class="text-xs text-secondary-500">{{ activity.time }}</p>
          </div>

          <svg
            class="w-4 h-4 text-secondary-400 opacity-0 group-hover:opacity-100 transition-opacity"
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

      <!-- Auto-refresh indicator -->
      <div v-if="autoRefresh && !isLoading" class="mt-4 pt-3 border-t border-secondary-200">
        <div class="flex items-center justify-center text-xs text-secondary-500">
          <div class="w-2 h-2 bg-success-400 rounded-full animate-pulse mr-2"></div>
          Auto-refreshing every {{ autoRefreshInterval }}s
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import type { RecentActivity } from '@/types'

interface Props {
  title?: string
  activities: RecentActivity[]
  isLoading?: boolean
  error?: string | null
  animationDelay?: number
  showViewAll?: boolean
  showRefresh?: boolean
  autoRefresh?: boolean
  autoRefreshInterval?: number
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Recent Activity',
  isLoading: false,
  error: null,
  animationDelay: 0,
  showViewAll: true,
  showRefresh: true,
  autoRefresh: false,
  autoRefreshInterval: 30,
})

const emit = defineEmits<{
  'activity-click': [activity: RecentActivity]
  'view-all': []
  refresh: []
  retry: []
}>()

let refreshInterval: number | null = null

onMounted(() => {
  if (props.autoRefresh) {
    refreshInterval = setInterval(() => {
      emit('refresh')
    }, props.autoRefreshInterval * 1000)
  }
})

onUnmounted(() => {
  if (refreshInterval) {
    clearInterval(refreshInterval)
  }
})
</script>
