const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/deepgram-key', (req, res) => {
  res.json({ key: process.env.DEEPGRAM_API_KEY });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
