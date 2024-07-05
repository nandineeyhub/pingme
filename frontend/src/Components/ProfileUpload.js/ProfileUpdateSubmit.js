import React from 'react'
import { useDispatch } from 'react-redux'
import { handleProfileOpen } from '../../Redux/ProfileSlice'

const ProfileUpdateSubmit = ({handleUpdate}) => {
    const dispatch = useDispatch()
  return (
    <div className='d-flex justify-content-end align-items start gap-2 mt-5'>
        <button className='submitBtn'onClick={async ()=>{
             await handleUpdate()
             dispatch(handleProfileOpen())
        }}>Done</button>
        <button className='btn btn-secondary' onClick={()=>{
             dispatch(handleProfileOpen())
        }}>Cancel</button>
    </div>
  )
}

export default ProfileUpdateSubmit