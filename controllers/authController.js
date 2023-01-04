require('dotenv').config()
const Workers = require('../model/worker')
const { compare } = require('bcrypt')
const { sign }= require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { signupValidation, loginValidation} = require('../middleware/validation')

const maxAge = 3 * 24 * 60 * 60

const createToken = (id) => {
     return sign({id}, process.env.TOKEN_SECRET, {
         expiresIn: maxAge
     })
}
//Protected routes for logged in workers

module.exports.welcome = (req, res) =>{
    res.render('welcome')
}

//signup get
module.exports.signupGet = (req, res) =>{
    res.render('signup')
}

//signup post
module.exports.signupPost = async (req, res) => {
    let { email, password, name } = req.body
    
    //Validate email
    const worker =  await Workers.findOne({email})
    if(worker) return res.status(400).json({message: "Workers email already exist"})
    //validate workers input
        try{
            const { details } =  await signupValidation(req.body) 
            if (!details){
                //hashing password
                const salt = await bcrypt.genSalt(10)
                const hashedPassword = await bcrypt.hash(password, salt)
                password = hashedPassword
                const worker = await Workers.create({email, password, name})
                console.log(worker)

                const token = createToken(worker._id)
                //cookies time is stored in miliseconds
                res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000})
                res.status(201).json({worker: worker._id, message: "Worker Created Successfully", token})
                console.log(token)
            }
            
        }catch(err){
         console.log(`Error: ${err}`)
         res.json(err.details[0])
    }
}


//login get
module.exports.loginGet = (req, res) =>{
    res.render('login')
}

//login post
module.exports.loginPost = async (req, res) => {
    const { email, password } = req.body
    
    //Validate email
    const worker =  await Workers.findOne({email})
    if(!worker) return res.status(400).json({message: "Worker does not exist"})

    console.log(worker)

    
        try{
            //Validating with Joi
            const { details } = await loginValidation(req.body)

            if(!details){
                //compare password using bcrypt
                const checkPass = await compare(password, worker.password)
                if(!checkPass) return res.status(400).json({message: "Password is Incorrect"})
                // console.log(worker) 

                //JWT

                const token = createToken(worker._id)
                res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000})
                res.status(201).json({worker: worker._id, message: "Worker loggin", token})
                console.log(token)
            }

            
        }catch(err){
  
        console.log(`Error: ${err}`)
        res.json(err.details[0])
    }
}

//logout 

module.exports.logout = (req, res) => {
    res.cookie('jwt', '', {
        maxAge: 1
    })
    res.redirect('/')
}