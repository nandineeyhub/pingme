import React, { useEffect, useRef } from "react";
import { MidProfilePic } from "../ProfilePics";
import { usePopUp } from "../../../customHooks";
import Sidebarpopup from "../../Popups/sidebarpopup";
import { useDispatch, useSelector } from "react-redux";
import Index from "../../ProfileUpload.js/Index";
import { handleProfileOpen, setProfile } from "../../../Redux/ProfileSlice";
import WarningPopup from "../../Popups/WarningPopup";
import { useNavigate } from "react-router-dom";
import { setActiveChat } from "../../../Redux/MessageSlice";

const ChatSideBar = () => {
  const [open, setOpen] = usePopUp();
  const [logoutPopup, setLogoutPopup] = usePopUp();
  const profileOpen = useSelector((store) => store.profile.profileOpen);
  const profileDetails = useSelector((store) => store.profile.profileDetails);
  const dispatch = useDispatch();
  const clickref = useRef();
  const navigate = useNavigate();

  const logoutFn = () => {
    localStorage.clear();
    dispatch(setProfile({}));
    dispatch(setActiveChat({}));
    navigate("/");
  };

  useEffect(() => {
    if (profileDetails.keys == undefined) {
      const userData = JSON.parse(localStorage.getItem("user"));
      dispatch(
        setProfile({
          name: userData?.name,
          email: userData?.email,
          profilePicture: userData?.profilePicture,
        })
      );
    }
  }, []);

  return (
    <>
      <MidProfilePic
        clickFn={setOpen}
        clickref={clickref}
        img={profileDetails?.profilePicture}
      />
      {open && (
        <Sidebarpopup
          open={open}
          clickFn={setOpen}
          clickref={clickref}
          logoutOpen={setLogoutPopup}
        />
      )}

      {profileOpen && (
        <Index
          profileDetails={profileDetails}
          action={true}
          fn={() => {
            dispatch(handleProfileOpen());
          }}
        />
      )}
      {logoutPopup && (
        <WarningPopup
          action="Logout"
          cancelFn={setLogoutPopup}
          submitFn={logoutFn}
        />
      )}
    </>
  );
};

export default ChatSideBar;
