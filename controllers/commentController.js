const WorkerPost = require('../model/post')
const CommentPost = require('../model/comment')
const { postValidation, commentValidation }=  require('../middleware/validation')
const moment = require('moment')


//Handling Comment Controller
module.exports.workersGetComment = async (req, res) => {
    try{
        const data = await WorkerPost.findById(req.params.id)
        let dataComment = await CommentPost.find({postID: req.params.id}).sort({date: 'desc'})
        let dataCommented = await dataComment
        console.log(`REQ PARAMS: ${req.params.id}`)
        const post = data 
        const worker = res.locals.worker
        
        console.log(`dateCommentBefore : ${dataCommented}`)

       
        dataCommented = dataCommented.map(comment => {
            const { date, name, workerID, commentPost, postID, _id } = comment
            // const { date } = comment

            let momentData = moment(date).startOf('sec').fromNow()
            let createdAt = moment(date).format('dddd Do, h:mm a')

           updateComment = {date, name, workerID, commentPost, postID, _id, momentData, createdAt}

              return updateComment

        })

        console.log(`datacommentAfter: ${dataCommented}`)


        let userConfirm = (worker.name == post.name) ? 'You' : post.name
        let commentNum = dataCommented.length > 1 ? `${dataCommented.length} Comments` : `${dataCommented.length} Comment`
        let resData = {
            post, 
            dataCommented, 
            worker, 
            commentNum, 
            userConfirm,
        }
        res.render('comments', resData)
        console.log({post, dataComment, worker, userConfirm})
        console.log(`Data comment length: ${dataComment.length}`)
    }catch(err){
        console.log(`Error: ${err}`)
    }
}

module.exports.workersPostComment = async (req, res) => {
    let { commentPost} = req.body
    console.log(req.body)


    try{
        const { details } = await commentValidation(req.body)

        if(!details) {
            const workerID = req.worker
            const name = res.locals.worker.name
            const postID =  req.params.id
            const workerPost = await CommentPost.create({name, workerID,  commentPost, postID}) 
            res.status(201).json({message: "Comment Created"})
            console.log(`Local:${res.locals.worker.name}`)
            console.log(workerPost)
        }

    }catch(err){
        console.log(err.details[0])
        res.json(err.details[0])
    }

}

module.exports.edit_GetWorkersComment = async(req, res) => {
    try{
        const postComment = await CommentPost.findById(req.params.id)
        const post = await WorkerPost.findById({_id: postComment.postID})
        res.render('editcomment', {postComment, post})
        console.log(`postComment ${postComment}`)
        console.log(`post ${post}`)
    }catch(err){
        console.log(`Error: ${err}`)
        res.status(500).json(err)
    }
}


module.exports.edit_PostWorkersComment = async(req, res) => {
    const { commentPost } = req.body
    console.log('Edit post button')
    try{
        let comment = await CommentPost.findById(req.params.id)

        comment.commentPost = commentPost
            
        comment = await comment.save()
        res.status(200).json({comment: comment, message: "Comment updated successfully"})
        console.log(comment)
    }catch(err){
        console.log(`Error: ${err}`)
    }
}

module.exports.commentDelete = async (req, res) => {

    let comment = await CommentPost.findById(req.params.id)
    console.log(`/comments/${comment.postID}`)
    const deleteComment = await CommentPost.findByIdAndDelete(req.params.id)
    
    if(deleteComment) res.redirect(`/comments/${comment.postID}`)

}