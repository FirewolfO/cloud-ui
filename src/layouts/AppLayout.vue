<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowRight, Cloudy, Setting, SwitchButton } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { apiMessage } from '@/api/client'
import { useAuthStore } from '@/stores/auth'
import { userInitials } from '@/utils/user'

const router = useRouter()
const auth = useAuthStore()
const profileVisible = ref(false)
const loggingOut = ref(false)
const initials = computed(() => userInitials(auth.user))

async function logout() {
  loggingOut.value = true
  try {
    await auth.logout()
    await router.replace({ name: 'auth' })
  } catch (error) {
    ElMessage.error(apiMessage(error, '退出失败'))
  } finally {
    loggingOut.value = false
  }
}

function openAccount() {
  profileVisible.value = false
  void router.push({ name: 'account-profile' })
}
</script>

<template>
  <div class="console-shell">
    <header class="console-header">
      <RouterLink class="console-brand" :to="{ name: 'home' }">
        <span class="brand-icon"><el-icon><Cloudy /></el-icon></span>
        <strong>Cloud Console</strong>
      </RouterLink>

      <el-popover v-model:visible="profileVisible" placement="bottom-end" :width="300" trigger="click" popper-class="profile-popover">
        <template #reference>
          <button class="avatar-button" type="button" aria-label="打开用户信息">
            <el-avatar :size="34" :src="auth.user?.avatarUrl || undefined">{{ initials }}</el-avatar>
          </button>
        </template>

        <div class="profile-summary">
          <div class="profile-identity">
            <el-avatar :size="44" :src="auth.user?.avatarUrl || undefined">{{ initials }}</el-avatar>
            <div>
              <strong>{{ auth.user?.displayName }}</strong>
              <span>@{{ auth.user?.username }}</span>
            </div>
          </div>
          <dl>
            <div><dt>邮箱</dt><dd>{{ auth.user?.email || '未绑定' }}</dd></div>
            <div><dt>手机</dt><dd>{{ auth.user?.phone || '未绑定' }}</dd></div>
          </dl>
          <div class="profile-actions">
            <el-button text :icon="Setting" @click="openAccount">账号管理<el-icon><ArrowRight /></el-icon></el-button>
            <el-button text type="danger" :icon="SwitchButton" :loading="loggingOut" @click="logout">退出登录</el-button>
          </div>
        </div>
      </el-popover>
    </header>

    <main class="console-main">
      <RouterView />
    </main>
  </div>
</template>
