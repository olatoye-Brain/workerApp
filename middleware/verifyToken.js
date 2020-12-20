const jwt = require('jsonwebtoken')
const Worker = require('../model/worker')

const authVerify = (req, res, next) => {
    const token =  req.cookies.jwt
    //Check JWT exist or verified
    if(token) {
        jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
            if(err) return res.redirect("/")
            console.log(`Decoded Token: ${decodedToken.id}`)
            req.worker = decodedToken.id
            let worker = await Worker.findById(decodedToken.id)
            res.locals.worker = worker
            console.log(`RES LOCALS: ${res.locals.worker}`)
            next()
            
        })
    }else{
        res.redirect("/")
    }
}


module.exports = { authVerify }