
const express = require('express');
const db = require('../db');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/announcements', (req, res) => {
const list = db.prepare('SELECT * FROM announcements ORDER BY created_at DESC LIMIT 20').all();
res.json({ code: 0, data: list });
});

router.get('/activities', (req, res) => {
const now = Date.now();
const list = db.prepare('SELECT * FROM activities WHERE end_at >= ? ORDER BY start_at DESC').all(now);
res.json({ code: 0, data: list });
});

router.post('/activities/:id/claim', auth, (req, res) => {
const activityId = Number(req.params.id);
const activity = db.prepare('SELECT * FROM activities WHERE id = ?').get(activityId);
if (!activity) return res.status(404).json({ code: 404, message: '活动不存在' });

const now = Date.now();
if (now < activity.start_at || now > activity.end_at) {
return res.status(400).json({ code: 400, message: '活动不在可领取时间内' });
}

const claimed = db.prepare('SELECT id FROM user_gifts WHERE user_id = ? AND activity_id = ?')
.get(req.user.id, activityId);
if (claimed) {
return res.status(409).json({ code: 409, message: '已领取过该礼包' });
}

db.prepare('INSERT INTO user_gifts (user_id, activity_id, claimed_at) VALUES (?, ?, ?)')
.run(req.user.id, activityId, now);

res.json({ code: 0, message: '领取成功', data: { reward: activity.reward } });
});

router.get('/my-gifts', auth, (req, res) => {
const list = db.prepare(SELECT g.id, g.claimed_at, a.title, a.reward FROM user_gifts g JOIN activities a ON a.id = g.activity_id WHERE g.user_id = ? ORDER BY g.claimed_at DESC).all(req.user.id);
res.json({ code: 0, data: list });
});

module.exports = router;

