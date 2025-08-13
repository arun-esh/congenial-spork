# AppPilot - Service Management Dashboard

A modern web-based dashboard for managing system services with an intuitive interface.

## Features

- **Service Discovery**: Automatically detects all system services
- **Service Control**: Start, stop, and restart services directly from the web interface
- **Real-time Status**: Live service status monitoring with visual indicators
- **Favorites System**: Mark frequently used services as favorites for quick access
- **Search & Filter**: Find services quickly with search and status filtering
- **Manual Port Configuration**: Configure service ports manually in the configuration file
- **Responsive Design**: Modern UI that works on desktop and mobile devices
- **Status Dashboard**: Overview of service counts by status

## Prerequisites

- Node.js 18+ and npm
- Linux system with systemd
- User with sudo privileges for service management

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd congenial-spork
```

2. Install dependencies:
```bash
npm install
```

3. Configure sudo permissions for the appserver user:
```bash
# Create a new sudoers file
sudo visudo -f /etc/sudoers.d/appserver-services

# Add the following lines (replace 'appserver' with your actual username):
appserver ALL=(ALL) NOPASSWD: /bin/systemctl start *.service
appserver ALL=(ALL) NOPASSWD: /bin/systemctl stop *.service
appserver ALL=(ALL) NOPASSWD: /bin/systemctl restart *.service
appserver ALL=(ALL) NOPASSWD: /bin/systemctl status *.service
appserver ALL=(ALL) NOPASSWD: /bin/systemctl is-active *.service
appserver ALL=(ALL) NOPASSWD: /bin/systemctl show -p PIDs --value *.service
appserver ALL=(ALL) NOPASSWD: /bin/systemctl list-units --type=service --all --no-pager --plain
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:9002`

## Usage

### Viewing Services
- All system services are automatically discovered and displayed
- Services are grouped by favorites and all services
- Use the search bar to find specific services
- Filter services by status (active, inactive, failed)

### Managing Services
- **Start**: Click the Start button to start an inactive service
- **Stop**: Click the Stop button to stop an active service
- **Restart**: Click the Restart button to restart any service
- **Favorites**: Click the star icon to add/remove services from favorites

### Configuring Service Ports
Service ports are configured manually in `src/lib/service-ports.ts`:

```typescript
export const SERVICE_PORTS: { [key: string]: string } = {
  'mcp-server': '8080',
  'casaos-gateway': '8083',
  // Add more services as needed
};
```

To add a new service port:
1. Edit `src/lib/service-ports.ts`
2. Add your service name and port number
3. Restart the application

### Dashboard Overview
- Status summary cards show counts of services by status
- Real-time updates when services change state
- Manual refresh button to update service status

## Security Considerations

- The application requires sudo privileges to manage services
- Configure sudoers file to limit access to only necessary systemctl commands
- Run the application as a dedicated user (appserver) with minimal required permissions
- Consider implementing user authentication for production use

## API Endpoints

- `GET /api/services` - List all services with status and port information
- `POST /api/services` - Control services (start/stop/restart)
- `GET /api/favorites` - Get list of favorite services
- `POST /api/favorites` - Add service to favorites
- `DELETE /api/favorites` - Remove service from favorites

## Development

### Project Structure
```
src/
├── app/                 # Next.js app router
│   ├── api/            # API endpoints
│   └── page.tsx        # Main dashboard page
├── components/         # React components
│   ├── ui/            # UI components (shadcn/ui)
│   ├── app-header.tsx # Application header
│   └── service-card.tsx # Service management card
├── types/             # TypeScript type definitions
└── lib/               # Utility functions and data
```

### Technologies Used
- **Next.js 15** - React framework with app router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Modern UI component library
- **Lucide React** - Icon library

## Troubleshooting

### Service Control Not Working
1. Verify sudo permissions are correctly configured
2. Check that the appserver user exists and has the right permissions
3. Ensure the application is running as the correct user

### Services Not Loading
1. Check systemd is running: `systemctl status`
2. Verify the application has permission to list services
3. Check browser console for error messages

### Port Detection Issues
1. Services must be actively listening on ports for detection
2. Some services may not expose ports (daemon services)
3. Check firewall settings if ports are not accessible

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.
