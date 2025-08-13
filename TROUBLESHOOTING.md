# Troubleshooting Guide - AppPilot Service Management

## Common Issues and Solutions

### 1. "Interactive authentication required" Error

**Problem**: Service control fails with "Interactive authentication required"

**Causes**:
- Service is configured as a user service
- Service requires specific user context
- **Polkit/PolicyKit authentication rules override sudo permissions**
- Service has specific security requirements

**Solutions**:

#### Option A: Install Polkit Rules (Recommended)
The application now includes Polkit rules to resolve this issue:

```bash
# Install Polkit rules to allow kali user to manage services
sudo ./install-polkit-rules.sh

# Or install the more permissive version
sudo cp polkit-rules-permissive.conf /etc/polkit-1/rules.d/50-appserver-services.rules
sudo chmod 644 /etc/polkit-1/rules.d/50-appserver-services.rules
sudo systemctl reload polkit
```

**Important Note**: The Next.js application runs as the `kali` user, so Polkit rules must allow that user to manage services, not just the `appserver` user.

#### Option B: Use User Service Commands
The application now automatically detects service types and uses appropriate commands:
- `systemctl start service.service` (system level)
- `systemctl --user start service.service` (user level)

#### Option C: Configure Polkit Rules Manually
Create `/etc/polkit-1/rules.d/50-appserver-services.rules`:
```javascript
polkit.addRule(function(action, subject) {
    if (action.id == "org.freedesktop.systemd1.manage-units" &&
        subject.user == "appserver") {
        return polkit.Result.YES;
    }
});
```

#### Option D: Enable User Service Manager
```bash
# Enable user service manager for the appserver user
sudo loginctl enable-linger appserver
systemctl --user daemon-reload
```

### 2. Service Not Found

**Problem**: Custom service like `mcp-server` doesn't appear in the list

**Solutions**:

#### Check Service Status
```bash
# Check system services
systemctl status mcp-server.service

# Check user services
systemctl --user status mcp-server.service

# List all services
systemctl list-units --type=service --all
systemctl --user list-units --type=service --all
```

#### Verify Service Configuration
```bash
# Check service file
ls -la /etc/systemd/system/mcp-server.service
ls -la ~/.config/systemd/user/mcp-server.service

# Check if service is enabled
systemctl is-enabled mcp-server.service
systemctl --user is-enabled mcp-server.service
```

### 3. Permission Denied Errors

**Problem**: "Permission denied" when trying to control services

**Solutions**:

#### Verify Sudoers Configuration
```bash
# Check if sudoers file exists
sudo cat /etc/sudoers.d/appserver-services

# Test sudo permissions
sudo -l -U appserver

# Verify file permissions
ls -la /etc/sudoers.d/appserver-services
```

#### Re-run Setup Script
```bash
sudo ./setup-services.sh
```

### 4. Port Detection Issues

**Problem**: Services show "N/A" for port

**Solutions**:

#### Check if Service is Listening
```bash
# Check listening ports
ss -tlpn | grep mcp-server

# Check service PIDs
systemctl show -p PIDs --value mcp-server.service
systemctl --user show -p PIDs --value mcp-server.service
```

#### Verify Service is Running
```bash
# Check service status
systemctl is-active mcp-server.service
systemctl --user is-active mcp-server.service
```

### 5. User Service Manager Not Available

**Problem**: "No user services found or user service manager not available"

**Solutions**:

#### Enable User Service Manager
```bash
# Enable for current user
systemctl --user daemon-reload

# Enable for appserver user
sudo loginctl enable-linger appserver
sudo -u appserver systemctl --user daemon-reload
```

#### Check User Session
```bash
# List user sessions
loginctl list-sessions

# Check if user has active session
loginctl show-user appserver
```

## Debugging Commands

### Check Service Details
```bash
# System service
systemctl show mcp-server.service

# User service
systemctl --user show mcp-server.service
```

### Check Logs
```bash
# System service logs
journalctl -u mcp-server.service

# User service logs
journalctl --user -u mcp-server.service

# Application logs
tail -f /var/log/syslog | grep mcp-server
```

### Test Commands Manually
```bash
# Test as appserver user
sudo -u appserver systemctl start mcp-server.service
sudo -u appserver systemctl --user start mcp-server.service

# Test with sudo
sudo systemctl start mcp-server.service
```

## Configuration Files

### Service Configuration
- **Service Config**: `src/lib/service-config.ts`
- **Custom Services**: Add to `CUSTOM_SERVICES` array
- **System Services**: Add to `SYSTEM_SERVICES` array

### Sudoers Configuration
- **File**: `/etc/sudoers.d/appserver-services`
- **Permissions**: Specific systemctl commands for specific services
- **User Services**: Include `--user` flag commands

### Polkit Configuration
- **File**: `/etc/polkit-1/rules.d/50-appserver-services.rules`
- **Purpose**: Allow appserver user to manage services without authentication

## Getting Help

1. **Check Application Logs**: Look for error messages in the browser console
2. **Check System Logs**: Use `journalctl` to see systemd logs
3. **Test Commands Manually**: Try the commands that are failing
4. **Verify Permissions**: Check sudo and polkit configurations
5. **Check Service Status**: Ensure services are properly configured

## Common Service Types

### System Services
- Located in `/etc/systemd/system/`
- Managed with `systemctl` (no flags)
- Require root/sudo permissions

### User Services
- Located in `~/.config/systemd/user/`
- Managed with `systemctl --user`
- Run in user context, no sudo required

### Global User Services
- Located in `/etc/systemd/user/`
- Managed with `systemctl --user`
- Available to all users
