import resolve from "rollup-plugin-node-resolve";
import babel from "rollup-plugin-babel";
import { terser } from "rollup-plugin-terser";

const isProduction = process.env.NODE_ENV === "production";

export default [
  {
    external: ["hybrids"],
    input: "src/index.js",
    external: ["hybrids", "hybrids/src/utils"],
    output: {
      file: "dist/index.js",
      format: "es",
      sourcemap: true,
    },
    plugins: [resolve(), babel(), isProduction && terser()],
  },
];
