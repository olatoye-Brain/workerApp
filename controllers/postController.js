const WorkerPost = require('../model/post')
const CommentPost = require('../model/comment')
const { postValidation, commentValidation }=  require('../middleware/validation')
const moment = require('moment')
const Fake = require('../model/fake')

module.exports.workerList_Get =  async (req, res) => {
    try {
        const worker = await WorkerPost.find({workerID: req.worker}).sort({date: 'desc'})
        let workerPostList = await worker

       workerPostList = workerPostList.map(post => {
            let {workerID, date, _id, title, description, __v} = post
            let momentDate = moment(date).startOf('sec').fromNow(); 
            let createdAt = moment(date).format('dddd Do, h:mm a')

            let updated = {
                workerID,
                _id,
                title,
                description,
                __v,
                createdAt,
                momentDate
            }
            return updated
        })
        console.log(workerPostList)
        res.render('post', {workerPostList})
        let dateData = moment().format('dddd Do, h:mm:ss a')

        console.log(`Moment: ${dateData}`)

    } catch (err) {
        console.log(err)
        res.status(400).json(err)
    }
}

module.exports.workersPost_Get= async (req, res) => {
    try{
        const post = await WorkerPost.findById(req.params.id)
     
        res.render('edit', {post: post})
    }catch(err){
        console.log(`Error: ${err}`)
    }
}

module.exports.workersPost_Put = async (req, res) => {
    const {title, description} = req.body
    try {
        let post = await WorkerPost.findById(req.params.id)

        post.title = title
        post.description = description
        
        post = await post.save()
        res.status(200).json({post: post, message: "Post updated successfully"})
        console.log(post)
    } catch (err) {
        console.log(`Error: ${err}`)
        res.status(200).json(err)
    }
}

module.exports.workersAdd_Get = (req, res) => {
    res.render('add')
    console.log(req.worker)
}


module.exports.workersAdd_Post = async (req, res) => {
   let { title, description} = req.body

    console.log(req.body)

    try{
        const { details } = await postValidation(req.body)

        if(!details) {
            const workerID = req.worker
            const name = res.locals.worker.name
            console.log(`Worker: ${workerID}`)
            const workerPost = await WorkerPost.create({name, title, description, workerID}) 
            res.status(201).json({message: "Job created successfully", worker: workerID})
            console.log(`Local:${res.locals.worker.name}`)
            console.log(workerPost)
        }

    }catch(err){
        console.log(err.details[0].message)
        res.json(err.details[0])
    }

    
}

module.exports.workersDelete = async (req, res) => {

        const deletePost = await WorkerPost.findByIdAndDelete(req.params.id)
        
        if(deletePost) res.redirect("/post")

        console.log(deletePost)
}

module.exports.allworkersList_Get =  async (req, res) => {
    try {
        const worker = await WorkerPost.find().sort({date: 'desc'})
        let workerPostList = await worker

        const postComment = await CommentPost.find()
        let postCommentList = await postComment
        console.log(postCommentList)
        const {name : workerName, _id: user} = res.locals.worker
        console.log(`UserData: ${workerName} ${user}`)
        // const user = req.worker
        workerPostList = workerPostList.map( post =>  {
            let {name, workerID, createAt, _id, title, description, __v, date} = post
            let userID = (user == workerID)? user : null
            name = (name == workerName) ? 'You' : name
            let momentDate = moment(date).startOf('sec').fromNow(); 
            let createdAt = moment(date).format('dddd Do, h:mm a')

            //Fetching numbers of comment for post
            let commentCount = 0
            postCommentList.forEach(comment => {
                if(comment.postID == _id) {
                    commentCount++
                }
                return commentCount
            })
            let commentNum = commentCount > 1 ? `${commentCount} Comments` : `${commentCount} Comment`

            console.log(commentNum)

            let updated = {
                name,
                userID,
                workerID,
                createAt,
                _id,
                title,
                description,
                commentNum,
                momentDate,
                createdAt,
                __v
            }
            return updated
        })
        // console.log(workerPostList)
        res.render('welcome', {workerPostList})


    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
}






module.exports.fakeUser_Get = async (req, res)=> {
    const user = await Fake
    res.status(200).json(user)
}


module.exports.userPost = async (req, res)=> {
    try {
        const user = await WorkerPost.find(req.query)
        res.status(200).json(user)

        console.log(req)
     
    } catch (err) {
        console.log(err)
    }
}


