import { createSlice } from "@reduxjs/toolkit";

interface AuthState {
  user: { name: string, role: string } | null;
}

const initialState: AuthState = {
  user: { name: "Amitav Roy Chowdhury", role: "admin" },
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
    },
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
