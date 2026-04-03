import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from './Login.module.css'
import AuthContext from "./context/AuthContext";
import { useContext } from "react";

function Login({setlogstatus, setAuthTokens}){
    const {baseURl} = useContext(AuthContext);
    const [password,setpassword] = useState('');
    const [username,setusername] = useState('');
    const navigate = useNavigate();
    let response;
    const handleSubmit = async (e) =>{
        e.preventDefault();
      try{ response  = await fetch(`${baseURl}login/`,
            {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password}),
    });
   
    let data = 0;
    if(response.ok){
        alert("You have logged in!");
        data = await response.json();
        localStorage.setItem('authTokens', JSON.stringify(data));
        setAuthTokens(JSON.parse(localStorage.getItem('authTokens')));
        console.log("Server response:", data);  
        setlogstatus(false);
        navigate('/');
    }
    if(response.status==401){
        alert("Username or Password Incorrect");
        data = await response.json();
        console.log("Server response:", data);
    }}
    catch(err){
        alert("Something went wrong")
    }
    }

    return(
        
        <>
        <form className={styles.loginform} onSubmit={handleSubmit} >
            <p className={styles.headtext}>LOGIN</p>
            <label htmlFor="username">Username:</label>
            <input className={styles.forminput}  id="username" type="text" value={username} onChange={(e)=>{setusername(e.target.value)}}/>
            <label htmlFor="password">Password</label>
            <input className={styles.forminput} id="password" type="password" value={password} onChange={(e)=>{setpassword(e.target.value)}}/>
            
            <button className={styles.button} type="submit">Submit</button>
        <button type="button" className={styles.button} onClick={()=>{navigate("/register")}}>You dont have an account?</button>
        </form>
        
        </>
    )
}

export default Login