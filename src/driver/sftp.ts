import { defineDriver } from "./utils/index.ts";
import Client from "ssh2-sftp-client";

export const DRIVER_NAME = "sftp";

export interface SFTPOptions extends Client.ConnectOptions {
  path: string;
}

export default defineDriver((opts: SFTPOptions) => {
  return {
    name: DRIVER_NAME,
    async download(offset?: number) {
      const client = new Client();
      try {
        await client.connect(opts);
        return client
          .createReadStream(opts.path, { start: offset })
          .on("close", () => client.end());
      } catch (error) {
        await client.end();
        throw error;
      }
    },
    async size() {
      const client = new Client();

      try {
        await client.connect(opts);
        return (await client.stat(opts.path)).size;
      } finally {
        await client.end();
      }
    },
  };
});
