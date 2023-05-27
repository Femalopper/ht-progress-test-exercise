import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  createTickerForm: {
    status: "unfilled",
    currentSubscription: "",
    instrument: {
      value: null,
      status: "unfilled",
    },
    amount: {
      value: "",
      status: "unfilled",
    },
    sellPrice: {
      value: null,
      status: "unfilled",
    },
    buyPrice: {
      value: null,
      status: "unfilled",
    },
    operation: {
      value: null,
    },
  },
};

export const tickerFormSlice = createSlice({
  name: "ticker",
  initialState,
  reducers: {
    setValue: (state, data) => {
      const val = data.payload[0];
      const prop = data.payload[1];
      state.createTickerForm[prop].value = val;
    },
    setFieldStatus: (state, data) => {
      const status = data.payload[0];
      const prop = data.payload[1];
      state.createTickerForm[prop].status = status;
    },
    setFormStatus: (state, data) => {
      state.createTickerForm.status = data.payload;
    },
    setCurrentSubscription: (state, data) => {
      state.createTickerForm.currentSubscription = data.payload;
    },
    reset: () => initialState,
  },
});

export const {
  setValue,
  setFieldStatus,
  setRooms,
  setFormStatus,
  reset,
  setCurrentSubscription,
} = tickerFormSlice.actions;
export const selectInstrument = (state) =>
  state.ticker.createTickerForm.instrument.value;
export const selectInstrumentStatus = (state) =>
  state.ticker.createTickerForm.instrument.status;
export const selectAmount = (state) =>
  state.ticker.createTickerForm.amount.value;
export const selectAmountStatus = (state) =>
  state.ticker.createTickerForm.amount.status;
export const selectSellPrice = (state) =>
  state.ticker.createTickerForm.sellPrice.value;
export const selectSellPriceStatus = (state) =>
  state.ticker.createTickerForm.sellPrice.status;
export const selectBuyPrice = (state) =>
  state.ticker.createTickerForm.buyPrice.value;
export const selectBuyPriceStatus = (state) =>
  state.ticker.createTickerForm.buyPrice.status;
export const selectOperation = (state) =>
  state.ticker.createTickerForm.operation.value;
export const selectFormStatus = (state) => state.ticker.createTickerForm.status;
export const selectCurrentSubscription = (state) =>
  state.ticker.createTickerForm.currentSubscription;

export default tickerFormSlice.reducer;
