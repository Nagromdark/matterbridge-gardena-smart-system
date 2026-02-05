# Matterbridge Gardena Smart System Plugin - Architecture

## Overview

The Gardena Smart System Plugin for Matterbridge is a dynamic platform that integrates Gardena smart devices with the Matter protocol ecosystem. It provides automatic device discovery, real-time synchronization, and comprehensive device control.

## System Architecture

```
┌─────────────────────────────────────────────────────┐
│              Matterbridge Core                      │
└──────────────────┬──────────────────────────────────┘
                   │
        ┌──────────▼──────────┐
        │  GardenaPlatform    │
        │ (Dynamic Platform)  │
        └──────────┬──────────┘
                   │
        ┌──────────▼──────────────┐
        │    GardenaAPI Client    │
        └──────────┬──────────────┘
                   │
    ┌──────────────┼──────────────┐
    │              │              │
┌───▼──┐    ┌──────▼──────┐   ┌──▼──┐
│ REST │    │  WebSocket  │   │Cache│
│ API  │    │ (Real-time) │   │    │
└──────┘    └─────────────┘   └─────┘
```

## Core Components

### 1. GardenaPlatform Class

**File**: `src/module.ts`

**Extends**: `MatterbridgeDynamicPlatform`

**Responsibilities**:
- Platform lifecycle management (start, configure, shutdown)
- Device discovery and registration
- Device endpoint creation and management
- Command handler routing
- Error handling and logging

**Key Methods**:
```typescript
- constructor()        // Initialize platform
- onStart()           // Start device discovery
- onConfigure()       // Configure all devices
- onShutdown()        // Clean shutdown
- discoverDevices()   // Discover Gardena devices
- registerGardenaDevice() // Register device as Matter endpoint
```

### 2. GardenaAPI Class

**File**: `src/module.ts`

**Responsibilities**:
- API communication with Gardena servers
- Device state management
- Real-time updates via WebSocket
- Device command execution

**Key Methods**:
```typescript
- constructor()       // Initialize with API key
- fetchDevices()      // Discover all devices
- getDevice()         // Get device by ID
- getAllDevices()     // Get all cached devices
- controlDevice()     // Send command to device
- connectWebSocket()  // Establish real-time connection
```

**Data Structures**:
```typescript
interface GardenaConfig {
  apiKey: string;         // Required API key
  email?: string;         // Optional email
  password?: string;      // Optional password
  systemId?: string;      // Optional system ID
}

interface GardenaDevice {
  id: string;            // Unique identifier
  name: string;          // Display name
  type: string;          // Device type
  category: string;      // Device category
  value?: number | string | boolean; // Current state
  batteryLevel?: number; // Battery percentage
  connected: boolean;    // Connection status
}
```

## Device Mapping

The plugin maps Gardena device types to Matter device types:

| Gardena Type | Matter Type | Control | Features |
|---|---|---|---|
| IRRIGATION_CONTROLLER | On/Off Outlet | on/off | Flow control |
| SOIL_HUMIDITY_SENSOR | Contact Sensor | read-only | Battery monitoring |
| WATER_VALVE | On/Off Light | on/off | Open/close valve |
| ROBOTIC_MOWER | On/Off Outlet | on/off | Start/stop, battery |

## Device Endpoint Creation Flow

```
┌──────────────────────────────────┐
│  discoverDevices()               │
└──────────────┬───────────────────┘
               │
               ▼
┌──────────────────────────────────┐
│  fetchDevices() from API         │
└──────────────┬───────────────────┘
               │
               ▼
┌──────────────────────────────────┐
│  For each device:                │
│  registerGardenaDevice()         │
└──────────────┬───────────────────┘
               │
    ┌──────────┴──────────┐
    │                     │
    ▼                     ▼
┌─────────────┐    ┌──────────────────┐
│ Determine   │───▶│ Create appropriate│
│ device type │    │ Matter endpoint  │
└─────────────┘    └────────┬─────────┘
                            │
                            ▼
                   ┌──────────────────┐
                   │ Add command      │
                   │ handlers         │
                   └────────┬─────────┘
                            │
                            ▼
                   ┌──────────────────┐
                   │ Register with    │
                   │ Matterbridge     │
                   └──────────────────┘
```

