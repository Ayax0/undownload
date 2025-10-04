import unjs from "eslint-config-unjs";

export default unjs({
  ignores: ["pnpm-lock.yaml"],
  rules: {
    "unicorn/prefer-event-target": "off",
  },
});
