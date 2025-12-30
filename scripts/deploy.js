const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  const VaultNFT = await hre.ethers.getContractFactory("VaultNFT");
  const nft = await VaultNFT.deploy("Facinations Vault", "FAC");
  await nft.deployed();

  const Fraction = await hre.ethers.getContractFactory("FractionToken");
  const fraction = await Fraction.deploy(
    "Facinations Fraction",
    "FACX",
    hre.ethers.parseEther("1000000")
  );
  await fraction.deployed();

  const Registry = await hre.ethers.getContractFactory("VaultRegistry");
  const registry = await Registry.deploy();
  await registry.deployed();

  await registry.registerVault(
    "VAULT-ALBATRIX-001",
    nft.address,
    fraction.address,
    "ipfs://legal-pack"
  );

  console.log("VaultNFT:", nft.address);
  console.log("Fraction:", fraction.address);
  console.log("Registry:", registry.address);
}

main().catch(console.error);
