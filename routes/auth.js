const express =require('express')
const router = express.Router()
const mongoose= require('mongoose')
const User = mongoose.model("user")
const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../config/keys')
const nodemailer = require('nodemailer')
const {EMAIL} = require('../config/keys')


var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'your mail',
      pass: 'your pass'
    }
  });

router.post('/signup',(req,res)=>{
    const {name,email,password,pic} = req.body
    if(!email||!password||!name){
        //422 means server get the data but unable to process it
        return res.status(422).json({error:"please add all the fields"})
    }
    if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
        return res.status(422).json({error:"Enter a valid Email"})
    }

    User.findOne({email:email}).then((savedUser)=>{
        if(savedUser)
            return res.status(422).json({error:"User already exist"})
        
            bcrypt.hash(password,12).then(hashedpassword=>{
                const user = new User({
                    email,
                    password:hashedpassword,
                    name,
                    pic
                })
                user.save()
                .then(user=>{
                    // var mailOptions = {
                    //     from: 'your mail',
                    //     to: user.email,
                    //     subject: 'Socially',
                    //     text: 'Welcome to Socially!'
                    //   }
                    // transporter.sendMail(mailOptions, function(error, info){
                    //     if (error) {
                    //       console.log(error);
                    //     } else {
                          res.json({message:"sign up successfully"})
                    //     }
                    //   })
                })
                .catch(err=>{
                    console.log(err)
                })
            })
    })
    .catch(err=>{
        console.log(err)
    })
})


router.post('/signin',(req,res)=>{
    const {email,password} =req.body
    if(!email||!password)
        return res.status(422).json({error:"please add email or password"})
    User.findOne({email:email}).then(savedUser=>{
        if(!savedUser)
            return res.status(422).json({error:"Invalid email or password"})
        bcrypt.compare(password,savedUser.password)
        .then(doMatch=>{
            if(doMatch)
            {
                    const token = jwt.sign({_id:savedUser._id},JWT_SECRET)
                    const {_id,name,email,followers,following,pic}=savedUser
                    res.json({token,user:{_id,name,email,followers,following,pic}})
            }
            else
                return res.status(422).json({error:"Invalid email or password"})
        }).catch(err=>{
            console.log(err)
        })
    })
})

router.post('/reset-password',(req,res)=>{
    crypto.randomBytes(32,(err,buffer)=>{
        if(err)
            console.log(err)
        const token = buffer.toString("hex")
        User.findOne({email:req.body.email})
        .then(user=>{
            if(!user)
                return res.status(422).status.json({error:"User Don't exists."})
            user.resetToken = token
            user.expireToken = Date.now()+ 3600000
            user.save()
            .then(result=>{
                var mailOptions = {
                    from: 'cyberskull1410@gmail.com',
                    to: user.email,
                    subject: 'Password reset link',
                    html:`
                    <p>You requested for password link</p>
                    <h5>click on this <a href="${EMAIL}/reset/${token}">link</a> to reset</h5>
                    `
                  }
                transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                      console.log(error);
                    } else {
                      res.json({message:"Check Your email"})
                    }
                  })
            })
        })
    })
})

router.post('/new-password',(req,res)=>{
    const newP= req.body.password
    const sentToken = req.body.token
    User.findOne({resetToken:sentToken,expireToken:{$gt:Date.now()}})
    .then(user=>{
        if(!user)
            return res.status(422).json({error:"Try Again!"})
            bcrypt.hash(newP,12).then(hashedpass=>{
                user.password=hashedpass
                user.resetToken=undefined
                user.expireToken=undefined
                user.save().then(result=>{
                    res.json({message:"Password Updated!"})
                })
            })
    }).catch(err=>{
        console.log(err)
    })
})


module.exports=router