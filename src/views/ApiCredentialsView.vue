<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { CopyDocument, Delete, Key, Plus, Refresh } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { accountApi } from '@/api/account'
import { apiMessage } from '@/api/client'
import type { ApiCredential } from '@/types'
import { writeClipboardText } from '@/utils/clipboard'

interface CredentialForm {
  name: string
}

const loading = ref(false)
const saving = ref(false)
const copyingSecretId = ref('')
const items = ref<ApiCredential[]>([])
const createVisible = ref(false)
const secretVisible = ref(false)
const formRef = ref<FormInstance>()
const form = reactive<CredentialForm>({ name: '' })
const generated = reactive({ name: '', accessKey: '', secretKey: '' })
const rules: FormRules<CredentialForm> = {
  name: [{ required: true, message: '请输入密钥名称', trigger: 'blur' }],
}

async function load() {
  loading.value = true
  try {
    items.value = await accountApi.listCredentials()
  } catch (error) {
    ElMessage.error(apiMessage(error, 'API 访问密钥加载失败'))
  } finally {
    loading.value = false
  }
}

function openCreate() {
  form.name = ''
  createVisible.value = true
}

async function create() {
  if (!await formRef.value?.validate()) return
  saving.value = true
  try {
    const credential = await accountApi.createCredential(form.name.trim())
    Object.assign(generated, {
      name: credential.name,
      accessKey: credential.accessKey,
      secretKey: credential.secretKey,
    })
    createVisible.value = false
    secretVisible.value = true
    await load()
  } catch (error) {
    ElMessage.error(apiMessage(error, 'API 访问密钥创建失败'))
  } finally {
    saving.value = false
  }
}

async function remove(item: ApiCredential) {
  try {
    await ElMessageBox.confirm(`确定删除“${item.name}”吗？`, '删除 API 访问密钥', {
      type: 'warning', confirmButtonText: '删除', cancelButtonText: '取消',
    })
    await accountApi.deleteCredential(item.id)
    items.value = items.value.filter((credential) => credential.id !== item.id)
    ElMessage.success('API 访问密钥已删除')
  } catch (error) {
    if (error !== 'cancel' && error !== 'close') ElMessage.error(apiMessage(error, 'API 访问密钥删除失败'))
  }
}

async function copyText(value: string, label: string) {
  try {
    await writeClipboardText(value)
    ElMessage.success(`${label} 已复制`)
  } catch {
    ElMessage.error(`${label} 复制失败`)
  }
}

async function copySecret(item: ApiCredential) {
  copyingSecretId.value = item.id
  try {
    const credential = await accountApi.getCredentialSecret(item.id)
    await writeClipboardText(credential.secretKey)
    ElMessage.success('SK 已复制')
  } catch (error) {
    ElMessage.error(apiMessage(error, 'SK 复制失败'))
  } finally {
    copyingSecretId.value = ''
  }
}

function closeSecret() {
  secretVisible.value = false
  Object.assign(generated, { name: '', accessKey: '', secretKey: '' })
}

onMounted(load)
</script>

<template>
  <section class="account-section">
    <div class="account-content-heading credentials-heading">
      <div><h2>API 访问密钥</h2><span>{{ items.length }} / 10</span></div>
    </div>

    <div class="credential-toolbar">
      <el-tooltip content="刷新列表"><el-button :icon="Refresh" circle aria-label="刷新列表" :loading="loading" @click="load" /></el-tooltip>
      <el-button type="primary" :icon="Plus" :disabled="items.length >= 10" @click="openCreate">创建密钥</el-button>
    </div>

    <el-table v-loading="loading" :data="items" empty-text="暂无 API 访问密钥" table-layout="fixed" class="account-table">
      <el-table-column prop="name" label="名称" min-width="150" />
      <el-table-column label="Access Key" min-width="280">
        <template #default="{ row }">
          <div class="account-credential-value"><code>{{ row.accessKey }}</code><el-tooltip content="复制 AK"><el-button text :icon="CopyDocument" aria-label="复制 AK" @click="copyText(row.accessKey, 'AK')" /></el-tooltip></div>
        </template>
      </el-table-column>
      <el-table-column label="Secret Key" min-width="180">
        <template #default="{ row }">
          <div class="account-credential-value"><code>{{ row.secretKey }}</code><el-tooltip content="复制 SK"><el-button text :icon="CopyDocument" aria-label="复制 SK" :loading="copyingSecretId === row.id" @click="copySecret(row)" /></el-tooltip></div>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="180"><template #default="{ row }">{{ new Date(row.createdAt).toLocaleString() }}</template></el-table-column>
      <el-table-column label="操作" width="74" fixed="right">
        <template #default="{ row }"><el-tooltip content="删除密钥"><el-button text type="danger" :icon="Delete" aria-label="删除密钥" @click="remove(row)" /></el-tooltip></template>
      </el-table-column>
    </el-table>

    <div v-loading="loading" class="credential-mobile-list">
      <article v-for="item in items" :key="item.id" class="credential-mobile-item">
        <header><strong>{{ item.name }}</strong><el-tooltip content="删除密钥"><el-button text type="danger" :icon="Delete" aria-label="删除密钥" @click="remove(item)" /></el-tooltip></header>
        <div><span>Access Key</span><code>{{ item.accessKey }}</code><el-tooltip content="复制 AK"><el-button text :icon="CopyDocument" aria-label="复制 AK" @click="copyText(item.accessKey, 'AK')" /></el-tooltip></div>
        <div><span>Secret Key</span><code>{{ item.secretKey }}</code><el-tooltip content="复制 SK"><el-button text :icon="CopyDocument" aria-label="复制 SK" :loading="copyingSecretId === item.id" @click="copySecret(item)" /></el-tooltip></div>
        <time :datetime="item.createdAt">{{ new Date(item.createdAt).toLocaleString() }}</time>
      </article>
      <el-empty v-if="!loading && items.length === 0" :image-size="52" description="暂无 API 访问密钥" />
    </div>

    <el-dialog v-model="createVisible" title="创建 API 访问密钥" width="min(480px, 92vw)" destroy-on-close @closed="formRef?.clearValidate()">
      <el-form ref="formRef" :model="form" :rules="rules" label-position="top">
        <el-form-item label="密钥名称" prop="name"><el-input v-model="form.name" maxlength="64" placeholder="本地开发" @keyup.enter="create" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="createVisible = false">取消</el-button><el-button type="primary" :loading="saving" @click="create">创建</el-button></template>
    </el-dialog>

    <el-dialog :model-value="secretVisible" title="API 访问密钥已创建" width="min(640px, 94vw)" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
      <div class="generated-api-credential">
        <div><span>名称</span><strong>{{ generated.name }}</strong></div>
        <div><span>Access Key</span><code>{{ generated.accessKey }}</code><el-tooltip content="复制 AK"><el-button :icon="CopyDocument" aria-label="复制 AK" @click="copyText(generated.accessKey, 'AK')" /></el-tooltip></div>
        <div><span>Secret Key</span><code>************************</code><el-tooltip content="复制 SK"><el-button :icon="CopyDocument" aria-label="复制 SK" @click="copyText(generated.secretKey, 'SK')" /></el-tooltip></div>
      </div>
      <template #footer><el-button type="primary" :icon="Key" @click="closeSecret">完成</el-button></template>
    </el-dialog>
  </section>
</template>
