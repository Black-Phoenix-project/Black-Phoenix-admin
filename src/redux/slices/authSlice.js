import { createSlice } from "@reduxjs/toolkit";

const token = localStorage.getItem("token");
const storedUser = localStorage.getItem("user");
let user = null;

try {
  user = storedUser ? JSON.parse(storedUser) : null;
} catch {
  user = null;
}

const initialState = {
  user,
  token: token || null,
  isAuthenticated: !!token,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      localStorage.setItem("user", JSON.stringify(action.payload.user || null));
      localStorage.setItem("token", action.payload.token);
    },
    registerSuccess: (state, action) => {
      state.user = action.payload.user; 
      state.token = action.payload.token;
      state.isAuthenticated = true;
      localStorage.setItem("user", JSON.stringify(action.payload.user || null));
      localStorage.setItem("token", action.payload.token);
    },
    
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
  },
});

export const { loginSuccess, registerSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
