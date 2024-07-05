import React from "react";

const ProfileDetails = ({name, email, editFn, action=false}) => {

  return (
    <div className="my-4">
      <div className="d-flex justify-content-center align-items-center gap-2 my-3">
        <input className="" placeholder="Name" name="name" value={name} disabled={!action} onChange={(e)=>{
          if(editFn){
            editFn(e)
          }
        }}/>
        {/* <span><i className="fa fa-pencil"></i></span> */}
      </div>
      <div className="d-flex justify-content-center align-items-center gap-2">
        <input className="" placeholder="Email" value={email} disabled/>
        {/* <span><i className="fa fa-pencil"></i></span> */}
      </div>
    </div>
  );
};

export default ProfileDetails;
