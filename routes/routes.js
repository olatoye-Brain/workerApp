const { Router } = require('express')
const authController = require('../controllers/authController')
const { authVerify } = require('../middleware/verifyToken')
const postContoller = require('../controllers/postController')
const commentContoller = require('../controllers/commentController')

const router = Router()

router.post('/signup', authController.signupPost)
router.get('/signup', authController.signupGet)
router.post('/', authController.loginPost)
router.get('/', authController.loginGet)
router.get('/logout', authController.logout)
router.get('/post', authVerify, postContoller.workerList_Get)
router.get('/add', authVerify, postContoller.workersAdd_Get)
router.post('/add', authVerify, postContoller.workersAdd_Post)
router.get('/edit/:id', authVerify, postContoller.workersPost_Get)
router.post('/edit/:id', authVerify, postContoller.workersPost_Put)
router.get('/delete/:id', authVerify, postContoller.workersDelete)
router.get('/welcome', authVerify, postContoller.allworkersList_Get)
router.get('/comments/:id', authVerify, commentContoller.workersGetComment)
router.post('/comments/:id', authVerify, commentContoller.workersPostComment)
router.get('/editcomments/:id', authVerify, commentContoller.edit_GetWorkersComment)
router.post('/editcomments/:id', authVerify, commentContoller.edit_PostWorkersComment)
router.get('/deletecomments/:id', authVerify, commentContoller.commentDelete)



//Fake Js Route
router.get('/user', postContoller.fakeUser_Get)

router.get('/api/post', postContoller.userPost)





module.exports = router