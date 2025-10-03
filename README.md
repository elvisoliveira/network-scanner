# Network Scanner

A modern network scanning tool built with React and the Direct Sockets API (https://wicg.github.io/direct-sockets/) for Chromium-based browsers and ChromeOS. This application provides a user-friendly interface for discovering and analyzing devices on your network.

## Features

- 🌐 Multi-subnet scanning support
- 🔍 Advanced service detection for common ports
- 🖨️ Device type identification (printers, routers, cameras, NAS, etc.)
- 📊 Real-time scanning progress and statistics
- 🛡️ Banner grabbing for service identification
- 💻 Modern, responsive user interface

## Supported Device Types

- Printers (IPP, JetDirect, LPR)
- Routers (including DrayTek Vigor)
- Network Cameras (RTSP, ONVIF)
- NAS Devices
- And more...

## Common Ports Scanned

- Web Services: 80, 443, 8080
- File Services: 21 (FTP), 445 (SMB)
- Print Services: 631 (IPP), 9100 (JetDirect)
- Mail Services: 25 (SMTP), 110 (POP3), 143 (IMAP)
- Database Services: 1433 (MSSQL), 3306 (MySQL)
- Network Services: 53 (DNS), 161 (SNMP)

## Installation

### Prerequisites
- Chromium-based browser (Chrome, Edge, etc.)
- Direct Sockets API support
- Node.js and npm for development

### Running as IWA (Isolated Web App)
```bash
# Start the development server
npm install
npm start

# Install as Isolated Web App in Chromium
chromium --test-type --enable-features=IsolatedWebApps,IsolatedWebAppDevMode --install-isolated-web-app-from-url=http://127.0.0.1:3647/
```

## Usage

1. Enter one or more subnet ranges to scan (e.g., 192.168.1)
2. Configure port ranges and scan options
3. Click "Start Network Scan" to begin
4. View real-time results in the device list
5. Analyze discovered services and device types

## Technical Details

This application uses:
- React for the user interface
- Direct Sockets API for network connectivity
- Advanced protocol probing for service detection
- Banner grabbing for service identification
- Device fingerprinting through port and service analysis

## Contributing

Contributions are welcome! Please feel free to submit pull requests, report issues, or suggest new features.