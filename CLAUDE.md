# @tagit/sdk

TypeScript SDK for TAGIT ERC-8004 agent contracts.

## Tech Stack
- TypeScript 5.7, ESM (`"type": "module"`, Node16 modules)
- viem ^2.23 for blockchain interaction
- zod ^3.24 for input validation
- commander ^13.1 for CLI
- vitest ^3.0 for testing

## Conventions
- All local imports use `.js` extension (ESM requirement)
- ABIs are `as const satisfies Abi` TypeScript constants
- Write methods return tx hash (`0x${string}`), not receipt
- Event watchers return unsubscribe function (`() => void`)
- Named imports only, strict TypeScript
- CLI is a separate export — no commander dependency leaks into SDK core
- A2A client (`src/a2a/`) is a separate subpath export (`@tagit/sdk/a2a`) — no viem dependency for A2A-only consumers
- A2A errors extend `SdkError` (A2AError → SdkError), so `catch (e instanceof SdkError)` catches both contract and A2A errors
- A2A types mirror `tagit-services/src/a2a/types.ts` exactly — keep in sync
- `fetch` is injectable via config for testability — never mock globals in A2A tests

## Contract Addresses (OP Sepolia)
- TAGITAgentIdentity: `0xA7f34FD595eBc397Fe04DcE012dbcf0fbbD2A78D`
- TAGITAgentReputation: `0x57CCa1974DFE29593FBD24fdAEE1cD614Bfd6E4a`
- TAGITAgentValidation: `0x9806919185F98Bd07a64F7BC7F264e91939e86b7`

## Commands
- `npm run build` — compile TypeScript
- `npm run typecheck` — type-check without emit
- `npm test` — run all tests
- `npm run clean` — remove dist/
