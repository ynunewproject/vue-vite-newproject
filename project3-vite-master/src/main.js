import { createApp } from 'vue';
import 'virtual:uno.css';
import '@unocss/reset/tailwind.css';
import './assets/global.css';
import App from './App.vue';
import setupElementPlus from './plugins/element-plus';
import router from './router';
import axiosInstance from "./api/index.js";
import {FontAwesomeIcon} from "./plugins/font-awesome";

import '@unocss/reset/tailwind.css';
import { autoAnimatePlugin } from '@formkit/auto-animate/vue'
import './assets/global.css';
import eventBus from 'vue3-eventbus'

export const ROOT_URL = "http://127.0.0.1:8000/"

/* add fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* add some free styles */
import { faHeart,faComment,faDeleteLeft,faCirclePlus } from '@fortawesome/free-solid-svg-icons'

/* add icons to the library */
library.add(faHeart,faComment,faDeleteLeft,faCirclePlus)

const app = createApp(App);

app.use(router)
app.use(eventBus)
app.use(autoAnimatePlugin)
setupElementPlus(app);
app.config.globalProperties.$axios = axiosInstance;
app.component('font-awesome-icon', FontAwesomeIcon)
app.mount('#app');










