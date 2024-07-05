import React from "react";
import { useOnClickOutside } from "../../../customHooks";

const GroupChatOptionPopup = ({ text = "", fn, fnView, clickref, clickFn }) => {
  useOnClickOutside(clickref, () => {
    clickFn();
  });

  return (
    <div
      ref={clickref}
      className="text-start"
      style={{
        backgroundColor: "#f0f2f5",
        width: "170px",
        fontSize: "14px",
        borderRadius: "10px",
      }}
    >
      <div
        className="d-flex align-items-center gap-3 p-3 listItem"
        onClick={() => {
          if (fn) fn();
        }}
      >
        <i className="fa fa-sign-out" />
        <span>{text}</span>
      </div>
      <div
        className=" d-flex align-items-center gap-3 p-3 listItem"
        onClick={() => {
          if (fnView) fnView();
        }}
      >
        <i className="fa fa-eye" />
        <span>View Details</span>
      </div>
    </div>
  );
};

export default GroupChatOptionPopup;
