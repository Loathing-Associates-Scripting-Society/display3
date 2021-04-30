# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- Performance improvements ([#11])
- Use [Bublé] to transpile ES2015-2018 syntax ([#12])

[#11]: https://github.com/Loathing-Associates-Scripting-Society/display3/pull/11
[#12]: https://github.com/Loathing-Associates-Scripting-Society/display3/pull/12

## [0.1.2] - 2021-01-29

### Fixed

- Use CSS Flexbox instead of Grid to correctly render shelves with >1000 rows
  (#7)
- Don't print warnings to the gCLI if there are multiple exact matches for the
  item name. (#8)
- Fix a bug that caused a Display Case message containing an external link to be
  incorrectly parsed as a shelf. (#9)

## [0.1.1] - 2021-01-28

### Changed

- When the viewport becomes narrow, collapse the table into 1-2 columns (#3)
- Use more distinguishable color for collapsed tables (#4)

### Fixed

- Use keyboard-accessible anchors for item names (#5)

## [0.1.0] - 2021-01-05

### Added

- Initial release

[unreleased]: https://github.com/Loathing-Associates-Scripting-Society/display3/compare/v0.1.2...HEAD
[0.1.2]: https://github.com/Loathing-Associates-Scripting-Society/display3/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/Loathing-Associates-Scripting-Society/display3/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/Loathing-Associates-Scripting-Society/display3/releases/tag/v0.1.0
