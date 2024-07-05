import React from "react";

const PopupWrapper = ({ children }) => {
  return (
    <div className="profile active">
      <div className="spinner_overlay"></div>
      <div className="d-flex justify-content-center align-items-center m-auto">
      <div className="spinner-box">{children}</div>
      </div>
    </div>
  );
};

export default PopupWrapper;
