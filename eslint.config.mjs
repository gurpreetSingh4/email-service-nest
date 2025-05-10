// @ts-check
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs'],
  },
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      // Disable all recommended rules
      ...Object.fromEntries(
        Object.keys({
          ...eslint.configs.recommended.rules,
          ...tseslint.configs.recommendedTypeChecked[0].rules,
        }).map((rule) => [rule, 'off'])
      ),
    },
  }
);
