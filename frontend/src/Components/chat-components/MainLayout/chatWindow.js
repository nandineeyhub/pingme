import React, { useEffect, useState } from "react";
import ContentSidebar from "../ContentSidebar";

import Messages from "../Messages";
import { usePopUp } from "../../../customHooks";
import callAPI from "../../../apiUtils/apiCall";
import { apiUrls } from "../../../apiConfig";

const ChatWindow = () => {
  const [showChat, setShowChat] = usePopUp();
  const [chats, setChats] = useState([]);
  const [friendSuggestions, setFriendSuggestions] = useState([]);
  const [loader, setLoader] = useState(false);

  const fetchChats = async () => {
    setLoader(true);
    try {
      const response = await callAPI(
        apiUrls.fetchChats,
        {},
        "get",
        null
      );
      if (response.status) {
        setChats(response.data);
        setFriendSuggestions(response.data);
        setLoader(false);
      }
    } catch (error) {
      setLoader(false);
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  return (
    <>
      <section className="chat-section">
        <div className="chat-container">{/* <ChatSideBar /> */}</div>
        <div className="chat-content">

          <ContentSidebar 
          showChat={showChat} 
          setShowChat={setShowChat}
          friendSuggestions={friendSuggestions}
          setFriendSuggestions={setFriendSuggestions} 
          chats={chats}
          loader={loader}/>

          <Messages showChat={showChat} setShowChat={setShowChat} fetchChats={fetchChats} />
        </div>
      </section>
    </>
  );
};

export default ChatWindow;
