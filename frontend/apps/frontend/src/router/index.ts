import { createWebHistory, createRouter } from "vue-router";

export default createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '',
            component: () => import('../views/Home.vue')
        },
        {
            path: '',
            component: () => import('../views/Chat.vue')
        },
    ]
})