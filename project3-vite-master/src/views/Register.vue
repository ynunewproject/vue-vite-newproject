<template>
  <div class="h-full bg-gray-50">
    <div class="h-20%">
      <header class="h-60% bg-blue flex items-center justify-center text-2xl text-gray-200">注册</header>
    </div>
    <div class="h-80% mx-[5px]">
      <el-form class="h-52.5%" :model="regiterForm" :rules="regiterFormRules" ref="regiterFormRef">
        <!-- 用户名 -->
        <el-form-item class="h-26%" prop="username">
          <el-input class="h-90% !text-xl" v-model="regiterForm.username"  placeholder="用户名" size="large" clearable>
            <template #prefix>
              <i class="text-2xl flex items-center"><el-icon><UserFilled/></el-icon></i>
            </template>
          </el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item class="h-26%" prop="password">
          <el-input class="h-90% !text-xl" v-model="regiterForm.password" type="password" placeholder="密码" size="large" :show-password="true" clearable>
            <template #prefix>
              <i class="text-2xl flex items-center"><el-icon><Lock/></el-icon></i>
            </template>
          </el-input>
        </el-form-item>
        <!--        确认密码-->
        <el-form-item class="h-26%" prop="confirmed_pwd">
          <el-input class="h-90% !text-xl" v-model="regiterForm.confirmed_pwd" type="password" :show-password="true" placeholder="确认密码" size="large" clearable autocomplete="off">
            <template #prefix>
              <i class="text-2xl flex items-center"><el-icon><Lock/></el-icon></i>
            </template>
          </el-input>
        </el-form-item>
      </el-form>
      <div class="flex justify-between mt-[15px]">
        <el-button text @click="returnLogin" class="underline">已有账号？去登录</el-button>
      </div>
      <div class="w-full mt-[15px]">
        <el-button  class="w-95% !h-[45px]" type="primary" @click="registerSubmit" auto-insert-space >注册</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue';
import {get_csrf_token, register} from '../api/api'
import {ElMessage} from 'element-plus';
import {Lock, UserFilled} from "@element-plus/icons-vue/global";
import router from "../router/index.js";

const regiterForm = ref({
  username: '',
  password: '',
  confirmed_pwd: '',
});
const validatePass2 = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请确认密码'))
  } else if (value !== regiterForm.value.password) {
    callback(new Error("两次密码不一致"))
  } else {
    callback()
  }
};

const regiterFormRules = ref({
  username: [
    {required: true, message: '请输入用户名', trigger: 'blur'},
    {min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur'},
  ],
  password: [
    {required: true, message: '请输入密码', trigger: 'blur'},
    {min: 8, max: 15, message: '长度在 8 到 15 个字符', trigger: 'blur'}
  ],
  confirmed_pwd: [
    {validator: validatePass2, trigger: 'blur'}
  ]
});

const registerSubmit = async () => {
  // 校验
  const valid = await validateRegisterForm();
  if (!valid) return;
  try {
    console.log('用户注册');
    const responsecsrf = await get_csrf_token();
    if (responsecsrf.status === 200) {
      const headers = ref({
        'Content-Type': 'application/x-www-form-urlencoded',
        "Content-Length": responsecsrf.headers["content-length"],
        "X-CSRFToken": responsecsrf.data.csrftoken,
      })
      try {
        const response = await register(regiterForm.value.username, regiterForm.value.password, headers);
        if (response.status === 200) {
          const data = response.data;
          if (data.registerstatus === '1') {
            ElMessage.success('注册成功');
            await router.push('/')
          }
        }

      } catch (error) {
        if (error.response.status === 409) {
          ElMessage.error("用户名已存在")
        } else if (error.response.status === 400) {
          console.log(error)
          ElMessage.error("用户名或者密码不能为空")
        } else {
          ElMessage.error('网络请求失败');
        }
      }
    }
  } catch (error) {
    ElMessage.error("错误信息：" + error)
    console.log("错误信息是" + error)
  }
};

async function validateRegisterForm() {
  if (regiterForm.value.username && regiterForm.value.password){
    if (regiterForm.value.username.length >= 2 && regiterForm.value.username.length <= 15){
      if (regiterForm.value.password.length >= 8 && regiterForm.value.password.length <= 15){
        if (regiterForm.value.confirmed_pwd) {
          if (regiterForm.value.password === regiterForm.value.confirmed_pwd)
            return true
          else {
            ElMessage.error("两次输入密码不一致")
            return false
          }
        } else {
          ElMessage.error("请确认密码")
          return false;
        }
      } else {
        console.log(regiterForm.value.username)
        console.log(regiterForm.value.username.length)
        console.log(regiterForm.value.password)
        console.log(regiterForm.value.password.length)
        ElMessage.error("请确保密码长度符合规范")
        return false;
      }
    }else {
      console.log(regiterForm.value.username)
      console.log(regiterForm.value.username.length)
      console.log(regiterForm.value.password)
      console.log(regiterForm.value.password.length)
      ElMessage.error("请确保用户名长度符合规范")
      return false;
    }
  }else {
    ElMessage.error("用户名或者密码不能为空")
    return false;
  }
}
const returnLogin = () => {
  router.push('/login')
}

</script>

<style scoped>

</style>
