import React, { useEffect, useState } from "react";
import ProfileDp from "./ProfileDp";
import ProfileDetails from "./ProfileDetails";
import ProfileUpdateSubmit from "./ProfileUpdateSubmit";
import { useDispatch } from "react-redux";
import { setProfile } from "../../Redux/ProfileSlice";
import callAPI, { API } from "../../apiUtils/apiCall";
import { apiUrls, headers, multiPartHeader } from "../../apiConfig";
import PopupWrapper from "../chat-components/PopupWrapper/PopupWrapper";
import CrossIcon from "../CrossIcon/CrossIcon";

const Index = ({ profileDetails, fn, action = false }) => {
  const [dp, setDp] = useState(
    profileDetails?.profilePicture ? profileDetails?.profilePicture : ""
  );
  const [details, setDetails] = useState(profileDetails ? profileDetails : {});

  const dispatch = useDispatch();

  const uploadDp = async (e) => {
    setDp(e.target.files[0]);
    
    const formData = new FormData();
    formData.append("picture", e.target.files[0]);
    console.log(formData)
    try {
      const response = await callAPI(
        apiUrls.uploadProfilePicture,
        {},
        "POST",
        formData,
        true
      );
      if (response?.status) {
        setDetails((value) => {
          return { ...value, profilePicture: response?.data?.fileName };
        });
        dispatch(
          setProfile({ ...details, profilePicture: response?.data?.fileName })
        );
      }
    } catch (error) {}
  };

  const handleChange = (e) => {
    setDetails((value) => {
      return { ...value, [e.target.name]: e.target.value };
    });
  };

  const handleUpdate = async () => {
    try {
      const response = await callAPI(
        apiUrls.updateProfile,
        {},
        "POST",
        details,
        headers
      );

      if (response.status) {
        dispatch(setProfile(details));
      }
    } catch (error) {}
  };

  // useEffect(() => {
  //    dispatch(setProfile(details));
  // }, [details?.profilePicture]);

  return (
    <PopupWrapper>
      <div className="d-flex justify-content-end align-items-center ">
        <CrossIcon
          fn={() => {
            fn();
          }}
        />
      </div>
      <div className="d-flex justify-content-center align-items-center h-50">
        <ProfileDp
          dp={dp}
          uploadDp={uploadDp}
          {...profileDetails}
          action={action}
        />
      </div>
      <ProfileDetails {...details} editFn={handleChange} action={action} />
      {action && <ProfileUpdateSubmit handleUpdate={handleUpdate} />}
    </PopupWrapper>
  );
};

export default Index;
