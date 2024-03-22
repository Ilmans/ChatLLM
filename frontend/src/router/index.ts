import { createWebHistory, createRouter } from "vue-router";

export default createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '',
            name: 'home',
            component: () => import('../views/Home.vue')
        },
        {
            path: '/model-list',
            name: 'models',
            component: () => import('../views/Models.vue')
        },
        {
            path: '/prompts',
            name: 'prompts',
            component: () => import('../views/Prompts.vue')
        },
    ]
})