import React from "react";

const KidPopUp = ({ children }) => {
  return (
    <div className="card p-3" style={{ width: "300px", backgroundColor:"#f0f2f5" }}>
      {children}
    </div>
  );
};

export default KidPopUp;
