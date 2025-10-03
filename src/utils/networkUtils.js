export const tcpPing = async (ip, port, timeout = 1000) => {
    return new Promise((resolve) => {
        const startTime = Date.now();
        console.log(`[tcpPing] Starting TCP ping to ${ip}:${port} with ${timeout}ms timeout`);

        try {
            const socket = new TCPSocket(ip, port);
            console.log(`[tcpPing] TCPSocket created for ${ip}:${port}`);

            const timeoutId = setTimeout(() => {
                console.log(`[tcpPing] Timeout reached for ${ip}:${port} after ${timeout}ms`);
                resolve({ success: false, error: 'timeout', port });
            }, timeout);

            socket.opened.then((info) => {
                console.log(`[tcpPing] Connection successful to ${ip}:${port}:`, info);
                // Local IP address of this machine is info.localAddress
                clearTimeout(timeoutId);
                const responseTime = Date.now() - startTime;
                console.log(`[tcpPing] Response time for ${ip}:${port}: ${responseTime}ms`);
                resolve({ success: true, responseTime, port });
            }).catch((error) => {
                console.log(`[tcpPing] Connection failed to ${ip}:${port}:`, error.message);
                clearTimeout(timeoutId);
                const elapsedTime = Date.now() - startTime;
                console.log(`[tcpPing] Failed after ${elapsedTime}ms for ${ip}:${port}`);
                resolve({ success: false, error: error.message, port });
            });
        } catch (error) {
            console.log(`[tcpPing] Exception caught for ${ip}:${port}:`, error.message);
            resolve({ success: false, error: error.message, port });
        }
    });
};

export const fetchJsonWithTCPSocket = async () => {
    const HOST = "ipv4.seeip.org";
    const PORT = 443;
    const PATH = "/geoip/";

    console.log(`[fetchJsonWithTCPSocket] Fetching from https://${HOST}${PATH}`);

    return new Promise((resolve, reject) => {
        const socket = new TCPSocket(HOST, PORT);

        socket.opened.then(async (info) => {
            const localAddress = info.localAddress;
            console.log(`[fetchJsonWithTCPSocket] Local address: ${localAddress}`);
            
            // Close the socket since we only needed the local address
            socket.close();

            // Use regular fetch for the actual HTTPS request
            try {
                const response = await fetch(`https://${HOST}${PATH}`);
                const jsonData = await response.json();
                const enrichedData = {
                    ...jsonData,
                    localAddress: localAddress
                };
                console.log(`[fetchJsonWithTCPSocket] Parsed JSON with local address:`, enrichedData);
                resolve(enrichedData);
            } catch (error) {
                console.error("[fetchJsonWithTCPSocket] Fetch failed:", error);
                reject(error);
            }
        }).catch((error) => {
            console.error("[fetchJsonWithTCPSocket] Socket connection failed:", error);
            reject(error);
        });
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