const { expect, assert } = require("chai")
const { ethers, deployments, getChainId, getNamedAccounts } = require("hardhat")

let chainId = 31337

//I could've written all the tests individually for each function.
//I'd definitely update this repo with the full test for now enjoy!
chainId != 31337
    ? describe.skip
    : describe("SVGNFT", function () {
          let SVGNFT
          let VRFMOCK
          let owner
          beforeEach(async () => {
              const { fixture } = deployments
              const { deployer, testAccount } = await getNamedAccounts()
              await fixture(["all"])
              owner = deployer
              SVGNFT = await ethers.getContract("SVGNFT", deployer)
              VRFMOCK = await ethers.getContract(
                  "VRFCoordinatorV2Mock",
                  deployer
              )
          })

          it("Should succesfully create nft", async () => {
              console.log(`creating NFT....`)
              await SVGNFT.createNft()
              console.log("Succesfull Creation of Nft!")
              console.log(
                  "=========================================================================="
              )

              //
              let statStruct = await SVGNFT.tokenIdToStat("1")

              assert.equal(await SVGNFT.tokenCounter(), "1")
              for (let index = 0; index < 3; index++) {
                  assert.equal(statStruct[index], "0")
              }
              assert.equal(await SVGNFT.ownerOf("1"), owner)
          })

          it("Should succesfully update The nft", async () => {
              console.log(`creating NFT....`)
              await SVGNFT.createNft()
              console.log("Succesfull Creation of Nft!")
              console.log(
                  "=========================================================================="
              )
              console.log(`updating NFT....`)
              await SVGNFT.updateNft(1)
              console.log("Succesfull Updated of Nft!")
              console.log(
                  "=========================================================================="
              )

              const { testAccount } = await getNamedAccounts()
              const SVGNFTAcct2 = await ethers.getContract(
                  "SVGNFT",
                  testAccount
              )
              expect(SVGNFTAcct2.updateNft(1)).to.be.reverted
              expect(SVGNFT.updateNft(2)).to.be.reverted
          })

          it("It should successfully mock the fulfill Randomness by the VRFCoordinator", async () => {
              console.log(`creating NFT....`)
              await SVGNFT.createNft()
              console.log("Succesfull Creation of Nft!")
              console.log(
                  "=========================================================================="
              )
              console.log(`updating NFT....`)
              await SVGNFT.updateNft(1)
              console.log("Succesfull Updated of Nft!")
              console.log(
                  "=========================================================================="
              )

              console.log("mocking Fulfill randomness...")
              const requestId = "1"
              const tokenId = "1"
              const svgNftAddress = SVGNFT.address
              console.log("Giving contract random Number...")
              await VRFMOCK.fulfillRandomWords(requestId, svgNftAddress)
              const random = await SVGNFT.tokenIdToStat(tokenId)

              assert.notEqual(random, 0)
          })

          it("Test that the reveal update function works as expected", async () => {
              const tokenId = "1"
              console.log(`creating NFT....`)
              await SVGNFT.createNft()
              console.log("Succesfull Creation of Nft!")
              console.log(
                  "=========================================================================="
              )
              console.log(`updating NFT....`)
              await SVGNFT.updateNft(tokenId)
              console.log("Succesfull Updated of Nft!")
              console.log(
                  "=========================================================================="
              )

              console.log("mocking Fulfill randomness...")
              const requestId = 1
              const svgNftAddress = SVGNFT.address
              await VRFMOCK.fulfillRandomWords(requestId, svgNftAddress)

              const StatForTokenId1 = await SVGNFT.tokenIdToStat(tokenId)
              const randomNumForTokenId = StatForTokenId1[3].toString()
              console.log(`The random Number: ${randomNumForTokenId}`)
              console.log("==================================================")

              console.log("Revealing Update for NFT.....")
              await SVGNFT.revealUpdate(tokenId)
              console.log("Revealed!")
          })
      })
