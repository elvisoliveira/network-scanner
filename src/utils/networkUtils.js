/**
 * Performs a TCP connection to a specific IP and port
 * @param {string} ip - Target IP address
 * @param {number} port - Target port number
 * @param {number} timeout - Connection timeout in milliseconds
 * @returns {Promise<Object>} Connection result
 */
export const tcpPing = async (ip, port, timeout = 1000) => {
    return new Promise((resolve) => {
        const startTime = Date.now();

        try {
            const socket = new TCPSocket(ip, port);
            const timeoutId = setTimeout(() => {
                resolve({ success: false, error: 'timeout' });
            }, timeout);

            socket.opened.then(() => {
                clearTimeout(timeoutId);
                const responseTime = Date.now() - startTime;

                getBanner(socket, port).then(banner => {
                    // socket.close();
                    resolve({
                        success: true,
                        responseTime,
                        banner: banner || '',
                        port,
                        service: identifyService(port, banner)
                    });
                });
            }).catch((error) => {
                clearTimeout(timeoutId);
                resolve({ success: false, error: error.message, port });
            });
        } catch (error) {
            resolve({ success: false, error: error.message, port });
        }
    });
};

/**
 * Attempts to get a service banner from an open connection
 * @param {TCPSocket} socket - Open TCP socket
 * @param {number} port - Port number
 * @returns {Promise<string>} Service banner
 */
export const getBanner = async (socket, port) => {
    return new Promise(async (resolve) => {
        const timeout = setTimeout(() => resolve(''), 2000);

        try {
            const { readable, writable, remoteAddress } = await socket.opened;

            const reader = readable.getReader();
            const writer = writable.getWriter();

            const probe = generateProbe(port, remoteAddress);

            if (probe) {
                writer.write(new TextEncoder().encode(probe));
            }

            reader.read().then(({ value }) => {
                clearTimeout(timeout);
                if (value) {
                    const banner = new TextDecoder().decode(value);
                    resolve(banner); // Limit banner size
                    // resolve(banner.substring(0, 200)); // Limit banner size
                } else {
                    resolve('');
                }
            }).catch(() => {
                clearTimeout(timeout);
                resolve('');
            });
        } catch (error) {
            clearTimeout(timeout);
            resolve('');
        }
    });
};

/**
 * Generates appropriate probe data for different services
 * @param {number} port - Target port
 * @param {string} host - Target host
 * @returns {string} Probe data
 */
const generateProbe = (port, host) => {
    const probes = {
        // HTTP/Web Services
        80: `OPTIONS / HTTP/1.0\r\n\r\n`,
        8080: `OPTIONS / HTTP/1.0\r\n\r\n`,
        443: `OPTIONS / HTTP/1.0\r\n\r\n`,
        631: `GET /printers HTTP/1.1\r\nHost: ${host}\r\nUser-Agent: NetworkScanner\r\n\r\n`,

        // Mail Services
        25: [
            `HELO networkscan.local\r\n`,
            `HELP\r\n`,
            `VRFY postmaster\r\n`,
            `VRFY networkscanner\r\n`,
            `EXPN postmaster\r\n`,
            `QUIT\r\n`
        ].join(''),
        110: [
            `USER anonymous\r\n`,
            `QUIT\r\n`
        ].join(''),
        143: `a001 CAPABILITY\r\n`,

        // File Services
        21: [
            `HELP\r\n`,
            `USER anonymous\r\n`,
            `PASS scan@local\r\n`,
            `QUIT\r\n`
        ].join(''),

        // Printer Services
        9100: '\x1B%-12345X@PJL INFO STATUS\r\n'  // HP JetDirect
    };
    return probes[port] || '\r\n';
};

/**
 * Identifies service based on port and banner
 * @param {number} port - Port number
 * @param {string} banner - Service banner
 * @returns {string} Identified service
 */
export const identifyService = (port, banner) => {
    const bannerLower = banner.toLowerCase();

    // Common services identification patterns
    const services = {
        http: [80, 8080, 8000, 8008],
        https: [443, 8443],
        ssh: [22],
        ftp: [21],
        telnet: [23],
        smtp: [25],
        dns: [53],
        dhcp: [67, 68],
        tftp: [69],
        pop3: [110],
        ntp: [123],
        imap: [143],
        snmp: [161],
        ldap: [389],
        smb: [445],
        ipp: [631],
        jetdirect: [9100],
        rtsp: [554],
    };

    // Check for service by port
    for (const [service, ports] of Object.entries(services)) {
        if (ports.includes(port)) {
            return service;
        }
    }

    // Check banner patterns
    if (bannerLower.includes('ssh')) return 'ssh';
    if (bannerLower.includes('ftp')) return 'ftp';
    if (bannerLower.includes('http')) return 'http';
    if (bannerLower.includes('smtp')) return 'smtp';
    if (bannerLower.includes('pop3')) return 'pop3';
    if (bannerLower.includes('imap')) return 'imap';
    if (bannerLower.includes('telnet')) return 'telnet';

    return 'unknown';
};

/**
 * Calculate confidence score for device type detection
 * @param {Object} device - Device information
 * @param {Object} typeConfig - Device type configuration
 * @returns {number} Confidence score
 */
export const calculateTypeConfidence = (device, typeConfig) => {
    let confidence = 0;
    const deviceInfo = (device.hostname + ' ' + device.banners.join(' ')).toLowerCase();

    // Port matching (30%)
    const openPorts = device.openPorts.map(p => p.port);
    const matchingPorts = typeConfig.ports.filter(port => openPorts.includes(port));
    confidence += (matchingPorts.length / typeConfig.ports.length) * 30;

    // Keyword matching (40%)
    const matchingKeywords = typeConfig.keywords.filter(keyword => deviceInfo.includes(keyword));
    confidence += (matchingKeywords.length / typeConfig.keywords.length) * 40;

    // Banner pattern matching (30%)
    if (typeConfig.bannerPatterns) {
        const matchingPatterns = typeConfig.bannerPatterns.filter(pattern =>
            device.banners.some(banner => pattern.test(banner))
        );
        confidence += (matchingPatterns.length / typeConfig.bannerPatterns.length) * 30;
    }

    return Math.min(Math.round(confidence), 100);
};
