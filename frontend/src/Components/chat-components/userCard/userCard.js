import React from "react";
import { imgUrl, noImg } from "../../../apiConfig";

const UserCard = ({
  name = "--",
  profilePicture = "",
  latestMessage = "Tap to send a message.",
  clickFn,
}) => {
  return (
    <li style={{ cursor: "pointer" }} onClick={clickFn}>
      <div className="content-messages-container">
        <img
          className="content-message-image"
          src={profilePicture === "" ? noImg : profilePicture}
          alt=""
        />
        <span className="content-message-info">
          <span className="content-message-name">{name}</span>
          <span className="content-message-text">{latestMessage}</span>
        </span>
        <span className="content-message-more">
          {/* <span className="content-message-unread">5</span> */}
          {/* <span className="content-message-time">12:30</span> */}
        </span>
      </div>
    </li>
  );
};

export default UserCard;
