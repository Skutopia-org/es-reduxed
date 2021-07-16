# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

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
