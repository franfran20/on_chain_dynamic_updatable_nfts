const {
    deployments,
    getChainId,
    getNamedAccounts,
    network,
    ethers,
} = require("hardhat")
const { networkConfig } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

module.exports = async () => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = await getChainId()
    let subId = networkConfig[chainId]["subId"]
    let KEY_HASH = networkConfig[chainId]["keyhash"]
    let VRFMOCK
    let args

    if (network.config.chainId == 31337) {
        VRFMOCK = await (
            await ethers.getContract("VRFCoordinatorV2Mock")
        ).address
    } else {
        VRFMOCK = networkConfig[chainId]["vrfCoordinator"]
    }
    args = [subId, VRFMOCK, KEY_HASH]

    log("Deploying SVG NFT contract..")
    const SVGNFT = await deploy("SVGNFT", {
        contract: "SVGNFT",
        from: deployer,
        logs: true,
        args: args,
        waitConfirmations: networkConfig[chainId].blockConfirmations || 1,
    })
    log(`SVGNFT Contract Deployed at ${SVGNFT.address}`)
    log("===========================================================")

    if (network.config.chainId != 31337) {
        await verify(SVGNFT.address, args)
    }
}

module.exports.tags = ["all", "svg"]
