module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    "eslint:recommended",
    "airbnb-base",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  "plugins": [
    "react-hooks",
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": 6,
    "allowImportExportEverywhere": true,
    "ecmaFeatures": {
      "impliedStrict": true,
      "jsx": true,
    },
  },
  settings: {
    "import/resolver": {
      webpack: {
        config: {
          extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
          alias: {
            "react-dom": "@hot-loader/react-dom",
            "@Src": "./src",
          }
        }
      }
    },
    "react": {
      "version": "detect",
    },
  },
  rules: {
    // window风格的换行(而非unix)
    "linebreak-style": ["error", "windows"],
    "quotes": ["error", "double"],
    "indent": ["error", 2],
    "semi": ["error", "never"],
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "error",
  
    // 便于调试, 所以允许console
    "no-console": "off",
    "@typescript-eslint/ban-ts-ignore": "off",
    // scss自动生成的scss.d.ts没有使用default, 同时一些utils可能从语义上来说没有default导出, 所以关闭
    "import/prefer-default-export": "off",
    "import/no-extraneous-dependencies": "off",
    "import/no-unresolved": "off",
    "import/extensions": "off",
    "no-prototype-builtins": "off",
    "@typescript-eslint/indent": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "max-len": "off",
    // 已经有了 typescript, 不需要了
    "no-undef": "off",
    "no-underscore-dangle": "off",
    "@typescript-eslint/no-parameter-properties": "off",
  }
}
