import moment from "moment";
import React from "react";

const ChatDayStamp = ({dateString}) => {
  const formatDateLabel = () => {
    const messageDate = new Date(dateString);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
  
    if (messageDate.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (messageDate.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return messageDate.toLocaleDateString(undefined, options);
    }
  };
  return (
    <div className="d-flex justify-content-center align-items-center my-2">
      <span>{formatDateLabel()}</span>
    </div>
  );
};

export default ChatDayStamp;
