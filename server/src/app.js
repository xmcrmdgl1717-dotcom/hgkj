
require('dotenv').config();
const express = require('express');
const cors = require('cors');

require('./db');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const contentRoutes = require('./routes/content');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ code: 0, message: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api', contentRoutes);

app.use((err, req, res, next) => {
console.error(err);
res.status(500).json({ code: 500, message: '服务器内部错误' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
console.log(Server running at http://localhost:${PORT});
});

