import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  createTickerForm: {
    status: "unfilled",
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
      status: "unavailable",
    },
    buyPrice: {
      value: null,
      status: "unfilled",
    },
    operation: {
      value: null,
      status: "unfilled",
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
    reset: () => initialState,
  },
});

export const { setValue, setFieldStatus, setRooms, setFormStatus, reset } =
  tickerFormSlice.actions;
export const selectInstrument = (state) =>
  state.ticker.createTickerForm.instrument.value;
export const selectAmount = (state) =>
  state.ticker.createTickerForm.amount.value;
export const selectSellPrice = (state) =>
  state.ticker.createTickerForm.sellPrice.value;
export const selectBuyPrice = (state) =>
  state.ticker.createTickerForm.buyPrice.value;
export const selectOperation = (state) =>
  state.ticker.createTickerForm.operation.value;
export const selectFormStatus = (state) => state.ticker.createTickerForm.status;

export default tickerFormSlice.reducer;
