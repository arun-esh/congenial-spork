#!/bin/bash

# Install Polkit rules for AppPilot Service Management
# This script installs rules to allow appserver user to manage services without authentication

echo "🔐 Installing Polkit rules for AppPilot Service Management..."

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo "❌ This script must be run as root (use sudo)"
    exit 1
fi

# Create the Polkit rules directory if it doesn't exist
POLKIT_DIR="/etc/polkit-1/rules.d"
if [ ! -d "$POLKIT_DIR" ]; then
    echo "📁 Creating Polkit rules directory: $POLKIT_DIR"
    mkdir -p "$POLKIT_DIR"
fi

# Copy the Polkit rules file
RULES_FILE="polkit-rules.conf"
if [ -f "$RULES_FILE" ]; then
    echo "📝 Installing Polkit rules from $RULES_FILE"
    cp "$RULES_FILE" "$POLKIT_DIR/50-appserver-services.rules"
    chmod 644 "$POLKIT_DIR/50-appserver-services.rules"
    echo "✅ Polkit rules installed to $POLKIT_DIR/50-appserver-services.rules"
else
    echo "❌ Polkit rules file $RULES_FILE not found"
    exit 1
fi

# Reload Polkit rules
echo "🔄 Reloading Polkit rules..."
systemctl reload polkit

echo ""
echo "🎯 Polkit rules installation complete!"
echo ""
echo "📋 What was installed:"
echo "   - File: $POLKIT_DIR/50-appserver-services.rules"
echo "   - Permissions: 644 (readable by all, writable by root)"
echo "   - Effect: appserver user can manage mcp-server and mcp-service without authentication"
echo ""
echo "🧪 To test:"
echo "   1. Try managing services from the web interface"
echo "   2. Or test manually: sudo -u appserver systemctl stop mcp-server.service"
echo ""
echo "📚 For more information, see: TROUBLESHOOTING.md"
