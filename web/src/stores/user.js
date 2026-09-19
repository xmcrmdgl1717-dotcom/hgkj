
import { defineStore } from 'pinia';
import { authApi, userApi } from '../api';

export const useUserStore = defineStore('user', {
state: () => ({
token: localStorage.getItem('token') || '',
user: JSON.parse(localStorage.getItem('user') || 'null')
}),
getters: {
isLoggedIn: (s) => !!s.token
},
actions: {
setAuth({ token, user }) {
this.token = token;
this.user = user;
localStorage.setItem('token', token);
localStorage.setItem('user', JSON.stringify(user));
},
async login(payload) {
const res = await authApi.login(payload);
this.setAuth(res.data);
},
async register(payload) {
const res = await authApi.register(payload);
this.setAuth(res.data);
},
async fetchMe() {
const res = await userApi.me();
this.user = res.data;
localStorage.setItem('user', JSON.stringify(res.data));
},
logout() {
this.token = '';
this.user = null;
localStorage.removeItem('token');
localStorage.removeItem('user');
}
}
});

