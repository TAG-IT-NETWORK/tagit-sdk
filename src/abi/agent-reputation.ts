import type { Abi } from "viem";

export const agentReputationAbi = [
  {
    "type": "constructor",
    "inputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "DECAY_PERIOD",
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
    "name": "MAX_COMMENT_LENGTH",
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
    "name": "MAX_RATING",
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
    "name": "MAX_RESPONSE_LENGTH",
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
    "name": "MIN_RATING",
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
    "name": "appendResponse",
    "inputs": [
      {
        "name": "feedbackId",
        "type": "uint256"
      },
      {
        "name": "responseText",
        "type": "string"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "getAgentFeedbackIds",
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
    "name": "getFeedback",
    "inputs": [
      {
        "name": "feedbackId",
        "type": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "tuple",
        "components": [
          {
            "name": "reviewer",
            "type": "address"
          },
          {
            "name": "agentId",
            "type": "uint256"
          },
          {
            "name": "rating",
            "type": "uint8"
          },
          {
            "name": "comment",
            "type": "string"
          },
          {
            "name": "response",
            "type": "string"
          },
          {
            "name": "timestamp",
            "type": "uint64"
          },
          {
            "name": "revoked",
            "type": "bool"
          }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getReviewerFeedback",
    "inputs": [
      {
        "name": "reviewer",
        "type": "address"
      },
      {
        "name": "agentId",
        "type": "uint256"
      }
    ],
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
    "name": "getSummary",
    "inputs": [
      {
        "name": "agentId",
        "type": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "summary",
        "type": "tuple",
        "components": [
          {
            "name": "totalFeedback",
            "type": "uint256"
          },
          {
            "name": "activeFeedback",
            "type": "uint256"
          },
          {
            "name": "averageRating",
            "type": "uint256"
          },
          {
            "name": "weightedScore",
            "type": "uint256"
          },
          {
            "name": "lastFeedbackAt",
            "type": "uint64"
          }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "giveFeedback",
    "inputs": [
      {
        "name": "agentId",
        "type": "uint256"
      },
      {
        "name": "rating",
        "type": "uint8"
      },
      {
        "name": "comment",
        "type": "string"
      }
    ],
    "outputs": [
      {
        "name": "feedbackId",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable"
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
    "name": "readAllFeedback",
    "inputs": [
      {
        "name": "agentId",
        "type": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "tuple[]",
        "components": [
          {
            "name": "reviewer",
            "type": "address"
          },
          {
            "name": "agentId",
            "type": "uint256"
          },
          {
            "name": "rating",
            "type": "uint8"
          },
          {
            "name": "comment",
            "type": "string"
          },
          {
            "name": "response",
            "type": "string"
          },
          {
            "name": "timestamp",
            "type": "uint64"
          },
          {
            "name": "revoked",
            "type": "bool"
          }
        ]
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
    "name": "revokeFeedback",
    "inputs": [
      {
        "name": "feedbackId",
        "type": "uint256"
      }
    ],
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
    "name": "FeedbackGiven",
    "inputs": [
      {
        "name": "feedbackId",
        "type": "uint256",
        "indexed": true
      },
      {
        "name": "agentId",
        "type": "uint256",
        "indexed": true
      },
      {
        "name": "reviewer",
        "type": "address",
        "indexed": true
      },
      {
        "name": "rating",
        "type": "uint8",
        "indexed": false
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "FeedbackRevoked",
    "inputs": [
      {
        "name": "feedbackId",
        "type": "uint256",
        "indexed": true
      },
      {
        "name": "agentId",
        "type": "uint256",
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
    "name": "ResponseAppended",
    "inputs": [
      {
        "name": "feedbackId",
        "type": "uint256",
        "indexed": true
      },
      {
        "name": "agentId",
        "type": "uint256",
        "indexed": true
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
    "name": "CommentTooLong",
    "inputs": [
      {
        "name": "length",
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
    "name": "FeedbackAlreadyRevoked",
    "inputs": [
      {
        "name": "feedbackId",
        "type": "uint256"
      }
    ]
  },
  {
    "type": "error",
    "name": "FeedbackNotFound",
    "inputs": [
      {
        "name": "feedbackId",
        "type": "uint256"
      }
    ]
  },
  {
    "type": "error",
    "name": "IdentityRegistryNotSet",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InvalidRating",
    "inputs": [
      {
        "name": "rating",
        "type": "uint8"
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
    "name": "NotAgentRegistrant",
    "inputs": [
      {
        "name": "caller",
        "type": "address"
      },
      {
        "name": "agentId",
        "type": "uint256"
      }
    ]
  },
  {
    "type": "error",
    "name": "NotReviewer",
    "inputs": [
      {
        "name": "caller",
        "type": "address"
      },
      {
        "name": "feedbackId",
        "type": "uint256"
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
    "name": "ResponseAlreadyExists",
    "inputs": [
      {
        "name": "feedbackId",
        "type": "uint256"
      }
    ]
  },
  {
    "type": "error",
    "name": "ResponseTooLong",
    "inputs": [
      {
        "name": "length",
        "type": "uint256"
      }
    ]
  },
  {
    "type": "error",
    "name": "SelfReviewBlocked",
    "inputs": [
      {
        "name": "reviewer",
        "type": "address"
      },
      {
        "name": "agentId",
        "type": "uint256"
      }
    ]
  }
] as const satisfies Abi;
