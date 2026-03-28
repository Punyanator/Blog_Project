import { useState } from "react"
import useAxios from "./utils/useAxios";

function DeleteAccount({setAuthTokens,setlogstatus,setUser}){
    const api = useAxios();
    const [password, setPassword] = useState("");
    const [placeholder, setplaceholder] = useState("");
    const HandleSubmit = async (e) =>{
    e.preventDefault();
    try{
     let  response  = await api.post(`user/delete/`,{password});
    
    alert("Account Deleted Successfully")
    setlogstatus(true);
    localStorage.removeItem("authTokens");
    setAuthTokens(null);
    setUser(null)

    
}
    
    catch(error){
        setplaceholder("Wrong Password");
        setPassword("");
        console.log(error.response);       // full response object
        console.log(error.response?.data); // server's response body
        console.log(error.message); 
        
    }
    
    
    
  
    
    }
    return(
        <>
        <p>Please Input Password to Confirm Delete</p>
        <form onSubmit={HandleSubmit}>
            
        <input type='text' value={password} placeholder={placeholder} onChange={(e)=>{setPassword(e.target.value)}}/>
        <button type="submit">Delete Account</button>

        </form>
        </>
    )
}


export default DeleteAccount