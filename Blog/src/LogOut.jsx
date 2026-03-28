import { useContext } from 'react';
import styles from './Logout.module.css'
import { useNavigate } from "react-router-dom";
import AuthContext from './context/AuthContext';

function Logout({setAuthTokens,setlogstatus}){
    const {user, setUser} = useContext(AuthContext);
    const navigate = useNavigate();
    const Logout = ()=>{
        setlogstatus(true);
       
        localStorage.removeItem("authTokens");
        setAuthTokens(null);
    }
    return(
        <div className={styles.mainbox}>
         <button className={styles.button} onClick={()=>navigate(`/profile/${user.username}`)}>Profile</button>
        <button className={styles.button}  onClick={Logout}>Logout</button>
        <button className={styles.button} onClick={()=>navigate("/post_delete")}>Delete Account</button>
        </div>
    )
}

export default Logout