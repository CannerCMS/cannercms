module.exports = {
  collectCoverageFrom: [
    'packages/**/*.{js}',
    '!**/node_modules/**',
    '!**/lib/**',
    '!**/dist/**',
    '!**/test/**',
    '!**/coverage/**'
  ],
  projects: [
    "<rootDir>/packages/!canner-graphql*",
  ],
  "moduleNameMapper": {
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/__mocks__/fileMock.js",
    "\\.(css|less)$": "<rootDir>/__mocks__/styleMock.js"
  },
  "transform": {
    "^.+\\.tsx?$": "ts-jest",
    "^.+\\.jsx?$": "babel-jest",
  },
  "testRegex": "(/test/.*|(\\.|/)(test|spec))\\.(j|t)sx?$",
  "moduleFileExtensions": [
    "ts",
    "tsx",
    "js",
    "jsx",
    "json",
    "node"
  ],
  "testURL": "http://localhost",
  setupFiles: ["<rootDir>/jestSetupFile.js"]
}