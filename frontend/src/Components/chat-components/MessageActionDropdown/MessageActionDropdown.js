import React from 'react'

const MessageActionDropdown = () => {
  return (
    <div className="conversation-item-dropdown">
    <button
      type="button"
      className="conversation-item-dropdown-toggle"
    >
      <i className="ri-more-2-line" />
    </button>
    <ul className="conversation-item-dropdown-list">
      <li>
        <a href="#">
          <i className="ri-share-forward-line" />{" "}
          Forward
        </a>
      </li>
      <li>
        <a href="#">
          <i className="ri-delete-bin-line" /> Delete
        </a>
      </li>
    </ul>
  </div>
  )
}

export default MessageActionDropdown