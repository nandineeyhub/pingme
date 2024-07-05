import React from 'react'

const CrossIcon = ({fn}) => {
  return (
   
        <i className="fa fa-close"  style={{ cursor: "pointer" }} onClick={()=>{
            if(fn) fn()
        }}></i>
   
  )
}

export default CrossIcon