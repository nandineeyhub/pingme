import { imgUrl } from "../../apiConfig";

export const MidProfilePic = ({ clickref, clickFn, img = ""}) => {
  return (
    <button ref={clickref}  type="button" onClick={clickFn} className="chat-sidebar-profile-toggle">
      <img
        src={(img && img != "") ? imgUrl+img : "https://www.svgrepo.com/show/527946/user-circle.svg"}
        alt=""
      />
    </button>
  );
};
