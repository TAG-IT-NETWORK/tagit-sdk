import { describe, it, expect } from "vitest";
import { parseSSEStream } from "../../../src/a2a/sse.js";

function makeStream(text: string): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  return new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode(text));
      controller.close();
    },
  });
}

function makeChunkedStream(chunks: string[]): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  return new ReadableStream({
    start(controller) {
      for (const chunk of chunks) {
        controller.enqueue(encoder.encode(chunk));
      }
      controller.close();
    },
  });
}

async function collectEvents(stream: ReadableStream<Uint8Array>) {
  const events = [];
  for await (const event of parseSSEStream(stream)) {
    events.push(event);
  }
  return events;
}

describe("parseSSEStream", () => {
  it("parses a single SSE event", async () => {
    const stream = makeStream('event: status\ndata: {"status":"working"}\n\n');
    const events = await collectEvents(stream);

    expect(events).toEqual([{ event: "status", data: { status: "working" } }]);
  });

  it("parses multiple SSE events", async () => {
    const text =
      'event: status\ndata: {"status":"working"}\n\n' +
      'event: result\ndata: {"output":"done"}\n\n';
    const events = await collectEvents(makeStream(text));

    expect(events).toHaveLength(2);
    expect(events[0]).toEqual({ event: "status", data: { status: "working" } });
    expect(events[1]).toEqual({ event: "result", data: { output: "done" } });
  });

  it("handles chunked delivery across event boundaries", async () => {
    const stream = makeChunkedStream([
      'event: stat',
      'us\ndata: {"s":"w"}\n\n',
      'event: done\ndata: {"s":"c"}\n\n',
    ]);
    const events = await collectEvents(stream);

    expect(events).toHaveLength(2);
    expect(events[0]).toEqual({ event: "status", data: { s: "w" } });
    expect(events[1]).toEqual({ event: "done", data: { s: "c" } });
  });

  it("handles non-JSON data as raw string", async () => {
    const stream = makeStream('event: message\ndata: plain text\n\n');
    const events = await collectEvents(stream);

    expect(events).toEqual([{ event: "message", data: "plain text" }]);
  });

  it("ignores lines without event or data prefix", async () => {
    const stream = makeStream('comment line\nevent: test\ndata: "hello"\n\n');
    const events = await collectEvents(stream);

    expect(events).toEqual([{ event: "test", data: "hello" }]);
  });

  it("skips events with missing data", async () => {
    const stream = makeStream('event: no-data\n\nevent: with-data\ndata: "ok"\n\n');
    const events = await collectEvents(stream);

    expect(events).toEqual([{ event: "with-data", data: "ok" }]);
  });

  it("skips events with missing event name", async () => {
    const stream = makeStream('data: "orphan"\n\nevent: named\ndata: "ok"\n\n');
    const events = await collectEvents(stream);

    expect(events).toEqual([{ event: "named", data: "ok" }]);
  });

  it("flushes remaining event at end of stream", async () => {
    // No trailing \n\n
    const stream = makeStream('event: final\ndata: {"done":true}');
    const events = await collectEvents(stream);

    expect(events).toEqual([{ event: "final", data: { done: true } }]);
  });

  it("yields nothing for empty stream", async () => {
    const stream = makeStream("");
    const events = await collectEvents(stream);

    expect(events).toEqual([]);
  });
});
