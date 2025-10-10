import type { Driver } from "./types.ts";
import type { Readable, Writable } from "node:stream";
import { join } from "node:path";
import { pipeline } from "node:stream/promises";
import { EventEmitter } from "node:events";
import { createHash, randomUUID } from "node:crypto";
import {
  createReadStream,
  createWriteStream,
  statSync,
  unlinkSync,
} from "node:fs";
import { unlink } from "node:fs/promises";

export interface CreateDownloadOptions {
  driver: Driver;
  key?: string;
  base?: string;
  immediate?: boolean;
}

export interface DownloadEvents {
  data: [any];
  end: [];
  error: [Error];
}

export type DownloadStatus = "idle" | "pending" | "error" | "complete";

export interface Download {
  promise: Promise<void> | undefined;
  on<U extends keyof DownloadEvents>(
    event: U,
    listener: (...args: DownloadEvents[U]) => void,
  ): void;
  off<U extends keyof DownloadEvents>(
    event: U,
    listener: (...args: DownloadEvents[U]) => void,
  ): void;
  stop(): void;
  start(): Promise<void>;
  status(): DownloadStatus;
  remove(): Promise<void>;
  validate(algorithm: string, hash: string): Promise<boolean>;
}

export function createDownload(opts: CreateDownloadOptions): Download {
  const { driver, base, key } = opts;

  const path = join(
    base ?? ".data/resource/.cache",
    key ?? randomUUID().toString(),
  );

  let status: DownloadStatus = "idle";
  let promise: Promise<void> | undefined;
  const controller = new AbortController();
  const events = new EventEmitter<DownloadEvents>();

  async function run() {
    // Check if file exists and is complete
    const meta = statSync(path, { throwIfNoEntry: false });
    if (meta && meta.size > 0) {
      const remoteSize = await opts.driver.size();

      if (remoteSize < meta.size) unlinkSync(path);
      if (meta.size === remoteSize) {
        status = "complete";
        promise = undefined;
        events.emit("end");
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
        status = "complete";
        promise = undefined;
        events.emit("end");
      });

      await pipeline(rs, ws, { signal: controller.signal });
    } catch (error) {
      if (controller.signal.aborted && isAbortError(error)) return;
      // Normalize non-Error throwables
      const errorObj =
        error instanceof Error ? error : new Error(String(error));

      status = "error";
      promise = undefined;
      controller.abort();
      events.emit("error", errorObj);

      throw errorObj;
    }
  }

  function start() {
    if (status === "pending" && promise) return promise;
    status = "idle";
    promise = run();
    return promise;
  }

  function remove() {
    if (status === "pending") controller.abort();
    status = "idle";
    return unlink(path);
  }

  async function validate(algorithm: string, hash: string) {
    try {
      const hashStream = createHash(algorithm);
      const fileStream = createReadStream(path);

      await pipeline(fileStream, hashStream);
      return hash === hashStream.digest("hex");
    } catch {
      return false;
    }
  }

  promise = opts.immediate === false ? undefined : run();

  return {
    promise,
    on: events.on.bind(events),
    off: events.off.bind(events),
    stop: controller.abort.bind(controller),
    start,
    status: () => status,
    remove,
    validate,
  };
}

function isAbortError(err: any) {
  return (
    err?.name === "AbortError" ||
    err?.code === "ABORT_ERR" ||
    (typeof err?.message === "string" && /aborted|abort/i.test(err.message))
  );
}
