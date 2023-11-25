<template>
    <header style="position: fixed;width:100%;display: flex;justify-content: left;z-index: 1;background-color: white;margin-bottom: 35px">
        <el-button class="navigatorBack"  :icon="ArrowLeftBold"  @click="router.go(-1)">菌子之交</el-button>
    </header>
    <el-image style="width: 100%" :src="ROOT_URL+momentInfo.coverImage"  fit="cover" >
        <template #error>
            <div class="image-slot">
                <el-icon><icon-picture /></el-icon>
            </div>
        </template>
    </el-image>
    <div class="momentInfo">
        <div class="momentInfo-title">
            <p>{{momentInfo.creatTime}}</p>
            <div class="comment icon">
                <font-awesome-icon icon="fa-solid fa-comment" style="color: #d3d3d9;"></font-awesome-icon>
                <p>{{momentInfo.commentCount}}</p>
            </div>
        </div>
        <div class="userInfo">
            <div class="userInfo-left">
                <div class="userInfo-avatar">
                    <el-avatar :icon="UserFilled" size="small"/>
                    <p>{{momentInfo.creator}}</p>
                </div>
                <p class="contend">{{momentInfo.text}}</p>
                <div class="flex flex-wrap gap-2 my-2 " style="display: flex;justify-content: left">
                    <el-tag
                        type="success"
                        class="mx-1"
                        effect="plain"
                        round
                    >
                        #{{momentInfo.title}}
                    </el-tag>
                </div>
            </div>
            <div class="userInfo-right icon">
                <font-awesome-icon icon="fa-solid fa-heart" size="2xl" :style="isFavor?{'color':'#d70f0f'}:{'color':'#d3d3d9'}" @click.stop="emitNewFavor"/>
                <p style="color: #d2cbcf">{{momentInfo.favorCount}}</p>
            </div>
        </div>
    </div>
    <div class="comment-nav" v-auto-animate>
        <ul class="comment-nav-ul" v-for="item in comments" :key="item.id">
            <li style="padding-top: 2.5vw;border-top: 1px solid rgba(192,196,204,0.4);position: relative">
                <div class="comment-nav-li">
                    <div class="avatar" >
                        <el-avatar :icon="UserFilled" size="small" />
                    </div>
                    <div class="nickNameBox" >
                        <div style="display: flex;align-items: center;justify-content: center;gap: 5px">
                            <p class="nickName" >{{item.user}}</p>
                            <div v-if="creatorCommentList.indexOf(item.id) !== -1" class="flex flex-wrap gap-2 my-2" >
                                <el-tag
                                    type="danger"
                                    class="mx-1 my-tag"
                                    effect="dark"
                                    size="small"
                                >
                                    作者
                                </el-tag>
                            </div>
                            <div v-else-if="myCommentList.indexOf(item.id) !== -1" class="flex flex-wrap gap-2 my-2">
                                <el-tag
                                    type="info"
                                    class="mx-1 my-tag"
                                    effect="dark"
                                >
                                    我
                                </el-tag>
                            </div>
                        </div>

                        <p class="creatTime" >{{item.creatTime}}</p>
                    </div>
                </div>
                <p class="comment-content" >{{item.content}}</p>
                <div v-if="myCommentList.indexOf(item.id) !== -1" style="position: absolute;right: 0;top:0;padding-right: 1.5vw">
                    <font-awesome-icon  :icon="['fas', 'delete-left']" style="color: #959aa3;" @click.prevent="deleteComment(item.id)" />
                </div>
            </li>
        </ul>
    </div>
    <div style="width: 100%;height: 45px"></div>
  <footer>
      <el-input style="width: 70%" v-model="commentsInput" placeholder="说说你的想法..." clearable />
      <el-button type="primary" @click="submitNewComment">评论</el-button>
  </footer>
</template>

<script setup>
import { UserFilled } from '@element-plus/icons-vue'
import {ArrowLeftBold} from "@element-plus/icons-vue/global";
import { defineProps,onMounted,reactive,nextTick,ref } from 'vue'
import {getMomentsDetail,getComments,submitNewCommentAPI,addFavorAPI,deleteCommentAPI} from "../api/api.js";
import { Picture as IconPicture } from '@element-plus/icons-vue'
import router from "../router/index.js";
import {ROOT_URL} from "../main.js";
import bus from 'vue3-eventbus'

let isFavor = ref(history.state.params)

