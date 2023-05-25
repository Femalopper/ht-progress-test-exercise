import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { SelectPicker, Input, InputGroup } from "rsuite";
import generatePrices from "./randomPriceGenerator";
import "./ticker.css";

import {
  selectAmount,
  selectBuyPrice,
  selectInstrument,
  selectOperation,
  selectSellPrice,
  setValue,
  setFieldStatus,
  reset,
  setFormStatus,
  selectFormStatus,
} from "../../store/tickerSlice";
import { WebSocket, Server } from "mock-socket";
import {
  selectBids,
  setBids,
  setBidsIds,
  updateBids,
} from "../../store/bidSlice";
import generateStatus from "./randomStatusGenerator";

const Ticker = () => {
  const instrument = useSelector(selectInstrument);
  const amount = useSelector(selectAmount);
  const sellPrice = useSelector(selectSellPrice);
  const buyPrice = useSelector(selectBuyPrice);
  const operation = useSelector(selectOperation);
  const formStatus = useSelector(selectFormStatus);
  const bids = useSelector(selectBids);
  const dispatch = useDispatch();

  const ws = useRef(null);

  useEffect(() => {
    const mockServer = new Server("ws://localhost:8080");

    mockServer.on("connection", (socket) => {
      socket.on("message", (data) => {
        const parsedData = JSON.parse(data);
        if (parsedData.messageType === "3") {
          setTimeout(() => {
            const date = new Date(Date.now()).toISOString();
            const dateSlice = date.slice(0, date.indexOf("T"));
            const timeSlice = date.slice(
              date.indexOf("T") + 1,
              date.indexOf("Z")
            );
            socket.send(
              JSON.stringify({
                messageType: "3",
                message: {
                  orderId: parsedData.message.id,
                  orderStatus: generateStatus(),
                  updateDate: `${dateSlice}
                  ${timeSlice}`,
                },
              })
            );
          }, 2000);
        }
      });
      socket.on("close", () => {});
      socket.on("error", () => {});
    });

    ws.current = new WebSocket("ws://localhost:8080");

    ws.current.onmessage = function (event) {
      const parsedData = JSON.parse(event.data);
      if (parsedData.messageType === "3") {
        dispatch(updateBids(parsedData.message));
      }
    };
  }, []);

  useEffect(() => {
    if (instrument && amount) {
      const prices = generatePrices();
      dispatch(setValue([prices.sellPrice, "sellPrice"]));
      dispatch(setFieldStatus(["filled", "sellPrice"]));
      dispatch(setValue([prices.buyPrice, "buyPrice"]));
      dispatch(setFieldStatus(["filled", "buyPrice"]));
      dispatch(setFormStatus("filled"));
    } else {
      dispatch(setValue([null, "sellPrice"]));
      dispatch(setFieldStatus(["unfilled", "sellPrice"]));
      dispatch(setValue([null, "buyPrice"]));
      dispatch(setFieldStatus(["unfilled", "buyPrice"]));
      dispatch(setFormStatus("unfilled"));
    }
  }, [instrument, amount, dispatch]);

  const instruments = [
    {
      label: "CNH/RUB",
      value: "CNH/RUB",
    },
    {
      label: "EUR/RUB",
      value: "EUR/RUB",
    },
    {
      label: "EUR/USD",
      value: "EUR/USD",
    },
    {
      label: "USD/RUB",
      value: "USD/RUB",
    },
    {
      label: "TRY/RUB",
      value: "TRY/RUB",
    },
    {
      label: "BYN/RUB",
      value: "BYN/RUB",
    },
  ];

  const changeInstrument = (val) => {
    dispatch(setValue([val, "instrument"]));
    dispatch(setFieldStatus(["filled", "instrument"]));
  };

  const changeAmount = (val) => {
    dispatch(setValue([val, "amount"]));
    dispatch(setFieldStatus(["filled", "amount"]));
  };

  const clickHandler = (oper) => () => {
    dispatch(setValue([oper, "operation"]));
    dispatch(setFieldStatus(["filled", "operation"]));
  };

  const isSubmitDisabled = () => formStatus === "unfilled";

  const handleSubmit = (e) => {
    e.preventDefault();
    const price = operation === "sell" ? sellPrice : buyPrice;
    const date = new Date(Date.now()).toISOString();
    const dateSlice = date.slice(0, date.indexOf("T"));
    const timeSlice = date.slice(date.indexOf("T") + 1, date.indexOf("Z"));
    const bid = {
      id: Object.keys(bids).length + 1,
      instrument,
      amount: amount + ".00",
      price,
      operation,
      creationDate: `${dateSlice}
      ${timeSlice}`,
      status: "",
      updateDate: "",
    };

    ws.current.send(JSON.stringify({ messageType: "3", message: bid }));

    dispatch(setBids(bid));
    dispatch(setBidsIds(bid));
    dispatch(reset());
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Choose instrument</label>
        <SelectPicker
          data={instruments}
          value={instrument}
          onChange={(val) => changeInstrument(val)}
          onClean={() => dispatch(reset())}
          menuMaxHeight={100}
        />
      </div>
      <div className="form-group">
        <label>Choose amount</label>
        <InputGroup>
          <Input
            type="number"
            value={amount}
            onChange={(val) => changeAmount(val)}
          />
          <InputGroup.Addon>.00</InputGroup.Addon>
        </InputGroup>
      </div>
      <div className="form-group prices">
        <span className="sell-price">{sellPrice}</span>
        <span className="buy-price">{buyPrice}</span>
      </div>
      <div className="form-group buttons">
        <button
          type="submit"
          onClick={clickHandler("sell")}
          className="btn btn-outline-primary sell"
          disabled={isSubmitDisabled()}
        >
          SELL
        </button>
        <button
          type="submit"
          onClick={clickHandler("buy")}
          className="btn btn-outline-success buy"
          disabled={isSubmitDisabled()}
        >
          BUY
        </button>
      </div>
    </form>
  );
};

export default Ticker;
