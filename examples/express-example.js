const express = require('express');
const CAPTCHAGenerator = require('../lib');
const crypto = require('crypto');

const app = express();
const captcha = new CAPTCHAGenerator({
  length: 6,
  characters: 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
});

// In-memory store (use Redis in production)
const captchaStore = new Map();

app.get('/captcha', (req, res) => {
  const { image, text, hash } = captcha.generate();
  
  const sessionId = crypto.randomBytes(16).toString('hex');
  captchaStore.set(sessionId, hash);

  res.json({
    sessionId,
    image: image.toString('base64')
  });
});

app.post('/verify', express.json(), (req, res) => {
  const { sessionId, userInput } = req.body;
  const storedHash = captchaStore.get(sessionId);
  
  if (!storedHash) {
    return res.status(400).json({ valid: false, message: 'Invalid session' });
  }

  const isValid = captcha.verify(userInput, storedHash);
  
  if (isValid) {
    captchaStore.delete(sessionId);
  }

  res.json({ 
    valid: isValid,
    message: isValid ? 'CAPTCHA verified' : 'Invalid CAPTCHA'
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Captcha running on port ${PORT}`);
});
