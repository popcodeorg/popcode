module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:promise/recommended',
    'plugin:prettier/recommended',
  ],
  globals: {
    __dirname: true,
  },
  overrides: [
    {
      env: {
        browser: false,
        node: true,
      },
      files: 'src/**/*.gen.js',
      parser: 'espree',
      parserOptions: {
        ecmaVersion: 2017,
        sourceType: 'script',
      },
      rules: {},
    },
    {
      env: {
        browser: false,
        es6: true,
        node: true,
      },
      files: [
        '.eslintrc.js',
        'babel.config.js',
        'gulpfile.js',
        'karma.conf.js',
        'script/*.js',
        'webpack.config.js',
      ],
      parser: 'espree',
      parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'script',
      },
      rules: {},
      settings: {},
    },
    {
      env: {
        browser: true,
        es6: true,
        node: true,
        jest: true,
      },
      files: ['**/{__factories__,__mocks__,__tests__}/*.js{,x}'],
      rules: {},
      plugins: ['react', 'promise'],
    },
    {
      files: 'src/**/*',
      rules: {},
    },
    {
      files: 'src/sagas/**/*',
      rules: {},
    },
    {
      files: 'test/unit/**/*',
      globals: {
        sinon: true,
      },
    },
    {
      files: 'test/unit/sagas/**/*',
      rules: {
        'prefer-reflect': 'off',
      },
    },
    {
      env: {
        browser: false,
        node: true,
      },
      files: 'src/**/*.gen.js',
      excludedFiles: 'src/**/__mocks__/*.gen.js',
      parser: 'espree',
      parserOptions: {
        ecmaVersion: 2017,
        sourceType: 'script',
      },
      rules: {},
    },
  ],
  parser: 'babel-eslint',
  plugins: ['react', 'prettier', 'promise'],
  rules: {
    'accessor-pairs': 'error',
    camelcase: [
      'warn',
      {
        properties: 'never',
      },
    ],
    'consistent-return': 'warn',
    'consistent-this': 'warn',
    'dot-notation': 'warn',
    eqeqeq: 'warn',
    'func-names': ['warn', 'as-needed'],
    'func-style': ['warn', 'declaration'],
    'guard-for-in': 'warn',
    'new-cap': [
      'warn',
      {
        capIsNewExceptions: ['Slowparse.HTML', 'Record'],
      },
    ],
    'no-alert': 'warn',
    'no-array-constructor': 'warn',
    'no-async-promise-executor': 'warn',
    'no-await-in-loop': 'warn',
    'no-caller': 'warn',
    'no-catch-shadow': 'warn',
    'no-console': 'warn',
    'no-constant-condition': 'warn',
    'no-continue': 'warn',
    'no-debugger': 'warn',
    'no-div-regex': 'warn',
    'no-else-return': 'warn',
    'no-empty': 'warn',
    'no-eq-null': 'warn',
    'no-eval': 'warn',
    'no-extend-native': 'warn',
    'no-extra-bind': 'warn',
    'no-extra-boolean-cast': 'warn',
    'no-fallthrough': 'warn',
    'no-implicit-coercion': 'warn',
    'no-implied-eval': 'warn',
    'no-inline-comments': 'warn',
    'no-inner-declarations': 'warn',
    'no-invalid-this': 'error',
    'no-iterator': 'error',
    'no-labels': 'error',
    'no-lone-blocks': 'error',
    'no-lonely-if': 'warn',
    'no-loop-func': 'warn',
    'no-misleading-character-class': 'warn',
    'no-mixed-requires': 'warn',
    'no-multi-str': 'warn',
    'no-negated-condition': 'warn',
    'no-nested-ternary': 'warn',
    'no-new-func': 'warn',
    'no-new-object': 'warn',
    'no-new-require': 'warn',
    'no-new-wrappers': 'warn',
    'no-new': 'warn',
    'no-octal-escape': 'warn',
    'no-param-reassign': 'warn',
    'no-path-concat': 'warn',
    'no-proto': 'warn',
    'no-restricted-imports': ['error', 'jquery'],
    'no-return-assign': 'warn',
    'no-return-await': 'warn',
    'no-script-url': 'warn',
    'no-self-compare': 'warn',
    'no-sequences': 'warn',
    'no-shadow': 'warn',
    'no-shadow-restricted-names': 'warn',
    'no-throw-literal': 'warn',
    'no-undef-init': 'warn',
    'no-unneeded-ternary': 'warn',
    'no-unreachable': 'warn',
    'no-unused-expressions': 'warn',
    'no-unused-vars': 'warn',
    'no-use-before-define': ['warn', 'nofunc'],
    'no-useless-call': 'warn',
    'no-useless-concat': 'warn',
    'no-useless-constructor': 'warn',
    'no-useless-return': 'warn',
    'no-var': 'error',
    'no-void': 'warn',
    'no-warning-comments': 'warn',
    'no-with': 'error',
    'object-shorthand': ['warn', 'always'],
    'operator-assignment': ['warn', 'always'],
    'prefer-const': 'warn',
    'prefer-promise-reject-errors': 'warn',
    'prefer-reflect': 'warn',
    'prefer-rest-params': 'warn',
    'prefer-spread': 'warn',
    'prefer-template': 'warn',
    'prettier/prettier': 'warn',
    'promise/param-names': 'warn',
    'promise/prefer-await-to-callbacks': 'warn',
    'promise/prefer-await-to-then': 'warn',
    radix: 'warn',
    'react/display-name': 'warn',
    'react/forbid-foreign-prop-types': 'warn',
    'react/jsx-boolean-value': ['warn', 'never'],
    'react/jsx-curly-brace-presence': ['warn', 'never'],
    'react/jsx-key': 'warn',
    'react/jsx-no-target-blank': 'warn',
    'react/jsx-sort-props': [
      'warn',
      {
        callbacksLast: true,
        shorthandFirst: true,
      },
    ],
    'react/jsx-uses-react': 'error',
    'react/no-deprecated': 'warn',
    'react/no-did-mount-set-state': 'warn',
    'react/no-did-update-set-state': 'warn',
    'react/no-multi-comp': 'warn',
    'react/no-set-state': 'warn',
    'react/no-string-refs': 'warn',
    'react/no-unknown-property': 'warn',
    'react/no-unused-prop-types': 'warn',
    'react/prefer-es6-class': ['warn', 'always'],
    'react/prefer-stateless-function': ['warn'],
    'react/prop-types': 'warn',
    'react/require-default-props': 'warn',
    'react/self-closing-comp': 'warn',
    'react/sort-comp': 'warn',
    'react/sort-prop-types': [
      'warn',
      {
        callbacksLast: true,
      },
    ],
    'require-atomic-updates': 'warn',
    'require-unicode-regexp': 'warn',
    'require-yield': 'error',
    'spaced-comment': ['warn', 'always'],
    strict: ['warn', 'never'],
    'use-isnan': 'warn',
    'valid-jsdoc': 'warn',
    yoda: ['warn', 'never'],
  },
  settings: {
    react: {
      version: '16.8.2',
    },
  },
};
