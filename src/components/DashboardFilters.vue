<template>
  <div class="card mb-6 animate-fade-in">
    <div class="card-header">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold text-secondary-900">Filters</h2>
        <button
          v-if="hasActiveFilters"
          @click="clearFilters"
          class="text-sm text-secondary-500 hover:text-secondary-700 transition-colors"
        >
          Clear all
        </button>
      </div>
    </div>
    <div class="card-content">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-secondary-700 mb-2"> Date Range </label>
          <select v-model="localFilters.dateRange" class="select w-full" @change="onFilterChange">
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
            <option value="custom">Custom range</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-secondary-700 mb-2"> User Type </label>
          <select v-model="localFilters.userType" class="select w-full" @change="onFilterChange">
            <option value="all">All Users</option>
            <option value="new">New Users</option>
            <option value="returning">Returning Users</option>
            <option value="premium">Premium Users</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-secondary-700 mb-2"> Category </label>
          <select v-model="localFilters.category" class="select w-full" @change="onFilterChange">
            <option value="all">All Categories</option>
            <option value="sales">Sales</option>
            <option value="marketing">Marketing</option>
            <option value="support">Support</option>
            <option value="product">Product</option>
          </select>
        </div>

        <div class="flex items-end">
          <button
            @click="applyFilters"
            :disabled="isLoading"
            class="btn-primary w-full"
            :class="{ 'opacity-50 cursor-not-allowed': isLoading }"
          >
            <svg
              class="w-4 h-4 mr-2"
              :class="{ 'animate-spin': isLoading }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                v-if="!isLoading"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z"
              />
              <path
                v-else
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            {{ isLoading ? 'Applying...' : 'Apply Filters' }}
          </button>
        </div>
      </div>

      <!-- Custom Date Range Picker -->
      <div
        v-if="localFilters.dateRange === 'custom'"
        class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pt-4 border-t border-secondary-200"
      >
        <div>
          <label class="block text-sm font-medium text-secondary-700 mb-2"> Start Date </label>
          <input
            v-model="customDateRange.start"
            type="date"
            class="input w-full"
            @change="onFilterChange"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-secondary-700 mb-2"> End Date </label>
          <input
            v-model="customDateRange.end"
            type="date"
            class="input w-full"
            @change="onFilterChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { DashboardFilters } from '@/types'

interface Props {
  filters: DashboardFilters
  isLoading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false,
})

const emit = defineEmits<{
  'update:filters': [filters: DashboardFilters]
  'apply-filters': [filters: DashboardFilters]
}>()

const localFilters = ref<DashboardFilters>({ ...props.filters })
const customDateRange = ref({
  start: '',
  end: '',
})

const hasActiveFilters = computed(() => {
  return (
    localFilters.value.dateRange !== '30d' ||
    localFilters.value.userType !== 'all' ||
    localFilters.value.category !== 'all'
  )
})

const onFilterChange = () => {
  emit('update:filters', { ...localFilters.value })
}

const applyFilters = () => {
  const filtersToApply = { ...localFilters.value }

  if (
    filtersToApply.dateRange === 'custom' &&
    customDateRange.value.start &&
    customDateRange.value.end
  ) {
    // Add custom date range logic here
    console.log('Custom date range:', customDateRange.value)
  }

  emit('apply-filters', filtersToApply)
}

const clearFilters = () => {
  localFilters.value = {
    dateRange: '30d',
    userType: 'all',
    category: 'all',
  }
  customDateRange.value = {
    start: '',
    end: '',
  }
  onFilterChange()
}

// Watch for external filter changes
watch(
  () => props.filters,
  (newFilters) => {
    localFilters.value = { ...newFilters }
  },
  { deep: true },
)
</script>
