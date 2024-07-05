import { useState } from "react"

const useHandlePopup = () => {
    const [open, setOpen] = useState(false)

    const handlePopup = () => {
         setOpen(!open)
    }

    return [open, handlePopup]

}

export default useHandlePopup