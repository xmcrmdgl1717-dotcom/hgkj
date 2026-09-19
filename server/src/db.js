
const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, '../data.db'));

db.pragma('journal_mode = WAL');

db.exec(`
CREATE TABLE IF NOT EXISTS users (
id INTEGER PRIMARY KEY AUTOINCREMENT,
username TEXT UNIQUE NOT NULL,
password_hash TEXT NOT NULL,
nickname TEXT DEFAULT '',
avatar TEXT DEFAULT '',
created_at INTEGER NOT NULL,
updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS announcements (
id INTEGER PRIMARY KEY AUTOINCREMENT,
title TEXT NOT NULL,
content TEXT NOT NULL,
created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS activities (
id INTEGER PRIMARY KEY AUTOINCREMENT,
title TEXT NOT NULL,
description TEXT NOT NULL,
reward TEXT NOT NULL,
start_at INTEGER NOT NULL,
end_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS user_gifts (
id INTEGER PRIMARY KEY AUTOINCREMENT,
user_id INTEGER NOT NULL,
activity_id INTEGER NOT NULL,
claimed_at INTEGER NOT NULL,
UNIQUE(user_id, activity_id)
);
`);

const now = Date.now();

const annCount = db.prepare('SELECT COUNT(*) AS c FROM announcements').get().c;
if (annCount === 0) {
db.prepare('INSERT INTO announcements (title, content, created_at) VALUES (?, ?, ?)')
.run('开服公告', '欢迎来到游戏官网，注册即可领取新手礼包。', now);
db.prepare('INSERT INTO announcements (title, content, created_at) VALUES (?, ?, ?)')
.run('版本更新', '新版本已上线，新增多个玩法。', now);
}

const actCount = db.prepare('SELECT COUNT(*) AS c FROM activities').get().c;
if (actCount === 0) {
db.prepare(INSERT INTO activities (title, description, reward, start_at, end_at) VALUES (?, ?, ?, ?, ?))
.run('新手礼包', '注册后即可领取', '金币×1000、体力×50', now - 86400000, now + 86400000 * 30);
db.prepare(INSERT INTO activities (title, description, reward, start_at, end_at) VALUES (?, ?, ?, ?, ?))
.run('周末登录活动', '周末登录送稀有道具', '稀有宝箱×1', now - 86400000, now + 86400000 * 7);
}

module.exports = db;

