<script setup lang="ts">
import { Key, User } from '@element-plus/icons-vue'
</script>

<template>
  <section class="account-page">
    <header class="account-heading">
      <h1>账号管理</h1>
      <span>Cloud Account</span>
    </header>
    <div class="account-workspace">
      <aside class="account-nav">
        <RouterLink :to="{ name: 'account-profile' }">
          <el-icon><User /></el-icon><span>基本资料</span>
        </RouterLink>
        <RouterLink :to="{ name: 'api-credentials' }">
          <el-icon><Key /></el-icon><span>API 访问密钥</span>
        </RouterLink>
      </aside>
      <main class="account-content">
        <RouterView />
      </main>
    </div>
  </section>
</template>
