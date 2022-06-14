const { ethers, deployments, getNamedAccounts, network } = require("hardhat")

const mockFulfillRandomWords = async (requestId) => {
    let { deployer } = await getNamedAccounts()
    if (network.config.chainId == 31337) {
        const { fixture, log } = deployments
        await fixture(["all"])

        log("Mocking fulflill Randomness...")
        const VRFMOCKDeployer = await ethers.getContract(
            "VRFCoordinatorV2Mock",
            account
        )
        const SVGNFT = await ethers.getContract("SVGNFT")

        const transactionfulfillRandomnessMock =
            await VRFMOCKDeployer.fulfillRandomWords(requestId, SVGNFT.address)
        transactionfulfillRandomnessMock.wait(1)

        log(`Random Number returned! Yippe-kay-yay!`)
        log(
            "=========================================================================="
        )
    }
}

module.exports = mockFulfillRandomWords

mockFulfillRandomWords(1)
    .then(() => {
        process.exit(0)
    })
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
