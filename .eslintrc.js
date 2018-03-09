module.exports = {
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:flowtype/recommended"
  ],
  "parser": "babel-eslint",
  "parserOptions": {
    "ecmaVersion": 7,
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true
    }
  },
  "env": {
    "browser": true,
    "node": true,
    "jest": true,
  },
  "plugins": [
    "react",
    "flowtype"
  ],
  "rules": {
    "react/prop-types": 0,
    "no-implicit-coercion": 0,
    "max-len": 0
  },
  "globals": {
    "Promise"
  }
}