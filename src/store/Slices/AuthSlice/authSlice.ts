import { User } from "@/types/Auth/Auth";
import { createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

interface AuthState {
  user: Partial<User> | null;
}

const initialState: AuthState = {
  user: {
    email: "",
    phone: "",
    userEmail: "",
    userId: "",
    clientId: "",
    role: "",
    specialToken: "",
    accessToken: "",
    refreshToken: "",
  },
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const token = action.payload.accessToken
        ? action.payload.accessToken
        : action.payload.specialToken;
      const decode = jwtDecode(token as string) as User;
      if (action.payload.accessToken) {
        state.user!.userEmail = decode.userEmail;
        state.user!.userId = decode.userId;
        state.user!.clientId = decode.clientId;
        state.user!.role = decode.role;
        state.user!.accessToken = action.payload.accessToken;
        state.user!.refreshToken = action.payload.refreshToken;
      } else {
        state.user!.email = action.payload.email;
        state.user!.phone = action.payload.phone;
        state.user!.specialToken = decode.specialToken;
      }
    },
    logOut: (state) => {
      state.user = null;
    },
  },
});

export const { logOut, setUser } = authSlice.actions;
export default authSlice.reducer;
