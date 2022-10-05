require("dotenv").config()
const express = require('express')
const app = express()
const port = 3000
const ejs = require("ejs")
const mongoose = require('mongoose')
const encrypt = require("mongoose-encryption")

app.use(express.static('public'))
app.use(express.urlencoded({extended: true}))
app.set('view engine', 'ejs')

mongoose.connect('mongodb://localhost:27017/userDB')

const userSchema = new mongoose.Schema({
    email: String,
    password: String
})

userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]})

const User = mongoose.model('User', userSchema)

app.get('/', (req, res) => {
    res.render("home")
})

app.get('/login', (req, res) => {
    res.render("login")
})

app.get('/register', (req, res) => {
    res.render("register")
})

app.post("/register", (req, res) => {
    const userItem = new User({
        email: req.body.username,
        password: req.body.password
    })

    userItem.save((err) => {
        if(err){
            console.log(err)
        }
        else {
            res.render("secrets")
        }
    })
})

app.post("/login", (req, res) => {

    User.findOne({email: req.body.username}, (err, foundUser) => {
        if(err){
            console.log(err)
        }
        else{
            if(foundUser){
                if(req.body.password === foundUser.password){
                    res.render("secrets")
                }
            }
            else{
                res.send("User Not Found")
            }
        }
    })
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))