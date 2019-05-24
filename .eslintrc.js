module.exports = {
  "root": true,
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
    "react/display-name": 0,
    "no-implicit-coercion": 0,
    "max-len": 0,
    "react/react-in-jsx-scope": 0,
    "no-unused-vars": ["error", {varsIgnorePattern: "CannerScript"}]
  },
  "globals": {
    "Promise": true
  },
  "settings": {
    "react": {
      "version": "detect", // React version. "detect" automatically picks the version you have installed.
                            // You can also use `16.0`, `16.3`, etc, if you want to override the detected value.
                            // default to latest and warns if missing
                            // It will default to "detect" in the future
    },
    "propWrapperFunctions": [
        // The names of any function used to wrap propTypes, e.g. `forbidExtraProps`. If this isn't set, any propTypes wrapped in a function will be skipped.
    ],
    "linkComponents": [
      // Components used as alternatives to <a> for linking, eg. <Link to={ url } />
    ]
  }
}