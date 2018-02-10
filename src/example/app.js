import Vue from 'vue';
import App from './app.vue'
import Markdown from '../index'

if (process.env.NODE_ENV !== 'production') {
    Vue.config.devtools = true;
}

// 使用markdown标签
Vue.use(Markdown);

// 渲染app
const app = new Vue({
    el: '#app',
    render: h => h(App)
});