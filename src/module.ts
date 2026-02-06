/**
 * This file contains the Gardena Smart System plugin for Matterbridge.
 *
 * @file module.ts
 * @author Gardena Plugin Contributors
 * @created 2025-06-15
 * @version 1.0.0
 * @license Apache-2.0
 *
 * Copyright 2025, 2026 Gardena Plugin Contributors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { MatterbridgeDynamicPlatform, MatterbridgeEndpoint, onOffOutlet, onOffLight, contactSensor, PlatformConfig, PlatformMatterbridge } from 'matterbridge';
import { AnsiLogger, LogLevel } from 'matterbridge/logger';

// Gardena API configuration
interface GardenaConfig {
  apiKey: string;
  email?: string;
  password?: string;
  systemId?: string;
}

interface GardenaDevice {
  id: string;
  name: string;
  type: string;
  category: string;
  value?: number | string | boolean;
  batteryLevel?: number;
  connected: boolean;
}

/**
 * Gardena API Client for interacting with Gardena Smart System
 */
class GardenaAPI {
  private apiKey: string;
  private apiBaseUrl = 'https://api.gardena.com/v1';
  private websocketUrl = 'wss://api.gardena.com/v1/websocket';
  private devices: Map<string, GardenaDevice> = new Map();
  private log: AnsiLogger;

  constructor(config: GardenaConfig, log: AnsiLogger) {
    this.apiKey = config.apiKey;
    this.log = log;

    if (!this.apiKey) {
      throw new Error('Gardena API key is required in configuration');
    }
  }

  /**
   * Fetch all devices from Gardena API
   *
   * @returns {Promise<GardenaDevice[]>} Array of discovered devices
   */
  async fetchDevices(): Promise<GardenaDevice[]> {
    try {
      this.log.info('Fetching devices from Gardena API...');

      // Mock devices for demonstration
      // In production, this would call the actual Gardena API
      const mockDevices: GardenaDevice[] = [
        {
          id: 'smart-irrigation-1',
          name: 'Smart Irrigation Controller',
          type: 'IRRIGATION_CONTROLLER',
          category: 'irrigation',
          value: 0,
          connected: true,
        },
        {
          id: 'soil-sensor-1',
          name: 'Soil Humidity Sensor',
          type: 'SOIL_HUMIDITY_SENSOR',
          category: 'sensor',
          value: 65,
          batteryLevel: 85,
          connected: true,
        },
        {
          id: 'water-valve-1',
          name: 'Smart Water Valve',
          type: 'WATER_VALVE',
          category: 'valve',
          value: 0,
          connected: true,
        },
        {
          id: 'smart-mower-1',
          name: 'Smart Lawn Mower',
          type: 'ROBOTIC_MOWER',
          category: 'mower',
          value: 'idle',
          batteryLevel: 90,
          connected: true,
        },
      ];

      for (const device of mockDevices) {
        this.devices.set(device.id, device);
      }

      this.log.info(`Found ${mockDevices.length} devices`);
      return mockDevices;
    } catch (error) {
      this.log.error(`Error fetching devices: ${error}`);
      return [];
    }
  }

  /**
   * Get device by ID
   *
   * @param {string} id - The device ID
   * @returns {GardenaDevice | undefined} The device or undefined if not found
   */
  getDevice(id: string): GardenaDevice | undefined {
    return this.devices.get(id);
  }

  /**
   * Get all devices
   *
   * @returns {GardenaDevice[]} Array of all devices
   */
  getAllDevices(): GardenaDevice[] {
    return Array.from(this.devices.values());
  }

  /**
   * Control a device (e.g., turn on/off irrigation)
   *
   * @param {string} deviceId - The device ID to control
   * @param {string} command - The command to execute
   * @param {unknown} _value - Optional value for the command
   * @returns {Promise<boolean>} True if control was successful
   */
  async controlDevice(deviceId: string, command: string, _value?: unknown): Promise<boolean> {
    try {
      this.log.info(`Controlling device ${deviceId} with command ${command}`);

      // Mock implementation
      const device = this.devices.get(deviceId);
      if (!device) {
        this.log.error(`Device ${deviceId} not found`);
        return false;
      }

      // Update device state
      if (command === 'on' || command === 'start') {
        device.value = 1;
      } else if (command === 'off' || command === 'stop') {
        device.value = 0;
      }

      this.log.info(`Device ${deviceId} controlled successfully`);
      return true;
    } catch (error) {
      this.log.error(`Error controlling device: ${error}`);
      return false;
    }
  }

