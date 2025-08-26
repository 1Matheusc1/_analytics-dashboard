<template>
  <div class="card animate-fade-in" :style="{ animationDelay: `${animationDelay}ms` }">
    <div class="card-header">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold text-secondary-900">{{ title }}</h3>
        <div v-if="showTypeToggle" class="flex items-center space-x-2">
          <button
            v-for="type in chartTypes"
            :key="type.value"
            @click="$emit('chart-type-change', type.value)"
            :class="currentType === type.value ? 'btn-primary' : 'btn-outline'"
            class="!text-xs !px-3 !py-1"
          >
            {{ type.label }}
          </button>
        </div>
        <slot name="actions" />
      </div>
    </div>
    <div class="card-content">
      <div class="chart-container relative">
        <canvas
          ref="canvasRef"
          class="w-full h-full"
          :width="canvasWidth"
          :height="canvasHeight"
        ></canvas>

        <!-- Loading overlay -->
        <div
          v-if="isLoading"
          class="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg"
        >
          <div class="flex items-center space-x-2">
            <svg class="animate-spin h-5 w-5 text-primary-600" viewBox="0 0 24 24">
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
                fill="none"
              />
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span class="text-sm text-secondary-600">Loading chart...</span>
          </div>
        </div>

        <!-- Error state -->
        <div
          v-else-if="error"
          class="absolute inset-0 flex items-center justify-center rounded-lg bg-danger-50"
        >
          <div class="text-center">
            <svg
              class="w-8 h-8 text-danger-400 mx-auto mb-2"
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
            <p class="text-sm text-danger-600">{{ error }}</p>
            <button @click="$emit('retry')" class="btn-outline !text-xs mt-2">Retry</button>
          </div>
        </div>
      </div>

      <!-- Chart Legend -->
      <div v-if="showLegend && legendItems.length > 0" class="mt-4">
        <div class="flex flex-wrap items-center justify-center gap-4">
          <div
            v-for="(item, index) in legendItems"
            :key="index"
            class="flex items-center space-x-2"
          >
            <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: item.color }"></div>
            <span class="text-sm text-secondary-600">{{ item.label }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useCharts } from '@/composables/useCharts'
import type { ChartType } from '@/types'

interface ChartTypeOption {
  value: ChartType
  label: string
}

interface LegendItem {
  label: string
  color: string
}

interface Props {
  title: string
  chartType: ChartType
  data: number[]
  labels: string[]
  colors?: string[]
  isLoading?: boolean
  error?: string | null
  animationDelay?: number
  showTypeToggle?: boolean
  chartTypes?: ChartTypeOption[]
  currentType?: ChartType
  showLegend?: boolean
  legendItems?: LegendItem[]
  canvasWidth?: number
  canvasHeight?: number
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false,
  error: null,
  animationDelay: 0,
  showTypeToggle: false,
  chartTypes: () => [
    { value: 'line', label: 'Line' },
    { value: 'bar', label: 'Bar' },
  ],
  currentType: 'line',
  showLegend: false,
  legendItems: () => [],
  canvasWidth: 800,
  canvasHeight: 300,
})

const emit = defineEmits<{
  'chart-type-change': [type: ChartType]
  retry: []
}>()

const { createChart } = useCharts()
const canvasRef = ref<HTMLCanvasElement | null>(null)

const drawChart = () => {
  if (!canvasRef.value || props.isLoading || props.error) return

  const options = props.colors ? { colors: props.colors } : {}
  createChart(canvasRef, props.chartType, props.data, props.labels, options)
}

// Watch for data changes
watch(
  [() => props.data, () => props.labels, () => props.chartType],
  () => {
    nextTick(() => {
      drawChart()
    })
  },
  { deep: true },
)

// Handle window resize
const handleResize = () => {
  drawChart()
}

onMounted(() => {
  nextTick(() => {
    drawChart()
  })
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>
