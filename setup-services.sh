#!/bin/bash

# Setup script for AppPilot Service Management Dashboard
# This script configures sudo permissions for the appserver user

echo "🚀 Setting up AppPilot Service Management Dashboard..."

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo "❌ This script must be run as root (use sudo)"
    exit 1
fi

# Get the username to configure (default: appserver)
read -p "Enter username for service management (default: appserver): " USERNAME
USERNAME=${USERNAME:-appserver}

echo "📝 Configuring sudo permissions for user: $USERNAME"

# Create sudoers file
SUDOERS_FILE="/etc/sudoers.d/appserver-services"

cat > "$SUDOERS_FILE" << EOF
# Sudoers configuration for $USERNAME user to manage services
# Created by AppPilot setup script

# Allow $USERNAME to manage custom services (system level)
$USERNAME ALL=(ALL) NOPASSWD: /bin/systemctl start mcp-server.service
$USERNAME ALL=(ALL) NOPASSWD: /bin/systemctl stop mcp-server.service
$USERNAME ALL=(ALL) NOPASSWD: /bin/systemctl restart mcp-server.service
$USERNAME ALL=(ALL) NOPASSWD: /bin/systemctl status mcp-server.service
$USERNAME ALL=(ALL) NOPASSWD: /bin/systemctl is-active mcp-server.service
$USERNAME ALL=(ALL) NOPASSWD: /bin/systemctl show -p PIDs --value mcp-server.service

$USERNAME ALL=(ALL) NOPASSWD: /bin/systemctl start mcp-service.service
$USERNAME ALL=(ALL) NOPASSWD: /bin/systemctl stop mcp-service.service
$USERNAME ALL=(ALL) NOPASSWD: /bin/systemctl restart mcp-service.service
$USERNAME ALL=(ALL) NOPASSWD: /bin/systemctl status mcp-service.service
$USERNAME ALL=(ALL) NOPASSWD: /bin/systemctl is-active mcp-service.service
$USERNAME ALL=(ALL) NOPASSWD: /bin/systemctl show -p PIDs --value mcp-service.service

# Allow user service management (--user flag)
$USERNAME ALL=(ALL) NOPASSWD: /bin/systemctl --user start mcp-server.service
$USERNAME ALL=(ALL) NOPASSWD: /bin/systemctl --user stop mcp-server.service
$USERNAME ALL=(ALL) NOPASSWD: /bin/systemctl --user restart mcp-server.service
$USERNAME ALL=(ALL) NOPASSWD: /bin/systemctl --user status mcp-server.service
$USERNAME ALL=(ALL) NOPASSWD: /bin/systemctl --user is-active mcp-server.service
$USERNAME ALL=(ALL) NOPASSWD: /bin/systemctl --user show -p PIDs --value mcp-server.service

$USERNAME ALL=(ALL) NOPASSWD: /bin/systemctl --user start mcp-service.service
$USERNAME ALL=(ALL) NOPASSWD: /bin/systemctl --user stop mcp-service.service
$USERNAME ALL=(ALL) NOPASSWD: /bin/systemctl --user restart mcp-service.service
$USERNAME ALL=(ALL) NOPASSWD: /bin/systemctl --user status mcp-service.service
$USERNAME ALL=(ALL) NOPASSWD: /bin/systemctl --user is-active mcp-service.service
$USERNAME ALL=(ALL) NOPASSWD: /bin/systemctl --user show -p PIDs --value mcp-service.service

# Allow listing services (read-only)
$USERNAME ALL=(ALL) NOPASSWD: /bin/systemctl list-units --type=service --all --no-pager --plain
$USERNAME ALL=(ALL) NOPASSWD: /bin/systemctl --user list-units --type=service --all --no-pager --plain
EOF

# Set correct permissions
chmod 440 "$SUDOERS_FILE"

echo "✅ Sudoers file created: $SUDOERS_FILE"

# Test the configuration
echo "🧪 Testing sudo configuration..."
if sudo -l -U "$USERNAME" | grep -q "systemctl"; then
    echo "✅ Sudo configuration test successful"
else
    echo "❌ Sudo configuration test failed"
    echo "Please check the sudoers file manually"
fi

echo ""
echo "🎯 Next steps:"
echo "1. Start the application: npm run dev"
echo "2. Test service management in the web interface"
echo "3. Add more custom services to the configuration if needed"
echo ""
echo "📁 Configuration files:"
echo "   - Sudoers: $SUDOERS_FILE"
echo "   - Service config: src/lib/service-config.ts"
echo ""
echo "🔧 To add more services, edit src/lib/service-config.ts and update the CUSTOM_SERVICES array"
echo "   Then run this script again to update sudo permissions"
