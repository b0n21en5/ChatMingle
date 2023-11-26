import { createSlice } from "@reduxjs/toolkit";

const initialState = () => {
  return {
    user: JSON.parse(localStorage.getItem("chat-mingle-user")) || null,
  };
};

const userSlice = createSlice({
  name: "user",
  initialState: initialState(),
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("chat-mingle-user", JSON.stringify(action.payload));
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem("chat-mingle-user", JSON.stringify(state.user));
    },
    removeUser: (state) => {
      state.user = null;
      localStorage.removeItem("chat-mingle-user");
    },
  },
});

export const { setUser, updateUser, removeUser } = userSlice.actions;
export default userSlice.reducer;
