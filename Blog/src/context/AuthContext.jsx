import {createContext, useState, useEffect} from "react";
import {jwtDecode} from "jwt-decode";
import {useNavigate} from "react-router-dom";
import Swal from 'sweetalert2';
import dayjs from "dayjs";

import axios from "axios";


const AuthContext = createContext();

export default AuthContext
const baseURL = "http://127.0.0.1:8000/api/";
export const AuthProvider = ({ children }) => {

    const [authTokens, setAuthTokens] = useState(() =>
        localStorage.getItem("authTokens")
            ? JSON.parse(localStorage.getItem("authTokens"))
            : null
    );
const axiosInstance = axios.create({
    baseURL,
    headers: { Authorization: `Bearer ${authTokens?.access}` }
  });

  axiosInstance.interceptors.request.use(async req => {
    const user = jwtDecode(authTokens.access);
    const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;

    if (!isExpired) return req;

    const response = await axios.post(`${baseURL}refresh/`, {
      refresh: authTokens.refresh
    });
    localStorage.setItem("authTokens", JSON.stringify({"access":response.data.access,"refresh":authTokens.refresh}));

    setAuthTokens(response.data);

    req.headers.Authorization = `Bearer ${response.data.access}`;
    return req;
  });
  
const UserFetch = async () =>{
    
        try{
            let  response =  await axiosInstance.get("user/");
            console.log(response);
            setUser(response.data);
            setLoading(false);
        }
        catch(error){
            console.log(error)
        }

}
    const [user, setUser] = useState()


    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    const loginUser = async (email, password) => {
        const response = await fetch("http://127.0.0.1:8000/api/token/", {
            method: "POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                email, password
            })
        })
        const data = await response.json()
        console.log(data);

        if(response.status === 200){
            console.log("Logged In");
            setAuthTokens(data)
            //setUser(jwtDecode(data.access))
            localStorage.setItem("authTokens", JSON.stringify(data))
            history.push("/")
            Swal.fire({
                title: "Login Successful",
                icon: "success",
                toast: true,
                timer: 6000,
                position: 'top-right',
                timerProgressBar: true,
                showConfirmButton: false,
            })

        } else {    
            console.log(response.status);
            console.log("there was a server issue");
            Swal.fire({
                title: "Username or passowrd does not exists",
                icon: "error",
                toast: true,
                timer: 6000,
                position: 'top-right',
                timerProgressBar: true,
                showConfirmButton: false,
            })
        }
    }

   /* const registerUser = async (email, username, password, password2) => {
        const response = await fetch("http://127.0.0.1:8000/api/register/", {
            method: "POST",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                email, username, password, password2
            })
        })
        if(response.status === 201){
            navigate("/login")
            Swal.fire({
                title: "Registration Successful, Login Now",
                icon: "success",
                toast: true,
                timer: 6000,
                position: 'top-right',
                timerProgressBar: true,
                showConfirmButton: false,
            })
        } else {
            console.log(response.status);
            console.log("there was a server issue");
            Swal.fire({
                title: "An Error Occured " + response.status,
                icon: "error",
                toast: true,
                timer: 6000,
                position: 'top-right',
                timerProgressBar: true,
                showConfirmButton: false,
            })
        }
    }*/

    const logoutUser = () => {
        setAuthTokens(null)
        setUser(null)
        localStorage.removeItem("authTokens")
        history.push("/login")
        swal.fire({
            title: "YOu have been logged out...",
            icon: "success",
            toast: true,
            timer: 6000,
            position: 'top-right',
            timerProgressBar: true,
            showConfirmButton: false,
        })
    }

    const contextData = {
        user, 
        setUser,
        authTokens,
        setAuthTokens,
    }

    useEffect( () =>  {
        if (authTokens) {

         UserFetch();
        }
        else{
            setUser(null);
            setLoading(false)
        }
        
    }, [authTokens, loading])

    return (
        <AuthContext.Provider value={contextData}>
            {loading ? (<p>Loading</p>) : children}
        </AuthContext.Provider>
    )

}