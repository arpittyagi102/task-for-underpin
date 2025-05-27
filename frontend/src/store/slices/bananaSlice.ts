import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const bananaSlice = createSlice({
    name: "user",
    initialState: 0,
    reducers: {
        setBanana: (state, action: PayloadAction<number>) => {
            return action.payload;
        },
    },
});

export const { setBanana } = bananaSlice.actions;
export default bananaSlice.reducer;
