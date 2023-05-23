import { SelectPicker, Input, InputGroup } from "rsuite";
import generatePrices from "./randomPriceGenerator";
import "./ticker.css";

const Ticker = () => {
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

  const prices = generatePrices();

  return (
    <form>
      <div className="form-group">
        <label>Choose instrument</label>
        <SelectPicker data={instruments} menuMaxHeight={100} />
      </div>
      <div className="form-group">
        <label>Choose amount</label>
        <InputGroup>
          <Input type="number" />
          <InputGroup.Addon>.00</InputGroup.Addon>
        </InputGroup>
      </div>
      <div className="form-group prices">
        <span className="sell-price">{prices.sellPrice}</span>
        <span className="buy-price">{prices.buyPrice}</span>
      </div>
      <div className="form-group buttons">
        <button className="btn btn-outline-primary sell">SELL</button>
        <button className="btn btn-outline-success buy">BUY</button>
      </div>
    </form>
  );
};

export default Ticker;
