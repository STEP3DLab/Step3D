module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
    node: true
  },
  extends: ['eslint:recommended'],
  plugins: ['html'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  overrides: [
    {
      files: ['index.html'],
      rules: {
        'no-unused-vars': 'off'
      }
    },
    {
      files: ['tests/**/*.mjs'],
      env: {
        node: true
      }
    }
  ]
};
