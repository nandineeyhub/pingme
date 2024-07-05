import React from "react";
import PopupWrapper from "../PopupWrapper/PopupWrapper";
import CrossIcon from "../../CrossIcon/CrossIcon";
import { groupImg } from "../../../apiConfig";
import ActionButtons from "../ActionButtons/ActionButtons";

const AddToGroup = ({ group = [], fn, setGroupfn, addValue, submitfn }) => {
  
  const ListAllUsers = () => {
    return group?.length > 0 ? (
      group?.map((item) => {
        return (
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex justify-content-start align-items-center p-2">
              <img
                className="content-message-image"
                src={groupImg}
                alt="user"
              />
              <div>
                <div>{item?.chatName}</div>
              </div>
            </div>
            <div></div>
            <input
              type="checkbox"
              style={{ height: "15px", width: "15px" }}
              checked={addValue?.chatId == item?._id}
              onChange={() => {
                setGroupfn({ ...addValue, chatId: item?._id });
              }}
            />
          </div>
        );
      })
    ) : (
      <div className="d-flex justify-content-center align-items-center">
        No new group found
      </div>
    );
  };

  return (
    <PopupWrapper>
      <div className="d-flex justify-content-between align-items-center">
        <h6>Add to Group</h6>
        <CrossIcon
          fn={() => {
            fn();
            setGroupfn({ ...addValue, chatId: "" });
          }}
        />
      </div>
      <div
        style={{ maxWidth: "300px", fontSize: "13px" }}
        className="my-2 w-100">
        <ListAllUsers />
      </div>
      {group?.length > 0 && (
        <ActionButtons
          submitFn={submitfn}
          cancelFn={() => {
            fn();
            setGroupfn({ ...addValue, chatId: "" });
          }}
        />
      )}
    </PopupWrapper>
  );
};

export default AddToGroup;
