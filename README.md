# undownload

<!-- automd:badges color=yellow -->

[![npm version](https://img.shields.io/npm/v/@nextlvlup/undownload?color=yellow)](https://npmjs.com/package/@nextlvlup/undownload)
[![npm downloads](https://img.shields.io/npm/dm/@nextlvlup/undownload?color=yellow)](https://npm.chart.dev/@nextlvlup/undownload)

<!-- /automd -->

A universal download utility for Node.js.
It provides a simple and flexible interface to download files from the internet using different protocols.
Its driver-based approach allows you to use different protocols with the same underlying syntax and functionality.
This package was inspired by [unstorage](https://github.com/unjs/unstorage).

## Usage

Install the package:

```sh
# ✨ Auto-detect (supports npm, yarn, pnpm, deno and bun)
npx nypm install @nextlvlup/undownload
```

Example:

```ts
import { createDownload } from "@nextlvlup/undownload";
import httpDriver from "@nextlvlup/undownload/drivers/http";
// import ftpDriver from "@nextlvlup/undownload/drivers/ftp";
// import sftpDriver from "@nextlvlup/undownload/drivers/sftp";

const download = createDownload({
  immediate: false, // Default: true -> Download starts automatically
  base: "~/Downloads",
  key: "BigBuckBunny.mp4",
  driver: httpDriver({
    url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  }),
});

download.on("end", () => console.log("Download completed"));
download.on("error", (err) => console.error("Download error:", err));
download.on("data", (chunk) => console.log("Downloaded chunk:", chunk.length));

download.start(); // To start the download if immediate = false
download.stop(); // To stop the download if needed
download.status(); // To check the status
download.restart(); // Discards already downloaded data and starts over

await download.promise; // To await the completion of the download

// To validate the file after completion
await download.validate(
  "sha256",
  "1cadc5e09cbb81044e256f9fc67090fcf86d7a596145eb615844fe15341451e6",
);
```

## Development

<details>

<summary>local development</summary>

- Clone this repository
- Install latest LTS version of [Node.js](https://nodejs.org/en/)
- Enable [Corepack](https://github.com/nodejs/corepack) using `corepack enable`
- Install dependencies using `pnpm install`
- Run interactive tests using `pnpm dev`

</details>

## License

<!-- automd:contributors license=MIT -->

Published under the [MIT](https://github.com/Ayax0/undownload/blob/main/LICENSE) license.
Made by [community](https://github.com/Ayax0/undownload/graphs/contributors) 💛
<br><br>
<a href="https://github.com/Ayax0/undownload/graphs/contributors">
<img src="https://contrib.rocks/image?repo=Ayax0/undownload" />
</a>

<!-- /automd -->

<!-- automd:with-automd -->

---

_🤖 auto updated with [automd](https://automd.unjs.io)_

<!-- /automd -->