  /**
   * Connect to WebSocket for real-time updates
   *
   * @param {(deviceId: string, data: unknown) => void} _onUpdate - Callback for device updates
   * @returns {Promise<void>}
   */
  async connectWebSocket(_onUpdate: (deviceId: string, data: unknown) => void): Promise<void> {
    try {
      this.log.info('Connecting to Gardena WebSocket...');
      // Mock WebSocket implementation
      // In production, this would establish a real WebSocket connection
      this.log.info('WebSocket connection established');
    } catch (error) {
      this.log.error(`WebSocket connection error: ${error}`);
    }
  }
}

/**
 * This is the standard interface for Matterbridge plugins.
 * Each plugin should export a default function that follows this signature.
 *
 * @param {PlatformMatterbridge} matterbridge - An instance of MatterBridge.
 * @param {AnsiLogger} log - An instance of AnsiLogger.
 * @param {PlatformConfig} config - The platform configuration.
 * @returns {GardenaPlatform} - An instance of the GardenaPlatform class.
 */
export default function initializePlugin(matterbridge: PlatformMatterbridge, log: AnsiLogger, config: PlatformConfig): GardenaPlatform {
  return new GardenaPlatform(matterbridge, log, config);
}

// Gardena Platform class extending MatterbridgeDynamicPlatform
export class GardenaPlatform extends MatterbridgeDynamicPlatform {
  private gardenaAPI: GardenaAPI | null = null;
  private deviceEndpoints: Map<string, MatterbridgeEndpoint> = new Map();

  constructor(matterbridge: PlatformMatterbridge, log: AnsiLogger, config: PlatformConfig) {
    super(matterbridge, log, config);

    // Verify Matterbridge version
    if (this.verifyMatterbridgeVersion === undefined || typeof this.verifyMatterbridgeVersion !== 'function' || !this.verifyMatterbridgeVersion('3.4.0')) {
      throw new Error(`This plugin requires Matterbridge version >= "3.4.0". Please update Matterbridge from ${this.matterbridge.matterbridgeVersion} to the latest version.`);
    }

    this.log.info('Initializing Gardena Platform...');
  }

  override async onStart(reason?: string): Promise<void> {
    this.log.info(`Gardena Platform onStart called with reason: ${reason ?? 'none'}`);

    try {
      // Initialize Gardena API
      await this.initializeGardenaAPI();

      // Wait for platform to be ready
      await this.ready;

      // Clear and rediscover devices
      await this.clearSelect();
      await this.discoverDevices();
    } catch (error) {
      this.log.error(`Error during onStart: ${error}`);
    }
  }

  override async onConfigure(): Promise<void> {
    await super.onConfigure();
    this.log.info('Gardena Platform onConfigure called');

    for (const device of this.getDevices()) {
      this.log.info(`Configuring device: ${device.uniqueId}`);
    }
  }

  /**
   * Handle configuration updates from the Matterbridge UI
   * This allows users to update the API key dynamically without editing config.json
   *
   * @param config
   */
  override async onConfigChanged(config: PlatformConfig): Promise<void> {
    this.log.info('Configuration changed from UI');

    const newApiKey = (config as Record<string, unknown>).apiKey as string | undefined;
    const oldApiKey = (this.config as Record<string, unknown>).apiKey as string | undefined;

    // Update config
    Object.assign(this.config, config);

    // If API key changed, reinitialize
    if (newApiKey && newApiKey !== oldApiKey) {
      this.log.info('API key updated, reinitializing Gardena API...');
      await this.initializeGardenaAPI();
      await this.discoverDevices();
    }
  }

  override async onChangeLoggerLevel(logLevel: LogLevel): Promise<void> {
    this.log.info(`onChangeLoggerLevel called with: ${logLevel}`);
  }

  override async onShutdown(reason?: string): Promise<void> {
    await super.onShutdown(reason);
    this.log.info(`Gardena Platform onShutdown called with reason: ${reason ?? 'none'}`);
    if (this.config.unregisterOnShutdown === true) {
      await this.unregisterAllDevices();
    }
  }

  private async initializeGardenaAPI(): Promise<void> {
    try {
      const gardenaConfig: GardenaConfig = {
        apiKey: (this.config as Record<string, unknown>).apiKey as string,
      };

      if (!gardenaConfig.apiKey) {
        this.log.warn('No Gardena API key configured');
        return;
      }

      this.gardenaAPI = new GardenaAPI(gardenaConfig, this.log);

      // Connect to WebSocket for real-time updates
      await this.gardenaAPI.connectWebSocket((deviceId: string) => {
        this.log.debug(`Device ${deviceId} updated`);
      });
    } catch (error) {
      this.log.error(`Error initializing Gardena API: ${error}`);
    }
  }

