const admin = require('firebase-admin');
const serviceAccount = require('../crsport-firebase.json'); // Reemplaza con la ruta de tu archivo JSON

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'crsport-4e5da.appspot.com' // Reemplaza con el ID de tu proyecto
});

const bucket = admin.storage().bucket();

module.exports = bucket;
