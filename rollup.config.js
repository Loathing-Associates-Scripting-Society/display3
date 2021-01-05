// @ts-check
/* eslint-disable node/no-unpublished-import */
/* eslint-disable node/no-unsupported-features/es-syntax */
import commonjs from '@rollup/plugin-commonjs';
import {nodeResolve} from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import copy from 'rollup-plugin-copy';

import pkg from './package.json';

const OUTPUT_DIR = 'build/dist';
const OUTPUT_DIR_RELAY = `${OUTPUT_DIR}/relay`;

/** @type {import('rollup').RollupOptions} */
const config = {
  // TypeScript compiler emits code that uses the 'this' keyword.
  // Don't let Rollup try to change it!
  context: 'this',
  external: ['kolmafia'],
  input: 'src/relay/displaycollection.tsx',
  output: {
    banner: `
/**
 * ${pkg.name} - ${pkg.description}
 * @version ${pkg.version}
 * @license ${pkg.license}
 * @preserve
 */`.trim(),
    format: 'cjs',
    dir: OUTPUT_DIR_RELAY,
  },
  plugins: [
    nodeResolve(),
    commonjs(),
    typescript({
      tsconfig: 'src/tsconfig.json',
      // Disable composite mode, because it emits .tsbuildinfo files in the
      // output directory
      composite: false,
      // Don't emit type declarations and source maps
      declaration: false,
      sourceMap: false,
      outDir: OUTPUT_DIR_RELAY,
    }),
    copy({
      flatten: false,
      targets: [{src: 'src/**/*.css', dest: OUTPUT_DIR}],
    }),
  ],
};

export default config;
