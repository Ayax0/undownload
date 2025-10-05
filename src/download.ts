import type { Driver } from "./types.ts";
import type { Readable, Writable } from "node:stream";
import { createWriteStream, stat, statSync } from "node:fs";
import { join } from "node:path";
import { pipeline } from "node:stream/promises";
import { randomUUID } from "node:crypto";
import { EventEmitter } from "node:stream";

export interface CreateDownloadOptions {
  driver: Driver;
  key?: string;
  base?: string;
}

export interface DownloadEvents {
  data: [any];
  end: [];
  error: [Error];
}

export type DownloadStatus = "idle" | "pending" | "error" | "complete";

export interface Download {
  promise: Promise<void>;
  on<U extends keyof DownloadEvents>(
    event: U,
    listener: (...args: DownloadEvents[U]) => void,
  ): void;
  off<U extends keyof DownloadEvents>(
    event: U,
    listener: (...args: DownloadEvents[U]) => void,
  ): void;
  stop(): void;
  status(): DownloadStatus;
}

export function createDownload(opts: CreateDownloadOptions): Download {
  const { driver, base, key } = opts;

  const path = join(
    base ?? ".data/resource/.cache",
    key ?? randomUUID().toString(),
  );

  let status: DownloadStatus = "idle";
  const controller = new AbortController();
  const events = new EventEmitter<DownloadEvents>();

  async function run() {
    // Check if file exists and is complete
    const meta = statSync(path, { throwIfNoEntry: false });
    if (meta && meta.size > 0) {
      const remoteSize = await opts.driver.size();
      if (meta.size === remoteSize) {
        events.emit("end");
        status = "complete";
        return;
      }
    }

    // Start download
    status = "pending";
    let rs: Readable | undefined;
    let ws: Writable | undefined;

    try {
      ws = createWriteStream(path, { flags: "a" });
      rs = await driver.download(meta?.size);
      rs.on("data", (chunk) => events.emit("data", chunk));
      rs.on("end", () => {
        events.emit("end");
        status = "complete";
      });

      await pipeline(rs, ws, { signal: controller.signal });
    } catch (error) {
      if (!(error instanceof Error)) return;
      if (controller.signal.aborted && isAbortError(error)) return;
      controller.abort();
      events.emit("error", error);
      status = "error";
    }
  }

  const promise = run();

  return {
    promise,
    on: events.on.bind(events),
    off: events.off.bind(events),
    stop: controller.abort.bind(controller),
    status: () => status,
  };
}

function isAbortError(err: any) {
  return (
    err?.name === "AbortError" ||
    err?.code === "ABORT_ERR" ||
    (typeof err?.message === "string" && /aborted|abort/i.test(err.message))
  );
}
