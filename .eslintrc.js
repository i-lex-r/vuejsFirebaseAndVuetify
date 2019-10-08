module.exports = {
  root: true,
  env: {
    node: true
  },
  plugins: ["vue", "prettier"],
  extends: ["plugin:vue/recommended", "prettier", "prettier/standard", "prettier/vue"],
  rules: {
    "vue/name-property-casing": "off",
    "vue/max-attributes-per-line": ["error", {
      "singleline": 1,
      "multiline": {
        "max": 1,
        "allowFirstLine": false
      }
    }]
  },
  parser: "vue-eslint-parser",
  parserOptions: {
    parser: "babel-eslint",
    sourceType: "module"
  }
};
