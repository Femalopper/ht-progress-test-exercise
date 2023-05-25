import { useSelector } from "react-redux";
import { selectBids } from "../../store/bidSlice";
import './bids.css'

const Bids = () => {
const bids = useSelector(selectBids);
console.log(Object.values(bids));
  return (
    <div className="table-container">
    <table className="table table-striped">
      <thead className="thead-dark">
        <tr>
          <th scope="col">Id</th>
          <th scope="col">Creation Time</th>
          <th scope="col">Change Time</th>
          <th scope="col">Status</th>
          <th scope="col">Side</th>
          <th scope="col">Price</th>
          <th scope="col">Amount</th>
          <th scope="col">Instrument</th>
        </tr>
      </thead>
      <tbody>
        {(Object.values(bids)).map(({id, instrument, amount, price, operation, creationDate, status, updateDate}) => <tr key={id}>
            <td>{id}</td>
            <td>{creationDate.toString()}</td>
            <td>{updateDate.toString()}</td>
            <td>{status}</td>
            <td>{operation}</td>
            <td>{price}</td>
            <td>{amount}</td>
            <td>{instrument}</td>
        </tr>)}
      </tbody>
    </table>
    </div>
  );
};

export default Bids;
