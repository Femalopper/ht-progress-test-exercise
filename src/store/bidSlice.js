import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  bids: {},
  bidsIds: [],
};

export const bidFormSlice = createSlice({
  name: "bid",
  initialState,
  reducers: {
    setBids: (state, data) => {
      const val = data.payload;
      state.bids = {...state.bids, [val.id]: val};
    },
    setBidsIds: (state, data) => {
        state.bidsIds = [...state.bidsIds, data.payload.id];
    },
    updateBids: (state, data) => {
      console.log(data)
      const orderId = data.payload.orderId;
      const status = data.payload.orderStatus;
      const changeTime = data.payload.updateDate;
      state.bids[orderId].status = status;
      state.bids[orderId].updateDate = changeTime;
    },
    reset: () => initialState,
  },
});

export const { setBids, reset, updateBids, setBidsIds } =
  bidFormSlice.actions;
export const selectBids = (state) =>
  state.bid.bids;
  export const selectBidsIds = (state) =>
  state.bid.bidsIds;

export default bidFormSlice.reducer;
