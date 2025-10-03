import { useState } from 'react';

export const useScannerConfig = () => {
    const [scanConfig, setScanConfig] = useState({
        subnets: [
            { subnet: '10.140.10' },
            { subnet: '192.168.12' }
        ],
        timeout: 1000,
        ports: [
            9100, // Printer
            8080, // PDQ
            3306, // MySQL
            1433, // MSSQL
            631,  // IPP
            443,  // HTTPS
            389,  // LDAP
            110,  // POP3
            80,   // HTTP
            25,   // SMTP
            23,   // Telnet
            22,   // SSH
            21,   // FTP
        ]
    });

    const updateConfig = (field, value) => {
        setScanConfig(prev => ({
            ...prev,
            [field]: value
        }));
    };

    return {
        scanConfig,
        updateConfig
    };
};