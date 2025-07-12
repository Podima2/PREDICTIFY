// Contract configuration for TalentFlow UserRegistry
export const USER_REGISTRY_CONTRACT = {
  // Replace this with your deployed contract address after deployment
  address: '0x70F8118715691b07DB18fD5748810350Fc568c88' as `0x${string}`,
  
  // Contract ABI - generated from the UserRegistry.sol contract
  abi: [
    {
      "inputs": [
        { "internalType": "string", "name": "_avatar", "type": "string" },
        { "internalType": "string", "name": "_name", "type": "string" },
        { "internalType": "uint256", "name": "_age", "type": "uint256" },
        { "internalType": "string", "name": "_sport", "type": "string" },
        { "internalType": "string", "name": "_position", "type": "string" },
        { "internalType": "string", "name": "_bio", "type": "string" }
      ],
      "name": "registerAthlete",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "string", "name": "_avatar", "type": "string" },
        { "internalType": "string", "name": "_name", "type": "string" },
        { "internalType": "string", "name": "_organization", "type": "string" },
        { "internalType": "string", "name": "_position", "type": "string" }
      ],
      "name": "registerScout",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "address", "name": "_user", "type": "address" }
      ],
      "name": "getUserRole",
      "outputs": [
        { "internalType": "enum UserRegistry.UserRole", "name": "", "type": "uint8" }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "address", "name": "_athlete", "type": "address" }
      ],
      "name": "getAthleteProfile",
      "outputs": [
        {
          "components": [
            { "internalType": "string", "name": "avatar", "type": "string" },
            { "internalType": "string", "name": "name", "type": "string" },
            { "internalType": "uint256", "name": "age", "type": "uint256" },
            { "internalType": "string", "name": "sport", "type": "string" },
            { "internalType": "string", "name": "position", "type": "string" },
            { "internalType": "string", "name": "bio", "type": "string" }
          ],
          "internalType": "struct UserRegistry.AthleteProfile",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "address", "name": "_scout", "type": "address" }
      ],
      "name": "getScoutProfile",
      "outputs": [
        {
          "components": [
            { "internalType": "string", "name": "avatar", "type": "string" },
            { "internalType": "string", "name": "name", "type": "string" },
            { "internalType": "string", "name": "organization", "type": "string" },
            { "internalType": "string", "name": "position", "type": "string" }
          ],
          "internalType": "struct UserRegistry.ScoutProfile",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    // Simplified highlight functions
    {
      "inputs": [
        { "internalType": "string", "name": "_metadataIpfsHash", "type": "string" }
      ],
      "name": "uploadHighlight",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "uint256", "name": "_highlightId", "type": "uint256" },
        { "internalType": "string", "name": "_newMetadataIpfsHash", "type": "string" }
      ],
      "name": "updateHighlight",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "uint256", "name": "_highlightId", "type": "uint256" }
      ],
      "name": "deactivateHighlight",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "uint256", "name": "_highlightId", "type": "uint256" }
      ],
      "name": "recordView",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "uint256", "name": "_highlightId", "type": "uint256" }
      ],
      "name": "likeHighlight",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "uint256", "name": "_highlightId", "type": "uint256" }
      ],
      "name": "saveHighlight",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "uint256", "name": "_highlightId", "type": "uint256" }
      ],
      "name": "getHighlight",
      "outputs": [
        {
          "components": [
            { "internalType": "string", "name": "metadataIpfsHash", "type": "string" },
            { "internalType": "bool", "name": "isActive", "type": "bool" },
            { "internalType": "address", "name": "athleteAddress", "type": "address" }
          ],
          "internalType": "struct UserRegistry.Highlight",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "address", "name": "_athleteAddress", "type": "address" }
      ],
      "name": "getAthleteHighlightIds",
      "outputs": [
        { "internalType": "uint256[]", "name": "", "type": "uint256[]" }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "address", "name": "_athleteAddress", "type": "address" },
        { "internalType": "uint256", "name": "_offset", "type": "uint256" },
        { "internalType": "uint256", "name": "_limit", "type": "uint256" }
      ],
      "name": "getAthleteHighlights",
      "outputs": [
        {
          "components": [
            { "internalType": "string", "name": "metadataIpfsHash", "type": "string" },
            { "internalType": "bool", "name": "isActive", "type": "bool" },
            { "internalType": "address", "name": "athleteAddress", "type": "address" }
          ],
          "internalType": "struct UserRegistry.Highlight[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "uint256", "name": "_offset", "type": "uint256" },
        { "internalType": "uint256", "name": "_limit", "type": "uint256" }
      ],
      "name": "getRecentHighlights",
      "outputs": [
        {
          "components": [
            { "internalType": "string", "name": "metadataIpfsHash", "type": "string" },
            { "internalType": "bool", "name": "isActive", "type": "bool" },
            { "internalType": "address", "name": "athleteAddress", "type": "address" }
          ],
          "internalType": "struct UserRegistry.Highlight[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    // Events
    {
      "anonymous": false,
      "inputs": [
        { "indexed": true, "internalType": "address", "name": "userAddress", "type": "address" },
        { "indexed": false, "internalType": "string", "name": "name", "type": "string" },
        { "indexed": false, "internalType": "string", "name": "sport", "type": "string" }
      ],
      "name": "AthleteRegistered",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        { "indexed": true, "internalType": "address", "name": "userAddress", "type": "address" },
        { "indexed": false, "internalType": "string", "name": "name", "type": "string" },
        { "indexed": false, "internalType": "string", "name": "organization", "type": "string" }
      ],
      "name": "ScoutRegistered",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        { "indexed": true, "internalType": "uint256", "name": "highlightId", "type": "uint256" },
        { "indexed": true, "internalType": "address", "name": "athleteAddress", "type": "address" },
        { "indexed": false, "internalType": "string", "name": "metadataIpfsHash", "type": "string" },
        { "indexed": false, "internalType": "uint256", "name": "uploadedAt", "type": "uint256" }
      ],
      "name": "HighlightUploaded",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        { "indexed": true, "internalType": "uint256", "name": "highlightId", "type": "uint256" },
        { "indexed": false, "internalType": "string", "name": "metadataIpfsHash", "type": "string" }
      ],
      "name": "HighlightUpdated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        { "indexed": true, "internalType": "uint256", "name": "highlightId", "type": "uint256" }
      ],
      "name": "HighlightDeactivated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        { "indexed": true, "internalType": "uint256", "name": "highlightId", "type": "uint256" },
        { "indexed": true, "internalType": "address", "name": "viewer", "type": "address" }
      ],
      "name": "HighlightViewed",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        { "indexed": true, "internalType": "uint256", "name": "highlightId", "type": "uint256" },
        { "indexed": true, "internalType": "address", "name": "liker", "type": "address" }
      ],
      "name": "HighlightLiked",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        { "indexed": true, "internalType": "uint256", "name": "highlightId", "type": "uint256" },
        { "indexed": true, "internalType": "address", "name": "saver", "type": "address" }
      ],
      "name": "HighlightSaved",
      "type": "event"
    }
  ]
} as const;

// Export for useHighlights hook
export const TALENTFLOW_ADDRESS = USER_REGISTRY_CONTRACT.address;
export const TALENTFLOW_ABI = USER_REGISTRY_CONTRACT.abi;
