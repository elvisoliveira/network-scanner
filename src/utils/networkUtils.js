export const tcpPing = async (ip, port, timeout = 1000) => {
    return new Promise((resolve) => {
        const startTime = Date.now();

        try {
            const socket = new TCPSocket(ip, port);
            const timeoutId = setTimeout(() => {
                resolve({ success: false, error: 'timeout', port });
            }, timeout);

            socket.opened.then(() => {
                clearTimeout(timeoutId);
                const responseTime = Date.now() - startTime;
                resolve({ success: true, responseTime, port });
            }).catch((error) => {
                clearTimeout(timeoutId);
                resolve({ success: false, error: error.message, port });
            });
        } catch (error) {
            resolve({ success: false, error: error.message, port });
        }
    });
};



export const scanSingleIP = async (ip, config) => {
    const device = { ip, openPorts: [], responseTime: null, isAlive: false };

    const results = await Promise.all(
        config.ports.map(port => tcpPing(ip, port, config.timeout))
    );

    results.forEach(result => {
        if (result.success) {
            device.isAlive = true;
            device.openPorts.push({
                port: result.port,
                responseTime: result.responseTime
            });
        }
    });

    if (device.openPorts.length > 0) {
        device.responseTime = Math.round(
            device.openPorts.reduce((sum, port) => sum + port.responseTime, 0) / device.openPorts.length
        );
    }

    return device;
};

export const scanNetwork = async (config, onProgress, onDeviceFound, shouldStop) => {
    const batchSize = 10;
    for (let i = 1; i <= 254; i += batchSize) {
        if (shouldStop()) break;

        const batch = [];
        const endBatch = Math.min(i + batchSize - 1, 254);

        for (let j = i; j <= endBatch; j++) {
            batch.push(scanSingleIP(`${config.subnet}.${j}`, config));
        }

        const results = await Promise.all(batch);
        results.forEach(device => {
            if (device.isAlive) onDeviceFound(device);
        });

        onProgress(Math.round((endBatch / 254) * 100));
    }
};