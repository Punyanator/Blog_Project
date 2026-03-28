import axios from "axios";
import {jwtDecode} from "jwt-decode";
import dayjs from "dayjs";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

const baseURL = "http://127.0.0.1:8000/api/";

const useAxios = () => {
  const { authTokens, setUser, setAuthTokens } = useContext(AuthContext);

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
    setUser(jwtDecode(response.data.access));

    req.headers.Authorization = `Bearer ${response.data.access}`;
    return req;
  });
  axiosInstance.interceptors.response.use(
    (response) => response,  // if request succeeds, just return it as normal
    (error) => {
       if (error.config.skipGlobal404) return Promise.reject(error);
        if (error.response.status === 404) {
            window.location.href = '/404'
        }
        return Promise.reject(error)  // still let the error propagate
    }
)


  return axiosInstance;
};

export default useAxios;