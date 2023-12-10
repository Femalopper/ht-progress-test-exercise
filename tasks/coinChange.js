const coinChange = (coins, amount) => {
  if (coins.length === 1 && amount % coins[0] === 0) {
    return amount / coins[0];
  }
  if (coins.length === 1 && amount % coins[0] !== 0) {
    return -1;
  }
  if (coins.includes(amount)) {
    return 1;
  }
  if (amount === 0) {
    return 0;
  }
  // if all coins are even and amount is odd return -1
  const oddCoins = coins.filter((element) => element % 2 !== 0);
  if (oddCoins.length === 0 && amount % 2 !== 0) {
    return -1;
  }
  const sortedCoins = coins.sort((a, b) => a - b);
  // if array contains bigger numbers than amount find nearest minimum number
  const findMinNum = (c) => {
    if (c.length === 1) {
      return c[0];
    }
    const mid = Math.floor(c.length / 2);

    if (c[mid] < amount) {
      return findMinNum(c.slice(mid));
    }
    if (c[mid] === amount) {
      return c[mid];
    }
    return findMinNum(c.slice(0, mid));
  };
  let nearestMinNum = sortedCoins[sortedCoins.length - 1];
  if (nearestMinNum > amount) {
    nearestMinNum = findMinNum(sortedCoins);
  }

  let result = 0;
  let sum = 0;
  let indexOfNearestMinNum = sortedCoins.indexOf(nearestMinNum);
  const results = [];

  let maxRemainder = Math.floor(amount / sortedCoins[0]);
  const minRemainder = Math.floor(amount / sortedCoins[sortedCoins.length - 1]);

  /* if difference between minimal and maximum remainders is 1,
    calculate sums with maxRemainder and minRemainder
    if one of sums = amount return this remainder
    */
  if (maxRemainder - minRemainder === 1) {
    if (maxRemainder * sortedCoins[0] === amount) {
      return maxRemainder;
    }
    if (
      (minRemainder * amount) / sortedCoins[sortedCoins.length - 1] ===
      amount
    ) {
      return minRemainder;
    }
  }

  const calcCombintsWithMaxRemainder = (nearestMinNum, amt, remainder, cns) => {
    const calculate = (min, am, rem) => {
      const remainderMultipliedMin = rem * min;
      result += rem;
      sum += remainderMultipliedMin;
      const diff = am - remainderMultipliedMin;
      return diff;
    };
    let diff = calculate(nearestMinNum, amt, remainder);
    if (sum === amount) {
      results.push(result);
      maxRemainder = Math.min.apply(null, results);
      return;
    }
    const rests = [];
    const remainders = [];
    let count = 0;

    const filteredCoins = cns.filter((num) => num !== nearestMinNum);

    while (count < filteredCoins.length) {
      const numNearest = filteredCoins[count];
      if (Math.floor(diff / numNearest) > 0) {
        rests.push(numNearest);
        remainders.push(Math.floor(diff / numNearest));
      }
      count += 1;
    }

    let counter = 0;
    const lastsum = sum;
    const lastdiff = diff;
    const lastResult = result;

    while (counter < remainders.length && result < maxRemainder) {
      while (
        remainders[counter] >= 1 &&
        remainders[counter] + result < maxRemainder
      ) {
        calcCombintsWithMaxRemainder(
          rests[counter],
          lastdiff,
          remainders[counter],
          filteredCoins,
          lastResult
        );
        sum = lastsum;
        diff = lastdiff;
        result = lastResult;
        remainders[counter] -= 1;
      }
      counter += 1;
    }
  };

  const calcCombintsWithLessenRemainder = (
    nearestMinNum,
    amount,
    remainder
  ) => {
    let rema = remainder;
    while (rema > 1) {
      rema -= 1;
      sum = 0;
      result = 0;
      calcCombintsWithMaxRemainder(nearestMinNum, amount, rema, sortedCoins); // 5, 11, 6, 1
    }
  };

  while (indexOfNearestMinNum > -1) {
    const nearMinNum = sortedCoins[indexOfNearestMinNum];
    const remainder = Math.floor(amount / nearMinNum);
    if (remainder > maxRemainder && results.length === 0) {
      indexOfNearestMinNum -= 1;
      continue;
    }
    calcCombintsWithMaxRemainder(nearMinNum, amount, remainder, sortedCoins);
    calcCombintsWithLessenRemainder(nearMinNum, amount, remainder);
    indexOfNearestMinNum -= 1;
  }

  if (results.length === 0) {
    return -1;
  }
  return Math.min.apply(null, results);
};

console.log(
  coinChange([411, 412, 413, 414, 415, 416, 417, 418, 419, 420, 421, 422], 9864)
); // 24
console.log(coinChange([2, 3, 6], 11)); // 3
console.log(coinChange([2, 3, 5], 11)); // 3
console.log(coinChange([1, 2], 3)); // 2
console.log(coinChange([1, 3, 5], 3)); // 1
console.log(coinChange([186, 419, 83, 408], 6249)); // 20
console.log(coinChange([83, 186, 408, 419], 6249)); // 20
console.log(coinChange([2], 3)); // -1
console.log(coinChange([1], 2)); // 2
console.log(coinChange([195, 265, 404, 396], 3239)); // 12
console.log(coinChange([3, 7, 405, 436], 8839)); // 25
console.log(coinChange([431, 62, 88, 428], 9084)); // 26
console.log(coinChange([442, 295, 365, 485], 8091)); // 20
console.log(coinChange([1, 2, 5], 11)); // 3
console.log(coinChange([270, 373, 487, 5, 62], 8121)); // 21
console.log(coinChange([227, 99, 328, 299, 42, 322], 9847)); // 31
console.log(coinChange([65, 451, 124, 70, 480, 441], 4129)); // 10
console.log(coinChange([2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24], 9999)); // -1
