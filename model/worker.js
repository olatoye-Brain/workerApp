const mongoose = require('mongoose');

const workerSchema = new mongoose.Schema({
    name:{
        type: 'string',
        required: 'true'
    },
    email:{
        type: 'string',
        required: 'true'
    },
    password:{
        type: 'string',
        required: 'true'
    },
    date:{
        type: Date,
        default: Date.now()

    }
});



module.exports = mongoose.model('worker', workerSchema)