import { defineDriver } from "./utils/index.ts";
import { Readable } from "node:stream";

export const DRIVER_NAME = "http";

export interface HTTPOptions extends RequestInit {
  path: string;
}

export default defineDriver((opts: HTTPOptions) => {
  return {
    name: DRIVER_NAME,
    async download(offset?: number) {
      const { body } = await fetch(opts.path, {
        ...opts,
        headers: { Range: `bytes=${offset}-` },
      });
      if (!body) throw new Error("Response body is empty");
      return Readable.fromWeb(body);
    },
    async size() {
      const head = await fetch(opts.path, { method: "HEAD" });
      const length = head.headers.get("content-length");
      return length
        ? Number.parseInt(length, 10)
        : Promise.reject(
            new Error("Content-Length header is missing or invalid"),
          );
    },
  };
});
