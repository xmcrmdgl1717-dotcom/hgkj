
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

const router = express.Router();

function signToken(user) {
return jwt.sign(
{ id: user.id, username: user.username },
process.env.JWT_SECRET,
{ expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
);
}

router.post('/register', (req, res) => {
const { username, password, nickname } = req.body || {};
if (!username || !password) {
return res.status(400).json({ code: 400, message: '用户名和密码不能为空' });
}
if (username.length < 3 || password.length < 6) {
return res.status(400).json({ code: 400, message: '用户名至少3位，密码至少6位' });
}
const exists = db.prepare('SELECT id FROM users WHERE username = ?').get(username);
if (exists) {
return res.status(409).json({ code: 409, message: '用户名已存在' });
}
const hash = bcrypt.hashSync(password, 10);
const now = Date.now();
const info = db.prepare(
INSERT INTO users (username, password_hash, nickname, created_at, updated_at) VALUES (?, ?, ?, ?, ?)
).run(username, hash, nickname || username, now, now);

const user = db.prepare('SELECT * FROM users WHERE id = ?').get(info.lastInsertRowid);
const token = signToken(user);
res.json({
code: 0,
message: '注册成功',
data: {
token,
user: { id: user.id, username: user.username, nickname: user.nickname, avatar: user.avatar }
}
});
});

router.post('/login', (req, res) => {
const { username, password } = req.body || {};
if (!username || !password) {
return res.status(400).json({ code: 400, message: '用户名和密码不能为空' });
}
const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
if (!user || !bcrypt.compareSync(password, user.password_hash)) {
return res.status(401).json({ code: 401, message: '用户名或密码错误' });
}
const token = signToken(user);
res.json({
code: 0,
message: '登录成功',
data: {
token,
user: { id: user.id, username: user.username, nickname: user.nickname, avatar: user.avatar }
}
});
});

module.exports = router;

