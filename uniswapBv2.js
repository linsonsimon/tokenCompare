const Web3 = require("web3");
const ABI = require("./BinanceFactoryABI.json");
const poolABI = require("./binancePoolABI.json");
const { getAbi, getBinancePrice, getToken } = require("./helpers");
const contractAddress = require("./binanceContract.json");

require("dotenv").config();

const BINANCE_RPC_URL = process.env.BINANCE_RPC_URL;

const FactoryAddress = "0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73";

const web3 = new Web3(BINANCE_RPC_URL);

let factoryContract = new web3.eth.Contract(ABI, FactoryAddress);

// console.log(poolContract.methods);

getPrice = async () => {
  console.log("hello");
  let priceChart = await getToken();
  let filteredData = [];
  console.log(priceChart.length);
  for (let i = 0; i < priceChart.length; i++) {
    let data = priceChart[i];
    if (data.symbol.slice(-4) == "USDC") {
      if (contractAddress[data.symbol.slice(0, -4)]) {
        console.log(
          contractAddress[data.symbol.slice(0, -4)],
          contractAddress.USDC
        );

        let poolAddress = await factoryContract.methods
          .getPair(
            contractAddress[data.symbol.slice(0, -4)],
            contractAddress.USDC
          )
          .call();
        console.log(poolAddress);
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
    if (data.symbol.slice(-4) == "USDC") {
      let poolAddress = await factoryContract.methods
        .getPair(
          contractAddress.USDC,
          contractAddress[data.symbol.slice(0, -4)]
        )
        .call();
      console.log("pool", poolAddress);

      const poolContract = new web3.eth.Contract(poolABI, poolAddress);
      const [token0, token1, reserve] = await Promise.all([
        poolContract.methods.token0().call(),
        poolContract.methods.token1().call(),
        poolContract.methods.getReserves().call(),
      ]);
      //   let reserve = await poolContract.methods.getReserves().call();
      console.log("binance data", data);
      console.log("uniswap", poolAddress);
      console.log("t", token0 == contractAddress.USDC, token0, token1);
      console.log(
        token0 == contractAddress.USDC
          ? reserve[0] / reserve[1]
          : reserve[1] / reserve[0],
        "\nreserve0=>",
        reserve[0].toString(),
        "\nreserve1=>",
        reserve[1].toString(),
        "\nblocktimestamp=>",
        reserve[2].toString()
      );
    }
  }
};

getPrice();
