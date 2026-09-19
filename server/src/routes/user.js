
const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/me', auth, (req, res) => {
const user = db.prepare('SELECT id, username, nickname, avatar, created_at FROM users WHERE id = ?')
.get(req.user.id);
if (!user) return res.status(404).json({ code: 404, message: '用户不存在' });
res.json({ code: 0, data: user });
});

router.put('/me', auth, (req, res) => {
const { nickname, avatar } = req.body || {};
const now = Date.now();
db.prepare('UPDATE users SET nickname = COALESCE(?, nickname), avatar = COALESCE(?, avatar), updated_at = ? WHERE id = ?')
.run(nickname ?? null, avatar ?? null, now, req.user.id);
const user = db.prepare('SELECT id, username, nickname, avatar FROM users WHERE id = ?').get(req.user.id);
res.json({ code: 0, message: '更新成功', data: user });
});

router.put('/password', auth, (req, res) => {
const { oldPassword, newPassword } = req.body || {};
if (!oldPassword || !newPassword) {
return res.status(400).json({ code: 400, message: '参数不完整' });
}
if (newPassword.length < 6) {
return res.status(400).json({ code: 400, message: '新密码至少6位' });
}
const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);
if (!bcrypt.compareSync(oldPassword, user.password_hash)) {
return res.status(400).json({ code: 400, message: '原密码错误' });
}
const hash = bcrypt.hashSync(newPassword, 10);
db.prepare('UPDATE users SET password_hash = ?, updated_at = ? WHERE id = ?')
.run(hash, Date.now(), req.user.id);
res.json({ code: 0, message: '密码修改成功' });
});

module.exports = router;

