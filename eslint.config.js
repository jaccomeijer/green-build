import globals from 'globals'
import eslintConfigESLint from 'eslint-config-eslint'
import eslintPluginReact from 'eslint-plugin-react/configs/recommended.js'

export default [
  ...eslintConfigESLint,
  eslintPluginReact,
  {
    rules: {
      'comma-dangle': ['error', 'always-multiline'],
      'func-style': ['error', 'declaration', { allowArrowFunctions: true }],
      'jsdoc/require-jsdoc': 'off',
      'jsdoc/require-param': 'off',
      'jsdoc/require-returns': 'off',
      'linebreak-style': ['error', 'unix'],
      'n/no-extraneous-import': 'off',
      'n/no-unpublished-import': 'off',
      'no-console': 'off',
      'react/jsx-key': 'off',
      'react/no-unknown-property': 'off',
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'unicorn/prefer-set-has': 'off',
      indent: ['error', 2],
      quotes: ['error', 'single'],
      semi: ['error', 'never'],
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
]
