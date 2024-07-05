import { useEffect, useState } from "react"

export const usePopUp = () => { 
    const [open, setOpen] = useState(false)
    
    const handlePopup = () => {
        setOpen(!open)
    }
    
    return [open, handlePopup]
}

export function useOnClickOutside(ref, callback) {

    useEffect(
      () => {
        const listener = (event) => {
          // if the referenece is not present
          // or the target is descendant of the refefence
          // return
          if (!ref.current || ref.current.contains(event.target)) {
            return;
          }
          
          // invoke the callback
          callback(event);
        };
  
        document.addEventListener("mousedown", listener);
        document.addEventListener("touchstart", listener);
  
        return () => {
          document.removeEventListener("mousedown", listener);
          document.removeEventListener("touchstart", listener);
        };
      },
      
      // add ref and callback to effect dependencies
      [ref, callback]
    );
  }