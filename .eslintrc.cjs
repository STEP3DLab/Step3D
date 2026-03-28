module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
    node: true
  },
  extends: ['eslint:recommended'],
  plugins: ['html'],
  overrides: [
    {
      files: ['index.html'],
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
      },
      rules: {
        'no-unused-vars': 'off'
      }
    },
    {
      files: ['scripts/**/*.mjs'],
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
      }
    }
  ]
};
