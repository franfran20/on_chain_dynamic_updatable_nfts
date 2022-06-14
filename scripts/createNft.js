const { ethers, deployments, getNamedAccounts } = require("hardhat")

const createNft = async () => {
    let { deployer } = await getNamedAccounts()
    const { fixture } = deployments
    await fixture(["all"])
    console.log("Creating NFT....")
    const SVGNFTdeployer = await ethers.getContract("SVGNFT", deployer)

    const createNFTTransaction = await SVGNFTdeployer.createNft()
    await createNFTTransaction.wait(1)

    console.log("Succesfull Creation of nft!")
    console.log(
        `tokenid to stat of token 1: ${await SVGNFTdeployer.tokenIdToStat(1)}`
    )
    console.log(
        "=========================================================================="
    )
}

createNft()
    .then(() => {
        process.exit(0)
    })
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
