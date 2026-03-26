import { BigInt, BigDecimal, Bytes } from "@graphprotocol/graph-ts";
import { SwapExecuted, VaultMinted } from "../generated/FacinationsVaultDeFi/FacinationsVaultDeFi";
import { TransferSingle, TransferBatch } from "../generated/FractionalVault/FractionalVault";
import { Swap, SwapUser, Trade, UserPosition, VaultMint } from "../generated/schema";

// ── Constants ─────────────────────────────────────────────────────────────────
const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
const DECIMALS_18  = BigDecimal.fromString("1000000000000000000");
const ZERO_BD      = BigDecimal.fromString("0");
const ZERO_BI      = BigInt.fromI32(0);

// ── Helpers ───────────────────────────────────────────────────────────────────

function toDecimal18(value: BigInt): BigDecimal {
  return value.toBigDecimal().div(DECIMALS_18);
}

function positionId(user: Bytes, vault: Bytes): string {
  return user.toHex() + "-" + vault.toHex();
}

function loadOrCreatePosition(user: Bytes, vault: Bytes, timestamp: BigInt): UserPosition {
  let id  = positionId(user, vault);
  let pos = UserPosition.load(id);
  if (!pos) {
    pos = new UserPosition(id);
    pos.user            = user;
    pos.vaultId         = vault.toHex();
    pos.fractionBalance = ZERO_BD;
    pos.entryXerAmount  = ZERO_BD;
    pos.updatedAt       = timestamp;
  }
  return pos as UserPosition;
}

// ── SwapExecuted ──────────────────────────────────────────────────────────────

export function handleSwapExecuted(event: SwapExecuted): void {
  // 1. Legacy Swap entity
  let swap         = new Swap(event.transaction.hash.toHex());
  swap.user        = event.params.user;
  swap.tokenOut    = event.params.tokenOut;
  swap.amountIn    = event.params.amountIn;
  swap.feePaid     = event.params.feePaid;
  swap.amountOut   = event.params.amountOut;
  swap.timestamp   = event.params.timestamp;
  swap.blockNumber = event.block.number;
  swap.save();

  // 2. SwapUser aggregate
  let userId   = event.params.user.toHex();
  let swapUser = SwapUser.load(userId);
  if (!swapUser) {
    swapUser               = new SwapUser(userId);
    swapUser.totalSwaps    = ZERO_BI;
    swapUser.totalXerIn    = ZERO_BI;
    swapUser.totalFeesPaid = ZERO_BI;
    swapUser.lastSwapAt    = ZERO_BI;
  }
  swapUser.totalSwaps    = swapUser.totalSwaps.plus(BigInt.fromI32(1));
  swapUser.totalXerIn    = swapUser.totalXerIn.plus(event.params.amountIn);
  swapUser.totalFeesPaid = swapUser.totalFeesPaid.plus(event.params.feePaid);
  swapUser.lastSwapAt    = event.params.timestamp;
  swapUser.save();

  // 3. Trade entity — matches Dashboard + ETL queries
  let tradeId          = event.transaction.hash.toHex() + "-" + event.logIndex.toString();
  let trade            = new Trade(tradeId);
  trade.user           = event.params.user;
  trade.fractionId     = event.params.tokenOut;
  trade.xerAmount      = toDecimal18(event.params.amountIn);
  trade.fractionAmount = toDecimal18(event.params.amountOut);
  trade.timestamp      = event.params.timestamp;
  trade.save();

  // 4. UserPosition — buyer gains fractions
  let pos = loadOrCreatePosition(event.params.user, event.params.tokenOut, event.params.timestamp);
  pos.fractionBalance = pos.fractionBalance.plus(toDecimal18(event.params.amountOut));
  pos.entryXerAmount  = pos.entryXerAmount.plus(toDecimal18(event.params.amountIn));
  pos.updatedAt       = event.params.timestamp;
  pos.save();
}

// ── VaultMinted ───────────────────────────────────────────────────────────────

export function handleVaultMinted(event: VaultMinted): void {
  let id        = event.transaction.hash.toHex() + "-" + event.logIndex.toString();
  let mint      = new VaultMint(id);
  mint.user     = event.params.user;
  mint.tokenId  = event.params.tokenId;
  mint.vaultId  = event.params.vaultId;
  mint.tokenURI = event.params.tokenURI;
  mint.legalURI = event.params.legalURI;
  mint.timestamp = event.params.timestamp;
  mint.save();
}

// ── TransferSingle (FractionalVault / ArtworkVault ERC1155) ───────────────────

export function handleTransferSingle(event: TransferSingle): void {
  let vaultAddr = event.address;
  let fromAddr  = event.params.from;
  let toAddr    = event.params.to;
  let value     = event.params.value.toBigDecimal();
  let ts        = event.block.timestamp;

  if (toAddr.toHex() != ZERO_ADDRESS) {
    let pos = loadOrCreatePosition(toAddr, vaultAddr, ts);
    pos.fractionBalance = pos.fractionBalance.plus(value);
    pos.updatedAt       = ts;
    pos.save();
  }

  if (fromAddr.toHex() != ZERO_ADDRESS) {
    let pos    = loadOrCreatePosition(fromAddr, vaultAddr, ts);
    let newBal = pos.fractionBalance.minus(value);
    pos.fractionBalance = newBal.lt(ZERO_BD) ? ZERO_BD : newBal;
    pos.updatedAt       = ts;
    pos.save();
  }
}

// ── TransferBatch (FractionalVault / ArtworkVault ERC1155) ────────────────────

export function handleTransferBatch(event: TransferBatch): void {
  let vaultAddr = event.address;
  let fromAddr  = event.params.from;
  let toAddr    = event.params.to;
  let values    = event.params.values;
  let ts        = event.block.timestamp;

  for (let i = 0; i < values.length; i++) {
    let value = values[i].toBigDecimal();

    if (toAddr.toHex() != ZERO_ADDRESS) {
      let pos = loadOrCreatePosition(toAddr, vaultAddr, ts);
      pos.fractionBalance = pos.fractionBalance.plus(value);
      pos.updatedAt       = ts;
      pos.save();
    }

    if (fromAddr.toHex() != ZERO_ADDRESS) {
      let pos    = loadOrCreatePosition(fromAddr, vaultAddr, ts);
      let newBal = pos.fractionBalance.minus(value);
      pos.fractionBalance = newBal.lt(ZERO_BD) ? ZERO_BD : newBal;
      pos.updatedAt       = ts;
      pos.save();
    }
  }
}
