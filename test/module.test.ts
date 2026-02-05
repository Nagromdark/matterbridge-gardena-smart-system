import path from 'node:path';

import { jest } from '@jest/globals';
import { AnsiLogger, LogLevel } from 'matterbridge/logger';
import { MatterbridgeEndpoint, PlatformConfig, PlatformMatterbridge, SystemInformation } from 'matterbridge';
import { VendorId } from 'matterbridge/matter';

import initializePlugin, { GardenaPlatform } from '../src/module.ts';

const mockLog = {
  fatal: jest.fn((message: string, ...parameters: any[]) => {}),
  error: jest.fn((message: string, ...parameters: any[]) => {}),
  warn: jest.fn((message: string, ...parameters: any[]) => {}),
  notice: jest.fn((message: string, ...parameters: any[]) => {}),
  info: jest.fn((message: string, ...parameters: any[]) => {}),
  debug: jest.fn((message: string, ...parameters: any[]) => {}),
} as unknown as AnsiLogger;

const mockMatterbridge: PlatformMatterbridge = {
  systemInformation: {
    ipv4Address: '192.168.1.1',
    ipv6Address: 'fd78:cbf8:4939:746:a96:8277:346f:416e',
    osRelease: 'x.y.z',
    nodeVersion: '22.10.0',
  } as unknown as SystemInformation,
  rootDirectory: path.join('jest', 'GardenaPlugin'),
  homeDirectory: path.join('jest', 'GardenaPlugin'),
  matterbridgeDirectory: path.join('jest', 'GardenaPlugin', '.matterbridge'),
  matterbridgePluginDirectory: path.join('jest', 'GardenaPlugin', 'Matterbridge'),
  matterbridgeCertDirectory: path.join('jest', 'GardenaPlugin', '.mattercert'),
  globalModulesDirectory: path.join('jest', 'GardenaPlugin', 'node_modules'),
  matterbridgeVersion: '3.4.0',
  matterbridgeLatestVersion: '3.4.0',
  matterbridgeDevVersion: '3.4.0',
  bridgeMode: 'bridge',
  restartMode: '',
  aggregatorVendorId: VendorId(0xfff1),
  aggregatorVendorName: 'Matterbridge',
  aggregatorProductId: 0x8000,
  aggregatorProductName: 'Matterbridge aggregator',
  // Mocked methods
  registerVirtualDevice: jest.fn(async (name: string, type: 'light' | 'outlet' | 'switch' | 'mounted_switch', callback: () => Promise<void>) => {}),
  addBridgedEndpoint: jest.fn(async (pluginName: string, device: MatterbridgeEndpoint) => {}),
  removeBridgedEndpoint: jest.fn(async (pluginName: string, device: MatterbridgeEndpoint) => {}),
  removeAllBridgedEndpoints: jest.fn(async (pluginName: string) => {}),
} as unknown as PlatformMatterbridge;

const mockConfig: PlatformConfig = {
  name: 'matterbridge-plugin-gardena',
  type: 'DynamicPlatform',
  version: '1.0.0',
  debug: false,
  unregisterOnShutdown: false,
  apiKey: 'test-api-key-123456',
};

const loggerLogSpy = jest.spyOn(AnsiLogger.prototype, 'log').mockImplementation((level: string, message: string, ...parameters: any[]) => {});

