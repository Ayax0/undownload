import { createServer } from "node:http";

export const MOCK_CONTENT = "This is a test file for download.\n";
export const MOCK_HASH =
  "ab8d264697ae0e51963eaf70d7b516016f9029c4447327e303bb47246fdddf69";

export function createMock() {
  return createServer((req, res) => {
    if (req.url === "/error") {
      res.writeHead(500, { "Content-Type": "text/plain" });
      return res.end("Internal Server Error");
    }

    const buffer = Buffer.from(MOCK_CONTENT);

    if (req.method === "HEAD") {
      res.writeHead(200, {
        "Content-Type": "text/plain",
        "Content-Length": buffer.length,
        "Accept-Ranges": "bytes",
      });
      return res.end();
    }

    const range = req.headers.range;
    let start = 0;
    let end = buffer.length - 1;

    if (range) {
      const matches = range.match(/bytes=(\d*)-(\d*)/);
      start = matches && matches[1] ? Number.parseInt(matches[1], 10) : 0;
      end =
        matches && matches[2]
          ? Number.parseInt(matches[2], 10)
          : buffer.length - 1;

      if (start >= buffer.length || end >= buffer.length) {
        res.writeHead(416, {
          "Content-Range": `bytes */${buffer.length}`,
        });
        return res.end();
      }

      res.writeHead(206, {
        "Content-Type": "text/plain",
        "Content-Range": `bytes ${start}-${end}/${buffer.length}`,
        "Content-Length": end - start + 1,
        "Accept-Ranges": "bytes",
      });
    } else {
      res.writeHead(200, {
        "Content-Type": "text/plain",
        "Content-Length": buffer.length,
        "Accept-Ranges": "bytes",
      });
    }

    // Send byte by byte
    let i = start;
    const sendNextByte = () => {
      if (i > end) return res.end();
      res.write(buffer.subarray(i, i + 1));
      i++;
      setImmediate(sendNextByte);
    };
    sendNextByte();
  });
}
