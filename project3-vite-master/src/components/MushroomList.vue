<template>
    <ul class="pt-1% h-100%">
        <el-card shadow="hover" v-for="item in mushroomList" :key="item.id" class="h-19% flex items-center my-[4px] mx-1% ">
          <el-image @click="openImageDialog(item)" class="w-39% max-h-35" :src="item.src" fit="cover">
          </el-image>
            <div class="text-s w-60% flex flex-wrap items-center" >
                <span class="text-left pl-2.5%">名称：{{item.name}}</span>
                <p class="text-left pl-2.5%">是否可食用：{{item.edible}}</p>
                <p class="text-left pl-2.5%">常见分布地：{{item.location}}</p>
            </div>
        </el-card>
      <el-dialog v-model="imageDialogVisible" width="90%">
        <el-image :src="previewImage.src" fit="cover" />
        <p class="text-left pl-2.5% my-2%">分布地：{{previewImage.location}}</p>
        <p class="text-left pl-2.5% my-2%">外部特征:{{previewImage.feature}}</p>
        <p v-if="previewImage.symptom" class="text-left pl-2.5%">误食后特征：{{previewImage.symptom}}</p>
        <p v-else class="text-left pl-2.5%">效用：{{previewImage.efficacy}}</p>
      </el-dialog>
    </ul>
</template>

<script setup>
import {onMounted, ref} from "vue";
import { getMushroomList} from "../api/api.js";

const mushroomList = ref([
])

const fetchMushroomData = () => {
  try {
    const params = {}
    getMushroomList().then(res =>{
      mushroomList.value = res.data
    })
  } catch (error) {
    console.error('获取数据时出现错误：', error);
  }
};

onMounted(() => {
  fetchMushroomData();
});

const clicks=()=>{
  console.log(mushroomList.value.data)
}

const previewImage = ref()
const imageDialogVisible = ref(false)

function openImageDialog(item) {
  previewImage.value = item;
  console.log(previewImage.value)
  imageDialogVisible.value = true;
}

</script>

<style scoped>
::v-deep(.el-card__body){
  padding: 0;
  display: flex;
}

::v-deep(.el-card){
  margin: 0 0 0 4px;
  padding: 0;
}


</style>