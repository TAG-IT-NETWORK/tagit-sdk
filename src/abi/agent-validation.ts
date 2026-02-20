import type { Abi } from "viem";

export const agentValidationAbi = [
  {
    "type": "constructor",
    "inputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "DEFAULT_QUORUM",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint8"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "DEFENSE_QUORUM",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint8"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "KYC_L1_IDENTITY",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "MAX_JUSTIFICATION_LENGTH",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "MAX_SCORE",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint8"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "MAX_VALIDATORS",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint8"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "PASSING_THRESHOLD",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint8"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "REQUEST_EXPIRY",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "VALIDATOR_CAPABILITY",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "accessController",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getAgentRequests",
    "inputs": [
      {
        "name": "agentId",
        "type": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getRequest",
    "inputs": [
      {
        "name": "requestId",
        "type": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "tuple",
        "components": [
          {
            "name": "agentId",
            "type": "uint256"
          },
          {
            "name": "requester",
            "type": "address"
          },
          {
            "name": "quorum",
            "type": "uint8"
          },
          {
            "name": "responseCount",
            "type": "uint8"
          },
          {
            "name": "createdAt",
            "type": "uint64"
          },
          {
            "name": "status",
            "type": "uint8"
          },
          {
            "name": "isDefense",
            "type": "bool"
          }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getResponses",
    "inputs": [
      {
        "name": "requestId",
        "type": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "tuple[]",
        "components": [
          {
            "name": "validator",
            "type": "address"
          },
          {
            "name": "score",
            "type": "uint8"
          },
          {
            "name": "justification",
            "type": "string"
          },
          {
            "name": "timestamp",
            "type": "uint64"
          }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getSummary",
    "inputs": [
      {
        "name": "agentId",
        "type": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "tuple",
        "components": [
          {
            "name": "totalRequests",
            "type": "uint256"
          },
          {
            "name": "passedCount",
            "type": "uint256"
          },
          {
            "name": "failedCount",
            "type": "uint256"
          },
          {
            "name": "latestScore",
            "type": "uint256"
          },
          {
            "name": "lastValidatedAt",
            "type": "uint64"
          },
          {
            "name": "isValidated",
            "type": "bool"
          }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getValidationStatus",
    "inputs": [
      {
        "name": "agentId",
        "type": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "isValidated",
        "type": "bool"
      },
      {
        "name": "latestScore",
        "type": "uint256"
      },
      {
        "name": "lastValidatedAt",
        "type": "uint64"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getValidatorStats",
    "inputs": [
      {
        "name": "validator",
        "type": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "tuple",
        "components": [
          {
            "name": "totalResponses",
            "type": "uint256"
          },
          {
            "name": "accurateResponses",
            "type": "uint256"
          },
          {
            "name": "lastResponseAt",
            "type": "uint64"
          }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "hasValidatorResponded",
    "inputs": [
      {
        "name": "requestId",
        "type": "uint256"
      },
      {
        "name": "validator",
        "type": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "identityRegistry",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "owner",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "pause",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "paused",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "renounceOwnership",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "setAccessController",
    "inputs": [
      {
        "name": "controller",
        "type": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "setIdentityRegistry",
    "inputs": [
      {
        "name": "registry",
        "type": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "transferOwnership",
    "inputs": [
      {
        "name": "newOwner",
        "type": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "unpause",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "validationRequest",
    "inputs": [
      {
        "name": "agentId",
        "type": "uint256"
      },
      {
        "name": "isDefense",
        "type": "bool"
      }
    ],
    "outputs": [
      {
        "name": "requestId",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "validationResponse",
    "inputs": [
      {
        "name": "requestId",
        "type": "uint256"
      },
      {
        "name": "score",
        "type": "uint8"
      },
      {
        "name": "justification",
        "type": "string"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "event",
    "name": "AccessControllerUpdated",
    "inputs": [
      {
        "name": "previousController",
        "type": "address",
        "indexed": true
      },
      {
        "name": "newController",
        "type": "address",
        "indexed": true
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "IdentityRegistryUpdated",
    "inputs": [
      {
        "name": "previousRegistry",
        "type": "address",
        "indexed": true
      },
      {
        "name": "newRegistry",
        "type": "address",
        "indexed": true
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "OwnershipTransferred",
    "inputs": [
      {
        "name": "previousOwner",
        "type": "address",
        "indexed": true
      },
      {
        "name": "newOwner",
        "type": "address",
        "indexed": true
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "Paused",
    "inputs": [
      {
        "name": "account",
        "type": "address",
        "indexed": false
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "Unpaused",
    "inputs": [
      {
        "name": "account",
        "type": "address",
        "indexed": false
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "ValidationFinalized",
    "inputs": [
      {
        "name": "requestId",
        "type": "uint256",
        "indexed": true
      },
      {
        "name": "agentId",
        "type": "uint256",
        "indexed": true
      },
      {
        "name": "passed",
        "type": "bool",
        "indexed": false
      },
      {
        "name": "finalScore",
        "type": "uint256",
        "indexed": false
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "ValidationRequested",
    "inputs": [
      {
        "name": "requestId",
        "type": "uint256",
        "indexed": true
      },
      {
        "name": "agentId",
        "type": "uint256",
        "indexed": true
      },
      {
        "name": "requester",
        "type": "address",
        "indexed": true
      },
      {
        "name": "isDefense",
        "type": "bool",
        "indexed": false
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "ValidationResponseSubmitted",
    "inputs": [
      {
        "name": "requestId",
        "type": "uint256",
        "indexed": true
      },
      {
        "name": "agentId",
        "type": "uint256",
        "indexed": true
      },
      {
        "name": "validator",
        "type": "address",
        "indexed": true
      },
      {
        "name": "score",
        "type": "uint8",
        "indexed": false
      }
    ],
    "anonymous": false
  },
  {
    "type": "error",
    "name": "AccessControllerNotSet",
    "inputs": []
  },
  {
    "type": "error",
    "name": "AgentNotActive",
    "inputs": [
      {
        "name": "agentId",
        "type": "uint256"
      }
    ]
  },
  {
    "type": "error",
    "name": "AgentNotFound",
    "inputs": [
      {
        "name": "agentId",
        "type": "uint256"
      }
    ]
  },
  {
    "type": "error",
    "name": "AlreadyResponded",
    "inputs": [
      {
        "name": "validator",
        "type": "address"
      },
      {
        "name": "requestId",
        "type": "uint256"
      }
    ]
  },
  {
    "type": "error",
    "name": "EnforcedPause",
    "inputs": []
  },
  {
    "type": "error",
    "name": "ExpectedPause",
    "inputs": []
  },
  {
    "type": "error",
    "name": "IdentityRegistryNotSet",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InvalidRequestStatus",
    "inputs": [
      {
        "name": "requestId",
        "type": "uint256"
      },
      {
        "name": "current",
        "type": "uint8"
      },
      {
        "name": "expected",
        "type": "uint8"
      }
    ]
  },
  {
    "type": "error",
    "name": "InvalidScore",
    "inputs": [
      {
        "name": "score",
        "type": "uint8"
      }
    ]
  },
  {
    "type": "error",
    "name": "JustificationTooLong",
    "inputs": [
      {
        "name": "length",
        "type": "uint256"
      }
    ]
  },
  {
    "type": "error",
    "name": "MissingKYCIdentity",
    "inputs": [
      {
        "name": "caller",
        "type": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "NotRequester",
    "inputs": [
      {
        "name": "caller",
        "type": "address"
      },
      {
        "name": "requestId",
        "type": "uint256"
      }
    ]
  },
  {
    "type": "error",
    "name": "NotValidator",
    "inputs": [
      {
        "name": "caller",
        "type": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "OwnableInvalidOwner",
    "inputs": [
      {
        "name": "owner",
        "type": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "OwnableUnauthorizedAccount",
    "inputs": [
      {
        "name": "account",
        "type": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "ReentrancyGuardReentrantCall",
    "inputs": []
  },
  {
    "type": "error",
    "name": "RequestExpired",
    "inputs": [
      {
        "name": "requestId",
        "type": "uint256"
      }
    ]
  },
  {
    "type": "error",
    "name": "RequestNotFound",
    "inputs": [
      {
        "name": "requestId",
        "type": "uint256"
      }
    ]
  }
] as const satisfies Abi;