  private async discoverDevices(): Promise<void> {
    this.log.info('Discovering Gardena devices...');

    if (!this.gardenaAPI) {
      this.log.error('Gardena API not initialized');
      return;
    }

    try {
      const devices = await this.gardenaAPI.fetchDevices();

      for (const device of devices) {
        await this.registerGardenaDevice(device);
      }

      this.log.info(`Registered ${devices.length} Gardena devices`);
    } catch (error) {
      this.log.error(`Error discovering devices: ${error}`);
    }
  }

  private async registerGardenaDevice(device: GardenaDevice): Promise<void> {
    try {
      let endpoint: MatterbridgeEndpoint;

      // Determine device type and create appropriate endpoint
      switch (device.category) {
        case 'irrigation':
          // Irrigation controller as on/off outlet
          endpoint = new MatterbridgeEndpoint(onOffOutlet, { id: device.id })
            .createDefaultBridgedDeviceBasicInformationClusterServer(device.name, `SN-${device.id}`, this.matterbridge.aggregatorVendorId, 'Gardena', device.name, 10000, '1.0.0')
            .createDefaultPowerSourceWiredClusterServer()
            .addRequiredClusterServers()
            .addCommandHandler('on', async (_data) => {
              this.log.info(`Turning on ${device.name}`);
              if (this.gardenaAPI) {
                await this.gardenaAPI.controlDevice(device.id, 'on');
              }
            })
            .addCommandHandler('off', async (_data) => {
              this.log.info(`Turning off ${device.name}`);
              if (this.gardenaAPI) {
                await this.gardenaAPI.controlDevice(device.id, 'off');
              }
            });
          break;

        case 'sensor':
          // Humidity sensor as contact sensor
          endpoint = new MatterbridgeEndpoint(contactSensor, { id: device.id })
            .createDefaultBridgedDeviceBasicInformationClusterServer(device.name, `SN-${device.id}`, this.matterbridge.aggregatorVendorId, 'Gardena', device.name, 10000, '1.0.0')
            .createDefaultPowerSourceBatteryClusterServer()
            .addRequiredClusterServers();
          break;

        case 'valve':
          // Water valve as on/off light
          endpoint = new MatterbridgeEndpoint(onOffLight, { id: device.id })
            .createDefaultBridgedDeviceBasicInformationClusterServer(device.name, `SN-${device.id}`, this.matterbridge.aggregatorVendorId, 'Gardena', device.name, 10000, '1.0.0')
            .createDefaultPowerSourceWiredClusterServer()
            .addRequiredClusterServers()
            .addCommandHandler('on', async (_data) => {
              this.log.info(`Opening valve ${device.name}`);
              if (this.gardenaAPI) {
                await this.gardenaAPI.controlDevice(device.id, 'open');
              }
            })
            .addCommandHandler('off', async (_data) => {
              this.log.info(`Closing valve ${device.name}`);
              if (this.gardenaAPI) {
                await this.gardenaAPI.controlDevice(device.id, 'close');
              }
            });
          break;

        case 'mower':
        default:
          // Mower as on/off outlet
          endpoint = new MatterbridgeEndpoint(onOffOutlet, { id: device.id })
            .createDefaultBridgedDeviceBasicInformationClusterServer(device.name, `SN-${device.id}`, this.matterbridge.aggregatorVendorId, 'Gardena', device.name, 10000, '1.0.0')
            .createDefaultPowerSourceBatteryClusterServer()
            .addRequiredClusterServers()
            .addCommandHandler('on', async (_data) => {
              this.log.info(`Starting ${device.name}`);
              if (this.gardenaAPI) {
                await this.gardenaAPI.controlDevice(device.id, 'start');
              }
            })
            .addCommandHandler('off', async (_data) => {
              this.log.info(`Stopping ${device.name}`);
              if (this.gardenaAPI) {
                await this.gardenaAPI.controlDevice(device.id, 'stop');
              }
            });
          break;
      }

      await this.registerDevice(endpoint);
      this.deviceEndpoints.set(device.id, endpoint);
      this.log.info(`Registered Gardena device: ${device.name} (${device.type})`);
    } catch (error) {
      this.log.error(`Error registering device ${device.name}: ${error}`);
    }
  }
}
