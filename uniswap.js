const { ethers } = require("ethers");
const {
  abi: IUniswapV3PoolABI,
} = require("@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json");
const {
  abi: QuoterABI,
} = require("@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json");

const { getAbi, getPoolImmutables } = require("./helpers");

require("dotenv").config();
const INFURA_URL = process.env.INFURA_URL;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

const provider = new ethers.providers.JsonRpcProvider(INFURA_URL);

const poolAddress = "0xB2cd930798eFa9B6CB042F073A2CcEa5012E7AbF";

const quoterAddress = "0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6";

const getPrice = async (inputAmount) => {
  console.log(QuoterABI);
  var start = new Date().getTime();
  const poolContract = new ethers.Contract(
    poolAddress,
    IUniswapV3PoolABI,
    provider
  );

  const [tokenAddress0, tokenAddress1, fee] = await Promise.all([
    poolContract.token0(),
    poolContract.token1(),
    poolContract.fee(),
  ]);
  //   let tokenAddress0 = "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0";
  //   let tokenAddress1 = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
  //   console.log(new Date().getTime() - start);

  const [tokenAbi0, tokenAbi1] = await Promise.all([
    getAbi(tokenAddress0),
    getAbi(tokenAddress1),
  ]);

  const tokenContract0 = new ethers.Contract(
    tokenAddress0,
    tokenAbi0,
    provider
  );
  const tokenContract1 = new ethers.Contract(
    tokenAddress1,
    tokenAbi1,
    provider
  );

  const [tokenSymbol0, tokenSymbol1, tokenDecimals0, tokenDecimals1] =
    await Promise.all([
      tokenContract0.symbol(),
      tokenContract1.symbol(),
      tokenContract0.decimals(),
      tokenContract1.decimals(),
    ]);

  //   console.log(new Date().getTime() - start);

  const quoterContract = new ethers.Contract(
    quoterAddress,
    QuoterABI,
    provider
  );

  //   const immutables = await getPoolImmutables(poolContract);
  //   console.log(new Date().getTime() - start);

  const amountIn = ethers.utils.parseUnits(
    inputAmount.toString(),
    tokenDecimals0
  );

  const quotedAmountOut = await quoterContract.callStatic.quoteExactInputSingle(
    tokenAddress0,
    tokenAddress1,
    fee,
    amountIn,
    0
  );
  //   console.log(new Date().getTime() - start);
  console.log(quotedAmountOut.toString(), tokenAddress0, tokenAddress1);

  const amountOut = ethers.utils.formatUnits(quotedAmountOut, tokenDecimals1);

  console.log("=========");
  console.log(
    `${inputAmount} ${tokenSymbol0} can be swapped for ${amountOut} ${tokenSymbol1}`
  );
  console.log("=========");
  var end = new Date().getTime();
  console.log("time taken =", end - start);
};

getPrice(1);
