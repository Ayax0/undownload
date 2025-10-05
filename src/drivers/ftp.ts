import { Readable } from "node:stream";
import { defineDriver } from "./utils";
import Client from "ftp";

export interface FTPOptions extends Client.Options {
  path: string;
}

export default defineDriver((opts: FTPOptions) => {
  return {
    name: "ftp",
    download(offset?: number) {
      const client = new Client();
      return new Promise<Readable>((resolve, reject) => {
        client.on("ready", () => {
          if (offset) client.restart(offset, (error) => error && reject(error));

          client.get(opts.path, (err, stream) => {
            if (err) return reject(err);
            stream.on("close", () => client.end());
            resolve(Readable.from(stream));
          });
        });

        client.on("error", (err) => reject(err));
        client.connect(opts);
      });
    },
    size() {
      return new Promise<number>((resolve, reject) => {
        const client = new Client();
        client.on("ready", () => {
          client.size(opts.path, (err, size) => {
            client.end();
            if (err) return reject(err);
            resolve(size);
          });
        });

        client.on("error", (err) => reject(err));
        client.connect(opts);
      });
    },
  };
});
