# Network Scanner

A modern network scanning tool built with React and the Direct Sockets API (https://wicg.github.io/direct-sockets/) for Chromium-based browsers and ChromeOS. This application provides a user-friendly interface for discovering and analyzing devices on your network.

## Installation

### Prerequisites
- ChromeOS or a Chromium-based browser (Chrome, Edge, etc.)
- Direct Sockets API support
- Node.js and npm for development

### Enable IWA Support
Before installing, you need to enable Isolated Web App support. Choose one of these methods:

#### Option A: Chrome Flags (Recommended)
1. Navigate to `chrome://flags/#enable-isolated-web-apps`
2. Set "Isolated Web Apps" to **Enabled**
3. Navigate to `chrome://flags/#enable-isolated-web-app-dev-mode`
4. Set "Isolated Web App Developer Mode" to **Enabled**
5. Restart Chrome/Chromium

#### Option B: Command Line Flags
Launch Chrome/Chromium with flags:
```bash
chromium --test-type --enable-features=IsolatedWebApps,IsolatedWebAppDevMode
```

### Running as IWA (Isolated Web App)
- Start the development server:
```bash
npm install
npm start
```
#### Method 1: Command Line Installation
- Install as Isolated Web App in Chromium
```bash
chromium --test-type --enable-features=IsolatedWebApps,IsolatedWebAppDevMode --install-isolated-web-app-from-url=http://127.0.0.1:3647/
```

#### Method 2: Developer Mode Installation
- Navigate to `chrome://web-app-internals/`
- Under "Developer Mode", add the URL: `http://127.0.0.1:3647/`
- Click "Install" to install the app as an IWA

Once installed the app will be available on `chrome://apps/`

## Technical Details

This application uses:
- React for the user interface
- Direct Sockets API for network connectivity

## Contributing

Contributions are welcome! Please feel free to submit pull requests, report issues, or suggest new features.