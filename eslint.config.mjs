import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // =============================================================================
  // BASE CONFIGURATIONS
  // =============================================================================
  ...compat.extends('next/core-web-vitals', 'next/typescript'),

  // =============================================================================
  // GLOBAL SETTINGS
  // =============================================================================
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
    },
    env: {
      browser: true,
      es2022: true,
      node: true,
    },
  },

  // =============================================================================
  // RULES CONFIGURATION
  // =============================================================================
  {
    rules: {
      // =============================================================================
      // CODE QUALITY RULES
      // =============================================================================
      'prefer-const': 'error',
      'no-var': 'error',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',
      'no-alert': 'error',
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
      'no-script-url': 'error',

      // =============================================================================
      // REACT SPECIFIC RULES
      // =============================================================================
      'react/jsx-key': 'error',
      'react/jsx-no-duplicate-props': 'error',
      'react/jsx-no-undef': 'error',
      'react/no-array-index-key': 'warn',
      'react/no-danger': 'warn',
      'react/no-deprecated': 'error',
      'react/no-direct-mutation-state': 'error',
      'react/no-find-dom-node': 'error',
      'react/no-is-mounted': 'error',
      'react/no-render-return-value': 'error',
      'react/no-string-refs': 'error',
      'react/no-unescaped-entities': 'error',
      'react/no-unknown-property': 'error',
      'react/no-unsafe': 'warn',
      'react/self-closing-comp': 'error',

      // =============================================================================
      // HOOKS RULES
      // =============================================================================
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // =============================================================================
      // ACCESSIBILITY RULES
      // =============================================================================
      'jsx-a11y/alt-text': 'error',
      'jsx-a11y/anchor-has-content': 'error',
      'jsx-a11y/anchor-is-valid': 'error',
      'jsx-a11y/aria-props': 'error',
      'jsx-a11y/aria-proptypes': 'error',
      'jsx-a11y/aria-unsupported-elements': 'error',
      'jsx-a11y/click-events-have-key-events': 'warn',
      'jsx-a11y/heading-has-content': 'error',
      'jsx-a11y/html-has-lang': 'error',
      'jsx-a11y/img-redundant-alt': 'error',
      'jsx-a11y/no-access-key': 'error',
      'jsx-a11y/no-autofocus': 'error',
      'jsx-a11y/no-distracting-elements': 'error',
      'jsx-a11y/no-redundant-roles': 'error',
      'jsx-a11y/role-has-required-aria-props': 'error',
      'jsx-a11y/role-supports-aria-props': 'error',
      'jsx-a11y/scope': 'error',
      'jsx-a11y/tabindex-no-positive': 'error',

      // =============================================================================
      // NEXT.JS SPECIFIC RULES
      // =============================================================================
      '@next/next/no-html-link-for-pages': 'error',
      '@next/next/no-img-element': 'error',
      '@next/next/no-sync-scripts': 'error',
      '@next/next/no-unwanted-polyfillio': 'error',
      '@next/next/no-page-custom-font': 'error',
      '@next/next/no-css-tags': 'error',
      '@next/next/no-head-element': 'error',
      '@next/next/no-typos': 'error',
      '@next/next/no-duplicate-head': 'error',
      '@next/next/no-before-interactive-script-outside-document': 'error',
      '@next/next/no-title-in-document-head': 'error',
      '@next/next/no-document-import-in-page': 'error',
      '@next/next/no-head-import-in-page': 'error',
      '@next/next/no-script-component-in-head': 'error',
      '@next/next/no-styled-jsx-in-document': 'error',

      // =============================================================================
      // PERFORMANCE RULES
      // =============================================================================
      'react/jsx-no-target-blank': 'error',
      'react/jsx-no-bind': [
        'warn',
        {
          allowArrowFunctions: true,
          allowBind: false,
          ignoreRefs: true,
        },
      ],
    },
  },

  // =============================================================================
  // FILE-SPECIFIC OVERRIDES
  // =============================================================================
  {
    files: ['**/*.config.js', '**/*.config.mjs', 'scripts/**/*'],
    rules: {
      'no-console': 'off',
    },
  },

  {
    files: ['**/*.test.ts', '**/*.test.tsx', '**/*.spec.ts', '**/*.spec.tsx'],
    rules: {
      'no-console': 'off',
    },
  },
];

export default eslintConfig;
