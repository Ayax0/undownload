import unjs from "eslint-config-unjs";

export default unjs({
  ignores: ["pnpm-lock.yaml", "./drivers"],
  rules: {
    "unicorn/prefer-event-target": "off",
  },
});
