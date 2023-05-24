import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  bids: [],
};

export const bidFormSlice = createSlice({
  name: "bid",
  initialState,
  reducers: {
    setBids: (state, data) => {
      const val = data.payload;
      state.bids = [...state.bids, val];
    },
    reset: () => initialState,
  },
});

export const { setBids, reset } =
  bidFormSlice.actions;
export const selectBids = (state) =>
  state.bid.bids;

export default bidFormSlice.reducer;
