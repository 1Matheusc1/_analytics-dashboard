<template>
  <div class="p-4 sm:p-6 max-w-4xl mx-auto">
    <!-- Page Header -->
    <div class="mb-6">
      <h1 class="text-2xl sm:text-3xl font-bold text-secondary-900 mb-2">Settings</h1>
      <p class="text-secondary-600">Manage your application settings and preferences.</p>
    </div>

    <!-- Settings Navigation -->
    <div class="mb-6">
      <nav class="flex space-x-1 bg-secondary-100 p-1 rounded-lg">
        <button
          v-for="tab in settingsTabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="
            activeTab === tab.id
              ? 'bg-white text-secondary-900 shadow-sm'
              : 'text-secondary-600 hover:text-secondary-900'
          "
          class="px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 flex items-center"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              :d="tab.iconPath"
            />
          </svg>
          {{ tab.name }}
        </button>
      </nav>
    </div>

    <!-- General Settings -->
    <div v-if="activeTab === 'general'" class="space-y-6">
      <div class="card">
        <div class="card-header">
          <h2 class="text-lg font-semibold text-secondary-900">Organization Settings</h2>
        </div>
        <div class="card-content">
          <form @submit.prevent="saveGeneralSettings">
            <div class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-secondary-700 mb-2">
                    Organization Name
                  </label>
                  <input
                    v-model="generalSettings.organizationName"
                    type="text"
                    class="input w-full"
                    placeholder="Enter organization name"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-secondary-700 mb-2">
                    Website URL
                  </label>
                  <input
                    v-model="generalSettings.websiteUrl"
                    type="url"
                    class="input w-full"
                    placeholder="https://example.com"
                  />
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-secondary-700 mb-2">
                  Description
                </label>
                <textarea
                  v-model="generalSettings.description"
                  class="input w-full h-20"
                  placeholder="Describe your organization..."
                ></textarea>
              </div>

              <div>
                <label class="block text-sm font-medium text-secondary-700 mb-2"> Time Zone </label>
                <select v-model="generalSettings.timezone" class="select w-full">
                  <option value="UTC">UTC</option>
                  <option value="America/Sao_Paulo">São Paulo (GMT-3)</option>
                  <option value="America/New_York">New York (GMT-5)</option>
                  <option value="Europe/London">London (GMT+0)</option>
                  <option value="Asia/Tokyo">Tokyo (GMT+9)</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-secondary-700 mb-2"> Language </label>
                <select v-model="generalSettings.language" class="select w-full">
                  <option value="en">English</option>
                  <option value="pt">Português</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                </select>
              </div>
            </div>

            <div class="mt-6 flex justify-end">
              <button type="submit" class="btn-primary">Save Changes</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Analytics Settings -->
    <div v-if="activeTab === 'analytics'" class="space-y-6">
      <div class="card">
        <div class="card-header">
          <h2 class="text-lg font-semibold text-secondary-900">Analytics Configuration</h2>
        </div>
        <div class="card-content">
          <form @submit.prevent="saveAnalyticsSettings">
            <div class="space-y-6">
              <!-- Tracking Settings -->
              <div>
                <h3 class="text-md font-medium text-secondary-900 mb-4">Tracking Settings</h3>
                <div class="space-y-4">
                  <div class="flex items-center justify-between">
                    <div>
                      <label class="text-sm font-medium text-secondary-700"
                        >Enable Analytics Tracking</label
                      >
                      <p class="text-xs text-secondary-500">
                        Collect and analyze user behavior data
                      </p>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input
                        v-model="analyticsSettings.enableTracking"
                        type="checkbox"
                        class="sr-only peer"
                      />
                      <div
                        class="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"
                      ></div>
                    </label>
                  </div>

                  <div class="flex items-center justify-between">
                    <div>
                      <label class="text-sm font-medium text-secondary-700"
                        >Anonymous Tracking</label
                      >
                      <p class="text-xs text-secondary-500">
                        Track users without collecting personal information
                      </p>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input
                        v-model="analyticsSettings.anonymousTracking"
                        type="checkbox"
                        class="sr-only peer"
                      />
                      <div
                        class="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"
                      ></div>
                    </label>
                  </div>

                  <div class="flex items-center justify-between">
                    <div>
                      <label class="text-sm font-medium text-secondary-700">Real-time Data</label>
                      <p class="text-xs text-secondary-500">Enable real-time analytics updates</p>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input
                        v-model="analyticsSettings.realTimeData"
                        type="checkbox"
                        class="sr-only peer"
                      />
                      <div
                        class="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"
                      ></div>
                    </label>
                  </div>
                </div>
              </div>

              <!-- Data Retention -->
              <div>
                <h3 class="text-md font-medium text-secondary-900 mb-4">Data Retention</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-secondary-700 mb-2">
                      Retain Data For
                    </label>
                    <select v-model="analyticsSettings.dataRetention" class="select w-full">
                      <option value="30d">30 days</option>
                      <option value="90d">90 days</option>
                      <option value="1y">1 year</option>
                      <option value="2y">2 years</option>
                      <option value="indefinite">Indefinite</option>
                    </select>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-secondary-700 mb-2">
                      Auto-cleanup
                    </label>
                    <select v-model="analyticsSettings.autoCleanup" class="select w-full">
                      <option value="enabled">Enabled</option>
                      <option value="disabled">Disabled</option>
                    </select>
                  </div>
                </div>
              </div>

              <!-- Integrations -->
              <div>
                <h3 class="text-md font-medium text-secondary-900 mb-4">Integrations</h3>
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-secondary-700 mb-2">
                      Google Analytics ID
                    </label>
                    <input
                      v-model="analyticsSettings.googleAnalyticsId"
                      type="text"
                      class="input w-full"
                      placeholder="GA-XXXXXXX-X"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-secondary-700 mb-2">
                      Facebook Pixel ID
                    </label>
                    <input
                      v-model="analyticsSettings.facebookPixelId"
                      type="text"
                      class="input w-full"
                      placeholder="XXXXXXXXXXXXXXXXX"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div class="mt-6 flex justify-end">
              <button type="submit" class="btn-primary">Save Analytics Settings</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Notifications Settings -->
    <div v-if="activeTab === 'notifications'" class="space-y-6">
      <div class="card">
        <div class="card-header">
          <h2 class="text-lg font-semibold text-secondary-900">Notification Preferences</h2>
        </div>
        <div class="card-content">
          <form @submit.prevent="saveNotificationSettings">
            <div class="space-y-6">
              <!-- Email Notifications -->
              <div>
                <h3 class="text-md font-medium text-secondary-900 mb-4">Email Notifications</h3>
                <div class="space-y-4">
                  <div
                    v-for="notification in emailNotifications"
                    :key="notification.id"
                    class="flex items-center justify-between"
                  >
                    <div>
                      <label class="text-sm font-medium text-secondary-700">{{
                        notification.title
                      }}</label>
                      <p class="text-xs text-secondary-500">{{ notification.description }}</p>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input v-model="notification.enabled" type="checkbox" class="sr-only peer" />
                      <div
                        class="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"
                      ></div>
                    </label>
                  </div>
                </div>
              </div>

              <!-- Push Notifications -->
              <div>
                <h3 class="text-md font-medium text-secondary-900 mb-4">Push Notifications</h3>
                <div class="space-y-4">
                  <div
                    v-for="notification in pushNotifications"
                    :key="notification.id"
                    class="flex items-center justify-between"
                  >
                    <div>
                      <label class="text-sm font-medium text-secondary-700">{{
                        notification.title
                      }}</label>
                      <p class="text-xs text-secondary-500">{{ notification.description }}</p>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input v-model="notification.enabled" type="checkbox" class="sr-only peer" />
                      <div
                        class="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"
                      ></div>
                    </label>
                  </div>
                </div>
              </div>

              <!-- Frequency Settings -->
              <div>
                <h3 class="text-md font-medium text-secondary-900 mb-4">Notification Frequency</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-secondary-700 mb-2">
                      Report Frequency
                    </label>
                    <select v-model="notificationSettings.reportFrequency" class="select w-full">
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="never">Never</option>
                    </select>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-secondary-700 mb-2">
                      Alert Threshold
                    </label>
                    <select v-model="notificationSettings.alertThreshold" class="select w-full">
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical Only</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div class="mt-6 flex justify-end">
              <button type="submit" class="btn-primary">Save Notification Settings</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Security Settings -->
    <div v-if="activeTab === 'security'" class="space-y-6">
      <div class="card">
        <div class="card-header">
          <h2 class="text-lg font-semibold text-secondary-900">Security & Privacy</h2>
        </div>
        <div class="card-content">
          <div class="space-y-6">
            <!-- Password Settings -->
            <div>
              <h3 class="text-md font-medium text-secondary-900 mb-4">Password Security</h3>
              <form @submit.prevent="changePassword">
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-secondary-700 mb-2">
                      Current Password
                    </label>
                    <input
                      v-model="passwordForm.current"
                      type="password"
                      class="input w-full"
                      placeholder="Enter current password"
                    />
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-secondary-700 mb-2">
                        New Password
                      </label>
                      <input
                        v-model="passwordForm.new"
                        type="password"
                        class="input w-full"
                        placeholder="Enter new password"
                      />
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-secondary-700 mb-2">
                        Confirm Password
                      </label>
                      <input
                        v-model="passwordForm.confirm"
                        type="password"
                        class="input w-full"
                        placeholder="Confirm new password"
                      />
                    </div>
                  </div>
                </div>

                <div class="mt-4 flex justify-end">
                  <button type="submit" class="btn-primary">Change Password</button>
                </div>
              </form>
            </div>

            <!-- Two-Factor Authentication -->
            <div class="border-t border-secondary-200 pt-6">
              <h3 class="text-md font-medium text-secondary-900 mb-4">Two-Factor Authentication</h3>
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-secondary-700">
                    Add an extra layer of security to your account
                  </p>
                  <p class="text-xs text-secondary-500 mt-1">
                    {{
                      securitySettings.twoFactorEnabled
                        ? 'Two-factor authentication is enabled'
                        : 'Two-factor authentication is disabled'
                    }}
                  </p>
                </div>
                <button
                  @click="toggleTwoFactor"
                  :class="securitySettings.twoFactorEnabled ? 'btn-danger' : 'btn-primary'"
                >
                  {{ securitySettings.twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA' }}
                </button>
              </div>
            </div>

            <!-- Session Management -->
            <div class="border-t border-secondary-200 pt-6">
              <h3 class="text-md font-medium text-secondary-900 mb-4">Active Sessions</h3>
              <div class="space-y-3">
                <div
                  v-for="session in activeSessions"
                  :key="session.id"
                  class="flex items-center justify-between p-3 border border-secondary-200 rounded-lg"
                >
                  <div class="flex items-center space-x-3">
                    <div
                      :class="session.iconBg"
                      class="w-10 h-10 rounded-lg flex items-center justify-center"
                    >
                      <svg
                        class="w-5 h-5"
                        :class="session.iconColor"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          :d="session.iconPath"
                        />
                      </svg>
                    </div>
                    <div>
                      <p class="text-sm font-medium text-secondary-900">{{ session.device }}</p>
                      <p class="text-xs text-secondary-500">
                        {{ session.location }} • {{ session.lastActive }}
                      </p>
                    </div>
                  </div>
                  <div class="flex items-center space-x-2">
                    <span
                      v-if="session.current"
                      class="text-xs px-2 py-1 bg-success-100 text-success-800 rounded-full"
                    >
                      Current
                    </span>
                    <button
                      v-else
                      @click="terminateSession(session)"
                      class="text-danger-600 hover:text-danger-800 text-sm"
                    >
                      Terminate
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

// State
const activeTab = ref('general')

const generalSettings = reactive({
  organizationName: 'Analytics Dashboard',
  websiteUrl: 'https://analytics.company.com',
  description: 'Advanced analytics platform for business insights',
  timezone: 'America/Sao_Paulo',
  language: 'en',
})

const analyticsSettings = reactive({
  enableTracking: true,
  anonymousTracking: false,
  realTimeData: true,
  dataRetention: '1y',
  autoCleanup: 'enabled',
  googleAnalyticsId: '',
  facebookPixelId: '',
})

const notificationSettings = reactive({
  reportFrequency: 'weekly',
  alertThreshold: 'medium',
})

const securitySettings = reactive({
  twoFactorEnabled: false,
})

const passwordForm = reactive({
  current: '',
  new: '',
  confirm: '',
})

// Data
const settingsTabs = [
  {
    id: 'general',
    name: 'General',
    iconPath:
      'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z',
  },
  {
    id: 'analytics',
    name: 'Analytics',
    iconPath:
      'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
  },
  {
    id: 'notifications',
    name: 'Notifications',
    iconPath: 'M15 17h5l-5-5v5zM10 17h5l-5-5v5z',
  },
  {
    id: 'security',
    name: 'Security',
    iconPath:
      'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
  },
]

const emailNotifications = ref([
  {
    id: 'reports',
    title: 'Weekly Reports',
    description: 'Receive weekly analytics summary reports',
    enabled: true,
  },
  {
    id: 'alerts',
    title: 'Alert Notifications',
    description: 'Get notified when metrics exceed thresholds',
    enabled: true,
  },
  {
    id: 'security',
    title: 'Security Alerts',
    description: 'Notifications about security events',
    enabled: true,
  },
  {
    id: 'updates',
    title: 'Product Updates',
    description: 'Information about new features and updates',
    enabled: false,
  },
])

const pushNotifications = ref([
  {
    id: 'realtime',
    title: 'Real-time Alerts',
    description: 'Instant notifications for critical events',
    enabled: true,
  },
  {
    id: 'goals',
    title: 'Goal Completions',
    description: 'Notifications when goals are achieved',
    enabled: false,
  },
])

const activeSessions = ref([
  {
    id: '1',
    device: 'Chrome on MacBook Pro',
    location: 'São Paulo, Brazil',
    lastActive: '2 minutes ago',
    current: true,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    iconPath:
      'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  },
  {
    id: '2',
    device: 'Safari on iPhone',
    location: 'São Paulo, Brazil',
    lastActive: '1 hour ago',
    current: false,
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    iconPath: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z',
  },
])

// Methods
const saveGeneralSettings = () => {
  console.log('Saving general settings:', generalSettings)
  // Implement save logic
}

const saveAnalyticsSettings = () => {
  console.log('Saving analytics settings:', analyticsSettings)
  // Implement save logic
}

const saveNotificationSettings = () => {
  console.log('Saving notification settings:', {
    email: emailNotifications.value,
    push: pushNotifications.value,
    general: notificationSettings,
  })
  // Implement save logic
}

const changePassword = () => {
  if (passwordForm.new !== passwordForm.confirm) {
    alert('Passwords do not match')
    return
  }
  console.log('Changing password...')
  // Implement password change logic
  Object.assign(passwordForm, { current: '', new: '', confirm: '' })
}

const toggleTwoFactor = () => {
  securitySettings.twoFactorEnabled = !securitySettings.twoFactorEnabled
  console.log(
    'Two-factor authentication:',
    securitySettings.twoFactorEnabled ? 'enabled' : 'disabled',
  )
  // Implement 2FA toggle logic
}

const terminateSession = (session: any) => {
  const index = activeSessions.value.findIndex((s) => s.id === session.id)
  if (index > -1) {
    activeSessions.value.splice(index, 1)
  }
  console.log('Terminated session:', session.device)
}
</script>
