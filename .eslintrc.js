module.exports = {
  env: {
    node: true,
    "vue/setup-compiler-macros": true,
  },
  extends: ["eslint:recommended", "plugin:vue/vue3-recommended", "prettier"],
  rules: {
    // override/add rules settings here, such as:
    // 'vue/no-unused-vars': 'error'
    "vue/script-setup-uses-vars": "error",
    "indent": ["error", 2]
  },
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  globals: {
    cy: "readonly",
    describe: "readonly",
    it: "readonly",
  },
};
