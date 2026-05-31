# @tagit/sdk

TypeScript SDK and CLI for interacting with TAGIT ERC-8004 agent contracts on OP Sepolia.

## Installation

```bash
npm install @tagit/sdk
```

## Quick Start

```typescript
import { createAgentClient } from "@tagit/sdk";

// Read-only client (no private key needed)
const client = createAgentClient({
  rpcUrl: "https://sepolia.optimism.io",
});

// Read agent data
const agent = await client.identity.getAgent(1n);
console.log(agent.wallet, agent.active);

// Read reputation
const reputation = await client.reputation.getSummary(1n);
console.log(`Rating: ${reputation.averageRating}`);

// Read validation status
const status = await client.validation.getValidationStatus(1n);
console.log(`Validated: ${status.isValidated}`);
```

## Write Operations

Provide a private key to enable write methods:

```typescript
const client = createAgentClient({
  rpcUrl: "https://sepolia.optimism.io",
  privateKey: "0x...",
});

// Register a new agent (returns tx hash)
const hash = await client.identity.register!("0xAgentWallet...", "ipfs://metadata");

// Give feedback (rating 1-5)
await client.reputation.giveFeedback!(1n, 5, "Great agent!");

// Request validation
await client.validation.validationRequest!(1n, false);
```

## Event Watching

```typescript
const unsub = client.events.watchAgentRegistered((logs) => {
  for (const log of logs) {
    console.log(`Agent #${log.agentId} registered by ${log.registrant}`);
  }
});

// Stop watching
unsub();
```

## API Reference

### `createAgentClient(config?)`

Creates a client instance. Config options:

| Option | Type | Description |
|--------|------|-------------|
| `chain` | `Chain` | Viem chain definition (default: OP Sepolia) |
| `rpcUrl` | `string` | RPC endpoint URL |
| `privateKey` | `` `0x${string}` `` | Private key for write operations |
| `publicClient` | `PublicClient` | Custom viem public client |
| `walletClient` | `WalletClient` | Custom viem wallet client |

### Identity Methods

| Method | Args | Returns | Write? |
|--------|------|---------|--------|
| `getAgent` | `agentId: bigint` | `{ registrant, wallet, registeredAt, active }` | No |
| `getAgentStatus` | `agentId: bigint` | `number` | No |
| `getAgentByWallet` | `wallet: Address` | `bigint` | No |
| `getAgentsByRegistrant` | `registrant: Address` | `bigint[]` | No |
| `getMetadata` | `agentId: bigint, key: string` | `string` | No |
| `isActiveAgent` | `agentId: bigint` | `boolean` | No |
| `totalAgents` | — | `bigint` | No |
| `registrationFee` | — | `bigint` | No |
| `tokenURI` | `agentId: bigint` | `string` | No |
| `register` | `wallet, uri, value?` | `0x${string}` | Yes |
| `setAgentURI` | `agentId, uri` | `0x${string}` | Yes |
| `setMetadata` | `agentId, key, value` | `0x${string}` | Yes |
| `suspendAgent` | `agentId` | `0x${string}` | Yes |
| `reactivateAgent` | `agentId` | `0x${string}` | Yes |
| `decommissionAgent` | `agentId` | `0x${string}` | Yes |

### Reputation Methods

| Method | Args | Returns | Write? |
|--------|------|---------|--------|
| `getSummary` | `agentId: bigint` | `ReputationSummary` | No |
| `getFeedback` | `feedbackId: bigint` | `Feedback` | No |
| `readAllFeedback` | `agentId: bigint` | `Feedback[]` | No |
| `getAgentFeedbackIds` | `agentId: bigint` | `bigint[]` | No |
| `getReviewerFeedback` | `reviewer, agentId` | `bigint` | No |
| `giveFeedback` | `agentId, rating, comment` | `0x${string}` | Yes |
| `revokeFeedback` | `feedbackId` | `0x${string}` | Yes |
| `appendResponse` | `feedbackId, responseText` | `0x${string}` | Yes |

### Validation Methods

| Method | Args | Returns | Write? |
|--------|------|---------|--------|
| `getRequest` | `requestId: bigint` | `ValidationRequest` | No |
| `getSummary` | `agentId: bigint` | `ValidationSummary` | No |
| `getValidationStatus` | `agentId: bigint` | `ValidationStatus` | No |
| `getResponses` | `requestId: bigint` | `ValidatorResponse[]` | No |
| `getAgentRequests` | `agentId: bigint` | `bigint[]` | No |
| `getValidatorStats` | `validator: Address` | `ValidatorStats` | No |
| `hasValidatorResponded` | `requestId, validator` | `boolean` | No |
| `validationRequest` | `agentId, isDefense` | `0x${string}` | Yes |
| `validationResponse` | `requestId, score, justification` | `0x${string}` | Yes |

## A2A Client

Typed client for TAGIT A2A agent servers (JSON-RPC 2.0). No extra dependencies — uses native `fetch()`.

```typescript
// Import from dedicated subpath (no viem dependency)
import { A2AClient } from "@tagit/sdk/a2a";

