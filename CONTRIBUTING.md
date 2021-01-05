# Contribution Guide

## Development Environment

To develop Display3, we recommend the following setup:

- Editor: Visual Studio Code
- Node.js: v12 or later
- Node.js package manager: NPM

## NPM scripts

`package.json` contains several useful NPM scripts for development.

- `npm run compile`: Compiles all TypeScript code to JavaScript, placing them in the `/build/` directory.
- `npm test`: Compiles all TypeScript code, executes all tests, and checks code style.
- `npm run bundle`: Creates bundled files under `/build/dist/`, which can be executed by KoLmafia
- `npm run release`: Runs `npm run bundle`, then commits the bundled files to the `release` branch. This uses an existing tag's annotation as the commit message.
  - For example, `npm run release -- --use-tag-message=v0.1.2` will take the annotation from the tag named `v0.1.2` and use it as the commit message.
- `npm run clean`: Removes all compiled/generated files.
