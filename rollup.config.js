import tsPlugin from '@rollup/plugin-typescript';

/**
 * @type {import('rollup').RollupOptions}
 */
export default {
  plugins: [tsPlugin()],
  input: 'src/index.ts',
  output: {
    file: 'dist/index.js',
    format: 'iife',
  },
};
