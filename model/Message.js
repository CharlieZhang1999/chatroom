const mongoose = require('mongoose');
// const moment = require("moment");
const messageSchema = new mongoose.Schema({
    username:{
        type:String,
        required: true
    },
    message:{
        type:String,
        required:true
    },
    time:{
        type:String,
        required:true 
    }

});

module.exports = mongoose.model('Message', messageSchema);