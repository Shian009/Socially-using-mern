import React,{useState,useContext,useEffect} from 'react'
import {UserContext} from '../../App'
import {Link} from 'react-router-dom'

const Home = ()=>{
    const {state,dispatch} =useContext(UserContext)
    const [data,setData] = useState([])
    useEffect(()=>{
        fetch('/getsubpost',{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            setData(result.posts)
        })
    },[])

    const likePost = (id)=>{
        fetch('/like',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId:id
            })
        }).then(res=>res.json())
        .then(result=>{
            const newData = data.map(item=>{
                if(item._id==result._id)
                    return result
                else 
                    return item
            })
            setData(newData)
        })
    } 
    const unlikePost = (id)=>{
        fetch('/unlike',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId:id
            })
        }).then(res=>res.json())
        .then(result=>{
            const newData = data.map(item=>{
                if(item._id==result._id)
                    return result
                else 
                    return item
            })
            setData(newData)
        }).catch(err=>{
            console.log(err)
        })
    } 

    const makeComment =(text,postId)=>{
        fetch('/comment',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId,
                text
            })
        }).then(res=>res.json())
        .then(result=>{
            const newData = data.map(item=>{
                if(item._id==result._id)
                    return result
                else 
                    return item
            })
            setData(newData)
        }).catch(err=>{
            console.log(err)
        })
    }

    const deletePost = (postId)=>{
        fetch(`/deletepost/${postId}`,{
            method:"delete",
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            const newData = data.filter(item=>{
                return item._id!==result._id
            })
            setData(newData)
        })
    }

    return(
        <div className="home">
            {
                data.map(item=>{
                    return(
                    <div className="card home-card" key={item._id}>
                        <h5 style={{padding:"5px"}}><Link to={item.postedBy._id===state._id?"/profile/":"/profile/"+item.postedBy._id}>{item.postedBy.name}</Link>
                        {
                          item.postedBy._id==state._id&&<i className="material-icons" style={{float:"right"}} onClick={()=>deletePost(item._id)}>delete</i>
                        } </h5>
                        <div className="card-image">
                            <img src={item.photo}/>
                        </div>
                        <div className="card-content">
                            {
                               item.likes.includes(state._id)
                               ? <i className="material-icons" style={{color:"blue"}} onClick={()=>unlikePost(item._id)}>thumb_down</i>
                                : <i className="material-icons" style={{color:"blue"}} onClick={()=>likePost(item._id)}>thumb_up</i>

                            }
                            <h6>{item.likes.length} likes</h6>
                            <h6>{item.title}</h6>
                            <p>{item.body}</p>
                            {
                                item.comments.map(rec=>{
                                    return(
                                        <h6 key={rec._id}><span style={{fontWeight:"500"}}>{rec.postedBy.name}</span> {rec.text} 
                                        {/* {
                                            rec.postedBy._id==state._id&&<i className="material-icons" style={{float:"right"}} onClick={()=>deleteComment(rec.text,rec.postedBy._id)}>delete</i>
                                        }  */}
                                        </h6>
                                    )
                                })
                            }
                            <form onSubmit={(e)=>{
                                e.preventDefault()
                                makeComment(e.target[0].value,item._id)
                            }}>
                                <input type="text" placeholder="add a comment" />
                            </form>
                         </div>
                    </div>
                    )   
                })
            }
            
        </div>
    )
}

export default Home