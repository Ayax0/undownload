import { defineBuildConfig } from "obuild/config";

export default defineBuildConfig({
  entries: [
    "./src/index.ts",
    {
      builder: "mkdist",
      input: "./src/driver/",
      outDir: "./dist/drivers",
    },
  ],
});
