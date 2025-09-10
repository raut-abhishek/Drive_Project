const express = require('express');
const router = express.Router();
const {body, validationResult} = require('express-validator');
const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



router.get('/register', (req, res)=>{
    res.render('register', { error: null })
})

router.post('/register', 
    body('email').trim().isEmail().isLength({min:10}),
    body('password').trim().isLength({min:5}),
    body('username').trim().isLength({min:3}),
    async (req, res)=>{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
           return res.status(400).json({
            errors: errors.array(),
            message: "Invalid data"
           })
        }
        const {email, username, password} = req.body;

        const hashPassword = await bcrypt.hash(password, 10)

        const newUser = await userModel.create({
            email,
            username,
            password: hashPassword
        })
        res.redirect('/user/login');
})


// login section
router.get('/login', (req, res) => {
    res.render('login', { error: null, errors: null }); // show login form
});

router.post('/login',
    body('username').trim().isLength({ min: 3 }),
    body('password').trim().isLength({ min: 5 }),
    async (req, res) => {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).render('login', { errors: errors.array(), error: null });
        }

        const { username, password } = req.body;

        const user = await userModel.findOne({ username });
        if (!user) {
            return res.status(400).render('login', { errors: null, error: 'Username or password is incorrect' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).render('login', { errors: null, error: 'Username or password is incorrect' });
        }

        // Token creation
        const token = jwt.sign(
            {
                userID: user._id,
                email: user.email, 
                username: user.username
            },
            process.env.JWT_SECRET
        );

        
        res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
        res.redirect('/home'); //redirects after successful login
    }
);


module.exports = router;