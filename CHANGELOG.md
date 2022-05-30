# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.3.8](https://github.com/Antman261/es-reduxed/compare/v0.3.7...v0.3.8) (2022-05-26)


### Bug Fixes

* **pg-provider:** fix a typo in the event store provider ([88c2cfc](https://github.com/Antman261/es-reduxed/commit/88c2cfc1f4560340ce601aa03a0643cb0ba416d2))

### [0.3.7](https://github.com/Antman261/es-reduxed/compare/v0.3.6...v0.3.7) (2022-05-25)


### Bug Fixes

* **enhancer:** exclude internal events from id check ([a584338](https://github.com/Antman261/es-reduxed/commit/a5843386f4106fe59ea96e1776a39c52c8125a28))
* **queue:** use redux event id to prevent out of order processing ([791124d](https://github.com/Antman261/es-reduxed/commit/791124d16fca16f25b019c268cf166c154a63c9b))

### [0.3.6](https://github.com/Antman261/es-reduxed/compare/v0.3.5...v0.3.6) (2021-07-18)


### Bug Fixes

* **migration:** add missing migration file to package.json files ([fa0602b](https://github.com/Antman261/es-reduxed/commit/fa0602b9e00dcf58a4e9f15bdfb54332fe3cc344))

### [0.3.5](https://github.com/Antman261/es-reduxed/compare/v0.3.4...v0.3.5) (2021-07-18)

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
