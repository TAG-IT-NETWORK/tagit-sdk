import { describe, it, expect, beforeEach } from "vitest";
import { fetchAgentCard } from "../../../src/a2a/agent-card.js";
import { A2AConnectionError, A2ATimeoutError } from "../../../src/a2a/errors.js";
import { createMockFetch, jsonResponse, makeAgentCard } from "../../helpers/mock-fetch.js";

describe("fetchAgentCard", () => {
  let mockFetch: ReturnType<typeof createMockFetch>;

  beforeEach(() => {
    mockFetch = createMockFetch();
  });

  it("fetches and validates agent card from well-known URL", async () => {
    const card = makeAgentCard();
    mockFetch.mockResolvedValue(jsonResponse(card));

    const result = await fetchAgentCard("http://localhost:3000", { fetch: mockFetch });

    expect(result).toEqual(card);
    expect(mockFetch).toHaveBeenCalledWith(
      "http://localhost:3000/.well-known/agent.json",
      expect.objectContaining({ method: "GET" }),
    );
  });

  it("strips trailing slash from baseUrl", async () => {
    mockFetch.mockResolvedValue(jsonResponse(makeAgentCard()));

    await fetchAgentCard("http://localhost:3000/", { fetch: mockFetch });

    expect(mockFetch).toHaveBeenCalledWith(
      "http://localhost:3000/.well-known/agent.json",
      expect.anything(),
    );
  });

  it("sends Authorization header when authToken provided", async () => {
    mockFetch.mockResolvedValue(jsonResponse(makeAgentCard()));

    await fetchAgentCard("http://localhost:3000", {
      fetch: mockFetch,
      authToken: "my-token",
    });

    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: "Bearer my-token" }),
      }),
    );
  });

  it("throws A2AConnectionError on non-OK response", async () => {
    mockFetch.mockResolvedValue(jsonResponse({ error: "not found" }, 404));

    await expect(
      fetchAgentCard("http://localhost:3000", { fetch: mockFetch }),
    ).rejects.toThrow(A2AConnectionError);
  });

  it("throws A2AConnectionError on network error", async () => {
    mockFetch.mockRejectedValue(new TypeError("fetch failed"));

    await expect(
      fetchAgentCard("http://localhost:3000", { fetch: mockFetch }),
    ).rejects.toThrow(A2AConnectionError);
  });

  it("throws A2ATimeoutError on abort", async () => {
    mockFetch.mockImplementation((_url, init) => {
      return new Promise((_resolve, reject) => {
        const signal = init?.signal;
        if (signal) {
          signal.addEventListener("abort", () => {
            const err = new DOMException("The operation was aborted.", "AbortError");
            reject(err);
          });
        }
      });
    });

    await expect(
      fetchAgentCard("http://localhost:3000", { fetch: mockFetch, timeout: 10 }),
    ).rejects.toThrow(A2ATimeoutError);
  });

  it("throws on invalid agent card data (zod validation)", async () => {
    mockFetch.mockResolvedValue(jsonResponse({ name: "Test" })); // missing fields

    await expect(
      fetchAgentCard("http://localhost:3000", { fetch: mockFetch }),
    ).rejects.toThrow(); // ZodError wrapped in A2AConnectionError
  });
});
