<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, Link, Message, Phone, User } from '@element-plus/icons-vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { apiMessage } from '@/api/client'
import { useAuthStore } from '@/stores/auth'
import { nullable, userInitials } from '@/utils/user'

interface ProfileForm {
  displayName: string
  email: string
  phone: string
  avatarUrl: string
}

const router = useRouter()
const auth = useAuthStore()
const formRef = ref<FormInstance>()
const saving = ref(false)
const form = reactive<ProfileForm>({
  displayName: auth.user?.displayName || '',
  email: auth.user?.email || '',
  phone: auth.user?.phone || '',
  avatarUrl: auth.user?.avatarUrl || '',
})
const initials = computed(() => userInitials(auth.user))
const previewAvatar = computed(() => nullable(form.avatarUrl) || undefined)

const rules: FormRules<ProfileForm> = {
  displayName: [{ required: true, message: '请输入显示名称', trigger: 'blur' }],
  email: [{ type: 'email', message: '请输入有效邮箱', trigger: 'blur' }],
  phone: [{ pattern: /^$|^\+[1-9]\d{7,14}$/, message: '请输入带国家代码的手机号', trigger: 'blur' }],
  avatarUrl: [{ pattern: /^$|^https?:\/\/[^\s]+$/i, message: '请输入有效的 HTTP(S) 地址', trigger: 'blur' }],
}

async function save() {
  if (!await formRef.value?.validate()) return
  saving.value = true
  try {
    await auth.updateProfile({
      displayName: form.displayName.trim(),
      email: nullable(form.email),
      phone: nullable(form.phone),
      avatarUrl: nullable(form.avatarUrl),
    })
    ElMessage.success('个人资料已更新')
  } catch (error) {
    ElMessage.error(apiMessage(error, '个人资料保存失败'))
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <section class="profile-page">
    <div class="page-heading">
      <el-tooltip content="返回主页"><el-button :icon="ArrowLeft" circle aria-label="返回主页" @click="router.push({ name: 'home' })" /></el-tooltip>
      <div><h1>个人资料</h1><span>@{{ auth.user?.username }}</span></div>
    </div>

    <div class="profile-editor">
      <aside class="avatar-preview">
        <el-avatar :size="88" :src="previewAvatar">{{ initials }}</el-avatar>
        <strong>{{ form.displayName || auth.user?.username }}</strong>
      </aside>

      <el-form ref="formRef" :model="form" :rules="rules" label-position="top" class="profile-form">
        <el-form-item label="显示名称" prop="displayName"><el-input v-model="form.displayName" :prefix-icon="User" maxlength="64" /></el-form-item>
        <el-form-item label="邮箱" prop="email"><el-input v-model="form.email" :prefix-icon="Message" maxlength="254" autocomplete="email" placeholder="未绑定" /></el-form-item>
        <el-form-item label="手机号" prop="phone"><el-input v-model="form.phone" :prefix-icon="Phone" maxlength="16" autocomplete="tel" placeholder="+8613800138000" /></el-form-item>
        <el-form-item label="头像地址" prop="avatarUrl"><el-input v-model="form.avatarUrl" :prefix-icon="Link" maxlength="1000" placeholder="https://example.com/avatar.png" /></el-form-item>
        <div class="form-actions"><el-button @click="router.push({ name: 'home' })">取消</el-button><el-button type="primary" :loading="saving" @click="save">保存修改</el-button></div>
      </el-form>
    </div>
  </section>
</template>
