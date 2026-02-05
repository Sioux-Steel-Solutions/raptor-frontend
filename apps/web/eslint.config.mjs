import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  // pull in Next.js defaults
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // now override the rules you want to loosen up
  {
    rules: {
      // make unused‐vars just a warning, and ignore anything prefixed with _
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "react/no-unescaped-entities": "off",

      // downgrade exhaustive-deps to a warning instead of an error
      "react-hooks/exhaustive-deps": "warn",
    },
  },
];
