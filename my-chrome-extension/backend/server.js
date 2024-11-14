const express = require('express');
const { google } = require('googleapis');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const customsearch = google.customsearch('v1');
const keyFilePath = process.env.GOOGLE_SERVICE_ACCOUNT_KEY_FILE; // Service account key file path
const cx = process.env.CX; // Search Engine ID

app.post('/search', async (req, res) => {
  const { query } = req.body;

  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: '../credentials.json',
      scopes: ['https://www.googleapis.com/auth/cse'],
    });

    const client = await auth.getClient();
    client.authorize()
    const result = await customsearch.cse.list({
      auth: client,
      cx,
      q: query,
    });

    res.json(result.data.items || []);
  } catch (error) {
    console.error('Error performing search:', error);
    res.status(500).send('Failed to perform search.');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('key file path', keyFilePath);
  console.log('Custom Search Engine ID:', cx);
});
