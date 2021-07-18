# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.3.4](https://github.com/Antman261/es-reduxed/compare/v0.3.3...v0.3.4) (2021-07-18)

### [0.3.3](https://github.com/Antman261/es-reduxed/compare/v0.3.2...v0.3.3) (2021-07-18)

### [0.3.2](https://github.com/Antman261/es-reduxed/compare/v0.3.1...v0.3.2) (2021-07-18)


### Bug Fixes

* **raiseevent:** fix a bug with raiseEvent wherein it could resolve early ([c8b13b4](https://github.com/Antman261/es-reduxed/commit/c8b13b449fda4de38e9253bf5b37c4167c1b0583))

### [0.3.1](https://github.com/Antman261/es-reduxed/compare/v0.3.0...v0.3.1) (2021-07-17)

## [0.3.0](https://github.com/Antman261/es-reduxed/compare/v0.2.0...v0.3.0) (2021-07-16)


### ⚠ BREAKING CHANGES

* **large event payload support:** There is a new database migration that will have to be run in order to use the
postgres provider.

### Bug Fixes

* **large event payload support:** add support for large event payloads greater than 8000 bytes ([0c9d735](https://github.com/Antman261/es-reduxed/commit/0c9d735511e54742ec8e843dda152ae89ba9faf5))

## [0.2.0](https://github.com/Antman261/es-reduxed/compare/v0.1.1...v0.2.0) (2021-06-27)


### ⚠ BREAKING CHANGES

* **redux-enhancer:** Changed several user facing APIs in the provider and initialiser.

### Features

* **redux-enhancer:** add a redux enhancer and return state after raising event ([71201fa](https://github.com/Antman261/es-reduxed/commit/71201fa3555b2eee187227f7ad83bc9d07b0293a))

### 0.1.1 (2021-06-26)
