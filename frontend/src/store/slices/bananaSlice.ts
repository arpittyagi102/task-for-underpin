import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const bananaSlice = createSlice({
    name: "user",
    initialState: 0,
    reducers: {
        increaseBanana: (state, action: PayloadAction<number>) => {
            if(typeof action.payload !== 'number') {
                action.payload = 1;
            }

            return state + action.payload;
        },
    },
});

export const { increaseBanana } = bananaSlice.actions;
export default bananaSlice.reducer;
