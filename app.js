const express = require('express')
const routes = require('./routes/routes')
const mongoose = require('mongoose')
const app = express()
const cookieParser =  require('cookie-parser')
const cors = require('cors')
const dotenv = require('dotenv')
const port = process.env.PORT || 8000


dotenv.config()

const MONGO_URI = process.env.MONGO_URI
mongoose.connect(MONGO_URI, { useUnifiedTopology: true, useNewUrlParser: true })
.then(()=>{
    app.listen(port, ()=>{
    console.log(`App is listening to port ${port}`)
})
})
.catch(err=> console.log(`Error : ${err}`))

app.set('view engine', 'ejs')


app.use(express.json())
app.use(cookieParser())
app.use(cors())

app.use(express.urlencoded({extended: true}))

// app.get('/',(req, res)=>{
//     res.send('Hello world')
// })


app.use((req, res, next) => {
    res.locals.worker = req.worker || null
    next()
})
app.use(routes)



//static folder for public files
app.use(express.static('public'))
app.use('/css', express.static('node_modules/bootstrap/dist/css'))



