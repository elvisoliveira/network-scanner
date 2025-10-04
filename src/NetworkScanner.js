import React, { useState, useRef } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { scanNetwork } from './utils/networkUtils';
import ConfigurationPanel from './components/ConfigurationPanel';
import NetworkInfo from './components/NetworkInfo';
import DeviceList from './components/DeviceList';
import Ping from './components/Ping';

/**
 * NetworkScanner component - Main component for the network scanning application
 * Coordinates scanning operations and manages the UI state
 */
const NetworkScanner = () => {
    const [scanning, setScanning] = useState(false);
    const [devices, setDevices] = useState([]);
    const [progress, setProgress] = useState(0);
    const [selectedTarget, setSelectedTarget] = useState({ ip: '', port: null });
    const [scanConfig, setScanConfig] = useState({
        subnets: [],
        timeout: 1000,
        ports: [9100, 8080, 3306, 1433, 631, 443, 389, 110, 80, 25, 23, 22]
    });
    const scanCancelRef = useRef(false);

    const updateConfig = (field, value) => setScanConfig(prev => ({ ...prev, [field]: value }));

    const handleNetworkInfoUpdate = (networkData) => {
        if (networkData?.localAddress) {
            const localSubnet = networkData.localAddress.split('.').slice(0, 3).join('.');
            const existingSubnets = scanConfig.subnets.map(s => s.subnet);

            if (!existingSubnets.includes(localSubnet))
                setScanConfig(prev => ({
                    ...prev,
                    subnets: [...prev.subnets, { subnet: localSubnet }]
                }));
        }
    };

    const handlePortClick = (ip, port) => {
        setSelectedTarget({ ip, port });
    };

    const startNetworkScan = async () => {
        setScanning(true);
        setDevices([]);
        setProgress(0);
        scanCancelRef.current = false;

        try {
            const totalSubnets = scanConfig.subnets.length;
            let completedSubnets = 0;

            for (const subnetConfig of scanConfig.subnets) {
                if (scanCancelRef.current) break;

                const config = {
                    ...scanConfig,
                    subnet: subnetConfig.subnet
                };

                await scanNetwork(
                    config,
                    (subnetProgress) => {
                        const overallProgress = ((completedSubnets * 100) + subnetProgress) / totalSubnets;
                        setProgress(Math.round(overallProgress));
                    },
                    (device) => setDevices(current => [...current, {
                        ...device,
                        subnet: subnetConfig.subnet
                    }]),
                    () => scanCancelRef.current
                );

                completedSubnets++;
            }
        } catch (error) {
            console.error('Scan failed:', error);
        } finally {
            setScanning(false);
            setProgress(100);
        }
    };

    const stopScan = () => {
        scanCancelRef.current = true;
        setScanning(false);
    };

    return (
        <Container fluid className="p-3">
            <Row>
                <Col md={4}>
                    <ConfigurationPanel
                        scanConfig={scanConfig}
                        updateConfig={updateConfig}
                        scanning={scanning}
                        onStartScan={startNetworkScan}
                        onStopScan={stopScan}
                        progress={progress}
                    />
                    <NetworkInfo onNetworkInfoUpdate={handleNetworkInfoUpdate} />
                </Col>
                <Col md={8}>
                    <DeviceList
                        devices={devices}
                        scanning={scanning}
                        onPortClick={handlePortClick}
                    />
                    <Ping selectedTarget={selectedTarget} />
                </Col>
            </Row>
        </Container>
    );
};

export default NetworkScanner;
