const generateStatus = () => {
  const status = ["Active", "Filled", "Rejected", "Cancelled"];
  const randomIndex = Math.floor(Math.random() * (status.length - 1 - 0) + 0);
  return status[randomIndex];
};

export default generateStatus;
