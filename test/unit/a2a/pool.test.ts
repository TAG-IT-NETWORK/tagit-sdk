import { describe, it, expect, beforeEach } from "vitest";
import { A2AClientPool } from "../../../src/a2a/pool.js";
import { A2AClient } from "../../../src/a2a/client.js";
import { createMockFetch } from "../../helpers/mock-fetch.js";

describe("A2AClientPool", () => {
  let pool: A2AClientPool;

  beforeEach(() => {
    pool = new A2AClientPool({ fetch: createMockFetch() });
  });

  it("creates a new client for unknown URL", () => {
    const client = pool.get("http://localhost:3000");
    expect(client).toBeInstanceOf(A2AClient);
  });

  it("returns same client for same URL", () => {
    const a = pool.get("http://localhost:3000");
    const b = pool.get("http://localhost:3000");
    expect(a).toBe(b);
  });

  it("normalizes trailing slashes", () => {
    const a = pool.get("http://localhost:3000/");
    const b = pool.get("http://localhost:3000");
    expect(a).toBe(b);
  });

  it("creates separate clients for different URLs", () => {
    const a = pool.get("http://localhost:3000");
    const b = pool.get("http://localhost:4000");
    expect(a).not.toBe(b);
    expect(pool.size).toBe(2);
  });

  it("has() checks for existing clients", () => {
    expect(pool.has("http://localhost:3000")).toBe(false);
    pool.get("http://localhost:3000");
    expect(pool.has("http://localhost:3000")).toBe(true);
  });

  it("remove() deletes a client", () => {
    pool.get("http://localhost:3000");
    expect(pool.remove("http://localhost:3000")).toBe(true);
    expect(pool.has("http://localhost:3000")).toBe(false);
    expect(pool.size).toBe(0);
  });

  it("clear() removes all clients", () => {
    pool.get("http://localhost:3000");
    pool.get("http://localhost:4000");
    pool.clear();
    expect(pool.size).toBe(0);
  });

  it("urls() returns all registered URLs", () => {
    pool.get("http://localhost:3000");
    pool.get("http://localhost:4000");
    expect(pool.urls()).toEqual(
      expect.arrayContaining(["http://localhost:3000", "http://localhost:4000"]),
    );
  });
});
