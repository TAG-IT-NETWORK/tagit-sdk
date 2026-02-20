import type { A2AClientConfig } from "./types.js";
import { A2AClient } from "./client.js";

export class A2AClientPool {
  private readonly _clients = new Map<string, A2AClient>();
  private readonly _defaults: Omit<A2AClientConfig, "baseUrl">;

  constructor(defaults: Omit<A2AClientConfig, "baseUrl"> = {}) {
    this._defaults = defaults;
  }

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

  has(baseUrl: string): boolean {
    return this._clients.has(baseUrl.replace(/\/+$/, ""));
  }

  remove(baseUrl: string): boolean {
    return this._clients.delete(baseUrl.replace(/\/+$/, ""));
  }

  clear(): void {
    this._clients.clear();
  }

  get size(): number {
    return this._clients.size;
  }

  urls(): string[] {
    return [...this._clients.keys()];
  }
}
