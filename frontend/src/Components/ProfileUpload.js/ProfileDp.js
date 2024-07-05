import React, { useRef } from "react";
import { imgUrl, noImg } from "../../apiConfig";

const ProfileDp = ({profilePicture="", uploadDp, action = false }) => {

  const openFileref = useRef();

  const clickFileInput = () => {
    openFileref.current.click();
  };

  return (
    <div className="choose-dp-logo">
      <div className="user_img">
        <img
          className=""
          src={profilePicture == "" ? noImg : imgUrl + profilePicture}
        />
      </div>
      {action && (
        <div className="edit-dp d-flex justify-content-center align-items-center">
          <i className="fa fa-pencil pencil-size" onClick={clickFileInput}></i>
        </div>
      )}
      <input
        className="choose-dp"
        type="file"
        accept="image/*"
        onChange={(e) => {
          uploadDp(e);
        }}
        ref={openFileref}
      />
    </div>
  );
};

export default ProfileDp;
