import React,{useState,useContext} from 'react'
import {Link,useHistory} from "react-router-dom"
import M from 'materialize-css'

const Reset = ()=>{
    const history = useHistory()
    const [email,setEmail]= useState("")
    const PostData = ()=>{
        
        fetch("/reset-password",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                email
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
                
                <button className="btn waves-effect waves-light #64b5f6 blue darken-1" 
                onClick={()=>PostData()}
                >
                    reset password
                </button>
            </div>
        </div>
    )
}

export default Reset