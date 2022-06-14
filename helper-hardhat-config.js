const networkConfig = {
    31337: {
        name: "localhost",
        vrfCoordinator: "0x6168499c0cFfCaCD319c818142124B7A15E857ab",
        subscriptionId: 1,
        keyhash:
            "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc",
        subId: "1",
    },
    80001: {
        name: "mumbai",
        vrfCoordinator: "0xAE975071Be8F8eE67addBC1A82488F1C24858067",
        keyhash:
            "0xcc294a196eeeb44da2888d17c0625cc88d70d9760a69d58d853ba6581a9ab0cd",
        blockConfirmations: 4,
        subId: "455",
    },
    4: {
        name: "rinkeby",
        vrfCoordinator: "0x6168499c0cFfCaCD319c818142124B7A15E857ab",
        keyhash:
            "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc",
        blockConfirmations: 4,
        subId: "6010",
    },
}
const BASE_FEE = ethers.utils.parseEther("0.1")
const GASPRICE_LINK = 10000000000

module.exports = {
    networkConfig,
    BASE_FEE,
    GASPRICE_LINK,
}
