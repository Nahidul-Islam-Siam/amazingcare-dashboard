import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

export interface User {
  id: string;
  email: string;
  role: string;
  fullName?: string;
  phoneNumber?: string;
  status?: string;
  country?: string;
  profileImage?: string;
  token?: string;
  isProfileComplete?: boolean;
}

interface AuthState {
  token: string | null;
  user: User | null;
}

const initialState: AuthState = {
  token: null,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      Cookies.set("access_token", action.payload, { expires: 7 });
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    setAuthData: (
      state,
      action: PayloadAction<{ token: string; user: User }>
    ) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      Cookies.set("access_token", action.payload.token, { expires: 7 });
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      Cookies.remove("access_token");
    },
  },
});

export const { setToken, setUser, setAuthData, logout } = authSlice.actions;
export default authSlice.reducer;
