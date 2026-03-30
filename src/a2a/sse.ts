import type { SSEEvent } from "./types.js";

/**
 * Parse an SSE stream (`text/event-stream`) into an async generator of events.
 *
 * Wire format:
 * ```
 * event: <name>\n
 * data: <json>\n
 * \n
 * ```
 *
 * Data payloads are JSON-parsed when possible; raw strings are yielded otherwise.
 * The stream reader is released in a `finally` block to prevent resource leaks.
 *
 * @param stream - A `ReadableStream<Uint8Array>` from a fetch response body.
 * @returns An async generator yielding {@link SSEEvent} objects.
 */
export async function* parseSSEStream(
  stream: ReadableStream<Uint8Array>,
): AsyncGenerator<SSEEvent, void, undefined> {
  const decoder = new TextDecoder();
  const reader = stream.getReader();

  let buffer = "";
  let currentEvent = "";
  let currentData = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      const lines = buffer.split("\n");
      // Keep the last (possibly incomplete) line in the buffer
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        if (line.startsWith("event: ")) {
          currentEvent = line.slice(7).trim();
        } else if (line.startsWith("data: ")) {
          currentData = line.slice(6);
        } else if (line === "") {
          // Empty line = end of event
          if (currentEvent && currentData) {
            let parsed: unknown;
            try {
              parsed = JSON.parse(currentData);
            } catch {
              parsed = currentData;
            }
            yield { event: currentEvent, data: parsed };
          }
          currentEvent = "";
          currentData = "";
        }
      }
    }

    // Process any remaining data in buffer (stream ended without trailing \n)
    if (buffer) {
      if (buffer.startsWith("event: ")) {
        currentEvent = buffer.slice(7).trim();
      } else if (buffer.startsWith("data: ")) {
        currentData = buffer.slice(6);
      }
    }

    // Flush any remaining event
    if (currentEvent && currentData) {
      let parsed: unknown;
      try {
        parsed = JSON.parse(currentData);
      } catch {
        parsed = currentData;
      }
      yield { event: currentEvent, data: parsed };
    }
  } finally {
    reader.releaseLock();
  }
}
