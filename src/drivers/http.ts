import { defineDriver } from "./utils";
import { Readable } from "node:stream";

export interface HTTPOptions extends RequestInit {
  url: string;
}

export default defineDriver((opts: HTTPOptions) => {
  return {
    name: "http",
    async download(offset?: number) {
      const { body } = await fetch(opts.url, {
        ...opts,
        headers: { Range: `bytes=${offset}-` },
      });
      if (!body) throw new Error("Response body is empty");
      return Readable.fromWeb(body);
    },
    async size() {
      const head = await fetch(opts.url, { ...opts, method: "HEAD" });
      const length = head.headers.get("proxy-content-length") || head.headers.get("content-length");
      return length
        ? Number.parseInt(length, 10)
        : Promise.reject(
            new Error("Content-Length header is missing or invalid"),
          );
    },
  };
});
