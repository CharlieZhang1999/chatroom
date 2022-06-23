const router = require('express').Router();
const User = require('../model/User');
const bcrypt = require('bcryptjs');
const Joi = require('@hapi/joi');
const jwt = require('jsonwebtoken');
const verify = require('./verify');

const schema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required()
});

router.post('/register', async (req, res) => {
    // Validation
    const { error } = schema.validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    // Check if the user is already in the db
    const userExist = await User.findOne({username: req.body.username});
    if(userExist) return res.status(400).send('Username already exists');

    // Hash
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);


    // New User 
    const user = new User({
        username: req.body.username,
        password: hashPassword,
    });

    try{
        const newUser = await user.save();
        res.send({user: user._id});
    }catch(err){
        res.status(400).send(err);
    }
});


router.post('/login', async (req, res) => {
    // Validation
    const { error } = schema.validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    // Check username
    const user = await User.findOne({username: req.body.username});
    if(!user) return res.status(400).send('Username is not found');
    
    // Check password
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword) return res.status(400).send('Password is wrong');

    // Create token
    const token = jwt.sign({_id:user._id, username: user.username}, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send(token);
})


router.get('/userinfo', verify, async(req, res) => {
    res.send(req.user);
})

module.exports = router;