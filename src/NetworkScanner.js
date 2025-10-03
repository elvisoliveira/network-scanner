import React, { useState, useRef } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useScannerConfig } from './hooks/useScannerConfig';
import { NetworkScannerService } from './services/NetworkScannerService';
import ConfigurationPanel from './components/ConfigurationPanel';
import StatisticsPanel from './components/StatisticsPanel';
import DeviceList from './components/DeviceList';

/**
 * NetworkScanner component - Main component for the network scanning application
 * Coordinates scanning operations and manages the UI state
 */
const NetworkScanner = () => {
    const [scanning, setScanning] = useState(false);
    const [devices, setDevices] = useState([]);
    const [progress, setProgress] = useState(0);
    const { scanConfig, updateConfig } = useScannerConfig();
    const scanCancelRef = useRef(false);

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

                await NetworkScannerService.scanNetwork(
                    config,
                    (subnetProgress) => {
                        const overallProgress = ((completedSubnets * 100) + subnetProgress) / totalSubnets;
                        setProgress(Math.round(overallProgress));
                    },
                    (device) => setDevices(current => [...current, {
                        ...device,
                        subnet: subnetConfig.subnet // Add subnet info to device
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
                    <StatisticsPanel devices={devices} />
                </Col>
                <Col md={8}>
                    <DeviceList
                        devices={devices}
                        scanning={scanning}
                    />
                </Col>
            </Row>
        </Container>
    );
};

export default NetworkScanner;