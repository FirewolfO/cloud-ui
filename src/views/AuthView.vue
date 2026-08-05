<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Cloudy, Lock, Message, Phone, User } from '@element-plus/icons-vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { apiMessage } from '@/api/client'
import { useAuthStore } from '@/stores/auth'
import { nullable } from '@/utils/user'

interface LoginForm {
  identifier: string
  password: string
}

interface RegisterForm {
  username: string
  displayName: string
  password: string
  email: string
  phone: string
}

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const activeTab = ref<'login' | 'register'>('login')
const submitting = ref(false)
const loginRef = ref<FormInstance>()
const registerRef = ref<FormInstance>()
const loginForm = reactive<LoginForm>({ identifier: '', password: '' })
const registerForm = reactive<RegisterForm>({ username: '', displayName: '', password: '', email: '', phone: '' })

const loginRules: FormRules<LoginForm> = {
  identifier: [{ required: true, message: '请输入账号、手机号或邮箱', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
}

const registerRules: FormRules<RegisterForm> = {
  username: [
    { required: true, message: '请输入账号', trigger: 'blur' },
    { pattern: /^[A-Za-z][A-Za-z0-9_.-]{2,31}$/, message: '3-32 位，以字母开头，可包含数字、点、_ 或 -', trigger: 'blur' },
  ],
  displayName: [{ required: true, message: '请输入显示名称', trigger: 'blur' }],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 8, max: 72, message: '密码长度为 8-72 个字符', trigger: 'blur' },
  ],
  email: [{ type: 'email', message: '请输入有效邮箱', trigger: 'blur' }],
  phone: [{ pattern: /^$|^\+[1-9]\d{7,14}$/, message: '请输入带国家代码的手机号，例如 +8613800138000', trigger: 'blur' }],
}

async function submitLogin() {
  if (!await loginRef.value?.validate()) return
  submitting.value = true
  try {
    await auth.login({ identifier: loginForm.identifier.trim(), password: loginForm.password })
    loginForm.password = ''
    const redirect = typeof route.query.redirect === 'string' && route.query.redirect.startsWith('/') ? route.query.redirect : '/'
    await router.replace(redirect)
  } catch (error) {
    loginForm.password = ''
    ElMessage.error(apiMessage(error, '登录失败'))
  } finally {
    submitting.value = false
  }
}

async function submitRegister() {
  if (!await registerRef.value?.validate()) return
  submitting.value = true
  try {
    await auth.register({
      username: registerForm.username.trim(),
      displayName: registerForm.displayName.trim(),
      password: registerForm.password,
      email: nullable(registerForm.email),
      phone: nullable(registerForm.phone),
    })
    registerForm.password = ''
    await router.replace({ name: 'home' })
  } catch (error) {
    registerForm.password = ''
    ElMessage.error(apiMessage(error, '注册失败'))
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <main class="auth-page">
    <section class="auth-panel" aria-labelledby="auth-title">
      <div class="auth-brand">
        <span class="brand-icon large"><el-icon><Cloudy /></el-icon></span>
        <div><h1 id="auth-title">Cloud Console</h1><p>统一云服务入口</p></div>
      </div>

      <el-tabs v-model="activeTab" stretch class="auth-tabs">
        <el-tab-pane label="登录" name="login">
          <el-form ref="loginRef" :model="loginForm" :rules="loginRules" label-position="top" @submit.prevent="submitLogin">
            <el-form-item label="账号" prop="identifier">
              <el-input v-model="loginForm.identifier" :prefix-icon="User" autocomplete="username" placeholder="账号、手机号或邮箱" />
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input v-model="loginForm.password" :prefix-icon="Lock" type="password" autocomplete="current-password" show-password @keyup.enter="submitLogin" />
            </el-form-item>
            <el-button class="submit-button" type="primary" native-type="submit" :loading="submitting">登录</el-button>
          </el-form>
        </el-tab-pane>

        <el-tab-pane label="注册" name="register">
          <el-form ref="registerRef" :model="registerForm" :rules="registerRules" label-position="top" @submit.prevent="submitRegister">
            <div class="auth-form-grid">
              <el-form-item label="账号" prop="username"><el-input v-model="registerForm.username" :prefix-icon="User" autocomplete="username" /></el-form-item>
              <el-form-item label="显示名称" prop="displayName"><el-input v-model="registerForm.displayName" :prefix-icon="User" autocomplete="name" /></el-form-item>
            </div>
            <el-form-item label="密码" prop="password"><el-input v-model="registerForm.password" :prefix-icon="Lock" type="password" autocomplete="new-password" show-password /></el-form-item>
            <div class="auth-form-grid">
              <el-form-item label="邮箱（选填）" prop="email"><el-input v-model="registerForm.email" :prefix-icon="Message" autocomplete="email" /></el-form-item>
              <el-form-item label="手机（选填）" prop="phone"><el-input v-model="registerForm.phone" :prefix-icon="Phone" autocomplete="tel" placeholder="+8613800138000" /></el-form-item>
            </div>
            <el-button class="submit-button" type="primary" native-type="submit" :loading="submitting">创建账号</el-button>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </section>
  </main>
</template>
