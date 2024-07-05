import { groupImg, imgUrl } from "../../apiConfig";
import CrossIcon from "../CrossIcon/CrossIcon";
import ActionButtons from "../chat-components/ActionButtons/ActionButtons";
import PopupWrapper from "../chat-components/PopupWrapper/PopupWrapper";

const ForwardPopup = ({
  submitfn,
  cancelFn,
  chats,
  setForwardingData,
  forwardingData,
}) => {
  const handleUsers = (id) => {
    let recipientIds = forwardingData?.recipientIds;
    if (recipientIds.includes(id)) {
      recipientIds = recipientIds?.filter((value) => {
        return value != id;
      });
    } else recipientIds.push(id);

    setForwardingData({ ...forwardingData, recipientIds: recipientIds });
  };
 
  const checkUser = (id) => {
    if (forwardingData?.recipientIds?.includes(id)) return true;
    else return false;
  };

  const ListAllUsers = () => {
    return chats?.length > 0 ? (
      chats?.map((item, i) => {
        const { Users = [], chatName = "group", isGroupChat = "false" } = item;
        const user = Users.filter((item) => {
          return item?._id != JSON.parse(localStorage.getItem("user"))?._id;
        });
        return (
          <div
            className="d-flex justify-content-between align-items-center"
            key={i}
          >
            <div className="d-flex justify-content-start align-items-center p-2">
              <img
                className="content-message-image"
                src={
                  isGroupChat == true
                    ? groupImg
                    : imgUrl + user[0]?.profilePicture
                }
                alt="user"
              />
              <div>
                <div>{isGroupChat == true ? chatName : user[0]?.name}</div>
              </div>
            </div>
            <div></div>
            <input
              type="checkbox"
              style={{ height: "15px", width: "15px" }}
              checked={checkUser(item?._id)}
              onChange={() => {
                handleUsers(item?._id);
              }}
            />
          </div>
        );
      })
    ) : (
      <div className="d-flex justify-content-center align-items-center">
        No chat found
      </div>
    );
  };
  return (
    <PopupWrapper>
      <div className="d-flex justify-content-between align-items-center">
        <h6>Forward Message</h6>
        <CrossIcon fn={() => {
          cancelFn()
        }} />
      </div>
      <div
        style={{ maxWidth: "300px", fontSize: "13px" }}
        className="my-2 w-100"
      >
        <ListAllUsers />
      </div>

      {chats?.length > 0 && (
        <ActionButtons submitFn={submitfn} cancelFn={() => {cancelFn()}} />
      )}
    </PopupWrapper>
  );
};

export default ForwardPopup;
