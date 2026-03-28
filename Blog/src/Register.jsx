import { useState } from "react"
import styles from './Register.module.css'
import { useNavigate } from "react-router-dom";
function Register(){
    const [password,setpassword] = useState('');
    const [password_confirm,setpassword_confirm] = useState('');
    const [username,setusername] = useState('');
    const navigate = useNavigate();
    let response;
    const handleSubmit = async (e) =>{
        e.preventDefault();
       response  = await fetch("http://localhost:8000/api/register/",
            {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password, password_confirm}),
    });
    const data = await response.json();
    console.log("Server response:", data);  
    if (response.status==201){
        console.log("we navigated to profile create");
        alert(data.message);
        navigate("/profile_create",{state : {"id":data.id}});
    }
    else {
        if (data.confirm_password){
            alert ("Passwords do not match")
        }
        if(data.username=="A user with that username already exists."){
        alert("A user with that username already exists");
    }
}
    }
    return(
        

        <form className={styles.registerform} onSubmit={handleSubmit}>
            <p className={styles.headtext}>REGISTER</p>
            <label htmlFor="username">Username:</label>
            <input className={styles.forminput} required id="username" type="text" value={username} onChange={(e)=>{setusername(e.target.value)}}/>
            <label htmlFor="password">Password</label>
            <input className={styles.forminput}  required id="password" type="password" value={password} onChange={(e)=>{setpassword(e.target.value)}}/>
             <label htmlFor="password_c">Confirm Password</label>
            <input className={styles.forminput} required  id="password_c" type="password" value={password_confirm} onChange={(e)=>{setpassword_confirm(e.target.value)}}/>
            <button className={styles.registerbutton} type="submit">Create Account</button>
        </form>
    )
}

export default Register