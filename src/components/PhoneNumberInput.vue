<script setup lang="ts">
import { ref, watch } from 'vue'
import { COUNTRY_CALLING_CODES, composePhoneNumber, splitPhoneNumber } from '@/utils/phone'

const props = withDefaults(defineProps<{
  modelValue: string
  placeholder?: string
  autocomplete?: string
}>(), {
  placeholder: '请输入手机号',
  autocomplete: 'tel',
})

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
const callingCode = ref('+86')
const nationalNumber = ref('')

watch(() => props.modelValue, (value) => {
  const parsed = splitPhoneNumber(value || '')
  callingCode.value = parsed.callingCode
  nationalNumber.value = parsed.nationalNumber
}, { immediate: true })

function updateValue() {
  const value = composePhoneNumber(callingCode.value, nationalNumber.value)
  nationalNumber.value = value ? value.slice(callingCode.value.length) : ''
  emit('update:modelValue', value)
}
</script>

<template>
  <el-input
    v-model="nationalNumber"
    type="tel"
    inputmode="numeric"
    :autocomplete="autocomplete"
    :placeholder="placeholder"
    :maxlength="16 - callingCode.length"
    class="phone-number-input"
    @input="updateValue"
  >
    <template #prepend>
      <el-select v-model="callingCode" filterable aria-label="国家或地区区号" @change="updateValue">
        <el-option
          v-for="item in COUNTRY_CALLING_CODES"
          :key="item.country"
          :label="`${item.label} ${item.code}`"
          :value="item.code"
        />
      </el-select>
    </template>
  </el-input>
</template>

<style scoped>
.phone-number-input :deep(.el-input-group__prepend) {
  padding: 0;
}

.phone-number-input :deep(.el-input-group__prepend .el-select) {
  width: 156px;
}
</style>
