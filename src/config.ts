export const abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "_id",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "_depositer",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "_withdrawer",
        type: "address",
      },
    ],
    name: "Registered",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "agreements",
    outputs: [
      {
        internalType: "address payable",
        name: "depositor",
        type: "address",
      },
      {
        internalType: "address payable",
        name: "withdrawer",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "payBlockInterval",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "payRate",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "lastActivityBlock",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "expiredLock",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "isExpired",
        type: "bool",
      },
      {
        internalType: "uint256",
        name: "paidOut",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_id",
        type: "uint256",
      },
    ],
    name: "depositorWithdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "escrowId",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_id",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_num",
        type: "uint256",
      },
    ],
    name: "extendAgreement",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_id",
        type: "uint256",
      },
    ],
    name: "increaseAgreementPay",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address payable",
        name: "_to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_payBlockInterval",
        type: "uint256",
      },
    ],
    name: "register",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_id",
        type: "uint256",
      },
    ],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];