## Command Flow

```
User Command (e.g., "Turn on irrigation")
       │
       ▼
Matter Protocol Handler
       │
       ▼
Matterbridge Device
       │
       ▼
Platform Command Handler
       │
       ▼
GardenaAPI.controlDevice()
       │
       ▼
REST API Call to Gardena
       │
       ▼
Device State Updated
```

## Real-time Update Flow

```
Gardena Device State Change
       │
       ▼
WebSocket Server
       │
       ▼
GardenaAPI WebSocket Handler
       │
       ▼
Device Cache Updated
       │
       ▼
Notifies Matterbridge
       │
       ▼
Matter Clients Notified
```

## Testing Architecture

The test suite validates all major components:

```
test/module.test.ts
├── Version checking
├── Plugin initialization
├── Platform lifecycle
│   ├── onStart()
│   ├── onConfigure()
│   ├── onShutdown()
│   └── onChangeLoggerLevel()
├── Device discovery
├── Device registration
├── Command handlers
├── Error handling
│   ├── Missing API key
│   └── Registration failures
└── Integration tests
```

## Error Handling Strategy

The plugin implements multiple layers of error handling:

1. **API Level**: Catches network and parsing errors
2. **Device Level**: Handles device-specific failures
3. **Platform Level**: Manages lifecycle errors
4. **Logging**: Comprehensive error logging for debugging

```typescript
try {
  // Operation
} catch (error) {
  this.log.error(`Detailed error message: ${error}`);
  // Graceful degradation
}
```

## Configuration Schema

The plugin configuration is validated against a JSON schema:

```json
{
  "name": "Gardena",
  "type": "DynamicPlatform",
  "apiKey": "required",
  "email": "optional",
  "password": "optional",
  "systemId": "optional",
  "debug": "boolean",
  "unregisterOnShutdown": "boolean"
}
```

## State Management

Device state is managed at multiple levels:

1. **Cache Level**: GardenaAPI maintains device cache
2. **Endpoint Level**: Matter endpoint holds device state
3. **Matter Level**: Matter protocol manages cluster state

## Security Considerations

- API keys are stored in configuration (not in code)
- WebSocket uses WSS (secure) protocol
- No device credentials stored locally
- Authentication delegated to Gardena servers

## Performance Optimizations

1. **Device Caching**: Avoids repeated API calls
2. **WebSocket**: Real-time updates without polling
3. **Batch Operations**: Device discovery happens once
4. **Async Operations**: Non-blocking API calls

## Extensibility

The architecture supports future enhancements:

1. **Additional Device Types**: Easy to add new device mappings
2. **Custom Commands**: Add device-specific commands
3. **Automation Rules**: Support for scheduling and automation
4. **Advanced Sensors**: Support for additional sensor types

## Deployment Architecture

```
┌─────────────────────────────┐
│    Docker Container         │
│  ┌───────────────────────┐  │
│  │  Matterbridge Core    │  │
│  │  ┌─────────────────┐  │  │
│  │  │ Gardena Plugin  │  │  │
│  │  └──────┬──────────┘  │  │
│  └────────┼──────────────┘  │
└───────────┼─────────────────┘
            │
     ┌──────┴──────┐
     │             │
     ▼             ▼
 Gardena    Matter Endpoints
 API       (Homekit, Google
            Home, Alexa)
```

## Data Flow

```
Configuration File
       │
       ▼
Plugin Initialization
       │
       ▼
Gardena API Connection
       │
       ├──▶ Device Discovery (REST)
       │
       ├──▶ Real-time Updates (WebSocket)
       │
       └──▶ Device Control (REST)
       │
       ▼
Matter Protocol
       │
       └──▶ Smart Home Ecosystem
```

## Future Enhancements

Potential improvements for future releases:

1. **MQTT Support**: Add MQTT protocol support
2. **Scheduling**: Built-in scheduling and automation
3. **History**: Store and display device history
4. **Analytics**: Usage analytics and reports
5. **Multi-system**: Support multiple Gardena systems
6. **Custom Scenes**: Create custom automation scenes

---

**Version**: 1.0.0  
**Last Updated**: 2025-02-05  
**License**: Apache-2.0
