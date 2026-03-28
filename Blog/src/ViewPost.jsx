import { useEffect , useState} from "react";
import { useParams } from "react-router-dom";
import useAxios from "./utils/useAxios";
import styles from './ViewPost.module.css'
function PostView(){
  const api = useAxios();
  const [data, setData] = useState();
  const [loading,setloading] = useState(true);
  const { id } = useParams();

 // console.log(name);
   useEffect(
            ()=>{

      const fetchPost = async() =>    { 
       try{ let res = await  api.get(`posts/${id}/`,{ skipGlobal404: true });
        setData(res.data); 
        setloading(false);}
        catch(error){
          console.error(error);
           console.log(error.response);       // full response object
          console.log(error.response?.data); // server's response body
          console.log(error.message); 
          if (error.response.status==404){
          alert("Post cant be found");
          setloading(false);
      }
        }
          }
        fetchPost();
      }
          ,[loading])

    if (!loading){
      console.log(data);
    }
    if(loading){
      return(<p>Post Loading</p>)
    }
    return(
        <div id={styles.parent}>
        
        
        {data?(<><p className={styles.title}>Title:<span>{data.title}</span></p><div className={styles.content} dangerouslySetInnerHTML={{ __html: data.content }}></div></>):(<p>No Post Found</p>)}
        
        
        </div>
    )
}

export default PostView