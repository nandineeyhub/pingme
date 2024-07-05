import { createSlice } from "@reduxjs/toolkit";

const profileSlice = createSlice({
    name:"profile",
    initialState:{
        profileOpen : false,
        profileDetails:{}
    },
    reducers:{
       handleProfileOpen : (state) => {
           state.profileOpen = !state.profileOpen;
       },
       setProfile: (state, action) => {
           state.profileDetails = action.payload
       }
    }
})

export const { handleProfileOpen, setProfile } = profileSlice.actions

export default profileSlice.reducer;