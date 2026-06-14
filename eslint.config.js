import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default tseslint.config(
  { ignores: ['dist', 'node_modules'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      // Mutating three.js objects (camera.position, mesh.rotation, …) inside
      // useFrame is THE intended react-three-fiber pattern, not a bug.
      'react-hooks/immutability': 'off',
      // We use Math.random() inside useMemo to generate procedural scene data
      // once (stable deps). The experimental purity rule over-flags this.
      'react-hooks/purity': 'off',
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },
  // Helper modules deliberately export non-components alongside helpers.
  {
    files: ['src/lib/**/*.{ts,tsx}'],
    rules: { 'react-refresh/only-export-components': 'off' },
  },
  // The serverless function runs in an edge/node runtime, not the browser.
  {
    files: ['api/**/*.ts'],
    languageOptions: { globals: { ...globals.node } },
  },
);
