import { arbitrum, polygon } from "viem/chains";
import { CurrencyAmount, TradeType } from '@uniswap/sdk-core';
import { AlphaRouter, routeAmountsToString } from "@uniswap/smart-order-router";
import { JsonRpcProvider } from '@ethersproject/providers';

// Testing a multi-hop. E.g. Arbitrum DAI => FRAX

const tokenInAddress = "0xda10009cbd5d07dd0cecc66161fc93d7c9000da1";
const tokenOutAddress = "0x17fc002b466eec40dae837fc4be5c67993ddbd6f";
const amount = 10000000;

const chain = arbitrum;
const provider = new JsonRpcProvider(chain.rpcUrls.default.http[0], chain.id);
const router = new AlphaRouter({provider, chainId: chain.id});
 
async function test() {
  const tokenAccessor = await (router as any).tokenProvider.getTokens([
    tokenInAddress,
    tokenOutAddress,
  ]);

  const tokenIn = tokenAccessor.getTokenByAddress(tokenInAddress);
  const tokenOut = tokenAccessor.getTokenByAddress(tokenOutAddress);
  
  
  const swapRouteExactOut = await router.route(
    CurrencyAmount.fromRawAmount(
      tokenIn,
      amount,
    ),
    tokenOut,
    TradeType.EXACT_OUTPUT    
  );
  
  console.log("\n* ExactOut route")
  console.log(routeAmountsToString(swapRouteExactOut!.route))

  const swapRouteExactInt = await router.route(
    CurrencyAmount.fromRawAmount(
      tokenOut,
      amount,
    ),
    tokenIn,
    TradeType.EXACT_INPUT    
  );
  
  console.log("\n* ExactIn route")
  console.log(routeAmountsToString(swapRouteExactInt!.route))
}

test();
