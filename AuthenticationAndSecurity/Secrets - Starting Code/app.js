//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const { error } = require("console");
const encrypt = require("mongoose-encryption");

const app = express();

app.set('view engine', 'ejs');

mongoose.connect('mongodb://localhost:27017/userDB');

const userSchema = new mongoose.Schema({
    email:String,
    password:String
});

// console.log(process.env.API_KEY);
userSchema.plugin(encrypt, { secret: process.env.SECRET , encryptedFields: ["password"] });


const User = mongoose.model('User',userSchema);


app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

//TODO

app.get('/',function(req,res){
    res.render('home');
})

app.get('/login',function(req,res){
    res.render('login');
    
})

app.post('/login',function(req,res){
    username = req.body.username;
    password = req.body.password;
    async function authentication(){
        const foundUser = await User.findOne({email:username});
        if(!foundUser){
            console.log('No User found');
        }
        else{
            if(password === foundUser.password){
                res.render('secrets');
            }
        }
        // console.log(foundUser.password);
    }
    authentication(); 
})

app.get('/register',function(req,res){
    res.render('register');
    
});

app.post('/register',async(req,res) =>{
    const user = new User({
        email:req.body.username,
        password:req.body.password
    })
    try{
        await user.save();
        res.render('secrets');
    }
    catch(err){
        console.error(err);
    }
})

app.listen(3000, function() {
  console.log("Server started on port 3000");
});