const resolve = require("@rollup/plugin-node-resolve").default;
const commonjs = require("@rollup/plugin-commonjs");
const typescript = require("@rollup/plugin-typescript");
const terser = require("@rollup/plugin-terser");
const copy = require("rollup-plugin-copy");
const del = require("rollup-plugin-delete");

const dest = "./dist";

module.exports = {
  input: "src/script.ts",
  output: {
    file: `${dest}/script.js`,
    format: "cjs",
    sourcemap: false,
  },
  plugins: [
    del({ targets: `${dest}/*` }),
    resolve(),
    commonjs(),
    typescript({ tsconfig: "./tsconfig.json" }),
    terser({
      compress: {
        drop_console: false,
        drop_debugger: true,
      },
      format: {
        comments: false,
      },
    }),
    copy({
      targets: [
        {
          src: "config.json",
          dest,
          transform: (contents) => {
            // Minify JSON by removing whitespace
            return JSON.stringify(JSON.parse(contents.toString()));
          },
        },
      ],
    }),
  ],
};
