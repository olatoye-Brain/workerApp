const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    name:{
        type: 'string',
        required: 'true'
    },
    title: {
        type: 'string',
        required: true
    },
    description: {
        type: 'string',
        required: true
    },
    workerID : {
        type: 'string',
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports =  mongoose.model('post', postSchema)