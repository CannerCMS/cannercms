module.exports = {
  "extends": [
    "plugin:flowtype/recommended",
    "google",
    "plugin:react/recommended"
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
    "browser": true
  },
  "plugins": [
    "react",
    "flowtype"
  ],
  "settings": {
    "react": {
      "pragma": "React",
      "version": "16.2"
    }
  },
  "rules": {
    "max-len": 0,
    "require-jsdoc": 0,
    "react/prop-types":0,
    "new-cap": 0,
    "no-invalid-this": 0
  },
  "globals": {
  }
}