<template>
  <div
    class="card animate-slide-up transform transition-all duration-200 hover:scale-105 hover:shadow-medium"
    :style="{ animationDelay: `${animationDelay}ms` }"
  >
    <div class="card-content">
      <div class="flex items-center justify-between">
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-secondary-600 truncate">{{ title }}</p>
          <p class="text-2xl lg:text-3xl font-bold text-secondary-900 mt-1">{{ value }}</p>
          <div class="flex items-center mt-2">
            <svg
              v-if="trend === 'up'"
              class="w-4 h-4 text-success-500 mr-1 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M7 17l9.2-9.2M17 17V7H7"
              />
            </svg>
            <svg
              v-else
              class="w-4 h-4 text-danger-500 mr-1 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 7l-9.2 9.2M7 7v10h10"
              />
            </svg>
            <span
              :class="trend === 'up' ? 'text-success-600' : 'text-danger-600'"
              class="text-sm font-medium"
            >
              {{ Math.abs(change) }}%
            </span>
            <span class="text-secondary-500 text-xs ml-1 truncate">from last period</span>
          </div>
        </div>

        <div
          :class="iconBg"
          class="w-12 h-12 lg:w-14 lg:h-14 rounded-xl flex items-center justify-center flex-shrink-0 ml-4 shadow-sm"
        >
          <svg
            class="w-6 h-6 lg:w-7 lg:h-7"
            :class="iconColor"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="iconPath" />
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
  value: string
  change: number
  trend: 'up' | 'down'
  iconBg: string
  iconColor: string
  iconPath: string
  animationDelay?: number
}

withDefaults(defineProps<Props>(), {
  animationDelay: 0,
})
</script>
