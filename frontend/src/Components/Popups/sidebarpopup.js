import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { useOnClickOutside } from "../../customHooks";
import { handleProfileOpen } from "../../Redux/ProfileSlice";
import { useDispatch } from "react-redux";

const Sidebarpopup = ({ open, clickFn, clickref, logoutOpen }) => {
  const dispatch = useDispatch();
  useOnClickOutside(clickref, () => {
    clickFn();
  });

  return (
    <ul
      ref={clickref}
      id="popup"
      style={{backgroundColor:"#f0f2f5"}}
      className={`chat-sidebar-profile-dropdown ${open ? "active" : ""}`}>
      <li>
        <Link
          onClick={() => {
            dispatch(handleProfileOpen());
            clickFn()
          }}>
          <i className="fa fa-user" /> Profile
        </Link>
      </li>
      <li>
        <Link >
          <i className="fa fa-key" /> Password
        </Link>
      </li>
      <li>
        <Link onClick={logoutOpen}>
          <i className="fa fa-sign-out" /> Logout
        </Link>
      </li>
   
    </ul>
  );
};

export default Sidebarpopup;