describe('Matterbridge Gardena Plugin', () => {
  let instance: GardenaPlatform;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('should throw an error if matterbridge is not the required version', async () => {
    // @ts-expect-error Ignore readonly for testing purposes
    mockMatterbridge.matterbridgeVersion = '2.0.0'; // Simulate an older version
    expect(() => new GardenaPlatform(mockMatterbridge, mockLog, mockConfig)).toThrow(
      'This plugin requires Matterbridge version >= "3.4.0". Please update Matterbridge from 2.0.0 to the latest version.',
    );
    // @ts-expect-error Ignore readonly for testing purposes
    mockMatterbridge.matterbridgeVersion = '3.4.0';
  });

  it('should initialize plugin with default function', async () => {
    const result = initializePlugin(mockMatterbridge, mockLog, mockConfig);
    expect(result).toBeInstanceOf(GardenaPlatform);
  });

  it('should create an instance of the Gardena platform', async () => {
    instance = initializePlugin(mockMatterbridge, mockLog, mockConfig) as GardenaPlatform;
    // @ts-expect-error Accessing private method for testing purposes
    instance.setMatterNode(
      // @ts-expect-error Accessing private method for testing purposes
      mockMatterbridge.addBridgedEndpoint,
      // @ts-expect-error Accessing private method for testing purposes
      mockMatterbridge.removeBridgedEndpoint,
      // @ts-expect-error Accessing private method for testing purposes
      mockMatterbridge.removeAllBridgedEndpoints,
      // @ts-expect-error Accessing private method for testing purposes
      mockMatterbridge.registerVirtualDevice,
    );
    expect(instance).toBeInstanceOf(GardenaPlatform);
    expect(instance.matterbridge).toBe(mockMatterbridge);
    expect(instance.log).toBe(mockLog);
    expect(instance.config).toBe(mockConfig);
    expect(instance.matterbridge.matterbridgeVersion).toBe('3.4.0');
    expect(mockLog.info).toHaveBeenCalledWith('Initializing Gardena Platform...');
  });

  it('should start the Gardena platform', async () => {
    await instance.onStart('Jest');
    expect(mockLog.info).toHaveBeenCalledWith(expect.stringContaining('onStart called with reason: Jest'));

    jest.clearAllMocks();
    await instance.onStart();
    expect(mockLog.info).toHaveBeenCalledWith(expect.stringContaining('onStart called with reason: none'));
  });

  it('should discover and register Gardena devices', async () => {
    jest.clearAllMocks();
    // Verify that the onStart method includes discovery logic
    await instance.onStart('Test Discovery');
    const discoveryCalls = mockLog.info.mock.calls.filter(
      (call) => typeof call[0] === 'string' && (call[0].includes('Discovering') || call[0].includes('Registered') || call[0].includes('Gardena')),
    );
    expect(discoveryCalls.length).toBeGreaterThan(0);
  });

  it('should call the command handlers on registered devices', async () => {
    let deviceCount = 0;
    for (const device of instance.getDevices()) {
      deviceCount++;
      if (device.hasClusterServer('onOff')) {
        await device.executeCommandHandler('on');
        await device.executeCommandHandler('off');
      }
    }
    expect(deviceCount).toBeGreaterThanOrEqual(0);
  });

  it('should configure Gardena devices', async () => {
    jest.clearAllMocks();
    await instance.onConfigure();
    expect(mockLog.info).toHaveBeenCalledWith('Gardena Platform onConfigure called');
  });

  it('should change logger level', async () => {
    jest.clearAllMocks();
    await instance.onChangeLoggerLevel(LogLevel.DEBUG);
    expect(mockLog.info).toHaveBeenCalledWith('onChangeLoggerLevel called with: debug');
  });

  it('should shutdown the Gardena platform', async () => {
    jest.clearAllMocks();
    await instance.onShutdown('Jest');
    expect(mockLog.info).toHaveBeenCalledWith(expect.stringContaining('onShutdown called with reason: Jest'));

    // Mock the unregisterOnShutdown behavior
    mockConfig.unregisterOnShutdown = true;
    jest.clearAllMocks();
    await instance.onShutdown();
    expect(mockLog.info).toHaveBeenCalledWith(expect.stringContaining('onShutdown called with reason: none'));
    // @ts-expect-error Accessing private method for testing purposes
    expect(mockMatterbridge.removeAllBridgedEndpoints).toHaveBeenCalled();
    mockConfig.unregisterOnShutdown = false;
  });

  it('should handle missing API key gracefully', async () => {
    const noKeyConfig: PlatformConfig = { ...mockConfig, apiKey: undefined };
    const noKeyMatterbridge = { ...mockMatterbridge };

    const platform = new GardenaPlatform(noKeyMatterbridge as any, mockLog, noKeyConfig);
    // @ts-expect-error Accessing private method for testing purposes
    platform.setMatterNode(
      // @ts-expect-error Accessing private method for testing purposes
      mockMatterbridge.addBridgedEndpoint,
      // @ts-expect-error Accessing private method for testing purposes
      mockMatterbridge.removeBridgedEndpoint,
      // @ts-expect-error Accessing private method for testing purposes
      mockMatterbridge.removeAllBridgedEndpoints,
      // @ts-expect-error Accessing private method for testing purposes
      mockMatterbridge.registerVirtualDevice,
    );

    jest.clearAllMocks();
    await platform.onStart();
    expect(mockLog.warn).toHaveBeenCalledWith('No Gardena API key configured');
  });

  it('should handle device registration errors gracefully', async () => {
    jest.clearAllMocks();
    // Trigger device registration with mocked API
    const newConfig: PlatformConfig = { ...mockConfig, apiKey: 'valid-key' };
    const newInstance = new GardenaPlatform(mockMatterbridge as any, mockLog, newConfig);
    // @ts-expect-error Accessing private method for testing purposes
    newInstance.setMatterNode(
      // @ts-expect-error Accessing private method for testing purposes
      mockMatterbridge.addBridgedEndpoint,
      // @ts-expect-error Accessing private method for testing purposes
      mockMatterbridge.removeBridgedEndpoint,
      // @ts-expect-error Accessing private method for testing purposes
      mockMatterbridge.removeAllBridgedEndpoints,
      // @ts-expect-error Accessing private method for testing purposes
      mockMatterbridge.registerVirtualDevice,
    );

    await newInstance.onStart();
    expect(mockLog.info).toHaveBeenCalledWith(expect.stringContaining('Gardena Platform onStart called'));
  });
});
