import { describe, it, expect, beforeEach } from "vitest";
import { A2AClient } from "../../../src/a2a/client.js";
import {
  A2AConnectionError,
  A2AProtocolError,
  A2ATimeoutError,
} from "../../../src/a2a/errors.js";
import { RPC_ERRORS } from "../../../src/a2a/types.js";
import {
  createMockFetch,
  jsonResponse,
  sseResponse,
  makeAgentCard,
  makeTask,
  rpcSuccess,
  rpcError,
} from "../../helpers/mock-fetch.js";

const BASE_URL = "http://localhost:3000";

describe("A2AClient", () => {
  let mockFetch: ReturnType<typeof createMockFetch>;
  let client: A2AClient;

  beforeEach(() => {
    mockFetch = createMockFetch();
    client = new A2AClient({
      baseUrl: BASE_URL,
      fetch: mockFetch,
      timeout: 5_000,
      maxRetries: 0, // disable retries for faster tests
    });
  });

  describe("connect()", () => {
    it("fetches and caches agent card", async () => {
      const card = makeAgentCard();
      mockFetch.mockResolvedValue(jsonResponse(card));

      const result = await client.connect();

      expect(result).toEqual(card);
      expect(client.agentCard).toEqual(card);
    });

    it("returns cached card on subsequent calls", async () => {
      mockFetch.mockResolvedValue(jsonResponse(makeAgentCard()));

      await client.connect();
      await client.connect();

      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it("force-refreshes when opts.force is true", async () => {
      mockFetch
        .mockResolvedValueOnce(jsonResponse(makeAgentCard()))
        .mockResolvedValueOnce(jsonResponse(makeAgentCard()));

      await client.connect();
      await client.connect({ force: true });

      expect(mockFetch).toHaveBeenCalledTimes(2);
    });

    it("agentCard is null before connect", () => {
      expect(client.agentCard).toBeNull();
    });
  });

  describe("sendTask()", () => {
    it("sends message/send RPC and returns task", async () => {
      const task = makeTask();
      mockFetch.mockResolvedValue(jsonResponse(rpcSuccess(1, task)));

      const result = await client.sendTask({ skill: "echo", input: { message: "hi" } });

      expect(result).toEqual(task);
      expect(mockFetch).toHaveBeenCalledWith(
        BASE_URL,
        expect.objectContaining({
          method: "POST",
          body: expect.stringContaining('"method":"message/send"'),
        }),
      );
    });

    it("sends Authorization header when authToken is set", async () => {
      const authedClient = new A2AClient({
        baseUrl: BASE_URL,
        fetch: mockFetch,
        authToken: "secret",
        maxRetries: 0,
      });
      mockFetch.mockResolvedValue(jsonResponse(rpcSuccess(1, makeTask())));

      await authedClient.sendTask({ skill: "echo", input: {} });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({ Authorization: "Bearer secret" }),
        }),
      );
    });

    it("throws A2AProtocolError on RPC error response", async () => {
      mockFetch.mockResolvedValue(
        jsonResponse(rpcError(1, RPC_ERRORS.SKILL_NOT_FOUND, "Skill 'nope' not found")),
      );

      await expect(
        client.sendTask({ skill: "nope", input: {} }),
      ).rejects.toThrow(A2AProtocolError);
    });

    it("increments request IDs", async () => {
      mockFetch
        .mockResolvedValueOnce(jsonResponse(rpcSuccess(1, makeTask())))
        .mockResolvedValueOnce(jsonResponse(rpcSuccess(2, makeTask())));

      await client.sendTask({ skill: "echo", input: {} });
      await client.sendTask({ skill: "echo", input: {} });

      const body1 = JSON.parse(mockFetch.mock.calls[0]![1]!.body as string) as { id: number };
      const body2 = JSON.parse(mockFetch.mock.calls[1]![1]!.body as string) as { id: number };
      expect(body2.id).toBe(body1.id + 1);
    });
  });

  describe("getTask()", () => {
    it("sends tasks/get RPC and returns task", async () => {
      const task = makeTask({ id: "abc-123" });
      mockFetch.mockResolvedValue(jsonResponse(rpcSuccess(1, task)));

      const result = await client.getTask({ id: "abc-123" });

      expect(result.id).toBe("abc-123");
      expect(mockFetch).toHaveBeenCalledWith(
        BASE_URL,
        expect.objectContaining({
          body: expect.stringContaining('"method":"tasks/get"'),
        }),
      );
    });

    it("throws A2AProtocolError when task not found", async () => {
      mockFetch.mockResolvedValue(
        jsonResponse(rpcError(1, RPC_ERRORS.TASK_NOT_FOUND, "Task not found")),
      );

      await expect(client.getTask({ id: "nope" })).rejects.toThrow(A2AProtocolError);
    });
  });

  describe("cancelTask()", () => {
    it("sends tasks/cancel RPC and returns updated task", async () => {
      const task = makeTask({ status: "canceled" });
      mockFetch.mockResolvedValue(jsonResponse(rpcSuccess(1, task)));

      const result = await client.cancelTask({ id: "task-1" });

      expect(result.status).toBe("canceled");
    });
  });

  describe("subscribe()", () => {
    it("yields SSE events from event stream", async () => {
      const events = [
        { event: "status", data: { status: "working" } },
        { event: "result", data: makeTask() },
      ];
      mockFetch.mockResolvedValue(sseResponse(events));

      const collected = [];
      for await (const event of client.subscribe({ skill: "echo", input: {} })) {
        collected.push(event);
      }

      expect(collected).toHaveLength(2);
      expect(collected[0]!.event).toBe("status");
      expect(collected[1]!.event).toBe("result");
    });

    it("gracefully handles JSON fallback when server returns application/json", async () => {
      const task = makeTask();
      mockFetch.mockResolvedValue(jsonResponse(rpcSuccess(1, task)));

      const gen = client.subscribe({ skill: "echo", input: {} });
      const result = await gen.next();

      // Generator returns the task as its return value
      expect(result.done).toBe(true);
      expect(result.value).toEqual(task);
    });

    it("throws A2AProtocolError on JSON-RPC error in SSE fallback", async () => {
      mockFetch.mockResolvedValue(
        jsonResponse(rpcError(1, RPC_ERRORS.SKILL_NOT_FOUND, "not found")),
      );

      const gen = client.subscribe({ skill: "nope", input: {} });
      await expect(gen.next()).rejects.toThrow(A2AProtocolError);
    });
  });

  describe("retry behavior", () => {
    it("retries on network errors", async () => {
      const retryClient = new A2AClient({
        baseUrl: BASE_URL,
        fetch: mockFetch,
        maxRetries: 2,
        timeout: 5_000,
      });

      // Mock _delay to avoid actual waits
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (retryClient as any)._delay = () => Promise.resolve();

      mockFetch
        .mockRejectedValueOnce(new TypeError("fetch failed"))
        .mockRejectedValueOnce(new TypeError("fetch failed"))
        .mockResolvedValueOnce(jsonResponse(rpcSuccess(1, makeTask())));

      const result = await retryClient.sendTask({ skill: "echo", input: {} });
      expect(result.status).toBe("completed");
      expect(mockFetch).toHaveBeenCalledTimes(3);
    });

    it("does not retry A2AProtocolError", async () => {
      const retryClient = new A2AClient({
        baseUrl: BASE_URL,
        fetch: mockFetch,
        maxRetries: 2,
        timeout: 5_000,
      });

      mockFetch.mockResolvedValue(
        jsonResponse(rpcError(1, RPC_ERRORS.SKILL_NOT_FOUND, "not found")),
      );

      await expect(
        retryClient.sendTask({ skill: "nope", input: {} }),
      ).rejects.toThrow(A2AProtocolError);
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it("throws after all retries exhausted", async () => {
      const retryClient = new A2AClient({
        baseUrl: BASE_URL,
        fetch: mockFetch,
        maxRetries: 1,
        timeout: 5_000,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (retryClient as any)._delay = () => Promise.resolve();

      mockFetch.mockRejectedValue(new TypeError("fetch failed"));

      await expect(
        retryClient.sendTask({ skill: "echo", input: {} }),
      ).rejects.toThrow(A2AConnectionError);
      expect(mockFetch).toHaveBeenCalledTimes(2); // initial + 1 retry
    });
  });

  describe("timeout", () => {
    it("throws A2ATimeoutError when request times out", async () => {
      const slowClient = new A2AClient({
        baseUrl: BASE_URL,
        fetch: mockFetch,
        timeout: 10,
        maxRetries: 0,
      });

      mockFetch.mockImplementation((_url, init) => {
        return new Promise((_resolve, reject) => {
          const signal = init?.signal;
          if (signal) {
            signal.addEventListener("abort", () => {
              reject(new DOMException("The operation was aborted.", "AbortError"));
            });
          }
        });
      });

      await expect(
        slowClient.sendTask({ skill: "echo", input: {} }),
      ).rejects.toThrow(A2ATimeoutError);
    });
  });

  describe("error hierarchy", () => {
    it("A2AProtocolError is instanceof A2AError and SdkError", async () => {
      mockFetch.mockResolvedValue(
        jsonResponse(rpcError(1, RPC_ERRORS.INTERNAL_ERROR, "boom")),
      );

      try {
        await client.sendTask({ skill: "echo", input: {} });
        expect.fail("should have thrown");
      } catch (e) {
        const { SdkError } = await import("../../../src/errors/index.js");
        const { A2AError } = await import("../../../src/a2a/errors.js");
        expect(e).toBeInstanceOf(A2AError);
        expect(e).toBeInstanceOf(SdkError);
        expect(e).toBeInstanceOf(A2AProtocolError);
      }
    });
  });
});
