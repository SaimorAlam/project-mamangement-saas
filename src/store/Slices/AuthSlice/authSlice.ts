import { createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";
interface User {
  email: string;
  phone: string;
  userEmail: string;
  userId: string;
  clientId: string;
  role: string;
  specialToken?: string;
  accessToken?: string;
}
interface AuthState {
  user: User | null;
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
  },
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const decode = jwtDecode(action?.payload?.specialToken as string) as User;
      console.log(decode, "Decode");
      state.user!.email = action.payload.email;
      state.user!.phone = action.payload.phone;
      state.user!.userEmail = decode.userEmail;
      state.user!.userId = decode.userId;
      state.user!.clientId = decode.clientId;
      state.user!.role = decode.role;
      state.user!.specialToken = decode.specialToken;
      state.user!.accessToken = action.payload.accessToken;
    },
    logOut: (state) => {
      state.user = null;
    },
  },
});

export const { logOut, setUser } = authSlice.actions;
export default authSlice.reducer;
