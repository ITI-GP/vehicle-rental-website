import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    type: null,
  },
  reducers: {
    setUserType: (state, action) => {
      state.type = action.payload;
    },
  },
});

export const { setUserType } = userSlice.actions;
export default userSlice.reducer;
