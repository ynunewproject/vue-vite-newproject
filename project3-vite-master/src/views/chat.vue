<template>
    <el-scrollbar>
        <div class="common-layout" style="height: 100%;">
            <el-container>
                <el-header class="bg-blend-color !h-auto mb-3" style="background-image: linear-gradient(to top, #fff1eb 0%, #ace0f9 100%);">
                    <div class="flex items-center">
                        <img class="w-30% sm:w-20%" src="../assets/Image/chatBot.png">
                        <p class="pl-2 text-center" style="position: relative; top: 50%; transform: translateY(10%); margin-left: 50px">智能问答</p>
                    </div>
                </el-header>
                <div>
                    <div class="chat-container">
                        <!-- 输入问题区域 -->
                        <div class="chat-input">
                            <el-input style="width: 80%" v-model="question" placeholder="请输入您的问题" clearable />
                            <el-button type="primary" @click="askQuestion">发送</el-button>
                        </div>
                        <!-- 聊天记录显示区域 -->
                        <div class="chat-history" v-auto-animate>
                            <div v-html="item.text" v-for="item in chatHistory" :key="item.id" :class="item.type">
                            </div>
                        </div>

                    </div>
                    <DotLoading v-show="isLoading"/>
                </div>
            </el-container>
        </div>
    </el-scrollbar>

    <footer class="flex fixed bottom-0 w-full !justify-around h-[60px]" style="background-image: linear-gradient(to top, #fff1eb 0%, #ace0f9 100%);">
        <Footer />
    </footer>
</template>

<script setup>
import { ref,nextTick } from 'vue';
import axios from 'axios';
import Footer from "../components/Footer.vue";
import DotLoading from "../components/DotLoading.vue";
const question = ref('');
const chatHistory = ref([]);
const showHistory = ref(false);
const isLoading = ref(false)
const askQuestion = async () => {
    try {
        if(question.value){
            isLoading.value = true
            chatHistory.value.push({id: chatHistory.value.length + 1, text: question.value, type: 'question'});
            await axios.post('http://127.0.0.1:8000/index/chat/', { questions: question.value }).then(response=>{
                chatHistory.value.push({ id: chatHistory.value.length + 1, text:response.data, type: 'answer' });
            }).catch(error=>
                console.log(error)
            ).finally(()=>{
                isLoading.value = false
                question.value = ''; // 清空输入框
                //自动回滚到底部
                nextTick();
                const chatHistoryContainer = document.querySelector(".chat-history")
                chatHistoryContainer.scrollTop = chatHistoryContainer.scrollHeight;
            })
        }

    } catch (error) {
        console.error('请求出错:', error);
    }
}

</script>

<style scoped>
.chat-container {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
}



.chat-history {
    width: 100%;
    overflow-y:auto ;
    max-height: 480px;
}

.chat-history .question,
.chat-history .answer{
    width: 80%;
    padding: 10px;
    border-radius: 10px;
    margin: 10px;
    position: relative;
}

.chat-history .question::before,
.chat-history .answer::before {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    border-style: solid;
}

.chat-history .question::before {
    border-width: 10px 0 10px 15px; /* 调整这里的值 */
    border-color: transparent transparent transparent #f0f0f0; /* 调整这里的值 */
    left: 10px;
    bottom: -10px;
}

.chat-history .answer::before {
    border-width: 10px 15px 10px 0;;
    border-color: transparent rgba(0, 123, 255, 0.99) transparent transparent ;
    right: 10px;
    bottom: -10px;
}



.chat-history .question {
    text-align: left;
    background-color: #f0f0f0;
}

.chat-history .answer {
    text-align: left;
    background-color: rgba(0, 123, 255, 0.99);
    color: #fff;
    margin-left: auto;
}

.chat-input {
    width: 100%;
}
</style>
