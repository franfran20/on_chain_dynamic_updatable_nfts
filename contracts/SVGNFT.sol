// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "hardhat/console.sol";

error StatNFT__TokenDoesNotExist();
error StatNFT__YouDontOwnThisToken();

contract SVGNFT is ERC721URIStorage, Ownable, VRFConsumerBaseV2 {
    using Strings for uint256;

    VRFCoordinatorV2Interface private COORDINATOR;
    bytes32 private s_keyHash;
    address private s_owner;
    uint16 private constant s_requestConfirmations = 3;
    uint32 private constant NUM_WORDS = 1;
    uint32 private callbackGasLimit = 120000;
    uint64 private s_subscriptionId;
    uint256 public s_requestId;
    uint256[] public s_randomWords;
    uint256 public tokenCounter;

    struct Stats {
        uint256 health;
        uint256 stamina;
        uint256 strength;
        uint256 randomNum;
    }
    mapping(uint256 => Stats) public tokenIdToStat;
    mapping(uint256 => uint256) public requestIdToTokenId;

    constructor(
        uint64 _subscriptionId,
        address _vrfcoordinator,
        bytes32 _keyhash
    ) ERC721("Rando Stat Card!", "RSTC") VRFConsumerBaseV2(_vrfcoordinator) {
        s_subscriptionId = _subscriptionId;
        s_keyHash = _keyhash;
        COORDINATOR = VRFCoordinatorV2Interface(_vrfcoordinator);
    }

    function createNft() public {
        tokenCounter++;
        Stats memory stats = Stats({
            health: 0,
            stamina: 0,
            strength: 0,
            randomNum: 0
        });
        tokenIdToStat[tokenCounter] = stats;
        string memory tokenURI = formatTokenURI(tokenCounter);
        console.log(tokenURI);
        _safeMint(msg.sender, tokenCounter);
        _setTokenURI(tokenCounter, tokenURI);
    }

    function updateNft(uint256 _tokenId) public {
        if (!_exists(_tokenId)) {
            revert StatNFT__TokenDoesNotExist();
        }
        if (ownerOf(_tokenId) != msg.sender) {
            revert StatNFT__YouDontOwnThisToken();
        }
        uint256 requestId = COORDINATOR.requestRandomWords(
            s_keyHash,
            s_subscriptionId,
            s_requestConfirmations,
            callbackGasLimit,
            NUM_WORDS
        );
        s_requestId = requestId;
        requestIdToTokenId[requestId] = _tokenId;
    }

    function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords)
        internal
        override
    {
        //require certain stuff
        uint256 token_id = requestIdToTokenId[requestId];
        tokenIdToStat[token_id].randomNum = randomWords[0];
    }

    function revealUpdate(uint256 _tokenId) public {
        uint256 spice = 1001;
        Stats memory stat = tokenIdToStat[_tokenId];
        uint256 randomNumForTokenId = stat.randomNum;
        stat.health = (randomNumForTokenId / _tokenId) % 100;
        stat.stamina = (randomNumForTokenId / s_requestConfirmations) % 100;
        stat.strength = (randomNumForTokenId / spice) % 100;
        tokenIdToStat[_tokenId] = stat;
        string memory svgURI = formatTokenURI(_tokenId);
        //console.log("New URI: ", svgURI);
        _setTokenURI(_tokenId, svgURI);
    }

    function formatTokenURI(uint256 _tokenId)
        public
        view
        returns (string memory)
    {
        return
            string(
                abi.encodePacked(
                    "data:application/json;base64,",
                    Base64.encode(
                        bytes(
                            abi.encodePacked(
                                '{"name":"',
                                "StatsCard NFT"
                                '", "description":"Stats Card ',
                                _tokenId.toString(),
                                '", "attributes":"", "image":"',
                                svgToImageURI(_tokenId),
                                '"}'
                            )
                        )
                    )
                )
            );
    }

    function svgToImageURI(uint256 _tokenId)
        public
        view
        returns (string memory)
    {
        string memory baseURL = "data:image/svg+xml;base64,";
        string memory svgBase64Encoded = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '<svg xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg" width="210mm" height="297mm" viewBox="0 0 210 297" version="1.1" id="svg379">',
                        '<g id="layer1">',
                        '<text xml:space="preserve" transform="matrix(0.26458333,0,0,0.26458333,0.52566372,19.449558)" id="text383" style="font-style:italic;font-weight:bold;font-size:96px;font-family:',
                        "MV Boli",
                        ";-inkscape-font-specification:",
                        "MV Boli Bold Italic",
                        ';white-space:pre;shape-inside:url(#rect385);display:inline;fill:#000000"><tspan x="43.708984" y="295.5298" id="tspan475">HEALTH -</tspan></text>',
                        '<text xml:space="preserve" transform="matrix(0.26458333,0,0,0.26458333,-6.3079646,5.7823009)" id="text389" style="font-style:italic;font-weight:bold;font-size:96px;font-family:',
                        "MV Boli",
                        ";-inkscape-font-specification:",
                        "MV Boli Bold Italic",
                        ';white-space:pre;shape-inside:url(#rect391);display:inline;fill:#000000"><tspan x="59.603516" y="484.27394" id="tspan477">STAMINA -</tspan></text>',
                        '<text xml:space="preserve" transform="matrix(0.26458333,0,0,0.26458333,-9.9876106,4.7309735)" id="text395" style="font-style:italic;font-weight:bold;font-size:96px;font-family:',
                        "MV Boli",
                        ";-inkscape-font-specification:",
                        "MV Boli Bold Italic",
                        ';white-space:pre;shape-inside:url(#rect397);display:inline;fill:#000000"><tspan x="59.603516" y="647.188" id="tspan479">STRENGTH -</tspan></text>',
                        '<text xml:space="preserve" transform="matrix(0.26458333,0,0,0.26458333,2.6283186,-3.1539823)" id="text401" style="font-style:italic;font-weight:bold;font-size:96px;font-family:',
                        "MV Boli",
                        ";-inkscape-font-specification:",
                        "MV Boli Bold Italic",
                        ';white-space:pre;shape-inside:url(#rect403);display:inline;fill:#000000"><tspan x="600.00195" y="382.94777" id="tspan481">',
                        (tokenIdToStat[_tokenId].health).toString(),
                        "</tspan></text>",
                        '<text xml:space="preserve" transform="matrix(0.26458333,0,0,0.26458333,7.3592921,31.539823)" id="text409" style="font-style:italic;font-weight:bold;font-size:96px;font-family:',
                        "MV Boli",
                        ";-inkscape-font-specification:",
                        "MV Boli Bold Italic",
                        ';white-space:pre;shape-inside:url(#rect411);display:inline;fill:#000000"><tspan x="600.00195" y="382.94777" id="tspan483">',
                        (tokenIdToStat[_tokenId].stamina).toString(),
                        "</tspan></text>",
                        '<text xml:space="preserve" transform="matrix(0.26458333,0,0,0.26458333,16.295575,75.695575)" id="text415" style="font-style:italic;font-weight:bold;font-size:96px;font-family:',
                        "MV Boli",
                        ";-inkscape-font-specification:",
                        "MV Boli Bold Italic",
                        ';white-space:pre;shape-inside:url(#rect417);display:inline;fill:#000000"><tspan x="600.00195" y="382.94777" id="tspan485">',
                        (tokenIdToStat[_tokenId].strength).toString(),
                        "</tspan></text>",
                        "</g>",
                        "</svg>"
                    )
                )
            )
        );
        //console.log(string(abi.encodePacked(baseURL, svgBase64Encoded)));

        return string(abi.encodePacked(baseURL, svgBase64Encoded));
    }
}
