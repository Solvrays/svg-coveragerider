module.exports = {
  extends: 'next/core-web-vitals',
  rules: {
    // Disable the any type error for now
    '@typescript-eslint/no-explicit-any': 'off',
    // Disable unused vars warning for now
    '@typescript-eslint/no-unused-vars': 'off',
    // Disable unescaped entities warning
    'react/no-unescaped-entities': 'off',
  },
};
