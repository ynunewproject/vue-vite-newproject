<template>
  <div class="h-full bg-gray-50">
    <div class="h-20%">
      <header class="h-60% bg-blue flex items-center justify-center text-2xl text-gray-200">登录</header>
    </div>
    <div class="h-80% mx-[5px]">
      <el-form class="h-35%" :model="loginForm" :rules="loginFormRules" ref="loginFormRef">
        <!-- 用户名 -->
        <el-form-item class="h-35%" prop="username">
          <el-input class="h-95% !text-xl"  v-model="loginForm.username"  placeholder="用户名" size="large" clearable>
            <template #prefix>
              <i class="text-2xl flex items-center"><el-icon><UserFilled/></el-icon></i>
            </template>
          </el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item class="h-35% !mt-6%" prop="password">
          <el-input class="h-95% !text-xl" v-model="loginForm.password" type="password" placeholder="密码" size="large" :show-password="true" clearable>
            <template #prefix>
              <i class="text-2xl flex items-center"><el-icon><Lock/></el-icon></i>
            </template>
          </el-input>
        </el-form-item>
      </el-form>
      <div class="flex justify-between mt-[3px]">
        <el-button text @click="goRegister" class="underline">还没有账号？去注册</el-button>
        <el-button text class="underline">找回密码</el-button>
      </div>
      <div class="w-full mt-[15px]">
        <el-button  class="w-95% !h-[45px]" type="primary" @click="loginSubmit" auto-insert-space >登录</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import {login,get_csrf_token} from "../api/api.js";
import { ElMessage } from 'element-plus';
import {UserFilled, Lock,} from "@element-plus/icons-vue/global";
import router from "../router/index.js";

const loginForm = ref({
  username: '',
  password: ''
});

const loginFormRules = ref({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 8, max: 15, message: '长度在 8 到 15 个字符', trigger: 'blur' }
  ]
});


const loginSubmit = async () => {
  try {
    // 校验
    const valid = await validateLoginForm();
    if (!valid) return;

    console.log('用户登录');
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
    };
    const response = await login(loginForm.value.username,loginForm.value.password, { headers });
      const data = response.data;
      if (data.state) {
          console.log(data.user.userName)
        window.sessionStorage.clear()
        ElMessage.success('欢迎登陆'+ " "+data.user.userName);
        window.sessionStorage.setItem('token',data.user.token);
        window.sessionStorage.setItem('userPhone',data.user.phone)
        await router.push('/index')
        console.log(data.user.token,data.user.phone);
    }
  } catch (error) {
      console.log(error)
      ElMessage.error("用户名或者密码错误")
    // if(error.response.status === 401 ){
    //   ElMessage.error("用户名或者密码错误")
    // }
    // else if (error.response.status === 400){
    //   ElMessage.error("用户名或者密码不能为空")
    // }
    // else ElMessage.error("网络请求失败")
    // console.log(error)
  }
};

async function validateLoginForm() {
  return new Promise((resolve) => {
    resolve(true);
  });
}

const goRegister = ()=>{
  router.push('/register')
}


</script>

<style scoped>

</style>
