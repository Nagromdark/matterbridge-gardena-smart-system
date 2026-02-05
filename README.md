# <img src="https://matterbridge.io/assets/matterbridge.svg" alt="Matterbridge Logo" width="64px" height="64px">&nbsp;&nbsp;&nbsp;Matterbridge Gardena Smart System Plugin

[![npm version](https://img.shields.io/npm/v/matterbridge.svg)](https://www.npmjs.com/package/matterbridge)
[![Docker Pulls](https://img.shields.io/docker/pulls/luligu/matterbridge?label=docker%20pulls)](https://hub.docker.com/r/luligu/matterbridge)

This plugin integrates **Gardena Smart System** devices with **Matterbridge**, enabling seamless control and monitoring of your Gardena Smart irrigation system through Matter protocol.

## Features

- 🌱 **Smart Irrigation Controller** - Control watering schedules and water flow
- 💧 **Soil Humidity Sensors** - Monitor soil moisture levels in real-time
- 🚰 **Smart Water Valves** - Automate water valve control
- 🤖 **Robotic Lawn Mowers** - Manage mower operations
- 📊 **Battery Level Monitoring** - Track battery status of wireless devices
- 🔄 **Real-time WebSocket Updates** - Receive instant device status updates
- 🏠 **Matter Protocol Support** - Compatible with all major smart home ecosystems

## Installation

### Via Matterbridge UI

1. Open Matterbridge web interface
2. Navigate to Plugins section
3. Search for "Gardena"
4. Install the plugin

### Via NPM

```bash
npm install matterbridge-plugin-gardena
```

## Configuration

### API Key Setup

To use this plugin, you need a Gardena API key:

1. Go to [Gardena Smart System](https://www.gardena.com/)
2. Create or sign in to your account
3. Navigate to API settings
4. Generate an authentication token

### Plugin Configuration

Add the following to your Matterbridge configuration file:

```json
{
  "name": "Gardena",
  "type": "DynamicPlatform",
  "version": "1.0.0",
  "apiKey": "your-gardena-api-key",
  "debug": false,
  "unregisterOnShutdown": false
}
```

## Supported Devices

### Device Types

| Device Type                 | Matter Representation | Features                                     |
| --------------------------- | --------------------- | -------------------------------------------- |
| Smart Irrigation Controller | On/Off Outlet         | Turn irrigation on/off, schedule management  |
| Soil Humidity Sensor        | Contact Sensor        | Real-time moisture monitoring, battery level |
| Smart Water Valve           | On/Off Light          | Valve control, water flow automation         |
| Robotic Lawn Mower          | On/Off Outlet         | Start/stop mowing, battery monitoring        |

## Usage

Once configured and started, the plugin will:

1. **Auto-discover** all your Gardena devices
2. **Register** them as Matter-compatible endpoints
3. **Sync** device states via WebSocket
4. **Allow control** through Matterbridge and connected ecosystems

### Example Voice Commands

- "Turn on the irrigation"
- "Close the water valve"
- "How much battery does the soil sensor have?"

## API Details

### GardenaAPI Class

#### Methods

- **fetchDevices()**: Discover all registered Gardena devices
- **getDevice(id)**: Get a specific device by ID
- **getAllDevices()**: Get all cached devices
- **controlDevice(deviceId, command, value)**: Send commands to devices
- **connectWebSocket(callback)**: Listen for real-time device updates

### Device Reference

```typescript
interface GardenaDevice {
  id: string;                          // Unique device identifier
  name: string;                        // Device display name
  type: string;                        // Device type (e.g., "IRRIGATION_CONTROLLER")
  category: string;                    // Device category (irrigation, sensor, valve, mower)
  value?: number | string | boolean;   // Current device state
  batteryLevel?: number;               // Battery percentage (0-100%)
  connected: boolean;                  // Connection status
}
```

## Testing

Run the comprehensive test suite:

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Run tests with verbose output
npm run test:verbose
```

Tests include:

- ✅ Plugin initialization and version checking
- ✅ Device discovery and registration
- ✅ Command handlers for all device types
- ✅ Configuration management
- ✅ Error handling and graceful degradation
- ✅ WebSocket connection management
- ✅ API client functionality

## Development

### Build

```bash
npm run build
```

### Lint & Format

```bash
# Fix linting issues
npm run lint:fix

# Format code with Prettier
npm run format

# Check Prettier formatting
npm run format:check
```

### Scripts

- `npm start` - Start Matterbridge
- `npm run watch` - Watch TypeScript files
- `npm run clean` - Clean build artifacts
- `npm run cleanBuild` - Clean and rebuild

## Troubleshooting

### No devices discovered

- ✓ Verify your API key is correct
- ✓ Check internet connection
- ✓ Ensure Gardena devices are powered and connected to WiFi
- ✓ Review logs for API errors

### WebSocket connection fails

- ✓ Check firewall settings
- ✓ Verify API endpoint availability
- ✓ Review Matterbridge logs

### Battery level not updating

- ✓ Ensure battery sensors are properly configured
- ✓ Check if devices are actually transmitting battery data
- ✓ Verify WebSocket connection is active

## Architecture

```
GardenaPlatform (extends MatterbridgeDynamicPlatform)
├── GardenaAPI
│   ├── fetchDevices()
│   ├── controlDevice()
│   └── connectWebSocket()
└── Device Registration
    ├── IrrigationController → On/Off Outlet
    ├── HumiditySensor → Contact Sensor
    ├── WaterValve → On/Off Light
    └── RoboticMower → On/Off Outlet
```

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Ensure code passes linting and tests
5. Submit a pull request

## License

Apache-2.0 © 2025-2026 Gardena Plugin Contributors

## Support

- 📖 [Plugin Documentation](https://github.com/Nagromdark/matterbridge-plugin-gardena)
- 🐛 [Report Issues](https://github.com/Nagromdark/matterbridge-plugin-gardena/issues)
- 💬 [Discussions](https://github.com/Nagromdark/matterbridge-plugin-gardena/discussions)

## Disclaimer

This plugin is not affiliated with Husqvarna Group or Gardena. Gardena is a registered trademark of the Husqvarna Group.

---

**Tip**: Start with a single device to test the integration before adding multiple devices.

- Monitor your GitHub Actions usage in your account settings.
- Consider disabling some workflows or reducing the OS/Node.js version matrix.
- Review GitHub's [pricing for Actions](https://github.com/pricing) to understand costs.
- For public repositories, GitHub Actions are free with generous limits.

## Getting Started

1. Create a repository from this template using the [template feature of GitHub](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-repository-from-a-template).
2. Clone it locally and open the cloned folder project with [VS Code](https://code.visualstudio.com/). If you have docker or docker desktop, just run `code .`.
3. When prompted, reopen in the devcontainer. VS Code will automatically build and start the development environment with all dependencies installed.
4. Update the code and configuration files as needed for your plugin. Change the name (keep always matterbridge- at the beginning of the name), version, description, author, homepage, repository, bugs and funding in the package.json.
5. Follow the instructions in the matterbridge [README-DEV](https://github.com/Luligu/matterbridge/blob/main/README-DEV.md) and comments in module.ts to implement your plugin logic.

## Using the Dev Container

- Docker Desktop or Docker Engine are required to use the Dev Container.
- Devcontainer works correctly on Linux, macOS, Windows, WSL2.
- The devcontainer provides Node.js, npm, TypeScript, ESLint, Prettier, Jest, Vitest and other tools and extensions pre-installed and configured.
- The dev branch of Matterbridge is already build and installed into the Dev Container and linked to the plugin.
- The devcontainer is optimized using named mounts for node_modules and matterbridge.
- You can run, build, and test your plugin directly inside the container.
- To open a terminal in the devcontainer, use the VS Code terminal after the container starts.
- All commands (npm, tsc, matterbridge etc.) will run inside the container environment.
- All the source files are on host.

## Dev containers networking limitations

Dev containers have networking limitations depending on the host OS and Docker setup.

• Docker Desktop on Windows or macOS:

- Runs inside a VM
- Host networking mode is NOT available
- Matterbridge and plugins can run but:
  - ❌ Pairing with Matter controllers will NOT work cause of missing mDNS support
  - ✅ Remote and local network access (cloud services, internet APIs) works normally
  - ✅ Matterbridge frontend works normally

• Native Linux or WSL 2 with Docker Engine CLI integration:

- Host networking IS available
- Full local network access is supported with mDNS
- Matterbridge and plugins work correctly, including pairing
- Matterbridge frontend works normally

## How to pair the plugin

When you want to test your plugin with a paired controller and you cannot use native Linux or WSL 2 with Docker Engine, you have several other options:

- create a tgz (npm run npmPack) and upload it to a running instance of matterbridge.
- publish the plugin with tag dev and install it (matterbridge-yourplugin@dev in Install plugins) in a running instance of matterbridge.
- use a local instance of matterbridge running outside the dev container and install (../matterbridge-yourplugin in Install plugins) or add (../matterbridge-yourplugin in Install plugins) your plugin to it (easiest way). Adjust the path if matterbridge dir and your plugin dir are not in the same parent directory.

## Documentation

Refer to the Matterbridge documentation for other guidelines.

---
