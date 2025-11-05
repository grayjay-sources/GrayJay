const resolve = require("@rollup/plugin-node-resolve").default;
const commonjs = require("@rollup/plugin-commonjs");
const typescript = require("@rollup/plugin-typescript");
const copy = require("rollup-plugin-copy");
const del = require("rollup-plugin-delete");

const dest = "./dist";

module.exports = {
  input: "src/Script.ts",
  output: {
    file: `${dest}/Script.js`,
    format: "cjs",
    sourcemap: false,
  },
  plugins: [
    del({ targets: `${dest}/*` }),
    resolve(),
    commonjs(),
    typescript({ tsconfig: "./tsconfig.json" }),
    copy({
      targets: [
        { src: "config.json", dest },
        { src: "assets/icon.png", dest: `${dest}/assets` },
      ],
    }),
  ],
};
