<template>
    <div class="common-layout" style="height: 100%;">
      <el-container class=" bg-[#dddddd] h-full">
        <el-header class="bg-blend-color !h-auto mb-3 "  style="background-image: linear-gradient(to top, #fff1eb 0%, #ace0f9 100%);">
          <div class="!h-auto flex justify-center">
            <img class="w-50% sm:w-30%" src="../assets/Image/logo.png" >
          </div>
          <!-- 头像 -->
          <div class="!h-auto flex w-full">
            <el-card class=" w-full !p-0 items-center" shadow="hover" style="background-image: linear-gradient(to top, #fff1eb 0%, #ace0f9 100%);">
              <el-avatar @error="errorHandler">
                <img :src="avaterUrl">
              </el-avatar>

              <span class="ml-14%">用户名</span>

            </el-card>
          </div>
        </el-header>
        <el-main class="flex bg-red !p-0 !h-screen" style="background-image: linear-gradient(to top, #e6e9f0 0%, #eef1f5 100%);">
          <ul class="flex flex-col h-full">
            <li @click="navigatorToHistoryRecord()" class="flex justify-center !h-13.5% font-300 sm:!h-18%">
              <el-button class="flex justify-center w-full !h-full " plain type="success">
                <el-icon class="!text-2xl"><Compass /></el-icon>
                <span class="text-2xl">历史记录</span>
              </el-button>
            </li>
            <li class="flex justify-center !h-13.5% font-300 sm:!h-18%">
              <el-button class="flex justify-center w-full !h-full " plain type="success" >
                <el-icon class="!text-2xl"><Compass /></el-icon>
                <span class="text-2xl">个人资料</span>
              </el-button>
            </li>
            <li class="flex justify-center !h-13.5% font-300 sm:!h-18%">
              <el-button class="flex justify-center w-full !h-full " plain type="success" @click="openUpdate">
                <el-icon class="!text-2xl"><Setting/></el-icon>
                <span class="text-2xl">修改密码</span>
              </el-button>
            </li>
            <li class="flex justify-center !h-13.5% font-300 sm:!h-18%">
              <el-button class="flex justify-center w-full !h-full " plain type="success" >
                <el-icon class="!text-2xl"><Setting/></el-icon>
                <span class="text-2xl">设置</span>
              </el-button>
            </li>
            <li class="flex justify-center !h-13.5% font-300 sm:!h-18%">
              <el-button class="flex justify-center w-full !h-full " plain type="success" @click="logout">
                <span class="text-2xl">退出登录</span>
            <template #icon>
              <font-awesome-icon class="text-2xl" :icon="['fas', 'right-from-bracket']" />
            </template></el-button>
            </li>
          </ul>
        </el-main>

        <footer class="flex fixed bottom-0 w-full !justify-around h-[60px]" style="background-image: linear-gradient(to top, #fff1eb 0%, #ace0f9 100%);">
          <Footer />
        </footer>
      </el-container>

<!--      修改密码-->
      <el-dialog v-model="isOpenUpdate" class="!w-95% ">
        <el-input class="mb-[15px] h-[65px] !text-2xl" v-model="inputOldPwd" type="password"  placeholder="旧密码" clearable>
          <template #prefix>
            <i class="flex items-center"><el-icon size="large"><Lock /></el-icon></i>
          </template>
        </el-input>
        <el-input class="mb-[15px] h-[65px] !text-2xl" v-model="inputNewPwd" type="password"  placeholder="新密码" clearable>
          <template #prefix>
            <i class="flex items-center"><el-icon size="large"><Lock /></el-icon></i>
          </template>
        </el-input>
        <el-input class="mb-[15px] h-[65px] !text-2xl" v-model="inputConfirm" type="password"  placeholder="确认新密码" clearable>
          <template #prefix>
            <i class="flex items-center"><el-icon size="large"><Lock /></el-icon></i>
          </template>
        </el-input>
        <el-button class="!h-[61px] !w-[100px] !text-lg" type="primary" @click="UpdatePwd">修改</el-button>
      </el-dialog>
    </div>
</template>

<script setup>
import {ref} from "vue";
import Footer from "../components/Footer.vue";
import {Setting, Compass, Lock} from "@element-plus/icons-vue/global";
import {ElMessage, ElMessageBox} from "element-plus";
import router from "../router/index.js";
import {updatePwd} from "../api/api.js";

const avaterUrl = ref('src/assets/Image/user.png')
const isOpenUpdate = ref(false)

const inputOldPwd = ref("")
const inputNewPwd = ref("")
const inputConfirm = ref("")

function errorHandler(){
  avaterUrl.value = 'src/assets/Image/avaterErr.png'
}

function openUpdate(){
  isOpenUpdate.value = true
}

async function UpdatePwd(){
  const valid = await validate();
  if (!valid) return;
  ElMessageBox.confirm(
    '确定修改密码？',{
        confirmButtonText:'确定',
        cancelButtonText:'取消',
        type:'warning'
      }
  ).then(async ()=>{
    const response = await updatePwd(window.sessionStorage.getItem('username'),inputOldPwd.value,inputNewPwd.value)
    if (response.data.updatePwdstatus === '1'){
      ElMessage.success("密码已修改，请重新登录")
      window.sessionStorage.clear()
      router.push('/')
    }
    else {
      ElMessage.error("旧密码错误，请重试")
    }
  }).catch(()=>{
    ElMessage.info("已取消操作")
  })

}

async function validate() {
  if (inputNewPwd.value.length < 8 || inputNewPwd.value.length > 15){
    ElMessage.error("新密码长度不符合规范，请重试");
    return false;
  }else if (inputNewPwd.value !== inputConfirm.value){
    ElMessage.error("请确保两次密码一致")
    return false;
  }else {
    return true;
  }
}
const navigatorToHistoryRecord = ()=>{
    router.push('/historyRecord')
}
function logout(){
  ElMessageBox.confirm(
      '确定退出登录',
      '退出登录',
      {
        confirmButtonText:'确定',
        cancelButtonText:'取消',
        type:'warning',
      }
  ).then(()=>{
    window.sessionStorage.clear()
    ElMessage({
      type:'success',
      message:'退出登录',
    })
    router.push('./login')
  }).catch(()=>{
    ElMessage({
      type:'info',
      message:'取消操作',
    })
  })
}

</script>

<style scoped>
.el-card ::v-deep(.el-card__body) {
  padding: 0;
  align-items: center;
  display: flex;
  padding-top: 30px;
  padding-bottom: 30px;
  padding-left: 30px;
}
</style>
