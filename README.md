# undownload

<!-- automd:badges color=yellow -->

[![npm version](https://img.shields.io/npm/v/@nextlvlup/undownload?color=yellow)](https://npmjs.com/package/@nextlvlup/undownload)
[![npm downloads](https://img.shields.io/npm/dm/@nextlvlup/undownload?color=yellow)](https://npm.chart.dev/@nextlvlup/undownload)

<!-- /automd -->

A universal download utility for Node.js.
It provides a simple and flexible interface to download files from the internet using different protocols.
Its driver-based approach allows you to use different protocols with the same underlying syntax and functionality.
This package was inspired by [unstorage](https://github.com/unjs/unstorage).

## Features

- 🌐 Multi-protocol download support — Seamlessly handle downloads over HTTP, HTTPS, FTP, and SFTP.
- 🔁 Resumable downloads — Automatically resume interrupted downloads without starting over.
- ⚡ Asynchronous downloading — Built on async/await for non-blocking, concurrent operations.
- 🧩 Checksum validation — Verify file integrity using MD5, SHA1, SHA256, or custom hash algorithms.
- 📏 File size verification — Compare local and remote file sizes to ensure complete downloads.
- 💾 Stream-based architecture — Efficient memory usage even with large files.
- 🧠 Promise-based API — Clean, modern, and easy to integrate with any Node.js application.
- 📦 Lightweight dependency footprint — Optimized for speed and minimal package size.
- 🧰 Extensible design — Add your own protocols, validation methods, or custom download logic easily.

## Usage

Install the package:

```sh
# ✨ Auto-detect (supports npm, yarn, pnpm, deno and bun)
npx nypm install @nextlvlup/undownload
```

---

> ⚙️ **Note:**
> To enable protocol-specific downloads, make sure to install the required optional dependencies:
>
> - For **FTP** support, install the [`ftp`](https://www.npmjs.com/package/ftp) package.
> - For **SFTP** support, install the [`ssh2-sftp-client`](https://www.npmjs.com/package/ssh2-sftp-client) package.
>
> These modules are not installed by default to keep the core library lightweight.

---

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
download.remove(); // Discards already downloaded data

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
