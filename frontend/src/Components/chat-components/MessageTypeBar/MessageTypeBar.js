import EmojiPicker from "emoji-picker-react";
import React from "react";
import { usePopUp } from "../../../customHooks";

const MessageTypeBar = ({ handleMessage, sendMessage, content = "", setMessageBody }) => {
  const [emojiBoard, setEmojiBoard] = usePopUp()
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        sendMessage();
      }}
    >
      <div className="conversation-form">
        <div className="d-flex justify-content-center align-items-center gap-2">
          <div>
            <button type="button" className="conversation-form-button">
              <i className="fa fa-smile-o" onClick={setEmojiBoard}/>
            </button>
            <div className="emoji-parent">
              <EmojiPicker open={emojiBoard} className="wid" onEmojiClick={
                (emojiObject) => { 
                  setMessageBody((val) =>{return {...val, content: val.content.concat(emojiObject.emoji)}})
                  setEmojiBoard()
                }
              }/>
            </div>
          </div>
          <button type="button" className="conversation-form-record">
            <i className="fa fa-microphone" />
          </button>
        </div>

        <div className="conversation-form-group">
          <input
            className="conversation-form-input"
            rows={1}
            placeholder="Type here..."
            value={content}
            onChange={handleMessage}
          />
        </div>
        <button
          type="submit"
          className="conversation-form-button conversation-form-submit"
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
        >
          <i className="fa fa-send-o" />
        </button>
      </div>
    </form>
  );
};

export default MessageTypeBar;
