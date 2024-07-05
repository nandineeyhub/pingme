import React, { useEffect, useState } from "react";
import MessageTypeBar from "./MessageTypeBar/MessageTypeBar";
import ChatHeader from "./ChatHeader/ChatHeader";
import MessageWrapper from "./MessageWrapper/MessageWrapper";
import { useDispatch, useSelector } from "react-redux";
import { setActiveChat } from "../../Redux/MessageSlice";
import callAPI from "../../apiUtils/apiCall";
import { apiUrls, base, headers } from "../../apiConfig";
import DefaultChatWindow from "./DefaultChatWindow";
import io from 'socket.io-client';


const Messages = ({ showChat, setShowChat, fetchChats }) => {
  const [chatDetails, setChatDetails] = useState({});
  const [messageBody, setMessageBody] = useState({ chatId: "", content: "" });
  const activeChatDetails = useSelector((store) => store.messages.activeChat);
  
  const dispatch = useDispatch();

  const handleMessage = (e) => {
    setMessageBody((value) => {
      return { ...value, content: e.target.value };
    });
  };

 

  const accessChat = async (id, isGroupChat) => {
    try {
      const response = await callAPI(
        apiUrls.accessChat,
        {},
        "post",
        { userId: id, isGroupChat: isGroupChat },
        headers
      );
      if (response.status) {
        setChatDetails(response.data);
        setMessageBody((value) => {
          return { ...value, chatId: response.data.chatDetails?._id };
        });
      }
    } catch (error) {}
  };

  const sendMessage = async () => {
    try {
      const response = await callAPI(
        apiUrls.sendMessage,
        {},
        "POST",
        messageBody,
        headers
      );
      if (response.status) {
        setMessageBody((value) => {
          return { ...value, content: "" };
        });
       
      }
    } catch (error) {}
  };

  useEffect(() => {
    if (activeChatDetails && Object.keys(activeChatDetails)?.length == 0) {
      dispatch(setActiveChat(JSON.parse(localStorage.getItem("activeChat"))));
    }
  }, []);

  useEffect(() => {
    if (activeChatDetails && Object.keys(activeChatDetails)?.length > 0) {
      accessChat(activeChatDetails?._id, activeChatDetails?.isGroupChat);
    }
  }, [activeChatDetails?._id]);

  useEffect(() => {
    const socket = io.connect(base, { transports: ['websocket', 'polling'] }); 
    socket.on('newMessage', (message) => {
      setChatDetails((val) => { return {...val, messages :[...val.messages, message]}});
    });

    return () => {
      socket.off('newMessage');
    };
  }, []);

  return activeChatDetails ? (
    <div className={`conversation ${showChat === false && "hide"}`}>
      <ChatHeader {...activeChatDetails} setShowChat={setShowChat} />
      <div className="conversation-main">
        <div className="conversation-wrapper">
          <MessageWrapper {...chatDetails} setChatDetails={setChatDetails} refreshList={fetchChats}/>
        </div>
      </div>
      <MessageTypeBar
        handleMessage={handleMessage}
        sendMessage={sendMessage}
        content={messageBody.content}
        setMessageBody={setMessageBody}
      />
    </div>
  ) : (
    <DefaultChatWindow />
  );
};

export default Messages;
