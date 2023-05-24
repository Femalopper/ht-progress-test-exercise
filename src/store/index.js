import { configureStore } from "@reduxjs/toolkit";
import tickerReducer from "./tickerSlice";
import bidReducer from "./bidSlice";

export default configureStore({
  reducer: {
    ticker: tickerReducer,
    bid: bidReducer,
  },
});
