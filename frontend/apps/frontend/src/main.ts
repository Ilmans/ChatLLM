import "./assets/css/tailwind.css"
import './styles.css';
import { createApp } from 'vue';
import App from './App.vue';
import router from './router'
import { createPinia } from 'pinia'
const pinia = createPinia()

const app = createApp(App);

app
    .use(router)
    .use(pinia)

app.mount('#root');
