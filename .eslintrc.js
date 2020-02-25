// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint'
  },
  env: {
    browser: true,
    node: true
  },
  extends: [
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    'plugin:vue/essential',
    // https://github.com/standard/standard/blob/master/docs/RULES-en.md
    'standard'
  ],
  // required to lint *.vue files
  plugins: [
    'vue'
  ],
  // add your custom rules here
  //https://eslint.org/docs/user-guide/configuring
  //https://eslint.org/docs/rules/indent
  //https://www.cnblogs.com/yinluhui0229/p/8579967.html
  rules: {
    // allow async-await
    'generator-star-spacing': 'off',
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-console': 0, //允许使用console, 0相当于"off"
    'indent': "off",
    "quotes": "off",
    "space": "off",
    "no-trailing-spaces": 0,
    "no-multiple-empty-lines": 0
  }
}
