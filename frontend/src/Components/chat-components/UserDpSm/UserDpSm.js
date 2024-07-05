import React from 'react'
import { imgUrl, noImg } from '../../../apiConfig'

const UserDpSm = ({profilePicture = ""}) => {
  const userimg = profilePicture == "" ? noImg : imgUrl+profilePicture
  return (
    <div className="conversation-item-side">
    <img
      className="conversation-item-image"
      src={userimg}
      alt=""
    />
  </div>
  )
}

export default UserDpSm