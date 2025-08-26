import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

// Lazy load pages for better performance
const Dashboard = () => import('@/views/Dashboard.vue')
const Analytics = () => import('@/views/Analytics.vue')
const Reports = () => import('@/views/Reports.vue')
const ReportDetail = () => import('@/views/ReportDetail.vue')
const Users = () => import('@/views/Users.vue')
const UserDetail = () => import('@/views/UserDetail.vue')
const Pages = () => import('@/views/Pages.vue')
const PageDetail = () => import('@/views/PageDetail.vue')
const Activities = () => import('@/views/Activities.vue')
const Settings = () => import('@/views/Settings.vue')
const Profile = () => import('@/views/Profile.vue')

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard,
    meta: {
      title: 'Dashboard',
      icon: 'chart-bar',
      description: 'Overview of your analytics',
    },
  },
  {
    path: '/analytics',
    name: 'Analytics',
    component: Analytics,
    meta: {
      title: 'Analytics',
      icon: 'chart-line',
      description: 'Detailed analytics and insights',
    },
  },
  {
    path: '/reports',
    name: 'Reports',
    component: Reports,
    meta: {
      title: 'Reports',
      icon: 'document-report',
      description: 'Generate and manage reports',
    },
  },
  {
    path: '/reports/:id',
    name: 'ReportDetail',
    component: ReportDetail,
    meta: {
      title: 'Report Details',
      showInSidebar: false,
    },
  },
  {
    path: '/users',
    name: 'Users',
    component: Users,
    meta: {
      title: 'Users',
      icon: 'users',
      description: 'User management and analytics',
    },
  },
  {
    path: '/users/:id',
    name: 'UserDetail',
    component: UserDetail,
    meta: {
      title: 'User Details',
      showInSidebar: false,
    },
  },
  {
    path: '/pages',
    name: 'Pages',
    component: Pages,
    meta: {
      title: 'Pages',
      icon: 'document',
      description: 'Page performance analytics',
    },
  },
  {
    path: '/pages/:path',
    name: 'PageDetail',
    component: PageDetail,
    meta: {
      title: 'Page Details',
      showInSidebar: false,
    },
  },
  {
    path: '/activities',
    name: 'Activities',
    component: Activities,
    meta: {
      title: 'Activities',
      icon: 'clock',
      description: 'Recent activities and logs',
    },
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings,
    meta: {
      title: 'Settings',
      icon: 'cog',
      description: 'Application settings',
    },
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: {
      title: 'Profile',
      icon: 'user',
      description: 'Your profile settings',
      showInSidebar: false,
    },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
})

// Route guards
router.beforeEach((to, from, next) => {
  // Update page title
  if (to.meta.title) {
    document.title = `${to.meta.title} - Analytics Dashboard`
  }

  next()
})

export default router
