const express = require('express');
const authMiddleware = require('../middlewares/auth')
const firebase = require('../config/firebase.config');

const router = express.Router();
const upload = require('../config/multer.config');
const fileModel = require('../models/files.models');


router.get('/home', authMiddleware, async (req, res)=>{

    const userFiles = await fileModel.find({
        user:req.user.userID
    })
    // console.log(userFiles)

    res.render('home', {
        files: userFiles
    });
})

router.post('/upload', authMiddleware, upload.single('file'), async (req, res) => {
    try {
      console.log("Auth user in upload route:", req.user);

      const newFile = await fileModel.create({
        path: req.file.path,
        originalname: req.file.originalname, 
        user: req.user.userID                
      });

      res.json(newFile);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
);

router.get('/download/:path', authMiddleware, async (req, res)=>{
    const loggedInUserId = req.user.userID;
    const path = req.params.path;

    const file = await fileModel.findOne({
        user: loggedInUserId,
        path: path
    })

    if(!file){
        return res.status(401).json({
            message: 'Unauthorised'
        })
    }

    const signedUrl = await firebase.storage().bucket().file(path).getSignedUrl({
        action: 'read',
        expires: Date.now() + 60 * 1000
    })
    res.redirect(signedUrl[0])

})

module.exports = router;