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
  selectCurrentSubscription,
  setCurrentSubscription,
  selectInstrumentStatus,
  selectAmountStatus,
  selectSellPriceStatus,
  selectBuyPriceStatus,
} from "../../store/tickerSlice";
import { WebSocket, Server } from "mock-socket";
import {
  selectBids,
  setBids,
  setBidsIds,
  updateBids,
} from "../../store/bidSlice";
import generateStatus from "./randomStatusGenerator";
import { uniqueId } from "lodash";

const Ticker = () => {
  const instrument = useSelector(selectInstrument);
  const instrumentStatus = useSelector(selectInstrumentStatus);
  const amount = useSelector(selectAmount);
  const amountStatus = useSelector(selectAmountStatus);
  const sellPrice = useSelector(selectSellPrice);
  const sellPriceStatus = useSelector(selectSellPriceStatus);
  const buyPrice = useSelector(selectBuyPrice);
  const buyPriceStatus = useSelector(selectBuyPriceStatus);
  const operation = useSelector(selectOperation);
  const formStatus = useSelector(selectFormStatus);
  const bids = useSelector(selectBids);
  const currentSubscription = useSelector(selectCurrentSubscription);
  const dispatch = useDispatch();
  const ws = useRef(null);
  const isUnsubscribed = useRef(false);

  useEffect(() => {
    const mockServer = new Server("ws://localhost:8080");

    mockServer.on("connection", (socket) => {
      socket.on("message", (data) => {
        const parsedData = JSON.parse(data);
        if (parsedData.messageType === "2") {
          console.log("nd");
          isUnsubscribed.current = true;
        }
        if (parsedData.messageType === "1") {
          console.log('k')
          const subscriptionId = uniqueId();
          isUnsubscribed.current = false;
          socket.send(
            JSON.stringify({
              messageType: "1",
              message: {
                subscriptionId,
                prices: generatePrices(),
              },
            })
          );
          const interval = setInterval(() => {
            if (isUnsubscribed.current) {
              console.log("d");
              Promise.resolve(clearInterval(interval)).then(() =>
                dispatch(reset())
              );
            }
            socket.send(
              JSON.stringify({
                messageType: "4",
                message: {
                  subscriptionId,
                  prices: generatePrices(),
                  instrument,
                },
              })
            );
          }, 3000);
        } else if (parsedData.messageType === "3") {
          setInterval(() => {
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
      if (parsedData.messageType === "1") {
        dispatch(setCurrentSubscription(parsedData.message.subscriptionId));
        dispatch(setValue([parsedData.message.prices.sellPrice, "sellPrice"]));
        dispatch(setFieldStatus(["filled", "sellPrice"]));
        dispatch(setValue([parsedData.message.prices.buyPrice, "buyPrice"]));
        dispatch(setFieldStatus(["filled", "buyPrice"]));
      }
      if (parsedData.messageType === "4") {
        dispatch(setValue([parsedData.message.prices.sellPrice, "sellPrice"]));
        dispatch(setValue([parsedData.message.prices.buyPrice, "buyPrice"]));
      } else if (parsedData.messageType === "3") {
        dispatch(updateBids(parsedData.message));
      }
    };
  }, []);

  useEffect(() => {
    if (instrumentStatus === "filled") {
      ws.current.send(
        JSON.stringify({ messageType: "1", message: instrument })
      );
    } else {
      ws.current.send(
              JSON.stringify({
                messageType: "2",
                message: { subscriptionId: currentSubscription },
              })
            );
    }
    if (
      instrumentStatus === "filled" &&
      amountStatus === "filled" &&
      sellPriceStatus === "filled" &&
      buyPriceStatus === "filled" &&
      amountStatus === "filled"
    ) {
      dispatch(setFormStatus("filled"));
    } else {
      dispatch(setFormStatus("unfilled"));
    }
  }, [
    instrumentStatus,
    amountStatus,
    sellPriceStatus,
    buyPriceStatus,
    dispatch,
  ]);

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
    if (val) {
      dispatch(setFieldStatus(["filled", "instrument"]));
    } else {
      dispatch(setFieldStatus(["unfilled", "instrument"]));
    }
  };

  const changeAmount = (val) => {
    console.log(val);
    dispatch(setValue([val, "amount"]));
    if (+val > 0) {
      dispatch(setFieldStatus(["filled", "amount"]));
    } else {
      dispatch(setFieldStatus(["unfilled", "amount"]));
    }
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

    ws.current.send(
      JSON.stringify({
        messageType: "2",
        message: { subscriptionId: currentSubscription },
      })
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Choose instrument</label>
        <SelectPicker
          data={instruments}
          value={instrument}
          onChange={(val) => changeInstrument(val)}
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
