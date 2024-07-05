import React from 'react'
import PopupWrapper from '../chat-components/PopupWrapper/PopupWrapper'
import ActionButtons from '../chat-components/ActionButtons/ActionButtons'

const WarningPopup = ({action="", submitFn, text, cancelFn}) => {
  return (
   <PopupWrapper>
   
      <h6 style={{color:"black"}}>{`Do you really want to ${action}? `}{text && <span>{text}</span>}</h6>
      
      <div className='d-flex justify-content-end align-items-center'>
        <ActionButtons submitText={action} submitFn={submitFn} cancelFn={cancelFn}/>
      </div>
   </PopupWrapper>
  )
}

export default WarningPopup