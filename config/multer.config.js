const multer = require('multer');
const firebaseStorage = require('multer-firebase-storage');
const firebase = require('./firebase.config');
const serviceAccount = require('../drive-d12c1-firebase-adminsdk-fbsvc-67b66aa146.json')

const storage = firebaseStorage({
    credential: firebase.credential.cert(serviceAccount),
    bucketName: 'drive-d12c1.firebasestorage.app',
    unique: true,
    credentials: {
        projectId: serviceAccount.project_id,
        clientEmail: serviceAccount.client_email,
        privateKey: serviceAccount.private_key,
    }
});


const upload = multer({
    storage: storage
})

module.exports = upload;