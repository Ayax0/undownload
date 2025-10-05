import { createDownload } from "../src";
import httpDriver from "../src/drivers/http";

createDownload({
  base: "~/Downloads",
  key: "BigBuckBunny.mp4",
  driver: httpDriver({
    path: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  }),
});
