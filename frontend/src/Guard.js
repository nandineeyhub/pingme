import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthRequired = (props) => {
  const navigate = useNavigate();
  const token = JSON.parse(localStorage.getItem("user"))?.token;
  
  useEffect(()=>{
    if (!token) {
    
        navigate("/");
      } 
  },[token])

   return <>{props.children}</>;
};
export default AuthRequired;
