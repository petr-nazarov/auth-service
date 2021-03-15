module.exports = {
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'functional'],
  extends: [
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
    'plugin:functional/external-recommended',
    'plugin:functional/recommended',
    'plugin:functional/stylitic',
  ],
  rules: {
    '@typescipt-eslint/interface-name-prefix': ['always'],
    'no-underscore-dangle': 'error',
    'immutable-data': true,
  },
};
