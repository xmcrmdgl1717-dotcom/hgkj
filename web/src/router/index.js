
import { createRouter, createWebHashHistory } from 'vue-router';
import { useUserStore } from '../stores/user';

const routes = [
{ path: '/', redirect: '/home' },
{ path: '/home', component: () => import('../views/Home.vue') },
{ path: '/login', component: () => import('../views/Login.vue') },
{ path: '/register', component: () => import('../views/Register.vue') },
{ path: '/activities', component: () => import('../views/Activities.vue') },
{ path: '/profile', component: () => import('../views/Profile.vue'), meta: { requiresAuth: true } },
{ path: '/my-gifts', component: () => import('../views/MyGifts.vue'), meta: { requiresAuth: true } }
];

const router = createRouter({
history: createWebHashHistory(),
routes
});

router.beforeEach((to) => {
const store = useUserStore();
if (to.meta.requiresAuth && !store.isLoggedIn) {
return { path: '/login', query: { redirect: to.fullPath } };
}
return true;
});

export default router;

