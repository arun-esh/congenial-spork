# **App Name**: AppPilot

## Core Features:

- Service Dashboard: Display a list of all configured services with actions to Start, Stop, and Restart each service. Users can toggle between List and Grid/Card views.
- Add Service: Allow users to add a new service by inputting service details like name, description, script path, and port number.
- Service Detail Page: Display detailed information about each service on a separate page with tabs for Status and Logs.
- Service Status: Show the current status (running, stopped, failed), uptime, memory usage, and CPU usage (if available) of the service.
- Log Viewer: Display the recent logs of the service with filtering options by date, time, and keywords.
- Log Summary: Summarize recent service logs, highlighting potential issues and anomalies. An LLM is used as a tool to identify key issues within logs.

## Style Guidelines:

- Primary color: Saturated blue (#4285F4) to convey reliability and stability. The hue evokes Ubuntu's default palette.
- Background color: Light gray (#F5F5F5), providing a clean and neutral backdrop to improve content visibility.
- Accent color: Orange (#FF5722) is analogous to the primary, and different in saturation and brightness; to highlight interactive elements and important status indicators.
- Font: 'Inter', a sans-serif, for both headlines and body text, for a modern and clean interface. This font provides great legibility and a neutral appearance suitable for displaying technical information.
- Use clear and intuitive icons from a library like FontAwesome to represent service status and actions. Use of filled icons for interactive states (e.g., active/enabled) and outlined icons for default/disabled states to provide clear visual cues.
- Utilize a responsive grid layout that adapts to different screen sizes, ensuring a consistent and accessible experience across devices. Implement clear visual hierarchy to guide the user through the service management tasks efficiently.
- Incorporate subtle transition animations (e.g., fade-in, slide-in) to enhance the user experience. Feedback animations (e.g., button ripple effect, progress loaders) confirm actions and provide immediate feedback.