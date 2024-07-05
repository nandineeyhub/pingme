import React, { useEffect, useState } from "react";
import UserCard from "./userCard/userCard";
import SearchBar from "./SearchBar/SearchBar";
import callAPI from "../../apiUtils/apiCall";
import { apiUrls, groupImg, headers, imgUrl } from "../../apiConfig";
import { setActiveChat } from "../../Redux/MessageSlice";
import { useDispatch } from "react-redux";
import CreateGroupPopup from "./CreateGroupPopup/CreateGroupPopup";
import useHandlePopup from "../../helpers/useHandlePopup";
import ChatSideBar from "./ChatSideBar/ChatSideBar";
import io from 'socket.io-client';


const ContentSidebar = ({ setShowChat, showChat, friendSuggestions, chats, setFriendSuggestions }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [loader, setLoader] = useState(false);
  const [groupOpen, setGroupOpen] = useHandlePopup();
  const [groupData, setGroupData] = useState({ name: "", users: [] });
  const userDetails = JSON.parse(localStorage.getItem("user"));
  const token = JSON.parse(localStorage.getItem("user"))?.token;


  const headerstemp = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json", // example header
  };
  const dispatch = useDispatch();

  const handleSearch = async (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value != "") setLoader(true);
    else setLoader(false);
  };

  const createGroupChat = async () => {
    try {
      const response = await callAPI(
        apiUrls.createGroupChat,
        {},
        "post",
        groupData,
        headerstemp
      );
      if (response.status) {
        setGroupOpen();
        setGroupData({ name: "", users: [] });
      }
    } catch (error) {}
  };

  

  const searchfriends = async (searchQuery) => {
    setLoader(true);
    try {
      const response = await callAPI(
        apiUrls.searchFriends,
        { search: searchQuery },
        "GET",
        [],
        headers
      );
      if (response?.status) {
        setFriendSuggestions(response?.data);
        setLoader(false);
      }
    } catch (error) {
      setLoader(false);
    }
  };

  const openChat = (item) => {
    dispatch(setActiveChat(item));
    localStorage.setItem("activeChat", JSON.stringify(item));
  };

  const cancelFn = () => {
    setGroupOpen();
  };

  const ListAllUsers = () => {
    return (
      loader == false &&
      friendSuggestions?.map((item) => {
        const { Users = [], chatName = "group", isGroupChat = "false" } = item;
        const user = Users.filter((item) => {
          return item?._id != JSON.parse(localStorage.getItem("user"))?._id;
        });
        return searchQuery.length == 0 ? (
          <UserCard
            name={isGroupChat == true ? chatName : user[0]?.name}
            profilePicture={
              isGroupChat == true ? groupImg : imgUrl + user[0]?.profilePicture
            }
            latestMessage={item?.latestMessage?.content}
            clickFn={() => {
              setShowChat();
              isGroupChat
                ? openChat({
                    ...item,
                    name: chatName,
                    profilePicture: groupImg,
                  })
                : user.length > 0 && openChat(user[0]);
            }}
          />
        ) : (
          <UserCard
            {...item}
            profilePicture={imgUrl + item?.profilePicture}
            latestMessage={"Tap to send a message."}
            clickFn={() => {
              openChat(item);
            }}
          />
        );
      })
    );
  };

  useEffect(() => {
    if (searchQuery === "") {
      setFriendSuggestions(chats);
    } else {
      const timer = setTimeout(() => {
        searchfriends(searchQuery);
      }, 1000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [searchQuery]);



  useEffect(() => {
    const socket = io.connect("http://localhost:8000", { transports: ['websocket', 'polling'] });
    if (userDetails?.name) {
      console.log("hi")
      socket.emit("user_connected", userDetails.name);
    }

    return () => {
      socket.off("user_connected");
    };
  }, [userDetails?.name]);

  return (
    <div className={`content-sidebar ${showChat && "hide"}`}>
      <div className="content-sidebar-title py-3 px-3">
        <div className="d-flex justify-content-center align-items-center gap-2">
          <ChatSideBar />
          Chats
        </div>
        <div style={{ marginTop: "auto", position: "relative" }}>
          <i
            className="fa fa-plus content-sidebar-title group-add"
            onClick={setGroupOpen}></i>
          <div className="group-add-popup">
            {groupOpen && (
              <CreateGroupPopup
                fn={setGroupOpen}
                users={chats}
                setGroupData={setGroupData}
                groupData={groupData}
                submitFn={createGroupChat}
                cancelFn={cancelFn}
              />
            )}
          </div>
        </div>
      </div>
      <SearchBar handleSearch={handleSearch} searchQuery={searchQuery} />
      <div className="content-messages">
        <ul className="content-messages-list">
          <ListAllUsers />
        </ul>
      </div>
    </div>
  );
};

export default ContentSidebar;
