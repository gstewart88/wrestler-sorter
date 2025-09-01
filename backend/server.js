const express = require('express');
const cors = require('cors');
const fs   = require('fs');
const path = require('path');

const app = express();
app.use(cors());

const wrestlersPath = path.join(__dirname, 'wrestlers.json');
console.log('⛔️ Looking for JSON at:', wrestlersPath);

// Check existence
if (!fs.existsSync(wrestlersPath)) {
  console.error('❌ File not found!');
  process.exit(1);
}

// Read raw data
const raw = fs.readFileSync(wrestlersPath, 'utf-8');
console.log('📦 Raw file content (first 200 chars):', raw.slice(0, 200));

// Now parse
let wrestlers;
try {
  wrestlers = JSON.parse(raw);
  console.log('✅ Parsed JSON array length:', Array.isArray(wrestlers) ? wrestlers.length : 'not an array');
} catch (err) {
  console.error('❌ JSON.parse error:', err.message);
  process.exit(1);
}

app.get('/api/wrestlers', (req, res) => {
  res.json(wrestlers);
});

app.listen(3001, () => {
  console.log('🚀 Backend running on port 3001');
});
