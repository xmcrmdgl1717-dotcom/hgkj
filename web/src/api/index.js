
import request from './request';

export const authApi = {
register: (data) => request.post('/auth/register', data),
login: (data) => request.post('/auth/login', data)
};

export const userApi = {
me: () => request.get('/user/me'),
updateMe: (data) => request.put('/user/me', data),
changePassword: (data) => request.put('/user/password', data)
};

export const contentApi = {
announcements: () => request.get('/announcements'),
activities: () => request.get('/activities'),
claim: (id) => request.post(/activities/${id}/claim),
myGifts: () => request.get('/my-gifts')
};

