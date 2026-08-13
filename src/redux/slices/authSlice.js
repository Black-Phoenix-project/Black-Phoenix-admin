import { createSlice } from "@reduxjs/toolkit";

const isValidToken = (token) => {
  if (!token || token === "undefined") return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  try {
    const payload = JSON.parse(
      atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"))
    );
    if (payload.exp && payload.exp * 1000 < Date.now()) return false;
    return true;
  } catch {
    return false;
  }
};

const storedToken = localStorage.getItem("token");
const token = isValidToken(storedToken) ? storedToken : null;
const storedUser = localStorage.getItem("user");
let user = null;

try {
  user = storedUser ? JSON.parse(storedUser) : null;
} catch {
  user = null;
}

if (!token && storedToken) {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
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
      const incomingToken = action.payload.token;
      if (!isValidToken(incomingToken)) {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        return;
      }
      state.user = action.payload.user;
      state.token = incomingToken;
      state.isAuthenticated = true;
      localStorage.setItem("user", JSON.stringify(action.payload.user || null));
      localStorage.setItem("token", incomingToken);
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

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
