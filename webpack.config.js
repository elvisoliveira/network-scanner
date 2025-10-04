const fs = require('fs');
const path = require('path');
const WebBundlePlugin = require('webbundle-webpack-plugin');
const {
    NodeCryptoSigningStrategy,
    parsePemKey,
    WebBundleId,
} = require('wbn-sign');

const privateKeyFile = path.resolve(__dirname, 'ed25519key.pem');

if (!fs.existsSync(privateKeyFile)) {
    throw new Error(`Private key not found at ${privateKeyFile}. Generate one with: openssl genpkey -algorithm Ed25519 -out ed25519key.pem`);
}

const buildDir = path.resolve(__dirname, 'build');
if (!fs.existsSync(buildDir)) {
    throw new Error(`Build directory not found at ${buildDir}. Run 'npm run build' first.`);
}

const privateKey = fs.readFileSync(privateKeyFile);
const key = parsePemKey(privateKey);

module.exports = {
    entry: './bundle.js',
    mode: 'production',
    output: {
        path: __dirname,
        clean: false
    },
    plugins: [
        new WebBundlePlugin({
            baseURL: new WebBundleId(key).serializeWithIsolatedWebAppOrigin(),
            static: {
                dir: buildDir
            },
            output: 'network-scanner.swbn',
            integrityBlockSign: {
                strategy: new NodeCryptoSigningStrategy(key),
            },
        }),
    ],
};