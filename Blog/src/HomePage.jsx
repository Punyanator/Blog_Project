import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import styles from './HomePage.module.css';
import editimage from '/src/assets/edit-3-svgrepo-com.svg'
import deleteimage from '/src/assets/trash-svgrepo-com.svg'
import useAxios from "./utils/useAxios";
import { useContext } from "react";
import AuthContext from "./context/AuthContext";
function Home({user,deleteTarget, setTarget}){
    const {baseURL} = useContext(AuthContext);
    const api = useAxios();
    const [data, setData] = useState([]);
    const [loading,setloading] = useState(true);// loading varibale in case fetch is delayed 
    const navigate = useNavigate();
    sessionStorage.removeItem("editorcontent")
    const Readpost = (datum) =>{navigate(`/post/${datum.id}`, {state:{"postid":datum.id}});
    }
    

   /*Deleteposts function */
     const Deletepost = async (id) =>{
       try{
    let response  = await api.delete(`posts/delete/${id}/`)
     const data = response.data;
    console.log("Server response:", data);
     alert(data.message);
    setloading(true) ;  }
    catch(error) {
       console.log(error.response);       // full response object
       console.log(error.response?.data); // server's response body
        console.log(error.message); 
    } 
    }


    /*fecth post statement*/ 
    useEffect(
        ()=>{ 
          try{fetch(`${baseURL}posts/`)
      .then((res) => res.json())
      .then((data) => setData(data));
        setloading(false);}
      catch(error){
        console.error(error)
      }}
      ,[loading])
  
    //date format functiom
    const formatDate = (date)=>{
          let d = new Date(date);
          return d;
    }
    
   if(loading) return(<p>Posts Loading....</p>)
    return(

        <div id={styles.homepage}>
        
       
        
          {user!=null?<p  id={styles.greeting}>Hi, {user.username}</p>:(<p id={styles.greeting}>Hey there</p>)}
          <p className={styles.text}>Posts</p>

          
          {data.length > 0 ? (<div className={styles.postcardparent}>{(
          data.map((datum)=>  <div onClick={()=> Readpost(datum)} className={styles.postcard} key={datum.id}>
          <p className={styles.title}>Title:{datum.title}{datum.edited?<small style={{fontSize:"0.8rem"}}>(edited)</small>:<></>}</p>
          <p>By:{datum.author_name}</p>
          
          <p>Created:{formatDate(datum.created_at).toDateString()}</p>
          {user!=null &&(user.username==datum.author_name)?<div><button data-tooltip="Delete Post" className={styles.button} id={styles.deletebutton} type="text" onClick={(e)=>{e.stopPropagation();setTarget(datum.id)}}><img src={deleteimage} /></button>
          <button data-tooltip="Edit Post" className={styles.button} id={styles.editbutton}  type="text" onClick={(e)=>{e.stopPropagation(); navigate("/post_edit",{state:{"postid":datum.id}})}}> <img src={editimage} /></button>
          </div>:<></>}
         {deleteTarget==datum.id? <div  className={styles.deleteconfirmation   }>
            <p style={{gridColumn:"1/3" ,gridRow:"1"}}>Are you sure you want to delete this post?</p>
            <button onClick={(e)=>{e.stopPropagation(); Deletepost(datum.id);setTarget(null)}} style={{gridColumn:"1" ,marginLeft:"auto",backgroundColor:"#36732C"}} type="text">Yes</button>
            <button onClick={(e)=>{e.stopPropagation(); setTarget(null)}}  style={{gridColumn:"2" ,backgroundColor:"#732C2C"}} type="text">No</button>
            </div>:<p></p>}
          </div> ))}</div>)
          : (
          <p>No posts yet</p>
        )}
            
        
        
        </div>
    )
}
 export default Home