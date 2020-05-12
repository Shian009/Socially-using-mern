import React,{useState, useEffect} from 'react'
import {Link,useHistory} from 'react-router-dom'
import M from 'materialize-css'
const Signup = ()=>{
    const history = useHistory()
    const [name,setName]= useState("")
    const [password,setPassword]= useState("")
    const [email,setEmail]= useState("")
    const [image,setImage] =useState("")
    const [url,setUrl] =useState(undefined)
    useEffect(()=>{
        if(url)
            uploadFields()
    },[url])
    
    const uploadPic =() =>{
        const data = new FormData()
        data.append("file",image)
        data.append("upload_preset","socially")
        data.append("cloud_name","dizvlttbm")
        fetch("https://api.cloudinary.com/v1_1/dizvlttbm/image/upload",{
            method:"post",
            body:data
        }).then(res=>res.json())
        .then(data=>{
            setUrl(data.url)
        })
        .catch(err=>{
            console.log(err)
        })
    }
    const uploadFields = ()=>{
        fetch("/signup",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                name,
                email,
                password,
                pic:url
            })
        }).then(res=>res.json())
        .then(data=>{
            if(data.error)
                M.toast({html: data.error,classes:"#e53935 red darken-1"})
            else{
                M.toast({html: data.message,classes:"#81c784 green lighten-2"})
                history.push('/signin')
            }
        }).catch(err=>{
            console.log(err)
        })
    }
    const PostData = ()=>{
        if(image){
            uploadPic()
        }else{
            uploadFields()
        }  
    }
    return(
        <div className="mycard">
            <div className="card auth-card input-field">
                <h2>Socially</h2>
                <input 
                    type="text"
                    placeholder="name"
                    value={name}
                    onChange={(e)=>setName(e.target.value)}
                />
                <input 
                    type="email"
                    placeholder="email"
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                />
                <input 
                    type="password"
                    placeholder="password"
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                />
                <div className="file-field input-field">
                    <div className="btn #64b5f6 blue darken-1">
                        <span>Upload pic</span>
                        <input type="file" onChange={(e)=>setImage(e.target.files[0])} />
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text"/>
                    </div>
                </div>
                <button className="btn waves-effect waves-light #64b5f6 blue darken-1" 
                onClick={()=>PostData()}
                >
                    SignUp
                </button>
                <h5><Link to="./signin">Already have an account ?</Link></h5>   
            </div>
        </div>
    )
}

export default Signup