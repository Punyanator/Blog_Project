import { useState, useEffect, useContext } from 'react'
import {Routes, Route , useNavigate, useLocation} from "react-router-dom";

import Home from './HomePage'
import PostView from './ViewPost'
import CreatePost from './CreatePost';
import EditPost from './EditPost';
import Register from './Register';
import Login from './Login';
import Logout from './LogOut';
import ProtectedRoute from './ProtectedRoute';
import DeleteAccount from './DeleteAccount';
import Profile from './Userprofile';
import EditProfile from './Editprofile';
import CreateProfile from './CreateProfile';
import AuthContext from './context/AuthContext';
import plusimage from '/src/assets/plus-svgrepo-com (1).svg'
import NotFound from './404';


function App() {
  const location = useLocation();
  const hideNavbarRoutes = ['/profile', '/','/post','/profile_edit','/post_delete'];
  const showNavbar = hideNavbarRoutes.includes(location.pathname);
  const {user, setUser} = useContext(AuthContext);
  const [deleteTarget,setTarget] = useState(null);
  const [click, setclick] = useState(false);
  const [logoutstatus, setlogstatus] = useState(false);

  const navigate = useNavigate();

  const {authTokens, setAuthTokens} = useContext(AuthContext)

  return (
    
    <div onClick={()=>{setclick(false);setTarget(null)}} id="appcontainer">
    <nav id="navbar"><p onClick={()=>{navigate("/")}}>PunyanatorBlog</p> {!user?<button onClick={()=>{navigate("/login")}}>Login</button>:<div data-tooltip="Profile" onClick={(e)=>{e.stopPropagation();setclick((prevclick)=>  prevclick===false?true:false)}}><img id="pfp"  src ={user.pfp}/>{(click)?( <Logout  setlogstatus={setlogstatus} setAuthTokens={setAuthTokens}/>):(<p></p>)}</div>}  </nav>
    <Routes>
    <Route path ="/register" element = {<Register/>}/>
    <Route path ="/login" element = {<Login setlogstatus={setlogstatus} setAuthTokens={setAuthTokens}  />}/>
    <Route path ="/" element = {<Home  deleteTarget={deleteTarget} setTarget={setTarget}  user ={user} setUser={setUser} />}/>
    <Route path ="/profile/:username" element = {<ProtectedRoute logstatus={logoutstatus} authTokens={authTokens}   ><Profile  deleteTarget={deleteTarget} setTarget={setTarget}  authTokens={authTokens}   user ={user} setUser={setUser} /></ProtectedRoute>}/>
    <Route path ="/post/:id" element = {<ProtectedRoute logstatus={logoutstatus} authTokens={authTokens}  ><PostView /></ProtectedRoute>}/>
    <Route path ="/post_create"  element = {<ProtectedRoute logstatus={logoutstatus}  authTokens={authTokens}><CreatePost/></ProtectedRoute>}/>
    <Route path ="/post_edit"  element = {<ProtectedRoute logstatus={logoutstatus}  authTokens={authTokens} ><EditPost/></ProtectedRoute>}/>
    <Route path ="/profile_edit"  element = {<ProtectedRoute logstatus={logoutstatus}  authTokens={authTokens} ><EditProfile setUser={setUser} user={user} /></ProtectedRoute>}/>
    <Route path ="/profile_create"  element = {<CreateProfile setUser={setUser} user={user} />}/>
    <Route path="/post_delete" element={<ProtectedRoute logstatus={logoutstatus} authTokens={authTokens} ><DeleteAccount setlogstatus={setlogstatus} setAuthTokens={setAuthTokens}  setUser={setUser} user={user}/></ProtectedRoute>}/>
    <Route path="/404" element = {<NotFound/>}/>
    <Route path={"*"} element = {<NotFound/>}/>
    </Routes>
    {showNavbar?(<button className="createbutton" onClick={()=>{navigate("/post_create")}} data-tooltip="Create Post"><img  src={plusimage} /></button>):(<></>)}
    </div>
  )
}

export default App
