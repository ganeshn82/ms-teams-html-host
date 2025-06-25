const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// ✅ Use dynamic import style for Node 18+
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/exchange-code', async (req, res) => {
  const { code, tenant } = req.body;

  const clientId = 'b243bbd4f95c4d37ba8a09a485fae07d';
  const redirectUri = 'https://ganeshn82.github.io/ms-teams-html-host/login-popup.html';
  const tokenUrl = `https://${tenant}.talkdeskid.com/oauth/token`;

  try {
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        client_id: clientId,
        redirect_uri: redirectUri
      })
    });

    const data = await response.json();
    if (!response.ok) return res.status(400).json(data);

    console.log("✅ Token received:", data);
    res.json(data);
  } catch (err) {
    console.error("❌ Token exchange failed:", err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => {
  console.log("🚀 Server running at http://localhost:3000");
});

