import React, { useEffect, useRef, useState } from "react";
import MessageBox from "../MessageBox/MessageBox";
import UserDpSm from "../UserDpSm/UserDpSm";
import WarningPopup from "../../Popups/WarningPopup";
import { usePopUp } from "../../../customHooks";
import moment from "moment";
import ChatDayStamp from "../ChatDayStamp/ChatDayStamp";
import callAPI from "../../../apiUtils/apiCall";
import { apiUrls } from "../../../apiConfig";
import ForwardPopup from "../../Popups/forwardPopup";
import { useDispatch } from "react-redux";
import { ErrorMessage, SuccessMessage } from "../../../Notification";

const MessageWrapper = ({ messages = [], chatDetails, setChatDetails, refreshList  }) => {
  const [messageList, setMessageList] = useState([]);
  const [chatList, setChatList] = useState([]);
  let messageListTemp = [];
  let subList = [];
  const chatEndRef = useRef(null);

  const serializeMessage = () => {
    if (messages.length == 0) {
      setMessageList([]);
    } else {
      for (let i = 0; i < messages.length; i++) {
        if (i == 0) {
          subList.push(messages[i]);
        } else {
          if (messages[i].sender._id == messages[i - 1].sender._id) {
            if (
              moment(messages[i].createdAt).format("YYYY/MM/DD") ==
              moment(messages[i - 1].createdAt).format("YYYY/MM/DD")
            )
              subList.push(messages[i]);
            else {
              messageListTemp.push(subList);
              setMessageList(messageListTemp);
              subList = [];
              subList.push(messages[i]);
            }
          } else {
            messageListTemp.push(subList);
            setMessageList(messageListTemp);
            subList = [];
            subList.push(messages[i]);
          }
        }

        if (i == messages.length - 1) {
          messageListTemp.push(subList);
          setMessageList(messageListTemp);
        }
      }
    }
  };

  const fetchChats = async () => {
    try {
      const response = await callAPI(apiUrls.fetchChats, {}, "get", null);
      if (response.status) {
        setChatList(
          response.data?.filter((chat) => {
            return chat?._id != chatDetails?._id;
          })
        );
      }
    } catch (error) {}
  };

  const deleteMessage = async (id) => {
    try {
      const response = await callAPI(
        apiUrls.deleteMessage,
        { messageId: id },
        "delete",
        {
          messageId: id,
        }
      );
      if (response.status) {
        const newMessages = messages.filter((msg) => {
          return msg._id != id;
        });
        setChatDetails((value) => {
          return { ...value, messages: newMessages };
        });
        refreshList()
      } else {
      }
    } catch (error) {}
  };

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    serializeMessage();
  }, [messages.length]);

  useEffect(() => {
    scrollToBottom();
  }, [messageList]);

  return (
    <div>
      {messageList.map((item, i) => {
        const lastLabel = i != 0 ? messageList[i - 1][0]?.createdAt : "";
        return (
          <MessageContainer
            item={item}
            isGroupChat={chatDetails?.isGroupChat}
            chats={chatList}
            lastLabel={lastLabel}
            i={i}
            fetchChats={fetchChats}
            refreshList={refreshList}
            deleteMessage={deleteMessage}
            chat={chatDetails}
          />
        );
      })}
      <div ref={chatEndRef}></div>
    </div>
  );
};

export default MessageWrapper;

const MessageContainer = ({
  item,
  isGroupChat,
  lastLabel,
  i,
  deleteMessage,
  chats,
  fetchChats,
  refreshList,
  chat
}) => {
  const [deletePopup, setDeletePopup] = usePopUp();
  const [forwardPopup, setForwardPopup] = usePopUp();
  const [id, setId] = useState("");
  const [forwardingData, setForwardingData] = useState({
    messageId: "",
    recipientIds: [],
  });

  const dispatch = useDispatch()

  const forwardMessage = async (data) => {
    try {
      const response = await callAPI(apiUrls.fowardMessage, {}, "post", data);
      if (response.status) {
        setForwardPopup();
        setForwardingData({
          messageId: "",
          recipientIds: [],
        });
        refreshList()
        SuccessMessage(response.message)
      }else{
        ErrorMessage(response.message)
      }
    } catch (error) {
      ErrorMessage(error.message)
    }
  };

  const forwardPopUpAction = (id) => {
    setForwardingData((value) => {
      return { ...value, messageId: id };
    });
    setForwardPopup();
    fetchChats();
  };

  const selfStatus =
    item[0]?.sender?._id != JSON.parse(localStorage.getItem("user"))?._id
      ? "me"
      : "";

  const getLabel = () => {
    if (i == 0) return true;
    else if (
      moment(item[0]?.createdAt).format("YYYY/MM/DD") !=
      moment(lastLabel).format("YYYY/MM/DD")
    )
      return true;
    else return false;
  };

  return (
    <>
      {getLabel() && <ChatDayStamp dateString={item[0].createdAt} />}
      <div className={`conversation-item ${selfStatus}`}>
        <UserDpSm {...item[0]?.sender} />
        <div className="conversation-item-content">
          {item?.map((message, index) => {
            return (
              <MessageBox
                isGroupChat={isGroupChat}
                index={index}
                {...message}
                selfStatus={selfStatus}
                setDeletePopup={setDeletePopup}
                setId={setId}
                setForwardPopup={setForwardPopup}
                fetchChats={fetchChats}
                forwardPopUpAction={forwardPopUpAction}
              />
            );
          })}
        </div>
      </div>
      {deletePopup && (
        <WarningPopup
          action={"Delete"}
          text={"It will only be deleted for you."}
          cancelFn={setDeletePopup}
          submitFn={() => {
            deleteMessage(id);
            setDeletePopup();
          }}
        />
      )}
      {forwardPopup && (
        <ForwardPopup
          chats={chats}
          setForwardPopup={setForwardPopup}
          setForwardingData={setForwardingData}
          forwardingData={forwardingData}
          submitfn={() => {
            forwardMessage(forwardingData);
          }}
          cancelFn={() => {
            setForwardPopup();
            setForwardingData({
              messageId: "",
              recipientIds: [],
            });
          }}
        />
      )}
    </>
  );
};
