import { configureStore } from "@reduxjs/toolkit";
import reducer from "./userSlice.js";

const store = configureStore({
  reducer: {
    user: reducer
  }
})

export default store;
