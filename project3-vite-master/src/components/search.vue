<template>
  <div v-show="hasResult" class="h-100%">
    <ul class="pt-1% h-100%">
      <el-card shadow="hover" v-for="item in searchMushroomList" :key="item.id" class="h-19% flex items-center my-[4px] mx-1%">
        <el-image @click="openImageDialog(item)" class="w-39% max-h-35" :src="item.src" fit="cover">
        </el-image>
        <div class="h-auto text-s w-60% flex flex-wrap items-center" >
          <span class="text-left pl-2.5%">名称：{{item.name}}</span>
          <p class="text-left pl-2.5%">是否可食用：{{item.edible}}</p>
          <p class="text-left pl-2.5%">常见分布地：{{item.location}}</p>
        </div>
      </el-card>
      <el-dialog v-model="imageDialogVisible" width="90%">
        <img :src="previewImage.src" style="max-width: 100%;" />
        <p class="text-left pl-2.5% my-2%">分布地：{{previewImage.location}}</p>
        <p class="text-left pl-2.5% my-2%">中毒症状:{{previewImage.symptom}}</p>
        <p class="text-left pl-2.5% my-2%">外部特征:{{previewImage.feature}}</p>
        <p v-if="previewImage.symptom" class="text-left pl-2.5%">误食后特征：{{previewImage.symptom}}</p>
        <p v-else class="text-left pl-2.5%">效用：{{previewImage.efficacy}}</p>
      </el-dialog>
    </ul>
  </div>
  <div class="mt-20%" v-show="!hasResult">
    <p>暂无搜索记录</p>
  </div>
</template>

<script setup>
import {ref,watch,reactive} from "vue";
import {useRoute} from "vue-router"
import {getData} from "../api/api.js";
const routers = useRoute()
const searchMushroomList = ref([])
const hasResult = ref(false)

watch(
    ()=> routers.query,(newQuery,oldQuery)=>{
      console.log(newQuery);
      getData(routers.query).then(res=>{
        if (res.data.length !== 0){
          hasResult.value = true
          searchMushroomList.value = res.data
        }
        else {
          hasResult.value = false
          searchMushroomList.length = 0
          console.log(hasResult.value)
        }
      })
    },
    {
      immediate:true
    }
)

const previewImage = ref(null)
const imageDialogVisible = ref(false)

function openImageDialog(item) {
  previewImage.value = item;
  console.log(previewImage.value)
  imageDialogVisible.value = true;
}
function clicks(){
  console.log(searchMushroomList.value)
}
</script>

<style scoped>
::v-deep(.el-card__body){
  padding: 0;
  display: flex;
}
</style>