module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    'plugin:prettier/recommended',
    'eslint:recommended'
  ],
  plugins: [
    'vue',
  ],
  rules: {
    'prettier/prettier': 0, // 会优先采用prettierrc.json的配置，不符合规则会提示错误
    'no-console': 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-unused-vars': 'off', // 关闭变量定义未使用
    "arrow-parens": 0,
    'vue/no-use-v-if-with-v-for': [
      'error',
      {
        allowUsingIterationVar: true // 关闭v-if和v-for不能同时用
      }
    ],
    // vue组件在template中使用的命名方式
    "vue/component-name-in-template-casing": ["off", "PascalCase" | "kebab-case", {
      "registeredComponentsOnly": true, // 仅检查已注册组件
      "ignores": [] // 需要过滤的内容
    }]
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
