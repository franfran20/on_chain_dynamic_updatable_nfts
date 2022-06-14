const { ethers, deployments, getNamedAccounts } = require("hardhat")

const updateNft = async (tokenId) => {
    let { deployer } = await getNamedAccounts()
    const { fixture, log } = deployments
    await fixture(["all"])
    log("Updating NFT....")
    const SVGNFTdeployer = await ethers.getContract("SVGNFT", deployer)

    const updateNFTTransaction = await SVGNFTdeployer.updateNft(tokenId)
    await updateNFTTransaction.wait(1)

    log(`Succesfully Updated nft with tokenId of: ${tokenId}!`)
    log(
        "=========================================================================="
    )
}

module.exports = updateNft

updateNft(1)
    .then(() => {
        process.exit(0)
    })
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
