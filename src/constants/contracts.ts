// Contract configuration for TalentFlow UserRegistry
export const USER_REGISTRY_CONTRACT = {
  // Replace this with your deployed contract address after deployment
  address: '0xd011e2250Eff6CB95266c0cC5730E8F4B4158104' as `0x${string}`,
  
  // Contract ABI - generated from the UserRegistry.sol contract
  abi: [
    {
      "inputs": [
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
    }
  ]
} as const;
