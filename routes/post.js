const express =require('express')
const router = express.Router()
const mongoose= require('mongoose')
const requireLogin = require('../middleware/requireLogin')
const Post = mongoose.model("post")

//allpost
router.get('/allpost',requireLogin,(req,res)=>{
    Post.find()
    .populate("postedBy","_id name pic")
    .populate("comments.postedBy","_id name pic")
    .sort('-createdAt')
    .then(posts=>{
        res.json({posts})
    })
    .catch(err=>{
        console.log(err)
    })
})

router.get('/getsubpost',requireLogin,(req,res)=>{
    Post.find({postedBy:{$in:req.user.following}})
    .populate("postedBy","_id name")
    .populate("comments.postedBy","_id name")
    .sort('-createdAt')
    .then(posts=>{
        res.json({posts})
    })
    .catch(err=>{
        console.log(err)
    })
})



//createpost
router.post('/createpost',requireLogin,(req,res)=>{
    const {title,body,pic} = req.body
    if(!title||!body||!pic)
        return res.status(422).json({error:"please add all the fields"})
    req.user.password = undefined
    const post = new Post({
        title,
        body,
        photo:pic,
        postedBy:req.user
    })
    post.save().then(result=>{
        res.json({post:result})
    })
    .catch(err=>{
        console.log(err)
    })
})

//mypost
router.get('/mypost',requireLogin,(req,res)=>{
    Post.find({postedBy:req.user._id})
    .populate("PostedBy","_id name")
    .then(mypost=>{
        res.json({mypost})
    })
    .catch(err=>{
        console.log(err)
    })
})

//unlike
router.put('/unlike',requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $pull:{likes:req.user._id} 
    },{
        new:true
    }).exec((err,result)=>{
        if(err)
            return res.status(422).json({error:err})
        else
        {
            res.json(result)
        }
    })
})

//like
router.put('/like',requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{likes:req.user._id} 
    },{
        new:true
    }).exec((err,result)=>{
        if(err)
            return res.status(422).json({error:err})
        else
        {
            res.json(result)
        }
    })
})

//comment
router.put('/comment',requireLogin,(req,res)=>{
    const comment = {
        text:req.body.text,
        postedBy:req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{comments:comment} 
    },{
        new:true
    }).populate("comments.postedBy","_id name")
    .populate("postedBy","_id name")
    .exec((err,result)=>{
        if(err)
            return res.status(422).json({error:err})
        else
        {
            res.json(result)
        }
    })
})

// //delete comment
// router.put('/commentdelete',requireLogin,(req,res)=>{
//     const comment = {
//         text:req.body.text,
//         postedBy:req.user._id
//     }
//     Post.findByIdAndUpdate(req.body.postId,{
//         $pull:{comments:comment} 
//     },{
//         new:true
//     })
//     .exec((err,result)=>{
//         if(err)
//             return res.status(422).json({error:err})
//         else
//         {
//             res.json(result)
//         }
//     })
// })

//deletepost
router.delete('/deletepost/:postId',requireLogin,(req,res)=>{
    Post.findOne({_id:req.params.postId})
    .populate("postedBy","_id")
    .exec((err,post)=>{
        if(err||!post)
            return res.status(422).json({error:err})
        if(post.postedBy._id.toString() === req.user._id.toString()){
            post.remove()
            .then(result=>{
                res.json(result)
            }).catch(err=>{
                console.log(err)
            })
        }
    })
})


module.exports = router