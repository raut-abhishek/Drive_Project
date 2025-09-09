const Firebase = require('firebase-admin');
const serviceAccount = require('../drive-d12c1-firebase-adminsdk-fbsvc-9d07a30ad6.json');

const firebase = Firebase.initializeApp({
    credential: Firebase.credential.cert(serviceAccount),
    storageBucket:'drive-d12c1.firebasestorage.app'
});


module.exports = Firebase;