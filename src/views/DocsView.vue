<script setup lang="ts">
import { computed, ref } from 'vue'
import { FullScreen, Link } from '@element-plus/icons-vue'

const loading = ref(true)
const configuredBaseUrl = String(import.meta.env.VITE_DOCUMENT_BASE_URL || '').trim().replace(/\/+$/, '')
const documentBaseUrl = configuredBaseUrl || `${window.location.protocol}//${window.location.hostname}:5180`
const documentUrl = computed(() => `${documentBaseUrl}/open?embedded=1`)
</script>

<template>
  <section class="cloud-docs-page">
    <div class="cloud-docs-toolbar">
      <div><el-icon><Link /></el-icon><span>Open 开放接口</span></div>
      <el-tooltip content="在新窗口打开">
        <el-button tag="a" :href="documentUrl" target="_blank" :icon="FullScreen">独立查看</el-button>
      </el-tooltip>
    </div>
    <div v-loading="loading" element-loading-text="正在加载 Open 接口文档" class="cloud-docs-frame">
      <iframe
        :src="documentUrl"
        title="Open 开放接口文档"
        allow="clipboard-write"
        @load="loading = false"
      />
    </div>
  </section>
</template>
