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
      if (action?.payload?.accessToken) {
        state.user = {
          ...state.user,
          userEmail: decode.userEmail,
          userId: decode.userId,
          clientId: decode.clientId,
          role: decode.role,
          accessToken: action.payload.accessToken,
          refreshToken: action.payload.refreshToken,
        };
      } else if (action?.payload?.specialToken) {
        state.user = {
          ...state.user,
          email: action.payload.email,
          phone: action.payload.phone,
          specialToken: decode.specialToken,
        };
      }
    },
    logOut: (state) => {
      state.user = null;
    },
  },
});

export const { logOut, setUser } = authSlice.actions;
export default authSlice.reducer;
