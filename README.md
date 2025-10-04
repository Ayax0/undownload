# undownload

<!-- automd:badges color=yellow -->

[![npm version](https://img.shields.io/npm/v/@nextlvlup/undownload?color=yellow)](https://npmjs.com/package/@nextlvlup/undownload)
[![npm downloads](https://img.shields.io/npm/dm/@nextlvlup/undownload?color=yellow)](https://npm.chart.dev/@nextlvlup/undownload)

<!-- /automd -->

This is my package description.

## Usage

Install the package:

```sh
# ✨ Auto-detect (supports npm, yarn, pnpm, deno and bun)
npx nypm install @nextlvlup/undownload
```

Import:

<!-- automd:jsimport cdn name="@nextlvlup/undownload" -->

**ESM** (Node.js, Bun, Deno)

```js
import {} from "@nextlvlup/undownload";
```

**CDN** (Deno and Browsers)

```js
import {} from "https://esm.sh/@nextlvlup/undownload";
```

<!-- /automd -->

Example:

```ts
import { createDownload } from "@nextlvlup/undownload";
import httpDriver from "@nextlvlup/undownload/driver/http";
// import ftpDriver from "@nextlvlup/undownload/driver/ftp";
// import sftpDriver from "@nextlvlup/undownload/driver/sftp";

const download = createDownload({
  base: "~/Downloads",
  key: "BigBuckBunny.mp4",
  driver: httpDriver({
    path: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  }),
});

download.on("end", () => console.log("Download completed"));
download.on("error", (err) => console.error("Download error:", err));
download.on("data", (chunk) => console.log("Downloaded chunk:", chunk.length));

download.stop(); // To stop the download if needed
await download.promise; // To await the completion of the download
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
