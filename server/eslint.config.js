import globals from "globals";
import pluginJs from "@eslint/js";


/** @type {import('eslint').Linter.Config[]} */
export default [
  { languageOptions: { globals: globals.node } },
  pluginJs.configs.recommended,
  {
    rules: {
      "quotes": ["error", "double", { "avoidEscape": true }],
      "semi": ["error", "always"] // Enforce semicolons
    }
  }
];