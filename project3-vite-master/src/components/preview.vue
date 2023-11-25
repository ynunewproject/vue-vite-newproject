<template>
  <div class="flex items-center justify-center flex-wrap h-auto">
    <el-upload class=" w-full h-[260px] px-9.5% border-dotted border-0.1 border-indigo-300" ref="upload" :show-file-list="false" action="#" :auto-upload="false "
               :on-change="changeHandle"
               drag>
      <img v-show="showImg" class="imgBox w-full" :src="imgUrl" >
      <video v-show="showVideo" class="videoBox w-full" :src="videoUrl" autoplay></video>
      <el-icon v-show="(!showImg)&&(!showVideo)&&(!isCamera)"><Plus /></el-icon>

      <canvas style="display: none" ref="canvasDom"/>
      <video v-show="isCamera" class="w-full" ref="videoDom"></video>


      <template #file="{ file }">
        <div>
          <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
          <span class="el-upload-list__item-actions">
          <span
              class="el-upload-list__item-preview"
              @click="handlePictureCardPreview(file)"
          >
            <el-icon><zoom-in /></el-icon>
          </span>
          <span
              v-if="!disabled"
              class="el-upload-list__item-delete"
              @click="handleDownload(file)"
          >
            <el-icon><Download /></el-icon>
          </span>
          <span
              v-if="!disabled"
              class="el-upload-list__item-delete"
              @click="handleRemove(file)"
          >
            <el-icon><Delete /></el-icon>
          </span>
        </span>
        </div>
      </template>
    </el-upload>
    <br>
    <div class="flex justify-center w-full h-100% mx-9.5% border-dotted border-0.1 border-indigo-300 py-[3px] !border-box">
      <el-button v-show="!isCamera" @click="openCamera">开启摄像头</el-button>
      <el-button v-show="isCamera" @click="insertImg">拍照</el-button>
    </div>

    <el-dialog v-model="dialogVisible">
      <img :src="dialogImageUrl" alt="Preview Image" />
    </el-dialog>
  </div>
  <div class="flex justify-center mt-[5px]">
    <el-button type="primary" plain @click="predict">点击预测</el-button>
  </div>
  <img src="http://localhost:8000/media/%E5%B9%B2%E5%B7%B4%E8%8F%8C.png/">
</template>
<script lang="ts" setup>
import {reactive, ref} from 'vue'
import {Delete, Download, Plus, VideoCamera, VideoPlay, ZoomIn} from '@element-plus/icons-vue'
import {ElMessage} from "element-plus";

import type {UploadFile} from 'element-plus'

const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const disabled = ref(false)
const uploadRef = ref(null);

const showImg = ref(false);
const showVideo = ref(false);
const BaseCode = ref("")
const imgLastName = reactive(["jpg","png","gif","svg","bmp"])
const videoLastName = reactive(["wmv","asf","asx","rm","rmvb","mpg","mpeg","mpe","3gp","mov","mp4","m4v","avi","dat","mkv","flv","vob"])
const imgUrl = ref("")
const videoUrl = ref("")

const isCamera = ref(false)

const canvasDom = ref(null);
const videoDom = ref(null);


const handleRemove = (file: UploadFile) => {
  console.log(file)
}

const handlePictureCardPreview = (file: UploadFile) => {
  dialogImageUrl.value = file.url!
  dialogVisible.value = true
}

const handleDownload = (file: UploadFile) => {
  console.log(file)
}

const changeHandle=(file,files)=>{

    const lastName = file.name.split('.').pop().toLowerCase()
    console.log("lastname is:" + lastName)
    // 获取base64编码并放到框子里
    let reader = new FileReader()
    reader.readAsDataURL(file.raw)
  if (imgLastName.indexOf(lastName) !==-1 ){
    console.log("处理图片")
    showImg.value = true
    showVideo.value = false
    reader.onload = function (e) {
      typeof reader.result === "string" ? BaseCode.value = reader.result : ""
      document.querySelector(".imgBox")['src'] = BaseCode.value
    }
  }
  else if (videoLastName.indexOf(lastName)!==-1){
    console.log("处理视频")
    showVideo.value=true
    showImg.value=false
    reader.onload = function (e) {
      typeof reader.result === "string" ? BaseCode.value = reader.result : ""
      document.querySelector(".videoBox")['src'] = BaseCode.value
    }

  }else {
    ElMessage.error("文件格式不对，只能上传图片或者视频")
    console.log("文件格式不对，只能上传图片或者视频")
  }

}

const predict=()=>{
  if (BaseCode.value === ""){
    ElMessage.error("请先选择图片或者视频")
  }
  console.log(BaseCode.value)
}


const openCamera = () => {
  showImg.value = false
  showVideo.value = false
  isCamera.value = true
  if (navigator.mediaDevices) {
    navigator.mediaDevices.getUserMedia({audio: false, video: true})
        .then((stream) => {
          // 将视频流传入viedo控件
          videoDom.value.srcObject = stream;
          videoDom.value.play();
        })
        .catch((err) => {
          console.log(err);
        });
  } else {
    ElMessage.error("该浏览器不支持开启摄像头，请更换最新版浏览器");
  }
};

const insertImg =async ()=>{
  await takePhoto()
  document.querySelector(".imgBox")['src'] = BaseCode.value
}

const takePhoto =async () => {
  canvasDom.value.width = videoDom.value.videoWidth;
  canvasDom.value.height = videoDom.value.videoHeight;
  canvasDom.value.getContext("2d").drawImage(videoDom.value, 0, 0);
  BaseCode.value = canvasDom.value.toDataURL("image/webp");

  stop();
}

const stop = () => {
  let stream = videoDom.value.srcObject;
  if (!stream) return;
  let tracks = stream.getTracks();
  tracks.forEach((x) => {
    x.stop();
  });
  isCamera.value = false
  showImg.value = true
};


</script>
<style scoped>
.el-upload{
  width: 100%;
  height: 100%;
}
.el-upload-dragger{
  width: 100%;
  height: 100%;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
