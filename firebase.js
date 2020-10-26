const firebase = require('firebase/app');
require('firebase/database');

const firebaseConfig = {
  apiKey: process.env.FB_API_KEY,
  authDomain: process.env.FB_DOMAIN,
  databaseURL: process.env.FB_URL,
  projectId: process.env.FB_PROJECT_ID,
  storageBucket: process.env.FB_BUCKET,
  messagingSenderId: process.env.FB_MSG,
  appId: process.env.FB_APP_ID,
};

firebase.initializeApp(firebaseConfig);

const database = firebase.database();

function saveGame({ id, ...game }) {
  return database.ref('games/' + id).set(game);
}

async function findGame(gameId) {
  return database.ref('/games/' + gameId).once('value');
}

module.exports = {
  saveGame,
  findGame,
};
