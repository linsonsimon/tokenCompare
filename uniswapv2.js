const { Multicall } = require("ethereum-multicall");
const { ethers } = require("ethers");

const ABI = require("./factoryABI.json");
const contractAddress = require("./contract.json");
require("dotenv").config();

const { getAbi, getBinancePrice, getToken } = require("./helpers");

const INFURA_URL = process.env.INFURA_URL;
const BINANCE_RPC_URL = process.env.BINANCE_RPC_URL;
// const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

// const FactoryAddress = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f";//uniswap
const FactoryAddress = "0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73";

// const provider = new ethers.providers.JsonRpcProvider(INFURA_URL);

const provider = new ethers.providers.JsonRpcProvider(BINANCE_RPC_URL);

const factoryContract = new ethers.Contract(FactoryAddress, ABI, provider);

const getPrice1 = async (tokenAddress0, tokenAddress1) => {
  const [poolAddress] = await Promise.all([
    factoryContract.getPair(tokenAddress0, tokenAddress1),
  ]);
  let bPrice = getBinancePrice();

  console.log(poolAddress);

  let poolAbi = await getAbi(poolAddress);

  const poolContract = new ethers.Contract(poolAddress, poolAbi, provider);
  const [price0CumulativeLast, price1CumulativeLast] = await Promise.all([
    poolContract.price0CumulativeLast(),
    poolContract.price1CumulativeLast(),
  ]);

  let ePrice = price1CumulativeLast / price0CumulativeLast;
  // console.log(price0CumulativeLast.toString(), price1CumulativeLast.toString());
  console.log(
    "USDCUSDT",
    bPrice > ePrice
      ? "binance price is greater =" + bPrice
      : "uniswap price is greater =" + ePrice
  );
};

const getPair = async () => {
  let priceChart = await getToken();
  let demPrice = [];
  let blastprice;
  let filteredData = [];
  // let pair = priceChart.filter(async (data) => {

  //   if (data.symbol.slice(-4) == "USDT") {
  //     let sym = data.symbol.slice(-4);
  //     let temp = contractAddress[sym];
  //     console.log(temp, sym);
  //     let poolAddress = await factoryContract.getPair(
  //       contractAddress.USDT,
  //       contractAddress[sym]
  //     );
  //     // let poolAbi = await getAbi(poolAddress);
  //     // const poolContract = new ethers.Contract(poolAddress, poolAbi, provider);
  //     // const [price0CumulativeLast, price1CumulativeLast] = await Promise.all([
  //     //   poolContract.price0CumulativeLast(),
  //     //   poolContract.price1CumulativeLast(),
  //     // ]);
  //     if (poolAddress != "0x0000000000000000000000000000000000000000")
  //       console.log(true);
  //     if (poolAddress != "0x0000000000000000000000000000000000000000")
  //       return data.lastprice;
  //   }
  // });
  // priceChart.map(async (data) => {
  //   if (data.symbol.slice(-4) == "USDT") {
  //     let temp = data.symbol.slice(0, -4);
  //     console.log(temp);
  //     if (contractAddress[data.symbol.slice(0, -4)]) {
  //       let poolAddress = await factoryContract.getPair(
  //         contractAddress.USDT,
  //         contractAddress[data.symbol.slice(0, -4)]
  //       );
  //       console.log(poolAddress);
  //       if (
  //         poolAddress != "0x0000000000000000000000000000000000000000" &&
  //         poolAddress != null
  //       ) {
  //         console.log(data);
  //         filteredData.push(data);
  //       }
  //     }
  //   }
  // });

  for (let i = 0; i < priceChart.length; i++) {
    let data = priceChart[i];
    if (data.symbol.slice(-4) == "USDT") {
      // let temp = data.symbol.slice(0, -4);
      // console.log(temp);
      if (contractAddress[data.symbol.slice(0, -4)]) {
        let poolAddress = await factoryContract.getPair(
          contractAddress.USDT,
          contractAddress[data.symbol.slice(0, -4)]
        );
        // console.log(poolAddress);
        if (
          poolAddress != "0x0000000000000000000000000000000000000000" &&
          poolAddress != null
        ) {
          // console.log(data);
          filteredData.push(data);
        }
      }
    }
  }

  console.log("fd", filteredData);

  for (let i = 0; i < filteredData.length; i++) {
    let data = filteredData[i];
    if (data.symbol.slice(-4) == "USDT") {
      let poolAddress = await factoryContract.getPair(
        contractAddress.USDT,
        contractAddress[data.symbol.slice(0, -4)]
      );
      let poolAbi = await getAbi(poolAddress);
      const poolContract = new ethers.Contract(poolAddress, poolAbi, provider);
      // const [price0CumulativeLast, price1CumulativeLast] = await Promise.all([
      //   poolContract.price0CumulativeLast(),
      //   poolContract.price1CumulativeLast(),
      // ]);
      let reserve = await poolContract.getReserves();
      console.log("binance data", data);
      console.log("uniswap", poolAddress);
      console.log(
        reserve[1] / reserve[0],
        "\nreserve0=>",
        reserve[0].toString(),
        "\nreserve1=>",
        reserve[1].toString(),
        "\nblocktimestamp=>",
        reserve[2].toString()
      );
      // console.log(price0CumulativeLast / price1CumulativeLast);
    }
  }
};

// let pair = priceChart.filter((data) => data.symbol.slice(-4) == "USDT" && );
// getPrice1(tokenAddress0, tokenAddress1);

// getToken();
getPair();
