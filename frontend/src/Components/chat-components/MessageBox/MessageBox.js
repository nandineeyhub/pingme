import moment from "moment";
import React, { useRef, useState } from "react";

const MessageBox = ({
  _id = "",
  content = "",
  createdAt = "",
  selfStatus,
  sender,
  setDeletePopup,
  index,
  isGroupChat,
  setId,
  fetchChats,
  forwardPopUpAction,
}) => {
  const friendStatus =
    selfStatus == ""
      ? "conversation-item-text"
      : "conversation-item-text-friend";

  return (
    <div className="conversation-item-wrapper d-flex justify-content-start align-items-center gap-2">
      {selfStatus == "" && (
        <TrashOptions
          setDeletePopup={setDeletePopup}
          clickFn={setId}
          id={_id}
          forwardPopUpAction={forwardPopUpAction}
        />
      )}
      <div className="conversation-item-box">
        {isGroupChat && index == 0 && (
          <span className="name">{sender?.name}</span>
        )}
        <div className={friendStatus}>
          <div>{content}</div>
          <div className="conversation-item-time">
            {moment(createdAt).format("HH:mm")}
          </div>
        </div>
      </div>
      {selfStatus != "" && (
        <TrashOptions
          setDeletePopup={setDeletePopup}
          clickFn={setId}
          fetchChats={fetchChats}
          forwardPopUpAction={forwardPopUpAction}
          id={_id}
        />
      )}
    </div>
  );
};

export default MessageBox;

const TrashOptions = ({
  setDeletePopup,
  clickFn,
  id = "",
  forwardPopUpAction,
}) => {
  const [isTrashVisible, setIsTrashVisible] = useState(false);
  const pressTimerRef = useRef(null);

  const handleMouseDown = () => {
    pressTimerRef.current = setTimeout(() => {
      setIsTrashVisible(true);
    }, 500); // 500ms for a long press
  };

  const handleMouseUp = () => {
    clearTimeout(pressTimerRef.current);
  };

  const handleMouseLeave = () => {
    clearTimeout(pressTimerRef.current);
  };

  const handleTouchStart = () => {
    pressTimerRef.current = setTimeout(() => {
      setIsTrashVisible(true);
    }, 500); // 500ms for a long press
  };

  const handleTouchEnd = () => {
    clearTimeout(pressTimerRef.current);
  };

  const handleTouchMove = () => {
    clearTimeout(pressTimerRef.current);
  };
  return (
    <div
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchMove}
      className="d-flex justify-content-center align-items-center gap-1 trash">
      <i
        className={`fa fa-trash ${isTrashVisible && "showTrash"} `}
        onClick={() => {
          setDeletePopup();
          clickFn(id);
        }}></i>
      <i
        className={`fa fa-share ${isTrashVisible && "showTrash"} `}
        onClick={() => {
          if (forwardPopUpAction) forwardPopUpAction(id);
        }}></i>
    </div>
  );
};
