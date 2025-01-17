import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    userid: localStorage.getItem('userid') || null,
    isLogined: localStorage.getItem('isLogined') || false
  },
  reducers: {
    login(state, action) {
      state.userid = action.payload;
      localStorage.setItem('userid', action.payload); //로컬스토리지
      state.isLogined = true;
      localStorage.setItem('isLogined', true);
    },
    logout(state, userid) {
      localStorage.removeItem('userid');
      localStorage.removeItem('isLogined');
      state.userid = null;
      state.isLogined = false;
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
