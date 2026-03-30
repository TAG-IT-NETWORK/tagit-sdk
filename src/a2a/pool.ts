import type { A2AClientConfig } from "./types.js";
import { A2AClient } from "./client.js";

/**
 * Connection pool that caches {@link A2AClient} instances by base URL.
 *
 * Re-uses existing clients for repeated calls to the same agent endpoint,
 * reducing overhead from repeated agent card fetches and TLS handshakes.
 */
export class A2AClientPool {
  private readonly _clients = new Map<string, A2AClient>();
  private readonly _defaults: Omit<A2AClientConfig, "baseUrl">;

  /**
   * @param defaults - Default config applied to every client created by the pool.
   */
  constructor(defaults: Omit<A2AClientConfig, "baseUrl"> = {}) {
    this._defaults = defaults;
  }

  /**
   * Get or create an {@link A2AClient} for the given base URL.
   *
   * @param baseUrl - The agent's base URL.
   * @param overrides - Per-client config overrides merged on top of pool defaults.
   * @returns A cached or newly created A2AClient.
   */
  get(baseUrl: string, overrides?: Partial<A2AClientConfig>): A2AClient {
    const key = baseUrl.replace(/\/+$/, "");
    const existing = this._clients.get(key);
    if (existing) return existing;

    const client = new A2AClient({
      ...this._defaults,
      ...overrides,
      baseUrl: key,
    });
    this._clients.set(key, client);
    return client;
  }

  /**
   * Check whether a client for the given URL is cached.
   *
   * @param baseUrl - The agent's base URL.
   * @returns `true` if a client exists in the pool.
   */
  has(baseUrl: string): boolean {
    return this._clients.has(baseUrl.replace(/\/+$/, ""));
  }

  /**
   * Remove a cached client from the pool.
   *
   * @param baseUrl - The agent's base URL.
   * @returns `true` if a client was found and removed.
   */
  remove(baseUrl: string): boolean {
    return this._clients.delete(baseUrl.replace(/\/+$/, ""));
  }

  /** Remove all cached clients from the pool. */
  clear(): void {
    this._clients.clear();
  }

  /** The number of clients currently in the pool. */
  get size(): number {
    return this._clients.size;
  }

  /** List all base URLs of clients currently in the pool. */
  urls(): string[] {
    return [...this._clients.keys()];
  }
}
