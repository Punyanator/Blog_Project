// ProtectedRoute.jsx
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ authTokens,children,logstatus}) {
  if (logstatus===true){
    console.log("we went to the homepage");
    return <Navigate to="/" replace />;
  }
  else{if (!authTokens) {
    console.log("we went to login page");
    console.log(logstatus)
    return <Navigate to="/login" replace />;
    
  }}
  

  return children;
}