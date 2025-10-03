import { tcpPing, calculateTypeConfidence } from '../utils/networkUtils';
import { deviceTypes } from '../config/deviceTypes';

export class NetworkScannerService {
    static async scanSingleIP(ip, config) {
        const device = {
            ip,
            openPorts: [],
            banners: [],
            responseTime: null,
            isAlive: false
        };

        const portPromises = config.ports.map(port =>
            tcpPing(ip, port, config.timeout)
        );

        const results = await Promise.all(portPromises);

        results.forEach(result => {
            if (result.success) {
                device.isAlive = true;
                device.openPorts.push({
                    port: result.port,
                    responseTime: result.responseTime,
                    banner: result.banner
                });
                if (result.banner) {
                    device.banners.push(result.banner);
                }
            }
        });

        if (device.openPorts.length > 0) {
            device.responseTime = Math.round(
                device.openPorts.reduce((sum, port) => sum + port.responseTime, 0) /
                device.openPorts.length
            );
        }

        if (device.isAlive) {
            const detection = this.detectDeviceType(device);
            device.type = detection.type;
            device.confidence = detection.confidence;
        }

        return device;
    }

    static detectDeviceType(device) {
        let bestMatch = { type: 'unknown', confidence: 0 };

        for (const [type, config] of Object.entries(deviceTypes)) {
            const confidence = calculateTypeConfidence(device, config);
            if (confidence > bestMatch.confidence) {
                bestMatch = { type, confidence };
            }
        }

        return bestMatch;
    }

    static async scanNetwork(config, onProgress, onDeviceFound, shouldStop) {
        const startIP = 1;
        const endIP = 254;
        const totalIPs = endIP - startIP + 1;
        const batchSize = 10;

        for (let i = startIP; i <= endIP; i += batchSize) {
            if (shouldStop()) break;

            const batch = [];
            const endBatch = Math.min(i + batchSize - 1, endIP);

            for (let j = i; j <= endBatch; j++) {
                const ip = `${config.subnet}.${j}`;
                batch.push(this.scanSingleIP(ip, config));
            }

            try {
                const results = await Promise.all(batch);
                results.forEach(device => {
                    if (device.isAlive) {
                        onDeviceFound(device);
                    }
                });
            } catch (error) {
                console.error('Batch error:', error);
            }

            const progress = Math.round(((endBatch - startIP + 1) / totalIPs) * 100);
            onProgress(progress);
        }
    }
}
