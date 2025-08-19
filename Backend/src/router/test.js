import express from 'express';

const router = express.Router();

use.get('/test', (req, res) => {
  res.json({ ok: true });
});

export default router;
