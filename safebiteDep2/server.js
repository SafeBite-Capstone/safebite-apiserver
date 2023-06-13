const express = require('express');
const axios = require('axios');
const admin = require('firebase-admin');
const { initializeApp } = require('firebase-admin/app');

const app = express();
const port = 3000;

const firebaseConfig = {
  apiKey: "AIzaSyD_9Z_WF1S9Sp67hlI8tUyNVr_########",
  authDomain: "safebite-#####.firebaseapp.com",
  projectId: "safebite-#####",
  storageBucket: "safebite-#####.appspot.com",
  messagingSenderId: "74880182####",
  appId: "1:748801823602:web:d7bbc2ab72c188b81####",
  measurementId: "G-SFCCRD####"
};
// Konfigurasi Firebase Admin SDK
const serviceAccount = require('./safebite-serviceaccountKey.json');

// Inisialisasi Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://safebite-abd6c.firebaseio.com' 
});

const db = admin.firestore();

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
      const resultData = response.data;

      // Menyimpan hasil ke dalam Firestore
      db.collection('results').add(resultData)
        .then(() => {
          res.json({ success: true, message: 'Data processed successfully', data: resultData });
        })
        .catch((error) => {
          console.error(error);
          res.status(500).json({ success: false, error: 'Failed to save data' });
        });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    });
});

app.get('/history', (req, res) => {
  db.collection('results').get()
    .then((snapshot) => {
      const history = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        history.push(data);
      });
      res.json({ success: true, data: history });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ success: false, error: 'Failed to retrieve history' });
    });
});

app.get('/', (req, res) => {
  res.send('API is running');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
