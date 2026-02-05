# Installation Guide - Matterbridge Gardena Smart System Plugin

This guide will walk you through installing and configuring the Gardena Smart System Plugin for Matterbridge.

## Prerequisites

- **Node.js**: Version 20, 22, or 24
- **Matterbridge**: Version 3.4.0 or higher
- **Gardena Account**: Active Gardena Smart System account with devices
- **API Key**: Gardena API authentication token

## Step 1: Get Your Gardena API Key

### Option A: Using OAuth2 (Recommended)

1. Visit [Gardena Smart System Developer Portal](https://www.gardena.com/api/v1/documentation)
2. Sign in with your Gardena account
3. Create a new application
4. Generate authentication credentials
5. Copy your API key/token

### Option B: Using Email & Password

If you prefer not to use OAuth2:

1. Use your Gardena account email and password
2. Note: This method is less secure - OAuth2 is recommended

## Step 2: Install the Plugin

### Via Matterbridge Web UI (Easiest)

1. Open Matterbridge Web Interface
   - Default: `http://localhost:8080`
2. Navigate to **Plugins** section
3. Search for **"Gardena"**
4. Click **"Install"**
5. The plugin will be automatically installed

### Via NPM (Manual)

1. Navigate to your Matterbridge directory:

   ```bash
   cd ~/.matterbridge/plugins
   ```

2. Install the plugin:

   ```bash
   npm install matterbridge-gardena-smart-system
   ```

3. Restart Matterbridge

### Via Docker

If using Docker, mount the plugin directory:

```bash
docker run -v ~/.matterbridge:/home/node/.matterbridge \
  -p 5540:5540 \
  luligu/matterbridge:latest
```

## Step 3: Configure the Plugin

### Via Matterbridge Web UI (Recommended)

1. In the Web UI, go to **Plugins** > **Gardena**
2. Fill in the configuration:
   - **API Key**: Your Gardena API token (required)
   - **Debug**: Enable for detailed logging (optional)
   - **Unregister on Shutdown**: Auto-cleanup devices (optional)
3. Click **"Save"**
4. Plugin will restart automatically

### Via Configuration File

Edit your Matterbridge configuration file (`~/.matterbridge/config.json`):

```json
{
  "bridge": {
    "name": "My Matterbridge",
    "username": "CC:22:3D:E3:CE:30",
    "pin": "031-45-154",
    "port": 5580
  },
  "platforms": [
    {
      "platform": "matterbridge-gardena-smart-system",
      "name": "Gardena",
      "type": "DynamicPlatform",
      "apiKey": "YOUR_API_KEY_HERE",
      "debug": false,
      "unregisterOnShutdown": false
    }
  ]
}
```

## Step 4: Verify Installation

### Check Plugin Status

1. Open Matterbridge Web UI
2. Look for **"Gardena"** in the plugins list
3. Status should show **"Running"** (green icon)

### View Discovered Devices

1. In Matterbridge Web UI, go to **Devices**
2. Look for devices starting with **"Gardena"**
3. You should see:
   - Smart Irrigation Controller
   - Soil Humidity Sensor(s)
   - Smart Water Valve(s)
   - Smart Lawn Mower (if available)

### Check Logs

1. In Matterbridge Web UI, go to **Logs**
2. Filter for **"Gardena"**
3. You should see device discovery messages:
   ```
   Found 4 devices
   Registered Gardena device: Smart Irrigation Controller (IRRIGATION_CONTROLLER)
   Registered Gardena device: Soil Humidity Sensor (SOIL_HUMIDITY_SENSOR)
   ...
   ```

## Step 5: Add to Smart Home System

### HomeKit / Apple Home

1. Open Apple Home app
2. Add device
3. Scan code from Matterbridge bridge
4. Gardena devices automatically appear

### Google Home

1. Open Google Home app
2. Set up device
3. Link Matterbridge as a Matter accessory
4. Devices sync automatically

### Amazon Alexa

1. Open Alexa app
2. Enable Matter skill
3. Discover devices
4. Gardena devices should appear

### Home Assistant

1. Settings → Devices & Services
2. Matter: Configure
3. Add Matterbridge as Matter server
4. Devices auto-discovered

## Troubleshooting Installation

### Plugin Not Appearing

**Problem**: Plugin doesn't show in Matterbridge Web UI

**Solutions**:

- Restart Matterbridge: `systemctl restart matterbridge`
- Check Matterbridge version: `matterbridge --version` (must be 3.4.0+)
- Check log for errors: Look in Logs section

### API Key Invalid

**Problem**: "API key is required" or "Invalid API key" error

**Solutions**:

- Verify your Gardena API key
- Try regenerating the key in Gardena portal
- Check for extra spaces in the key
- Ensure you're using the token, not the client ID

### No Devices Discovered

**Problem**: Plugin shows no Gardena devices

**Solutions**:

- Verify Gardena devices are powered on
- Check Gardena app - devices visible there?
- Ensure WiFi connectivity
- Check API key permissions
- Review logs for connection errors

### WebSocket Connection Failed

**Problem**: Real-time updates not working

**Solutions**:

- Check internet connection
- Verify firewall allows WebSocket connections
- Check Matterbridge logs
- Restart the plugin

### Device Not Responding

**Problem**: Can't control a specific device

**Solutions**:

- Verify device is powered and connected
- Check battery level (for wireless devices)
- Restart the device
- Remove and re-add the plugin

## Advanced Configuration

### Enable Debug Logging

Edit config.json:

```json
{
  "platform": "matterbridge-gardena-smart-system",
  "debug": true
}
```

### Filter Specific System

```json
{
  "platform": "matterbridge-gardena-smart-system",
  "systemId": "system-123456"
}
```

### Custom Device Name

Not directly supported in config, but can be renamed via:

- Matterbridge Web UI
- Smart Home app (HomeKit, etc.)

## Security Best Practices

1. **Protect Your API Key**:
   - Don't share configuration files
   - Use environment variables for sensitive data
   - Rotate API keys periodically

2. **Use HTTPS**:
   - Access Matterbridge via HTTPS when possible
   - Use strong passwords for Web UI

3. **Update Regularly**:
   - Keep Matterbridge updated
   - Keep plugin updated (`npm update`)
   - Review security advisories

4. **Monitor Logs**:
   - Check logs for unauthorized access
   - Monitor device control commands
   - Alert on connection failures

## Next Steps

After successful installation:

1. **Test Device Control**:
   - Turn irrigation on/off
   - Check sensor readings
   - Operate water valves

2. **Set Up Automation**:
   - Create scenes in HomeKit
   - Set up routines in Google Home
   - Build automations in Home Assistant

3. **Monitor Performance**:
   - Check device battery levels
   - Monitor connection stability
   - Review usage patterns

4. **Customize Setup**:
   - Rename devices for clarity
   - Organize into rooms/zones
   - Create meaningful scenes

## Getting Help

### Documentation

- [README.md](README.md) - Full feature documentation
- [ARCHITECTURE.md](ARCHITECTURE.md) - Technical architecture
- [API Documentation](#) - API reference (coming soon)

### Support Resources

- [GitHub Issues](https://github.com/Nagromdark/matterbridge-gardena-smart-system/issues)
- [GitHub Discussions](https://github.com/Nagromdark/matterbridge-gardena-smart-system/discussions)
- [Gardena Support](https://www.gardena.com/support)
- [Matterbridge Wiki](https://github.com/Luligu/matterbridge/wiki)

### Reporting Issues

When reporting issues, please include:

- Matterbridge version
- Plugin version
- Node.js version
- Relevant error messages from logs
- Steps to reproduce
- Device types you're using

## Uninstallation

### Via Matterbridge Web UI

1. Go to **Plugins**
2. Find **Gardena**
3. Click **"Uninstall"**
4. Confirm the action

### Via NPM

```bash
cd ~/.matterbridge/plugins
npm uninstall matterbridge-gardena-smart-system
```

### Manual Cleanup

Remove plugin directory:

```bash
rm -rf ~/.matterbridge/plugins/gardena
```

---

**Congratulations!** You have successfully installed the Matterbridge Gardena Plugin. Enjoy controlling your Gardena devices from your smart home!

For more information, see the [README](README.md) and [ARCHITECTURE](ARCHITECTURE.md) documentation.
