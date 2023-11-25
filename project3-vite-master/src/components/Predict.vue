<template>
  <div class="flex items-center justify-center flex-wrap h-auto ">
    <el-upload class=" w-100% h-[320px] mx-9.5% border-dotted border-0.1 border-indigo-300" ref="upload" :show-file-list="false" action="#" :auto-upload="false "
               :on-change="changeHandle"
               drag>
      <img v-show="showImg" class="imgBox w-full" :src="imgUrl" >
      <video v-show="showVideo" class="videoBox w-full" :src="videoUrl" autoplay></video>
      <el-icon class="!text-3xl"  v-show="(!showImg)&&(!showVideo)&&(!isCamera)"><Plus /></el-icon>

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

    <div class="flex justify-center w-full mx-9.5% border-dotted border-0.1 border-indigo-300 py-[3px] !border-box">
      <el-button v-show="!isCamera" @click="openCamera()">开启摄像头</el-button>
      <el-button v-show="isCamera" @click="insertImg()">拍照</el-button>
    </div>

    <el-dialog v-model="dialogVisible">
      <img :src="dialogImageUrl" alt="Preview Image" />
    </el-dialog>

    <div class="flex justify-center mt-[5px]">
      <el-button type="primary" size="large" plain @click="predict()">开始识别</el-button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {reactive, ref} from 'vue'
import {Delete, Download, Plus, ZoomIn} from '@element-plus/icons-vue'
import type {UploadFile} from 'element-plus'
import {ElMessage,ElLoading} from "element-plus";
import {PredictMethods,GetBaseCode} from "../api/api.js";
import router from "../router/index.js";
const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const disabled = ref(false)
const uploadRef = ref(null);

const showImg = ref(false);
const showVideo = ref(false);
const BaseCode = ref("")
const imgLastName = reactive(["jpg","png","gif","svg","bmp","jpeg"])
const BlobCode = ref(null)
const videoLastName = reactive(["wmv","asf","asx","rm","rmvb","mpg","mpeg","mpe","3gp","mov","mp4","m4v","avi","dat","mkv","flv","vob"])
const imgUrl = ref("")
const videoUrl = ref("")

const isCamera = ref(false)

const canvasDom = ref(null);
const videoDom = ref(null);

const getcode = ()=>{
  GetBaseCode({'Content-Type': 'application/x-www-form-urlencoded'}).then(res=>{
    console.log(res)
  })
}

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
  isCamera.value = false
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

const predict= async ()=> {
  if (BaseCode.value === "") {
    ElMessage.error("请先选择图片或者视频")
  } else {
      const loading = ElLoading.service({
          lock: true,
          text: '识别中，请稍等',
          background: 'rgba(0, 0, 0, 0.7)',
      })
      await PredictMethods({
          userPhone: 13324774798,
          fileData: BaseCode.value
      }, {'Content-Type': 'application/x-www-form-urlencoded'}).then(res => {
              loading.close()
              // console.log(res.data.base64Data)
              if (res.data.fileType.includes("image")){
                  if (res.data.confidence){
                      console.log(res.data)
                      router.push({path:'index/resultDetail',state:{params:res.data}})
                  }else {
                      alert("识别失败请重试")
                  }
              }else {
                  base64ToBlobUrl(res.data.base64Data, "video/mp4")
                      .then((blobUrl) => {
                          // 在这里使用 Blob 地址，比如将其设置为图像的 src
                          document.querySelector(".videoBox")['src'] = blobUrl
                      })
                      .catch((error) => {
                          console.error("Error:", error.message);
                      });
              }

          }
      ).catch(e=> {
          loading.close()
          ElMessage.error("服务器出错了请重试")
      })
      // console.log(BaseCode.value)
  }
}

function base64ToBlobUrl(base64, mimeType) {
    return new Promise((resolve, reject) => {
        // 解码 base64 编码为二进制数据
        const binaryStr = atob(base64);
        const byteArray = new Uint8Array(binaryStr.length);

        for (let i = 0; i < binaryStr.length; i++) {
            byteArray[i] = binaryStr.charCodeAt(i);
        }

        // 创建 Blob 对象
        const blob = new Blob([byteArray], { type: mimeType });

        // 创建 Blob 地址
        const blobUrl = URL.createObjectURL(blob);

        // 返回 Blob 地址
        if (blobUrl) {
            resolve(blobUrl);
        } else {
            reject(new Error("Failed to create Blob URL."));
        }
    });
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
<style>
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
  background-image: linear-gradient(to top, #e6e9f0 0%, #eef1f5 100%);
}
</style>
