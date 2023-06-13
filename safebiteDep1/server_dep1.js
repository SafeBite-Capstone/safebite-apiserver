const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000;

app.use(express.json());

app.post('/process_input', (req, res) => {
  const inputData = req.body.text;

  const data = JSON.stringify({
    text: inputData
  });

  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://safebite-rev-tkxwl4uaba-et.a.run.app/process_input', // Ganti dengan URL Cloud Run
    headers: { 
      'Content-Type': 'application/json'
    },
    data: data
  };

  axios.request(config)
    .then((response) => {
      res.json({ success: true, data: response.data });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    });
});

app.get('/', (req, res) => {
  res.send('API is running');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
