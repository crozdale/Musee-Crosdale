// src/mapping.ts
import { BigInt, Bytes } from "@graphprotocol/graph-ts";
import {
  VaultCreated,           // <-- from your ABI
} from "../generated/Vaults/Vaults";  // <-- contract name + folder
import { Vault, Asset } from "../generated/schema";

export function handleVaultCreated(event: VaultCreated): void {
  // Use vault address or ID from event as the entity ID
  let id = event.params.vault.toHex();        // adjust param names
  let vault = new Vault(id);

  vault.name = event.params.name;             // string, or set null if none
  vault.owner = event.params.owner;           // Address -> Bytes matches schema
  vault.createdAt = event.block.timestamp;    // BigInt
  vault.status = "ACTIVE";                    // default for new vaults

  // Primary asset (optional, only if your event exposes it)
  let assetId = event.params.asset.toHex();   // token address
  let asset = Asset.load(assetId);
  if (asset == null) {
    asset = new Asset(assetId);
    asset.symbol = null;                      // can be backfilled later
    asset.decimals = event.params.decimals.toI32();
    asset.tokenAddress = event.params.asset as Bytes;
    asset.save();
  }

  vault.primaryAsset = assetId;

  vault.save();
}
