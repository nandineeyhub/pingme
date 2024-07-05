import { createSlice } from "@reduxjs/toolkit";

const messageSlice = createSlice({
    name:"messages",
    initialState:{
        activeChat:{},
        messages:[]
    },
    reducers:{
       setActiveChat: (state, action) => {
         state.activeChat = action.payload
       }
    }
})

export const { setActiveChat } = messageSlice.actions;
export default messageSlice.reducer