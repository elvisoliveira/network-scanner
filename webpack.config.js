/* webpack.config.js */
const fs = require("fs");
const path = require('path');
const WebBundlePlugin = require('webbundle-webpack-plugin');
const {
    NodeCryptoSigningStrategy,
    parsePemKey,
    WebBundleId,
} = require('wbn-sign');

const privateKeyFile = "ed25519key.pem";
if (!fs.existsSync(privateKeyFile)) {
    throw new Error("Cannot read private key.");
}
const privateKey = fs.readFileSync(privateKeyFile);
const key = parsePemKey(privateKey);

module.exports = async () => {
    return {
        entry: './bundle.js',
        mode: 'development',
        output: {
            path: __dirname
        },
        plugins: [
            new WebBundlePlugin({
                baseURL: new WebBundleId(key).serializeWithIsolatedWebAppOrigin(),
                static: {
                    dir: path.resolve(__dirname, 'build')
                },
                output: 'network-scanner.swbn',
                integrityBlockSign: {
                    strategy: new NodeCryptoSigningStrategy(key),
                },
            }),
        ],
    };
};