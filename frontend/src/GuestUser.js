import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const GuestUser = (props) => {
  const navigate = useNavigate();
  const token = JSON.parse(localStorage.getItem("user"))?.token;

  useEffect(() => {
    if (token) {
      navigate("/messages");
    }
  }, [token]);

  return <>{props.children}</>;
};
export default GuestUser