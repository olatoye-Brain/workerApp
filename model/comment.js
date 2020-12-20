const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
    commentPost: {
        type: 'string',
        required: true
    },
    name:{
        type: 'string',
        required: 'true'
    },
    workerID : {
        type: 'string',
        required: true
    },
    postID : {
        type: 'string',
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports =  mongoose.model('comment', commentSchema)