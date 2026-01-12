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
    adminAccessToken: "",
    adminRefreshToken: "",
  },
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      console.log(action.payload, "Admin Payload")
      const token = action.payload.accessToken
        ? action.payload.accessToken
        : action.payload.specialToken;
      const adminToken = action.payload.adminData?.accessToken
      const adminDecode = jwtDecode(adminToken as string) as User;
      console.log(adminDecode, "Admin decode")
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
          adminAccessToken: action.payload.adminData?.accessToken,
          adminRefreshToken: action.payload.adminData?.refreshToken,
        };
      } else if (action?.payload?.specialToken) {
        state.user = {
          ...state.user,
          email: action.payload.email,
          phone: action.payload.phone,
          accessToken: action.payload.specialToken,
          adminAccessToken: action.payload.adminData?.accessToken,
          adminRefreshToken: action.payload.adminData?.refreshToken,
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
