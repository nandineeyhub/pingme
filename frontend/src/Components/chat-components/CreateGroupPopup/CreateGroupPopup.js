import React from "react";
import CrossIcon from "../../CrossIcon/CrossIcon";
import { imgUrl, noImg } from "../../../apiConfig";
import ActionButtons from "../ActionButtons/ActionButtons";
import KidPopUp from "../PopupWrapper/KidPopUp";

const CreateGroupPopup = ({ fn, users = [], submitFn, setGroupData, groupData, cancelFn }) => {
  const ListAllUsers = () => {
    return users?.map((item) => {
      const { Users = [], isGroupChat = false } = item;
      const userss = Users.filter((user)=>{ return user._id != JSON.parse(localStorage.getItem("user"))?._id})
      const imgUrlString = imgUrl + userss[0]?.profilePicture;
      return (
        isGroupChat == false && (
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex justify-content-start align-items-center p-2">
              <img
                className="content-message-image"
                src={userss[0]?.profilePicture == "" ? noImg : imgUrlString}
                alt="user"
              />
              <div>
                <div>{userss[0]?.name}</div>
                <div>{userss[0]?.email}</div>
              </div>
            </div>
         
            <input
              type="checkbox"
              style={{ height: "15px", width: "15px" }}
              checked={groupData?.users?.includes(userss[0]?._id)}
              onChange={() => {
                handleGroupMembers(userss[0]?._id);
              }}
            />
          </div>
        )
      );
    });
  };

  const handleName = (e) => {
    setGroupData((value) => {
      return { ...value, name: e.target.value };
    });
  };

  const handleGroupMembers = (userid) => {
    if (groupData?.users?.includes(userid)) {
      setGroupData((item) => {
        return {
          ...item,
          users: groupData?.users?.filter((item) => item != userid),
        };
      });
    } else {
      let newData = groupData?.users;
      newData.push(userid);
      setGroupData((item) => {
        return { ...item, users: newData };
      });
    }
  };

  return (
    <KidPopUp>
      <div className="d-flex justify-content-between align-items-center">
        <h6>Create Group</h6>
        <CrossIcon fn={fn} />
      </div>

      <input
        placeholder="Group Name"
        className="my-2 form-control form-input"
        onChange={handleName}
      />
      <div style={{ height: "300px", fontSize: "13px" }} className="my-2 w-100">
        <ListAllUsers />
      </div>
      <ActionButtons submitText="Create" submitFn={submitFn} cancelFn={cancelFn}/>
    </KidPopUp>
  );
};

export default CreateGroupPopup;
