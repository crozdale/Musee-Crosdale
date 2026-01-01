import { BrowserProvider, Contract, parseUnits } from "ethers";
import ERC20_ABI from "../abi/ERC20Approve.json";
import SWAP_ABI from "../abi/FractionSwap.json";
import { XER_TOKEN } from "../config/tokens";
import { VAULTS } from "../registry/vaultRegistry";

export async function buyFractions(vaultId, amount) {
  const vault = VAULTS.find(v => v.id === vaultId);
  if (!vault) throw new Error("Vault not found");

  const provider = new BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  const xer = new Contract(XER_TOKEN.address, ERC20_ABI, signer);
  const swap = new Contract(vault.fractionContract, SWAP_ABI, signer);

  const parsed = parseUnits(amount, XER_TOKEN.decimals);

  // Approve
  const approveTx = await xer.approve(vault.fractionContract, parsed);
  await approveTx.wait();

  // Buy
  const buyTx = await swap.buy(parsed);
  const receipt = await buyTx.wait();

  return {
    hash: buyTx.hash,
    receipt,
  };
}

export async function sellFractions(vaultId, amount) {
  const vault = VAULTS.find(v => v.id === vaultId);
  if (!vault) throw new Error("Vault not found");

  const provider = new BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  const swap = new Contract(vault.fractionContract, SWAP_ABI, signer);
  const parsed = parseUnits(amount, 18);

  const sellTx = await swap.sell(parsed);
  const receipt = await sellTx.wait();

  return {
    hash: sellTx.hash,
    receipt,
  };
}
