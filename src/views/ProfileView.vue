<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { Link, Lock, Message, Phone, User } from '@element-plus/icons-vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { accountApi } from '@/api/account'
import { apiMessage } from '@/api/client'
import { useAuthStore } from '@/stores/auth'
import { passwordConfirmationError } from '@/utils/password'
import { nullable, userInitials } from '@/utils/user'

interface ProfileForm {
  displayName: string
  email: string
  phone: string
  avatarUrl: string
}

interface PasswordForm {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

const auth = useAuthStore()
const formRef = ref<FormInstance>()
const passwordFormRef = ref<FormInstance>()
const saving = ref(false)
const changingPassword = ref(false)
const form = reactive<ProfileForm>({
  displayName: auth.user?.displayName || '',
  email: auth.user?.email || '',
  phone: auth.user?.phone || '',
  avatarUrl: auth.user?.avatarUrl || '',
})
const passwordForm = reactive<PasswordForm>({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})
const initials = computed(() => userInitials(auth.user))
const previewAvatar = computed(() => nullable(form.avatarUrl) || undefined)

const rules: FormRules<ProfileForm> = {
  displayName: [{ required: true, message: '请输入显示名称', trigger: 'blur' }],
  email: [{ type: 'email', message: '请输入有效邮箱', trigger: 'blur' }],
  phone: [{ pattern: /^$|^\+[1-9]\d{7,14}$/, message: '请输入带国家代码的手机号', trigger: 'blur' }],
  avatarUrl: [{ pattern: /^$|^https?:\/\/[^\s]+$/i, message: '请输入有效的 HTTP(S) 地址', trigger: 'blur' }],
}

const passwordRules: FormRules<PasswordForm> = {
  currentPassword: [
    { required: true, message: '请输入当前密码', trigger: 'blur' },
    { max: 72, message: '当前密码不能超过 72 个字符', trigger: 'blur' },
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 8, max: 72, message: '新密码长度为 8-72 个字符', trigger: 'blur' },
  ],
  confirmPassword: [{
    validator: (_rule, value, callback) => {
      const message = passwordConfirmationError(passwordForm.newPassword, String(value ?? ''))
      callback(message ? new Error(message) : undefined)
    },
    trigger: 'blur',
  }],
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

async function changePassword() {
  if (!await passwordFormRef.value?.validate()) return
  changingPassword.value = true
  try {
    await accountApi.updatePassword({
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword,
    })
    ElMessage.success('密码已修改')
  } catch (error) {
    ElMessage.error(apiMessage(error, '密码修改失败'))
  } finally {
    changingPassword.value = false
    Object.assign(passwordForm, { currentPassword: '', newPassword: '', confirmPassword: '' })
    passwordFormRef.value?.clearValidate()
  }
}
</script>

<template>
  <section class="account-section">
    <div class="account-content-heading"><div><h2>基本资料</h2><span>@{{ auth.user?.username }}</span></div></div>

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
        <div class="form-actions"><el-button type="primary" :loading="saving" @click="save">保存修改</el-button></div>
      </el-form>
    </div>

    <div class="password-editor">
      <aside class="password-heading">
        <span><el-icon><Lock /></el-icon></span>
        <strong>修改密码</strong>
      </aside>

      <el-form ref="passwordFormRef" :model="passwordForm" :rules="passwordRules" label-position="top" class="profile-form">
        <el-form-item label="当前密码" prop="currentPassword">
          <el-input v-model="passwordForm.currentPassword" :prefix-icon="Lock" type="password" maxlength="72" autocomplete="current-password" show-password />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="passwordForm.newPassword" :prefix-icon="Lock" type="password" maxlength="72" autocomplete="new-password" show-password />
        </el-form-item>
        <el-form-item label="确认新密码" prop="confirmPassword">
          <el-input v-model="passwordForm.confirmPassword" :prefix-icon="Lock" type="password" maxlength="72" autocomplete="new-password" show-password @keyup.enter="changePassword" />
        </el-form-item>
        <div class="form-actions"><el-button type="primary" :loading="changingPassword" @click="changePassword">修改密码</el-button></div>
      </el-form>
    </div>
  </section>
</template>
