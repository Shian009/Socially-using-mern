import React,{useState,useContext} from 'react'
import {Link,useHistory} from "react-router-dom"
import M from 'materialize-css'

import {UserContext} from '../../App' 

const Signin = ()=>{
    const {state,dispatch} =useContext(UserContext)
    const history = useHistory()
    const [password,setPassword]= useState("")
    const [email,setEmail]= useState("")
    const PostData = ()=>{
        
        fetch("/signin",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                email,
                password
            })
        }).then(res=>res.json())
        .then(data=>{
            if(data.error)
                M.toast({html: data.error,classes:"#e53935 red darken-1"})
            else{
                localStorage.setItem("jwt",data.token)
                localStorage.setItem("user",JSON.stringify(data.user))
                dispatch({type:"USER",payload:data.user})
                M.toast({html: "Successfully Signed In",classes:"#81c784 green lighten-2"})
                history.push('/')
            }
        }).catch(err=>{
            console.log(err)
        })
    }
    return(
        <div className="mycard">
            <div className="card auth-card input-field">
                <h2>Socially</h2>
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
                
                <button className="btn waves-effect waves-light #64b5f6 blue darken-1" 
                onClick={()=>PostData()}
                >
                    SignIn
                </button>
                <h5><Link to="./signup">Don't have an account ?</Link></h5>
                {/* <h6><Link to="./reset">Reset your Password ?</Link></h6> */}
            </div>
        </div>
    )
}

export default Signin