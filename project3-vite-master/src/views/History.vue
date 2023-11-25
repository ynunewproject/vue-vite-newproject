<template>
  <el-scrollbar>
    <el-container class="w-full " >
      <el-header class="!h-auto !p-1 w-auto justify-between border-b border-violet-300 mb-1 flex  items-center flex-col" >
        <div class="w-full h-auto items-center text-center flex justify-between mt-2.5%">
          <span class="pl-5% lg:pl-9%">
              <el-button :icon="ArrowLeft" @click="router.go(-1)">识别记录</el-button>
          </span>
          <img src="../assets/Image/logo.png" class="w-28% mr-4">
          <el-button type="primary" @click="chanmang" style="border-color: #ace0f9"  round >管理</el-button>
        </div>
        <div style="margin-top: 5%;border-top: #646cff;">
          <img src="../assets/Image/indexImg.jpg" class="w-full h-auto" >
        </div>
      </el-header>
      <el-main class=" w-full h-auto box-border p-[10px]" >
        <div class="demo-collapse">
          <el-collapse accordion>
            <div v-if="mang">
              <div v-for="(item, index) in items" :key="index" class="box">
                <el-collapse-item :name="item.id">
                  <template #title>
                    <img :src="ROOT_URL+item.filePath" style="max-width: 100%; max-height: 90%;" >
                    <p style="text-align: right">{{item.mushroomClassInfo.mushroomClass}}</p>
                  </template>
                  <img :src="ROOT_URL+item.filePath" style="display: block; margin: 0 auto;" >
                  <div>
                    是{{item.mushroomClassInfo.mushroomClass}}的可能性为{{item.confidence}}
                  </div>
                  <div>
                    {{item.mushroomClassInfo.mushroomClass}}，学名为{{item.mushroomClassInfo.ScientificName}}，该菌种{{item.mushroomClassInfo.edible}}。
                  </div>
                  <div>
                    特征：{{item.mushroomClassInfo.feature}}。
                  </div>
                  <div>
                    {{item.mushroomClassInfo.description}}。
                  </div>
                </el-collapse-item>
              </div>
            </div>
            <div v-else>
              <div v-for="(item, index) in items" :key="index" class="box">
                <el-collapse-item :name="item.id">
                  <template #title>
                    <img :src="ROOT_URL+item.filePath" style="max-width: 100%; max-height: 90%;" >
                      {{item.mushroomClassInfo.formatted_creatTime}}
                    <el-button type="danger" :icon="Delete " circle @click.stop="deleteRecord(item.id)"/>
                  </template>
                  <img :src="ROOT_URL+item.filePath" style="display: block; margin: 0 auto;" >
                  <div>
                    是{{item.mushroomClassInfo.mushroomClass}}的可能性为{{item.confidence}}
                  </div>
                  <div>
                    {{item.mushroomClassInfo.mushroomClass}}，学名为{{item.mushroomClassInfo.ScientificName}}，该菌种{{item.mushroomClassInfo.edible}}。
                  </div>
                  <div>
                    特征：{{item.mushroomClassInfo.feature}}。
                  </div>
                  <div>
                    {{item.mushroomClassInfo.description}}。
                  </div>
                </el-collapse-item>
              </div>
            </div>
          </el-collapse>
        </div>

      </el-main>

    </el-container>
  </el-scrollbar>
</template>


<script setup lang="ts">
import {ArrowLeft, InfoFilled} from '@element-plus/icons-vue'
import {computed} from "vue";
import router from "../router";
import {Delete} from '@element-plus/icons-vue';
import Footer from "../components/Footer.vue";
import {ref,defineExpose,onMounted,reactive} from "vue";
import {getHistoricalRecords,deleteHistoricalRecords} from "../api/api.js";
import {ROOT_URL} from "../main.js";

const mang = ref(true);
const chanmang = () => {
  mang.value = !mang.value;
};
const deleteRecord = (id)=>{
    const index = items.findIndex((obj) => obj.id === id)
    items.splice(index,1)
    deleteHistoricalRecords(id).then(res=>{
        console.log(res.data)
    })
}
// 使用defineExpose导出数据和方法
defineExpose({ mang, chanmang });
const items =reactive([])
onMounted(async ()=>{
    await getHistoricalRecords(window.sessionStorage.getItem('token')).then(res=>{
        items.splice(0,items.length)
        items.push(...res.data)
    })
})


</script>

<style scoped>

</style>