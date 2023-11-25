<template>
    <el-card :body-style="{ padding: '0px' }">
        <img
                :src="ROOT_URL+props.item.coverImage"
                class="image"
        />
        <div style="padding: 14px">
            <span>{{ props.item.title }}</span>

            <div class="bottom ">
                <time class="time">{{ props.item.creatTime }}</time>
                <div class="favor icon" >
                    <font-awesome-icon
                        icon="fa-solid fa-heart"
                        :style="props.isFavor?{'color':'#d70f0f'}:{'color':'#d3d3d9'}"
                        @click.stop="addNewFavor(props.item.id)"
                    />
                    <p>{{props.item.favorCount}}</p>
                </div>
                <div class="comment icon">
                    <font-awesome-icon icon="fa-solid fa-comment" style="color: #d3d3d9;"></font-awesome-icon>
                    <p>{{props.item.commentCount}}</p>
                </div>
<!--                <font-awesome-icon icon="fa-solid fa-heart" style="color: #e30d0d;" />-->
<!--                <font-awesome-icon :icon="['fas', 'heart']" style="color: #d70f0f;" />-->
            </div>
            <div class="user">
                <el-avatar :icon="UserFilled" size="small"/>
                <p>{{props.item.creator}}</p>
            </div>
        </div>
    </el-card>
</template>

<script setup>
import { ref,defineProps } from 'vue'
import {ROOT_URL} from "../main.js";
import { UserFilled } from '@element-plus/icons-vue'
const props = defineProps(["item",'isFavor'])
const emit = defineEmits(['favor'])
const addNewFavor = (id)=>{
    emit('favor',id)
}
</script>

<style scoped>
.el-card{

}
.time {
    font-size: 12px;
    color: #999;
}

.bottom {
    margin-top: 13px;
    line-height: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.icon{
    display: flex;
    align-items: center;
    justify-content: center;

}
.icon p{
    font-size: 3.5vw;
    color: black;
}
.image {
    width: 100%;
    display: block;
}
.user{
    display: flex;
    justify-content: left;
    align-items: center;
    gap: 1.5vw;

}
.user p{
    color: #c0c4cc;
}
</style>