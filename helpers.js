const axios = require("axios");

require("dotenv").config();
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

exports.getAbi = async (address) => {
  // const url =`https://api.bscscan.com/api?module=contract&action=getabi&address=${address}&apikey=${BSCSCAN_API_KEY}`
  const url = `https://api.etherscan.io/api?module=contract&action=getabi&address=${address}&apikey=${ETHERSCAN_API_KEY}`;
  const res = await axios.get(url);
  const abi = JSON.parse(res.data.result);
  return abi;
};

exports.getBinancePrice = async () => {
  const url = "https://api.binance.com/api/v3/ticker/price";
  const res = await axios.get(url);
  // console.log("res:", res.data);
  // const priceChart = JSON.parse(res.data);
  const priceChart = res.data;
  // console.log(priceChart);
  let token = priceChart.filter((token) => token.symbol === "USDCUSDT");
  console.log(token[0].symbol, "=", token[0].price);
  return token[0].price;
};

exports.getToken = async () => {
  // let tokenarray = [];
  const url = "https://api.binance.com/api/v3/ticker/24hr";
  const res = await axios.get(url);
  // console.log("res:", res.data);
  // const priceChart = JSON.parse(res.data);
  const priceChart = res.data;
  // console.log(priceChart);
  let usdt = priceChart.filter((a) => a.symbol.slice(-4) == "USDT");

  // usdt.map((token) => console.log(token.symbol.slice(0, -4)));
  // // busd.map((token) => tokenarray.push(token.symbol.slice(0, -4)));

  // let eth = priceChart.filter((a) => a.symbol.slice(-3) == "ETH");
  // console.log(eth.length);
  // // eth.map((token) => console.log(token.symbol.slice(0, -3)));
  // // eth.map((token) => tokenarray.push(token.symbol.slice(0, -3)));

  // let btc = priceChart.filter((a) => a.symbol.slice(-3) == "BTC");
  // console.log(btc.length);
  // // btc.map((token) => console.log(token.symbol.slice(0, -3)));
  // // btc.map((token) => tokenarray.push(token.symbol.slice(0, -4)));

  // let bnb = priceChart.filter((a) => a.symbol.slice(-3) == "BNB");
  // console.log(bnb.length);
  // // bnb.map((token) => console.log(token.symbol.slice(0, -3)));
  // // bnb.map((token) => tokenarray.push(token.symbol.slice(0, -4)));

  // let non = priceChart.filter(
  //   (a) =>
  //     a.symbol.slice(-3) != "BNB" &&
  //     a.symbol.slice(-4) != "BUSD" &&
  //     a.symbol.slice(-3) != "BTC" &&
  //     a.symbol.slice(-3) != "ETH"
  // );
  // console.log(non.length);
  // // busd.map((token) => console.log(token.symbol));
  // non.map((token) => tokenarray.push(token.symbol));

  priceChart.sort((a, b) => a.priceChangePercent - b.priceChangePercent);
  // console.log(priceChart);
  // console.log(priceChart.length);
  // removeDuplicates(tokenarray);
  // tokenarray.map((a) => console.log(a));
  return priceChart;
};

function removeDuplicates(arr) {
  return [...new Set(arr)];
}

exports.getPoolImmutables = async (poolContract) => {
  const [token0, token1, fee] = await Promise.all([
    poolContract.token0(),
    poolContract.token1(),
    poolContract.fee(),
  ]);
  console.log(token0, token1);

  const immutables = {
    token0: token0,
    token1: token1,
    fee: fee,
  };

  return immutables;
};
