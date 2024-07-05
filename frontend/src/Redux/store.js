
import { configureStore } from "@reduxjs/toolkit";
import profileSlice from "./ProfileSlice";
import MessageSlice from "./MessageSlice";

const store = configureStore({
  reducer: {
    profile: profileSlice,
    messages: MessageSlice
  },
});
export default store;
