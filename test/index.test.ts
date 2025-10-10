import type { Server } from "node:http";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createDownload } from "../src";
import { createMock, MOCK_HASH } from "./http-mock";
import httpDriver from "../src/drivers/http";

describe("undownload", () => {
  let server: Server;
  let serverPort: number;

  beforeAll(async () => {
    return new Promise<void>((resolve) => {
      server = createMock();
      server.listen(0, () => {
        const address = server.address();
        serverPort =
          typeof address === "object" && address ? address.port : 3000;
        resolve();
      });
    });
  });

  afterAll(() => {
    server?.close();
  });

  it("should download the test file and validate its content", async () => {
    const download = createDownload({
      driver: httpDriver({
        url: `http://localhost:${serverPort}`,
      }),
    });

    await download.promise;
    const isValid = await download.validate("sha256", MOCK_HASH);
    await download.remove();

    expect(isValid).toBe(true);
  });

  it("should prevent redownloading if file is complete", async () => {
    const download = createDownload({
      driver: httpDriver({
        url: `http://localhost:${serverPort}`,
      }),
    });

    await download.promise;
    await download.start();

    const isValid = await download.validate("sha256", MOCK_HASH);
    await download.remove();

    expect(isValid).toBe(true);
  });

  it("should stop an ongoing download", async () => {
    const download = createDownload({
      driver: httpDriver({
        url: `http://localhost:${serverPort}`,
      }),
      immediate: false,
    });

    download.on("data", download.stop);
    await download.start();

    expect(download.status()).toBe("idle");
    expect(download.promise).toBeUndefined();

    await download.remove();
  });

  it("should be able to stop and restart the download", async () => {
    const download = createDownload({
      driver: httpDriver({
        url: `http://localhost:${serverPort}`,
      }),
      immediate: false,
    });

    let size = 0;
    download.on("data", (chunk) => {
      size += chunk.length;
      if (size >= 20) {
        size = 0;
        download.stop();
      }
    });

    await download.start();
    await download.start();
    const isValid = await download.validate("sha256", MOCK_HASH);
    await download.remove();

    expect(isValid).toBe(true);
  });

  it("should handle server errors gracefully", async () => {
    const download = createDownload({
      driver: httpDriver({
        url: `http://localhost:${serverPort}/error`,
      }),
      immediate: false,
    });

    try {
      await download.start();
      expect(download.status()).not.toBe("complete");
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(download.status()).toBe("error");
    } finally {
      await download.remove();
    }
  });

  it("should handle invalide hash algorithm", async () => {
    const download = createDownload({
      driver: httpDriver({
        url: `http://localhost:${serverPort}`,
      }),
    });

    await download.promise;
    const isValid = await download.validate("invalid", MOCK_HASH);
    await download.remove();
    expect(isValid).toBe(false);
  });
});
