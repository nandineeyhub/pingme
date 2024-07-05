import React, { useEffect, useRef, useState } from "react";
import { apiUrls, imgUrl, noImg } from "../../../apiConfig";
import GroupChatOptionPopup from "../PopupWrapper/GroupChatOptionPopup";
import { usePopUp } from "../../../customHooks";
import Index from "../../ProfileUpload.js/Index";
import { useSelector } from "react-redux";
import ViewGroupPopup from "../viewGroupPopup/ViewGroupPopup";
import AddToGroup from "../AddToGroup/AddToGroup";
import callAPI from "../../../apiUtils/apiCall";
import io from "socket.io-client";

const ChatHeader = ({
  name = "User",
  profilePicture = "",
  isGroupChat = false,
  groupAdmin,
  Users = [],
  setShowChat,
}) => {
  const activeChatDetails = useSelector((store) => store.messages.activeChat);
  const [open, setOpen] = usePopUp();
  const [profileOpen, setProfileOpen] = usePopUp();
  const [addOpen, setAddOpen] = usePopUp();
  const [removeOpen, setRemoveOpen] = usePopUp();
  const [addValue, setAddValue] = useState({
    userId: activeChatDetails?._id,
    chatId: "",
  });
  const [group, setGroup] = useState();
  const [userStatus, setUserStatus] = useState("offline");
  const clickref = useRef();

  const userDetails = JSON.parse(localStorage.getItem("user"));
  const profilePicUrl =
    profilePicture == ""
      ? noImg
      : isGroupChat
      ? profilePicture
      : imgUrl + profilePicture;
  const conversationSubtitle = isGroupChat ? (
    <>
      You,{" "}
      {Users?.map((user, i) => {
        if (user._id != userDetails._id) {
          const member =
            i + 1 != Users.length
              ? " " + user.name + ","
              : " " + user.name + ".";
          return member;
        }
      })}
    </>
  ) : (
    userStatus
  );

  const fetchChats = async () => {
    try {
      const response = await callAPI(apiUrls.fetchChats, {}, "get", null);
      if (response.status) {
        const data = response.data?.filter((value) => {
          return value?.isGroupChat == true;
        });

        const groups = data.filter((group) => {
          const users = group?.Users?.map((item) => {
            return item?._id;
          });
          return users?.includes(activeChatDetails?._id) == false;
        });

        setGroup(groups);
      }
    } catch (error) {}
  };

  const addToGroup = async () => {
    try {
      const response = await callAPI(apiUrls.addToGroup, {}, "post", addValue);
      if (response.status) {
        setAddOpen();
        setAddValue({ ...addValue, chatId: "" });
      }
    } catch (error) {}
  };

  const removeFromGroup = async (chatId, userId) => {
    try {
      const response = await callAPI(apiUrls.removeFromGroup, {}, "post", {
        chatId: chatId,
        userId: userId,
      });
      if (response.status) {
        setRemoveOpen();
      }
    } catch (error) {}
  };

  const chatOptionsText = () => {
    if (isGroupChat) {
      if (groupAdmin?._id == userDetails._id) {
        return "Remove friend";
      } else return "Leave Group";
    } else return "Add to Group";
  };

  const fn = () => {
    if (isGroupChat) {
      if (groupAdmin?._id == userDetails._id) return setRemoveOpen;
    } else {
      return setAddOpen;
    }
  };

  useEffect(() => {
    if (addOpen) {
      fetchChats();
    }
  }, [addOpen]);

  useEffect(() => {
    setAddValue({ userId: activeChatDetails });
  }, [activeChatDetails?._id]);

  useEffect(() => {
    const socket = io.connect("http://localhost:8000", {
      transports: ["websocket", "polling"],
    });
    const checkUserStatus = (username) => {
      socket.emit("check_user_status", username);
    };

    if (name) {
      checkUserStatus(name);
    }

    socket.on("user_status", ({ username, status }) => {
      console.log("hi", username);
      if (username == name) {
        setUserStatus(status);
      }
    });

    return () => {
      socket.off("user_status");
    };
  }, [name]);

  return (
    <div className="conversation-top">
      <div className="conversation-user">
        <i
          className="fa fa-arrow-left conversation-back"
          onClick={() => setShowChat()}
        />
        <img
          className="conversation-user-image"
          src={profilePicUrl}
          alt="user"
        />
        <div>
          <div className="conversation-user-name">{name}</div>
          <div
            className={
              conversationSubtitle == "online" && "conversation-user-status"
            }
          >
            <span>{conversationSubtitle}</span>
          </div>
        </div>
      </div>
      <div className="conversation-buttons">
        <div type="button" style={{ position: "relative" }}>
          <i className="fa fa-ellipsis-v" onClick={setOpen} />
          <div className="group-add-popup">
            {open && (
              <GroupChatOptionPopup
                text={chatOptionsText()}
                clickFn={setOpen}
                clickref={clickref}
                fn={fn()}
                fnView={setProfileOpen}
              />
            )}
          </div>
        </div>
      </div>
      {profileOpen &&
        (isGroupChat ? (
          <ViewGroupPopup {...activeChatDetails} fn={setProfileOpen} />
        ) : (
          <Index profileDetails={activeChatDetails} fn={setProfileOpen} />
        ))}
      {addOpen && (
        <AddToGroup
          group={group}
          fn={setAddOpen}
          setGroupfn={setAddValue}
          addValue={addValue}
          submitfn={addToGroup}
        />
      )}
      {removeOpen && (
        <ViewGroupPopup
          {...activeChatDetails}
          fn={setRemoveOpen}
          submitfn={removeFromGroup}
          action={true}
        />
      )}
    </div>
  );
};

export default ChatHeader;
