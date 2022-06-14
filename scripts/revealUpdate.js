const { deployments, getNamedAccounts, ethers } = require("hardhat")

const revealUpdate = async (tokenId) => {
    let { deployer } = await getNamedAccounts()
    const { fixture, log } = deployments
    await fixture(["all"])

    const SVGNFT = await ethers.getContract("SVGNFT", deployer)
    log("Revealing Updated Nft....")
    await SVGNFT.revealUpdate(tokenId)
    log("CHECK OUT YO NFT BOY!!!..or GIRL!!")
}

module.exports = revealUpdate

revealUpdate(1)
    .then(() => {
        process.exit(0)
    })
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
