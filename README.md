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

### Installation Methods

#### Method 1: Pre-built Bundle (Recommended)
1. Download the latest `network-scanner.swbn` file from the [releases page](https://github.com/elvisoliveira/network-scanner/releases/)
2. Navigate to `chrome://web-app-internals/`
3. Under "Install IWA from Signed Web Bundle", upload the downloaded `.swbn` file

#### Method 2: Build Your Own Bundle
1. Generate a private key:
```bash
openssl genpkey -algorithm Ed25519 -out ed25519key.pem
```
2. Build the bundle:
```bash
npm install
npm run build
npm run bundle
```
3. Upload the generated `network-scanner.swbn` file at `chrome://web-app-internals/` under "Install IWA from Signed Web Bundle"

#### Method 3: Self-Host a Dev Mode Proxy
1. Start the development server:
```bash
npm install
npm start
```
2. Install using command line:
```bash
chromium --test-type --enable-features=IsolatedWebApps,IsolatedWebAppDevMode --install-isolated-web-app-from-url=http://127.0.0.1:3647/
```
3. Or navigate to `chrome://web-app-internals/` and under "Install IWA via Dev Mode Proxy", add the URL: `http://127.0.0.1:3647/`

Once installed, the app will be available on `chrome://apps/`

## Technical Details

This application uses:
- React for the user interface
- Direct Sockets API for network connectivity

## Contributing

Contributions are welcome! Please feel free to submit pull requests, report issues, or suggest new features.