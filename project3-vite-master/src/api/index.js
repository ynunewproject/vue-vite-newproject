import { createApp } from 'vue';
import Axios from 'axios';

const axiosInstance = Axios.create({
    withCredentials: true
});

axiosInstance.defaults.transformRequest = [function (data) {  //将发送的post参数封装成FROM-DATA，使后端接收
    let ret = ''
    for (let it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
    }
    return ret
}];


axiosInstance.interceptors.request.use((config) => {
    config.headers['X-Requested-With'] = 'XMLHttpRequest';
    const regex = /.*csrftoken=([^;.]*).$/;
    config.headers['X-CSRFToken'] = document.cookie.match(regex) === null ? null : document.cookie.match(regex)[1];
    return config;
});

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 创建 Vue 实例并提供 Axios
const app = createApp({});
app.config.globalProperties.$axios = axiosInstance;

export default axiosInstance;
