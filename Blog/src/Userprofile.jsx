import { useState, useEffect } from "react";
import { useNavigate, useParams} from "react-router-dom";
import styles from './Userprofile.module.css';
import editimage from '/src/assets/edit-3-svgrepo-com.svg'
import deleteimage from '/src/assets/trash-svgrepo-com.svg'
import useAxios from "./utils/useAxios";
function Profile({deleteTarget, setTarget, user}){
    const api = useAxios();
    const [loading,setloading] = useState(true);
    const [posts, setposts] = useState([]);
    const [profile, setprofile] = useState(null);
    const { username } = useParams();
    const navigate = useNavigate();
    useEffect(
            ()=>{

      const fetchProfile = async() =>    { 
       try{ let res = await  api.get(`profile/${username}`,{ skipGlobal404: true });
        console.log(res.data)
        setposts(res.data.posts); 
        setprofile(res.data.profile);
        setloading(false);}
        catch(error){
           console.log(error.response);       // full response object
           console.log(error.response?.data); // server's response body
           console.log(error.message); 
         if (error.response.status==404){
           setloading(false); 
          
      }
        }
          }
        fetchProfile();
      }
          ,[loading])

    const Readpost = (datum) =>{
      navigate(`/post/${datum.id}`);
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

    //date format functiom
    const formatDate = (date)=>{
          let d = new Date(date);
          return d;
    }
    if(loading) return(<p>Profile Loading....</p>)
    else if(!profile) return(<p>Account doesn't exist</p>)
    return(
       <div id={styles.profilepage}>
            <div className={styles.profilecontent}>
              <img src={user.pfp} id={styles.pfp}/>
            <div>
              <p className={styles.text} id={styles.name}>{profile.full_name}</p>
              <p  id={styles.bio}>{profile.bio}</p>
             {profile.user==user.id?( <button className={styles.editprofile} onClick={()=>navigate('/profile_edit')} >Edit Profile</button>):<></>}
            </div>
            </div>
            
            
            <p className={styles.text}>Creator Posts</p>
           {posts.length > 0 ? (<div className={styles.postcardparent}>{(
                posts.map((datum)=>  <div onClick={()=> Readpost(datum)} className={styles.postcard} key={datum.id}>
                <p className={styles.title}>Title:{datum.title}{datum.edited?<small style={{fontSize:"0.8rem"}}>(edited)</small>:<></>}</p>
                <p>By:{datum.author_name}</p>
                            
                <p>Created:{formatDate(datum.created_at).toDateString()}</p>
                {user!=null &&(user.username==datum.author_name)?<div><button className={styles.postbutton} id={styles.deletebutton} type="text" onClick={(e)=>{e.stopPropagation();setTarget(datum.id)}}><img src={deleteimage} /></button>
                          <button className={styles.postbutton} id={styles.editbutton}  type="text" onClick={(e)=>{e.stopPropagation(); navigate("/post_edit",{state:{"postid":datum.id}})}}> <img src={editimage} /></button>
                          </div>:<></>}
                {deleteTarget==datum.id? <div  className={styles.deleteconfirmation   }>
                <p style={{gridColumn:"1/3" ,gridRow:"1"}}>Are you sure you want to delete this post?</p>
                <button onClick={(e)=>{e.stopPropagation(); Deletepost(datum.id);setTarget(null)}} style={{gridColumn:"1" ,marginLeft:"auto",backgroundColor:"#36732C"}} type="text">Yes</button>
                <button onClick={(e)=>{e.stopPropagation(); setTarget(null)}}  style={{gridColumn:"2" ,backgroundColor:"#732C2C"}} type="text">No</button>
                </div>:<p></p>}
                </div> ))}</div>) : (<p>No posts yet</p>
                            )}  
        </div>
    )
}

export default Profile