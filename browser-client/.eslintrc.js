module.exports = {
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint', 'react', 'react-hooks', 'react-refresh'],
    extends: [
      'eslint:recommended',
      'plugin:react/recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:react-hooks/recommended',
    ],
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      'react/react-in-jsx-scope': 'off', // Not needed with React 17+
      'react/jsx-uses-react': 'off',     // Disable React unused variable checks for JSX
      'no-unused-vars': 'off',           // Disable unused vars for JavaScript
      '@typescript-eslint/no-unused-vars': 'off', // Disable unused vars for TypeScript
    },
  };
  