const client = new A2AClient({
  baseUrl: "http://localhost:3000",
  authToken: "optional-bearer-token",
  timeout: 30_000,    // default
  maxRetries: 3,      // default, exponential backoff
});

// Discover agent capabilities
const card = await client.connect();
console.log(card.name, card.skills);

// Send a task
const task = await client.sendTask({
  skill: "echo",
  input: { message: "hello" },
});
console.log(task.status, task.output);

// Get task by ID
const fetched = await client.getTask({ id: task.id });

// Cancel a running task
const canceled = await client.cancelTask({ id: task.id });

// SSE streaming
for await (const event of client.subscribe({ skill: "echo", input: {} })) {
  console.log(event.event, event.data);
}
```

### Connection Pooling

```typescript
import { A2AClientPool } from "@tagit/sdk/a2a";

const pool = new A2AClientPool({ timeout: 10_000 });
const client = pool.get("http://localhost:3000"); // reuses existing
```

### A2A Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `connect(opts?)` | `AgentCard` | Fetch + cache agent card |
| `sendTask(params)` | `A2ATask` | Send `message/send` RPC |
| `getTask({ id })` | `A2ATask` | Retrieve task by ID |
| `cancelTask({ id })` | `A2ATask` | Cancel a running task |
| `subscribe(params)` | `AsyncGenerator<SSEEvent>` | SSE streaming |

## CLI Usage

```bash
# Install globally
npm install -g @tagit/sdk

# Get agent info (read-only)
tagit agent info --agent-id 1

# Get agent info as JSON
tagit agent info --agent-id 1 --json

# Register a new agent
tagit agent register --wallet 0x... --uri ipfs://... --private-key 0x...

# Give feedback
tagit agent feedback --agent-id 1 --rating 5 --comment "Great!" --private-key 0x...

# Request validation
tagit agent validate --agent-id 1 --private-key 0x...

# Request defense-level validation
tagit agent validate --agent-id 1 --defense --private-key 0x...
```

### Environment Variables

| Variable | Description |
|----------|-------------|
| `TAGIT_RPC_URL` | Default RPC endpoint |
| `TAGIT_PRIVATE_KEY` | Default private key for write operations |

## Contract Addresses (OP Sepolia)

| Contract | Address |
|----------|---------|
| TAGITAgentIdentity | `0xA7f34FD595eBc397Fe04DcE012dbcf0fbbD2A78D` |
| TAGITAgentReputation | `0x57CCa1974DFE29593FBD24fdAEE1cD614Bfd6E4a` |
| TAGITAgentValidation | `0x9806919185F98Bd07a64F7BC7F264e91939e86b7` |

## Development

```bash
npm install
npm run typecheck   # Type-check
npm test            # Run tests
npm run build       # Build to dist/
```

## License

MIT
