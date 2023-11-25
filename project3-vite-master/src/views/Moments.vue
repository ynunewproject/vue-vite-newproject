<template>
    <header>
        <div class="title">
            广场
        </div>
        <div class="menu">
            <div class="order-btn">
                <el-button
                    v-loading.fullscreen.lock="fullscreenLoading"
                    :type="isLatest?'primary':''"
                    @click="changeOrder()"
                    round
                >最新</el-button>
                <el-button
                    v-loading.fullscreen.lock="fullscreenLoading"
                    :type="!isLatest?'primary':''"
                    @click="changeOrder()"
                    round
                >最热</el-button>
            </div>
                <font-awesome-icon :icon="['fas', 'circle-plus']" style="color:#0088ff;" size="xl" @click="dialogFormVisible = true" />
        </div>
    </header>
    <div class="nav">
        <template v-for="(item) in itemList" :key="item.id">
            <moment-item
                :isFavor="IsFavor(item.id)"
                :item="item"
                @click="showMomentDetails(item.id)"
                @favor="addNewFavor"
            ></moment-item>
        </template>
    </div>
    <div style="width: 100%;height: 60px"></div>
    <footer class="flex fixed  bottom-0 w-full" style="height:60px;background-image: linear-gradient(to top, #fff1eb 0%, #ace0f9 100%);">
        <Footer />
    </footer>

    <el-dialog v-model="dialogFormVisible" title="添加动态" width="90%">
        <el-form :model="form">
            <el-form-item label="标题" :label-width="formLabelWidth">
                <el-input v-model="form.title" autocomplete="off" />
            </el-form-item>
            <el-form-item label="内容" :label-width="formLabelWidth">
                <el-input
                    v-model="form.text"
                    :autosize="{ minRows: 2, maxRows: 4 }"
                    type="textarea"
                    placeholder="Please input"
                />
            </el-form-item>
            <el-form-item>
                <el-upload
                    class="upload-demo"
                    :on-change="handlePreview"
                    list-type="picture"
                    :auto-upload="false"
                    :limit="1"
                >
                    <el-button type="primary">添加图片</el-button>
                </el-upload>
            </el-form-item>
        </el-form>
        <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="submit">
          发布
        </el-button>
      </span>
        </template>
    </el-dialog>
</template>

<script setup>
import {ref,reactive,onMounted,nextTick,computed} from "vue";
import { ElLoading } from 'element-plus'
import Footer from "../components/Footer.vue";
import MomentItem from "../components/moment-item.vue";
import {getMomentsList,getMyFavorsAPI,submitNewMoment,addFavorAPI} from "../api/api.js";
import router from "../router/index.js";
import bus from 'vue3-eventbus'
import axios from "axios";
import {data} from "autoprefixer";
const formLabelWidth = '100px'
const fullscreenLoading = ref(false)
const itemList = reactive([])
const myFavorList = ref([])

onMounted(async ()=>{
    await getMomentsList().then(res=> {
        console.log(res.data.results)
        itemList.splice(0,itemList.length)
        itemList.push(...res.data.results)
        nextTick()
    })
    await getMyFavorsAPI(window.sessionStorage.getItem('token')).then(res=> {
        myFavorList.value = res.data.results.map((obj) => {
            return obj.moment
        })
        nextTick()
    })

})
const isLatest = ref(true)
const changeOrder = async ()=> {
    isLatest.value = !isLatest.value
    const loading = ElLoading.service({
        lock: true,
        text: '加载中',
        background: 'rgba(0, 0, 0, 0.3)',
    })
    //获取最新或者最热
    const orderBy = isLatest.value?'creatTime':'favorCount'
    getMomentsList(orderBy).then(res=> {
        loading.close()
        itemList.splice(0,itemList.length)
        itemList.push(...res.data.results)
        nextTick()
    }).catch(()=>{
        loading.close()
    })

}
function IsFavor(id) {
    return myFavorList.value.indexOf(id) !== -1
}
const showMomentDetails =  (pk)=>{
    router.push({ path:`./moments/momentDetail/${pk}`,state: {params:IsFavor(pk)}})
}
const dialogFormVisible = ref(false)
const form = reactive({
    title: '',
    text:"",
    image:""
})
const handlePreview = (e)=>{
    form.image = e.raw
}
const submit =()=>{
    //发布
    axios.post(`http://127.0.0.1:8000/index/moments/?token=${window.sessionStorage.getItem('token')}`,form,
        {headers:{'Content-Type':'multipart/form-data'}}).then(response=>{
            itemList.splice(0,itemList.length)
            itemList.push(...response.data.momentsList)
            dialogFormVisible.value = false
    }).catch(e=>console.log(e))
}
//点赞
const addNewFavor = async (data)=>{
    await addFavorAPI(data,window.sessionStorage.getItem('token')).then(res=>{
        itemList.splice(0,itemList.length)
        itemList.push(...res.data.momentsList)
    })
    await getMyFavorsAPI(window.sessionStorage.getItem('token')).then(res=> {
        myFavorList.value = res.data.results.map((obj) => {
            return obj.moment
        })
        nextTick()
    })
}
</script>

<style scoped>
.title{
    text-align: left;
    border-bottom: 1px solid rgba(0,0,0,0.5);
    padding: 2vw;
}
.nav{
    background: rgba(0,0,0,0.2);
    width: 100%;
    display: grid;
    grid-template-columns: repeat(auto-fill,minmax(155px,1fr));
    gap: 10px;

}
.menu{
    margin-top: 2.5vw;
    padding: 1.5vw;
    border-bottom: 1px solid rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    justify-content: space-between;
}
</style>