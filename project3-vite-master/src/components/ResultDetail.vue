<template>
    <div style="background-color:#f5f7fa;display: flex;align-items: center;flex-direction: column;justify-content: space-between">
        <div style="width: 100%;height: 50px;text-align: left" @click="router.go(-1)">◀返回</div>
        <el-card :body-style="{ padding: '0px',marginTop:'20px',width:'100vw' }">
            <img
                :src="ROOT_URL+resultData.filePath"
                class="image"
                style="margin: 0 auto;width: 100vw"
            />
            <div style="padding: 14px">
                <span>{{ resultData.mushroomClassInfo.mushroomClass }}</span>
            </div>
            <div class="demo-collapse">
                <el-collapse accordion>
                    <el-collapse-item title="查看详情" >
                        <div>
                            学名：{{ resultData.mushroomClassInfo.ScientificName }}
                        </div>
                        <div>
                            毒性：{{ resultData.mushroomClassInfo.edible }}
                        </div>
                        <div>
                            特征：{{ resultData.mushroomClassInfo.feature }}
                        </div>
                        <div>
                            简介：{{ resultData.mushroomClassInfo.description }}
                        </div>
                    </el-collapse-item>
                </el-collapse>
            </div>
        </el-card>
        <el-button type="success" style="margin-top: 2.5vw">分享</el-button>
    </div>


</template>

<script setup>
import {onMounted,ref} from "vue";
import router from "../router/index.js";
import {ROOT_URL} from "../main.js";

const resultData = ref(history.state.params)

</script>

<style scoped>
.el-collapse-item div{
    text-align: left;
}
</style>