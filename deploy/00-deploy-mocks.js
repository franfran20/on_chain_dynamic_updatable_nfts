const { network, ethers } = require("hardhat")
const {
    networkConfig,
    BASE_FEE,
    GASPRICE_LINK,
} = require("../helper-hardhat-config")

module.exports = async ({ getNamedAccounts, deployments, getChainId }) => {
    const { deploy, log, get } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = await getChainId()

    //we deploy the mock gere because we need the subscription if
    if (network.config.chainId == 31337) {
        log("Deploying mocks....")
        await deploy("VRFCoordinatorV2Mock", {
            contract: "VRFCoordinatorV2Mock",
            from: deployer,
            args: [BASE_FEE, GASPRICE_LINK],
            log: true,
        })

        log("Mock deployed!")

        log(
            "=================================================================="
        )

        const VRFMOCKDeployer = await ethers.getContract(
            "VRFCoordinatorV2Mock",
            deployer
        )

        log("Creating subscription....")
        let tx = await VRFMOCKDeployer.createSubscription()
        let tx_receipt = await tx.wait(1)
        //let subscriptionId = tx.events[0].args.subId;
        subId = tx_receipt.events[0].args[0].toString()
        log(`Subscription created with an Id of ${subId}`)

        log("funding subscription....")
        const AMOUNT_FOR_SUB = ethers.utils.parseEther("1")
        let txFund = await VRFMOCKDeployer.fundSubscription(
            subId,
            AMOUNT_FOR_SUB
        )
        let txFundReceipt = await txFund.wait(1)
        //let subscriptionId = tx.events[0].args.subId;
        let amount = txFundReceipt.events[0].args[2].toString()
        log(`Subscription funded with ${amount}`)
        VRFMOCK_ADDRESS = VRFMOCKDeployer.address
    } else {
        VRFMOCK_ADDRESS = networkConfig[chainId]["vrfCoordinator"]
    }
}

module.exports.tags = ["all", "mocks"]
