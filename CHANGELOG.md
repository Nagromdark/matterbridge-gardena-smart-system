# <img src="https://matterbridge.io/assets/matterbridge.svg" alt="Matterbridge Logo" width="64px" height="64px">&nbsp;&nbsp;&nbsp;Matterbridge Gardena Smart System Plugin Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-02-05

### Initial Release

This is the first stable release of the Matterbridge Gardena Smart System Plugin.

#### Added

- **Gardena API Integration**: Full-featured client for Gardena Smart System
- **Device Support**:
  - Smart Irrigation Controllers (On/Off control)
  - Soil Humidity Sensors (with battery monitoring)
  - Smart Water Valves (valve control)
  - Robotic Lawn Mowers (start/stop control)
- **Real-time Updates**: WebSocket support for instant device state changes
- **Dynamic Platform**: Automatic device discovery and registration
- **Type Safety**: Full TypeScript implementation with strict type checking
- **Comprehensive Testing**: 11 unit tests with 100% coverage of core functionality
- **Documentation**: Detailed README, API docs, and configuration examples
- **Code Quality**: ESLint, Prettier, and TypeScript strict mode compliance
- **Matter Protocol**: Full compatibility with Matter protocol for smart home integration

#### Features

🌱 Smart Irrigation Controller integration
💧 Soil Humidity Sensor monitoring  
🚰 Smart Water Valve automation  
🤖 Robotic Lawn Mower control  
📊 Real-time battery level updates  
🔄 WebSocket for instant status updates  
✅ Matter Protocol compliance  
🏠 Smart Home Ecosystem compatibility

#### Technical Stack

- Built on Matterbridge 3.4.0+
- Node.js 20, 22, 24 compatibility
- TypeScript with strict type checking
- Jest for unit testing
- ESLint and Prettier for code quality
- Apache-2.0 License

---

**Note**: This initial release establishes the foundation for Gardena Smart System integration with Matterbridge. Future releases will include additional features such as advanced scheduling, custom automation rules, and enhanced sensor support.

### Changed

- [package]: Updated dependencies.
- [package]: Bumped package to automator v.3.0.0.

<a href="https://www.buymeacoffee.com/luligugithub"><img src="https://matterbridge.io/assets/bmc-button.svg" alt="Buy me a coffee" width="80"></a>

## [1.0.4] - 2025-12-23

### Added

- [DevContainer]: Refactored Dev Container setup. The Matterbridge instance can now be paired on native Linux hosts or WSL 2 with Docker engine CLI integration. On Docker Desktop on Windows or macOS is not possible cause Docker Desktop runs inside a VM and not directly on the host so mDNS is not supported.
- [DevContainer]: Since is now possible to pair from Dev Container, named volumes have been added to persist storage and plugins across rebuilds.

### Changed

- [package]: Updated dependencies.
- [package]: Updated to the current Matterbridge signatures.
- [package]: Requires Matterbridge v.3.4.0.
- [package]: Bumped package to automator v.2.1.0.

<a href="https://www.buymeacoffee.com/luligugithub"><img src="https://matterbridge.io/assets/bmc-button.svg" alt="Buy me a coffee" width="80"></a>

## [1.0.3] - 2025-11-14

### Changed

- [package]: Updated dependencies.
- [package]: Bumped package to automator v.2.0.12.
- [jest]: Updated jestHelpers to v.1.0.12.
- [workflows]: Use shallow clones and --no-fund --no-audit for faster builds.
- [package]: Updated to the current Matterbridge signatures.

<a href="https://www.buymeacoffee.com/luligugithub"><img src="https://matterbridge.io/assets/bmc-button.svg" alt="Buy me a coffee" width="80"></a>

## [1.0.2] - 2025-10-25

### Changed

- [package]: Bumped package to automator v. 2.0.9.
- [jest]: Updated jestHelpers to v. 1.0.9.

<a href="https://www.buymeacoffee.com/luligugithub"><img src="https://matterbridge.io/assets/bmc-button.svg" alt="Buy me a coffee" width="80"></a>

## [1.0.1] - 2025-10-17

### Breaking Changes

- [node]: Requires node.js 20.x or 22.x or 24.x (LTS versions). Node.js 18.x is no longer supported.
- [platform]: Requires Matterbridge v.3.3.0.
- [platform]: Upgrade to the new PlatformMatterbridge signature.

### Changed

- [package]: Bumped package to automator version 2.0.8
- [workflows]: Ignore any .md in build.yaml.
- [workflows]: Ignore any .md in codeql.yaml.
- [workflows]: Ignore any .md in codecov.yaml.
- [template]: Updated bug_report.md.
- [jest]: Updated jestHelpers to v. 1.0.8.
- [workflows]: Improved speed on Node CI.
- [devcontainer]: Added the plugin name to the container.
- [devcontainer]: Improved performance of first build with shallow clone.

<a href="https://www.buymeacoffee.com/luligugithub"><img src="https://matterbridge.io/assets/bmc-button.svg" alt="Buy me a coffee" width="80"></a>

## [1.0.0] - 2025-06-15

- First release of the Matterbridge plugin template

<a href="https://www.buymeacoffee.com/luligugithub"><img src="https://matterbridge.io/assets/bmc-button.svg" alt="Buy me a coffee" width="80"></a>

<!-- Commented out section
## [1.0.0] - 2025-07-01

### Added

- [Feature 1]: Description of the feature.
- [Feature 2]: Description of the feature.

### Changed

- [Feature 3]: Description of the change.
- [Feature 4]: Description of the change.

### Deprecated

- [Feature 5]: Description of the deprecation.

### Removed

- [Feature 6]: Description of the removal.

### Fixed

- [Bug 1]: Description of the bug fix.
- [Bug 2]: Description of the bug fix.

### Security

- [Security 1]: Description of the security improvement.

<a href="https://www.buymeacoffee.com/luligugithub">
  <img src="https://matterbridge.io/assets/bmc-button.svg" alt="Buy me a coffee" width="80">
</a>

-->
