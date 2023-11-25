<template>
    <div class="bg-blue w-full h-full">
      <header class="h-10% bg-blue flex items-center justify-center text-2xl text-gray-200">介绍</header>
      <main class="h-full bg-gray-100">
        <div class="flex">
          <el-input class="ml-0.5%  pt-[2px]" type="text" size="large" :prefix-icon="Search" placeholder="输入名称或者分布地搜索" v-model="searchContent"></el-input>
          <el-button class="mt-[2px]" text size="large" @click="searchMushroom">搜索</el-button>
        </div>
        <router-view/>
      </main>
      <footer class="flex fixed bottom-0 w-full !justify-around h-[60px]" style="background-image: linear-gradient(to top, #fff1eb 0%, #ace0f9 100%);">
        <Footer />
      </footer>
    </div>
</template>

<script setup>
import {ref} from "vue";
import Footer from "../components/Footer.vue"
import {Search} from "@element-plus/icons-vue/global";
import router from "../router/index.js";
const searchContent = ref(null)
const searchMushroom=()=>{
  console.log(searchContent.value)
  if (searchContent.value !== ""){
    router.push({ path: '/search', query: { search: searchContent.value } });
  }
  else {
    router.push('./introduce')
  }
}

</script>

<style scoped>
</style>