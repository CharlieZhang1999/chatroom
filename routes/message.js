const router = require('express').Router();
const verify = require('./verify');
const Message = require('../model/Message');
const Joi = require('@hapi/joi');
const moment = require("moment");
// router.get('/', verify, (req, res) => {
//     res.send(req.user);
// });
const schema = Joi.object({
    message: Joi.string().required()
});


router.get('/', verify, async (req, res) => {
    // console.log(req.user);
    try{
        const allMessage = await Message.find();
        res.send(allMessage);
    }catch(err){
        res.status(400).send(err);
    }

});

router.post('/', verify, async (req, res) => {
    // Validation
    const { error } = schema.validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    // New Message
    const message = new Message({
        username: req.user.username,
        message: req.body.message,
        time: moment(new Date()).format('YYYY/MM/D hh:mm a')
    });

    try{
        const savedMessage = await message.save();
        res.send(savedMessage);
    }
    catch(err){
        res.status(400).send(err);
    }
});
module.exports = router;