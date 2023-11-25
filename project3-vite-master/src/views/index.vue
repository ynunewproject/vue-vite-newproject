<template>
    <el-container class="h-100%" style="background-image: linear-gradient(to top, #fff1eb 0%, #ace0f9 100%);">
      <el-header class="!h-auto !p-1 w-auto justify-between border-b border-violet-300 mb-1 flex  items-center flex-col" >
        <div class="w-full h-auto items-center text-center flex justify-between mt-2.5%">
          <font-awesome-icon class="fa-2x ml-14% fa-beat-fade color-#9fc610" :icon="['fas', 'book']" bounce @click="goIntroduce()" />
          <img src="src/assets/Image/logo.png" class="w-30% mr-5">
        </div>
        <div style="margin-top: 5%;border-top: #646cff;">
          <img src="src/assets/Image/indexImg.jpg" class="w-full h-auto" >
        </div>
      </el-header>
      <el-main class=" w-full mt-8% !items-center box-border p-[10px] mb-3%" >
        <Predict />
      </el-main>
      <footer class="flex fixed relative bottom-0 w-full !justify-around h-[60px]" style="background-image: linear-gradient(to top, #fff1eb 0%, #ace0f9 100%);">
        <Footer />
      </footer>
    </el-container>
</template>


<script setup lang="ts">
import Predict from "../components/Predict.vue";
import Footer from "../components/Footer.vue";
import router from "../router";

function goIntroduce() {
  router.push('./introduce')
}
</script>

<style lang="less" scoped>
.el-main{
  padding: 0;
}
.el-scrollbar__view{
  height: 100%;
}

</style>