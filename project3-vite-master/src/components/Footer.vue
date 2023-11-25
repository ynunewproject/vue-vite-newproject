<template>
<!--  <el-footer class="flex fixed bottom-0 w-full !h-[60px]" style="background-image: linear-gradient(to top, #fff1eb 0%, #ace0f9 100%);">-->
    <ul class="flex !justify-around items-center w-full">
      <li><el-button circle type="primary" :icon="House" @click="goIndex"></el-button></li>
      <li><el-button circle :icon="Promotion" type="primary" @click="goChat"></el-button></li>
      <li><el-button circle :icon="DataBoard" type="primary" @click="goMoments"></el-button></li>
      <li><el-button circle type="primary" :icon="User" @click="goUserInfo"></el-button></li>
    </ul>
<!--  </el-footer>-->
</template>

<script setup>
import {DataBoard, House, Promotion, User} from "@element-plus/icons-vue/global";
import router from "../router/index.js";

const goIndex = ()=>{
  router.push('./index')
}

const goUserInfo=()=>{
  router.push('./userInfo')
}

const goChat=()=>{
  router.push('./chat')
}
const goMoments=()=>{
    router.push('./moments')
}
</script>

<style scoped>

</style>