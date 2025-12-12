import { User } from "@/types/Auth/Auth";
import { createSlice } from "@reduxjs/toolkit";

interface AuthState {
  user: Partial<User> | null;
}

const initialState: AuthState = {
  user: {
    email: "",
    phone: "",
    userEmail: "",
    userId: "",
    name: "",
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
      if (action.payload.accessToken) {
        state.user!.accessToken = action.payload.accessToken;
        state.user!.refreshToken = action.payload.refreshToken;
      } else {
        state.user!.email = action.payload.email;
        state.user!.phone = action.payload.phone;
        state.user!.specialToken = action.payload.specialToken;
      }
    },
    logOut: (state) => {
      state.user = null;
    },
  },
});

export const { logOut, setUser } = authSlice.actions;
export default authSlice.reducer;
