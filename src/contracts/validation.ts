import type { Address, PublicClient, WalletClient } from "viem";
import { agentValidationAbi } from "../abi/agent-validation.js";
import { ContractError } from "../errors/index.js";
import type { ValidationReadMethods, ValidationWriteMethods } from "../types/client.js";

const abi = agentValidationAbi;

/**
 * Create read-only methods for the TAGITAgentValidation contract.
 *
 * @param publicClient - viem public client connected to the target chain.
 * @param address - Deployed TAGITAgentValidation contract address.
 * @returns An object implementing {@link ValidationReadMethods}.
 * @throws {ContractError} When any underlying contract read fails.
 */
export function createValidationReader(
  publicClient: PublicClient,
  address: Address,
): ValidationReadMethods {
  return {
    async getRequest(requestId: bigint) {
      try {
        return await publicClient.readContract({ address, abi, functionName: "getRequest", args: [requestId] });
      } catch (e) {
        throw new ContractError(`getRequest failed: ${e instanceof Error ? e.message : String(e)}`, "TAGITAgentValidation", "getRequest", { cause: e });
      }
    },
    async getSummary(agentId: bigint) {
      try {
        return await publicClient.readContract({ address, abi, functionName: "getSummary", args: [agentId] });
      } catch (e) {
        throw new ContractError(`getSummary failed: ${e instanceof Error ? e.message : String(e)}`, "TAGITAgentValidation", "getSummary", { cause: e });
      }
    },
    async getValidationStatus(agentId: bigint) {
      try {
        const result = await publicClient.readContract({ address, abi, functionName: "getValidationStatus", args: [agentId] });
        return {
          isValidated: result[0],
          latestScore: result[1],
          lastValidatedAt: result[2],
        };
      } catch (e) {
        throw new ContractError(`getValidationStatus failed: ${e instanceof Error ? e.message : String(e)}`, "TAGITAgentValidation", "getValidationStatus", { cause: e });
      }
    },
    async getResponses(requestId: bigint) {
      try {
        return await publicClient.readContract({ address, abi, functionName: "getResponses", args: [requestId] });
      } catch (e) {
        throw new ContractError(`getResponses failed: ${e instanceof Error ? e.message : String(e)}`, "TAGITAgentValidation", "getResponses", { cause: e });
      }
    },
    async getAgentRequests(agentId: bigint) {
      try {
        return await publicClient.readContract({ address, abi, functionName: "getAgentRequests", args: [agentId] });
      } catch (e) {
        throw new ContractError(`getAgentRequests failed: ${e instanceof Error ? e.message : String(e)}`, "TAGITAgentValidation", "getAgentRequests", { cause: e });
      }
    },
    async getValidatorStats(validator: Address) {
      try {
        return await publicClient.readContract({ address, abi, functionName: "getValidatorStats", args: [validator] });
      } catch (e) {
        throw new ContractError(`getValidatorStats failed: ${e instanceof Error ? e.message : String(e)}`, "TAGITAgentValidation", "getValidatorStats", { cause: e });
      }
    },
    async hasValidatorResponded(requestId: bigint, validator: Address) {
      try {
        return await publicClient.readContract({ address, abi, functionName: "hasValidatorResponded", args: [requestId, validator] });
      } catch (e) {
        throw new ContractError(`hasValidatorResponded failed: ${e instanceof Error ? e.message : String(e)}`, "TAGITAgentValidation", "hasValidatorResponded", { cause: e });
      }
    },
  };
}

/**
 * Create write methods for the TAGITAgentValidation contract.
 *
 * Each method simulates the transaction before broadcasting to surface
 * revert reasons as {@link ContractError}.
 *
 * @param walletClient - viem wallet client with an attached account.
 * @param publicClient - viem public client for simulation.
 * @param address - Deployed TAGITAgentValidation contract address.
 * @returns An object implementing {@link ValidationWriteMethods}.
 * @throws {ContractError} When the wallet has no account or a transaction reverts.
 */
export function createValidationWriter(
  walletClient: WalletClient,
  publicClient: PublicClient,
  address: Address,
): ValidationWriteMethods {
  function getAccount() {
    const account = walletClient.account;
    if (!account) throw new ContractError("Wallet client has no account", "TAGITAgentValidation", "getAccount");
    return account;
  }

  return {
    async validationRequest(agentId: bigint, isDefense: boolean) {
      try {
        const { request } = await publicClient.simulateContract({
          address, abi, functionName: "validationRequest", args: [agentId, isDefense], account: getAccount(),
        });
        return walletClient.writeContract(request);
      } catch (e) {
        throw new ContractError(`validationRequest failed: ${e instanceof Error ? e.message : String(e)}`, "TAGITAgentValidation", "validationRequest", { cause: e });
      }
    },
    async validationResponse(requestId: bigint, score: number, justification: string) {
      try {
        const { request } = await publicClient.simulateContract({
          address, abi, functionName: "validationResponse", args: [requestId, score, justification], account: getAccount(),
        });
        return walletClient.writeContract(request);
      } catch (e) {
        throw new ContractError(`validationResponse failed: ${e instanceof Error ? e.message : String(e)}`, "TAGITAgentValidation", "validationResponse", { cause: e });
      }
    },
  };
}
