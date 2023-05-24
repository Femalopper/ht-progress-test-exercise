const generateRandomPrice = (min = 1, max = 100) => {
  const sellPrice = +(Math.random() * (max - min) + min).toFixed(3);
  const buyPrice = +(sellPrice + Math.random()).toFixed(3);
  return { sellPrice, buyPrice };
};

export default generateRandomPrice;
