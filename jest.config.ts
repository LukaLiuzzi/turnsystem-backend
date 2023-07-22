// "jest": {
//   "transform": {
//     "^.+\\.jsx?$": "babel-jest", // Adding this line solved the issue
//     "^.+\\.tsx?$": "ts-jest"
//   },
//   // ...
// },

import type { Config } from "jest"

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.jsx?$": "babel-jest",
    "^.+\\.tsx?$": "ts-jest",
  },
  verbose: true,
  testMatch: ["**/**/*.(test|spec).(ts|tsx)"],
  forceExit: true,
}

export default config