const props = defineProps({
    pk: {
        type: Number,
        default: '0',
        required: true
    }
})
let momentInfo = reactive({})
const comments = ref([])
const creatorCommentList = reactive([])
const myCommentList = reactive([])
onMounted(async ()=>{
    await getMomentsDetail(props.pk).then(res=>{
        if (res.data.state){
            momentInfo = res.data.data
            //获取评论
            getComments(props.pk,window.sessionStorage.getItem('token')).then(res=> {
                comments.value = res.data.commentList
                myCommentList.splice(0,myCommentList.length)
                myCommentList.push(...res.data.myCommentIds)
                creatorCommentList.splice(0,creatorCommentList.length)
                creatorCommentList.push(...res.data.creatorCommentIds)
            }).catch(err=>console.log(err))
            nextTick()
        }
        else console.log("动态不存在")
    })
})
const commentsInput = ref('')
const submitNewComment = async ()=>{
   await submitNewCommentAPI(props.pk,commentsInput.value,window.sessionStorage.getItem('token')).then(res=> {
        comments.value = res.data.data
        momentInfo.commentCount = res.data.commentCount
       getComments(props.pk,window.sessionStorage.getItem('token')).then(res=> {
           comments.value = res.data.commentList
           myCommentList.splice(0,myCommentList.length)
           myCommentList.push(...res.data.myCommentIds)
           creatorCommentList.splice(0,creatorCommentList.length)
           creatorCommentList.push(...res.data.creatorCommentIds)
       }).catch(err=>console.log(err))
    }).catch(err=>console.log(err))
    await nextTick()
}

const emitNewFavor = async ()=>{
    await addFavorAPI(props.pk,window.sessionStorage.getItem('token')).then(res=>{
        momentInfo.favorCount = res.data.favorCount
        isFavor.value = res.data.op === 'create'
    }).catch(err=>console.log(err))
    // bus.emit('myFavorList', { moment_id: props.pk,op:res.data.op })
}
const deleteComment = (id)=>{
    deleteCommentAPI(id,window.sessionStorage.getItem('token')).then(res=>{
        if(res.data.state){
            //在所有评论里删除
            const index = comments.value.findIndex(obj => obj.id === id)
            comments.value.splice(index, 1);
            //在我的评论里面删除
            myCommentList.splice(myCommentList.indexOf(res.data.deleteId),1)
            console.log(res.data.msg)
            //count--
            momentInfo.commentCount = comments.value.length
            nextTick()
        }else console.log(res.data.msg)
    }).catch(err=>console.log(err))
}
</script>

<style scoped>
.navigatorBack{
    border: white;
    font-size: 3.5vw;
    z-index: 1
}
footer{
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    height: 35px;
    width: 100%;
    position: fixed;
    bottom: 0;
    background-color: rgba(192,196,204,0.4);
}
.momentInfo{
    padding: 0 3.5vw 1.2vw;
    margin-bottom: 5vw;
}

.momentInfo-title{
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 3.5vw;
    color: rgb(135,135,135)
}
.icon{
    display: flex;
    align-items: center;
    justify-content: left;
}
.userInfo{
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.userInfo-avatar{
    margin-top: 1.5vw;
    display: flex;
    align-items: center;
    justify-content: left;
    gap: 15px;
}
.userInfo-left{
    height: 25vw;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
}
.userInfo-right{
    width: 15%;
}
.contend{
    text-align: left;
    width: 250px;
    word-wrap: break-word;
}
.comment-nav-ul{
    width: 100%;
    display: grid;
    grid-template-columns: 1fr;
}
.comment-nav-li{
    display: grid;
    grid-template-columns: 1fr 5fr;
}
.comment-nav-li .avatar{
    display: flex;
    justify-content: right;
    align-items: center;
}
.comment-nav-li .nickNameBox{
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding-left: 3.5vw;
}
.comment-nav-li .nickNameBox .nickName{
    display: flex;
    align-items: center;
    justify-content: center;
    height: 4.5vw;
}
.comment-nav-li .nickNameBox .creatTime{
    color: rgb(135,135,135);
    font-size: 3vw;
}
.comment-content{
    width: 50%;
    text-align: left;
    margin-top: 2.5vw;
    margin-left: 10vw;
    font-size: 3.5vw;
    height: auto;
    word-wrap:break-word;
    word-break:break-all;
    overflow: hidden;
}
.my-tag{
    width: 7vw;
    height: 5vw;
    font-size: 3vw;
}

</style>