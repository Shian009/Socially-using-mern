import React,{useState,useContext} from 'react'
import {Link,useHistory,useParams} from "react-router-dom"
import M from 'materialize-css'

const Newpassword = ()=>{
    const history = useHistory()
    const [password,setPassword]= useState("")
    const {token} =useParams()
    const PostData = ()=>{
        
        fetch("/new-password",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                password,
                token
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
                    type="password"
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                />
                
                <button className="btn waves-effect waves-light #64b5f6 blue darken-1" 
                onClick={()=>PostData()}
                >
                    SignIn
                </button>
                <h5><Link to="./signup">Don't have an account ?</Link></h5>
            </div>
        </div>
    )
}

export default Newpassword