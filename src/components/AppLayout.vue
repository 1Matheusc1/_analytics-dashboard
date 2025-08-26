<template>
  <div class="min-h-screen bg-secondary-50 flex">
    <!-- Sidebar -->
    <aside
      class="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-secondary-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0"
      :class="{ '-translate-x-full': !sidebarOpen }"
    >
      <!-- Logo -->
      <div class="flex items-center justify-between h-16 px-6 border-b border-secondary-200">
        <router-link to="/" class="flex items-center space-x-3">
          <div
            class="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center"
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
            <h1 class="text-lg font-bold text-secondary-900">Analytics</h1>
            <p class="text-xs text-secondary-500">Dashboard</p>
          </div>
        </router-link>

        <button
          @click="toggleSidebar"
          class="lg:hidden p-2 rounded-lg hover:bg-secondary-100 transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
        <router-link
          v-for="route in navigationRoutes"
          :key="route.name"
          :to="route.path"
          class="group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200"
          :class="
            isActiveRoute(route.path)
              ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
              : 'text-secondary-600 hover:bg-secondary-50 hover:text-secondary-900'
          "
          @click="closeSidebarOnMobile"
        >
          <div class="w-5 h-5 mr-3 flex-shrink-0">
            <svg
              class="w-5 h-5"
              :class="
                isActiveRoute(route.path)
                  ? 'text-primary-600'
                  : 'text-secondary-400 group-hover:text-secondary-500'
              "
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          {{ route.meta?.title }}

          <!-- Active indicator -->
          <div
            v-if="isActiveRoute(route.path)"
            class="ml-auto w-2 h-2 bg-primary-600 rounded-full"
          ></div>
        </router-link>
      </nav>

      <!-- User Menu -->
      <div class="border-t border-secondary-200 p-3">
        <div class="relative">
          <button
            @click="showUserMenu = !showUserMenu"
            class="flex items-center w-full px-3 py-2 text-sm font-medium text-secondary-600 rounded-lg hover:bg-secondary-50 transition-colors"
          >
            <div
              class="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center mr-3"
            >
              <span class="text-white text-sm font-semibold">M</span>
            </div>
            <div class="flex-1 text-left">
              <p class="font-medium text-secondary-900">Marcos</p>
              <p class="text-xs text-secondary-500">Admin</p>
            </div>
            <svg
              class="w-4 h-4 ml-2 transition-transform"
              :class="{ 'rotate-180': showUserMenu }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          <!-- User Menu Dropdown -->
          <transition name="dropdown">
            <div
              v-if="showUserMenu"
              class="absolute bottom-full left-0 right-0 mb-2 bg-white border border-secondary-200 rounded-lg shadow-lg py-1"
            >
              <router-link
                to="/profile"
                class="flex items-center px-3 py-2 text-sm text-secondary-700 hover:bg-secondary-50"
                @click="showUserMenu = false"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Profile
              </router-link>
              <router-link
                to="/settings"
                class="flex items-center px-3 py-2 text-sm text-secondary-700 hover:bg-secondary-50"
                @click="showUserMenu = false"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Settings
              </router-link>
              <hr class="my-1 border-secondary-200" />
              <button
                @click="handleLogout"
                class="flex items-center w-full px-3 py-2 text-sm text-danger-600 hover:bg-danger-50"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Logout
              </button>
            </div>
          </transition>
        </div>
      </div>
    </aside>

    <!-- Mobile overlay -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
      @click="closeSidebar"
    ></div>

    <!-- Main content -->
    <div class="flex-1 flex flex-col lg:ml-0">
      <!-- Top bar -->
      <header class="bg-white border-b border-secondary-200 px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center">
            <!-- Mobile menu button -->
            <button
              @click="toggleSidebar"
              class="lg:hidden -ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-secondary-500 hover:text-secondary-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            >
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            <!-- Breadcrumb -->
            <nav class="hidden sm:flex ml-4 lg:ml-0" aria-label="Breadcrumb">
              <ol class="flex items-center space-x-2">
                <li>
                  <router-link to="/" class="text-secondary-500 hover:text-secondary-700">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                      />
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M8 5v14M16 5v14"
                      />
                    </svg>
                  </router-link>
                </li>
                <li v-if="$route.name !== 'Dashboard'">
                  <div class="flex items-center">
                    <svg
                      class="flex-shrink-0 h-5 w-5 text-secondary-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    <span class="ml-2 text-sm font-medium text-secondary-900">{{
                      $route.meta?.title
                    }}</span>
                  </div>
                </li>
              </ol>
            </nav>
          </div>

          <div class="flex items-center space-x-4">
            <!-- Search -->
            <div class="hidden md:block relative">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search..."
                class="input w-64 pl-10 !py-2"
                @keyup.enter="handleSearch"
              />
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  class="h-5 w-5 text-secondary-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            <!-- Notifications -->
            <button
              @click="showNotifications = !showNotifications"
              class="relative p-2 rounded-lg text-secondary-400 hover:text-secondary-500 hover:bg-secondary-100 transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 17h5l-5-5h5l-5-5v10zM10 17h5l-5-5h5l-5-5v10z"
                />
              </svg>
              <span
                v-if="unreadNotifications > 0"
                class="absolute top-0 right-0 block h-2 w-2 rounded-full bg-danger-400"
              ></span>
            </button>
          </div>
        </div>
      </header>

      <!-- Page content -->
      <main class="flex-1 overflow-y-auto">
        <router-view v-slot="{ Component }">
          <transition name="page" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// State
const sidebarOpen = ref(false)
const showUserMenu = ref(false)
const showNotifications = ref(false)
const searchQuery = ref('')
const unreadNotifications = ref(3)

// Computed: filtra rotas que devem aparecer na sidebar
const navigationRoutes = computed(() => {
  return router.getRoutes().filter(
    (r) => r.meta?.showInSidebar !== false && r.meta?.title
  )
})

// Métodos
const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const closeSidebar = () => {
  sidebarOpen.value = false
}

const closeSidebarOnMobile = () => {
  if (window.innerWidth < 1024) closeSidebar()
}

// Melhorando detecção de rota ativa
const isActiveRoute = (path: string) => {
  return route.path === path || route.path.startsWith(path + '/')
}

// Pesquisa
const handleSearch = () => {
  console.log('Searching for:', searchQuery.value)
}

// Logout
const handleLogout = () => {
  console.log('Logging out...')
}

// Fecha menus se clicar fora
const handleClickOutside = (e: MouseEvent) => {
  const userMenu = document.querySelector('#userMenu')
  if (userMenu && !userMenu.contains(e.target as Node)) {
    showUserMenu.value = false
  }
  const sidebar = document.querySelector('#sidebar')
  if (sidebar && sidebarOpen.value && window.innerWidth < 1024 && !sidebar.contains(e.target as Node)) {
    closeSidebar()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

// Fechar sidebar automaticamente ao redimensionar para desktop
const handleResize = () => {
  if (window.innerWidth >= 1024) sidebarOpen.value = true
}
window.addEventListener('resize', handleResize)
onBeforeUnmount(() => window.removeEventListener('resize', handleResize))
</script>
