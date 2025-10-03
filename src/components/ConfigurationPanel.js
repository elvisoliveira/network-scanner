import React, { useState } from 'react';
import { Card, Form, Button, ProgressBar, InputGroup } from 'react-bootstrap';
import { BsGearFill, BsArrowRepeat, BsShieldCheck } from 'react-icons/bs';

/**
 * ConfigurationPanel Component
 * Provides the user interface for configuring and controlling network scans
 */
const ConfigurationPanel = ({
    scanConfig,
    updateConfig,
    scanning,
    onStartScan,
    onStopScan,
    progress
}) => {
    const [validation, setValidation] = useState({});

    // Validate subnet segment
    const validateSubnetSegment = (value) => {
        const num = parseInt(value);
        return !isNaN(num) && num >= 0 && num <= 255;
    };

    // Handler for subnet segment changes
    const handleSubnetSegmentChange = (subnetIndex, segmentIndex, value) => {
        const updatedSubnets = [...scanConfig.subnets];
        const segments = updatedSubnets[subnetIndex].subnet.split('.');
        segments[segmentIndex] = value;
        
        const newSubnet = segments.join('.');
        updatedSubnets[subnetIndex] = {
            ...updatedSubnets[subnetIndex],
            subnet: newSubnet
        };

        const isValid = segments.every(segment => validateSubnetSegment(segment));
        setValidation(prev => ({
            ...prev,
            [subnetIndex]: {
                ...prev[subnetIndex],
                subnet: isValid
            }
        }));

        updateConfig('subnets', updatedSubnets);
    };

    return (
        <Card className="shadow-sm">
            <Card.Header className="bg-primary text-white d-flex align-items-center">
                <BsGearFill className="me-2" />
                <h5 className="mb-0">Scanner Configuration</h5>
            </Card.Header>
            <Card.Body className="bg-light">
                <Form>
                    <div className="mb-4 border rounded p-3 bg-light">
                        <div className="d-flex justify-content-between align-items-center border-bottom pb-2">
                            <h6 className="mb-0">Subnet</h6>
                            <Button 
                                variant="outline-primary" 
                                size="sm"
                                onClick={() => updateConfig('subnets', [...scanConfig.subnets, { subnet: '0.0.0' }])}
                                disabled={scanning}
                            >
                                Add Subnet
                            </Button>
                        </div>
                        {scanConfig.subnets.map((subnet, index) => (
                            <Form.Group key={index} className="mt-3">
                                <InputGroup>
                                    {subnet.subnet.split('.').map((segment, segmentIndex) => (
                                        <React.Fragment key={segmentIndex}>
                                            <Form.Control
                                                type="number"
                                                min="0"
                                                max="255"
                                                value={segment}
                                                onChange={(e) => handleSubnetSegmentChange(index, segmentIndex, e.target.value)}
                                                disabled={scanning}
                                                isInvalid={validation[index]?.subnet === false}
                                                placeholder="0"
                                                className="border-primary text-center"
                                                style={{ width: '70px' }}
                                            />
                                            {segmentIndex < 2 && <InputGroup.Text className="border-primary">.</InputGroup.Text>}
                                        </React.Fragment>
                                    ))}
                                    {scanConfig.subnets.length > 1 && (
                                        <Button 
                                            variant="outline-danger"
                                            onClick={() => {
                                                const newSubnets = scanConfig.subnets.filter((_, i) => i !== index);
                                                updateConfig('subnets', newSubnets);
                                                // Update validation state
                                                setValidation(prev => {
                                                    const newValidation = { ...prev };
                                                    delete newValidation[index];
                                                    return newValidation;
                                                });
                                            }}
                                            disabled={scanning}
                                        >
                                            ×
                                        </Button>
                                    )}
                                </InputGroup>
                                {validation[index]?.subnet === false && (
                                    <Form.Text className="text-danger">Invalid subnet</Form.Text>
                                )}
                            </Form.Group>
                        ))}
                    </div>
                    <Form.Group className="mb-3">
                        <Form.Label className="d-flex align-items-center justify-content-between">
                            Ports
                            <Button 
                                variant="outline-primary" 
                                size="sm"
                                onClick={() => updateConfig('ports', [...scanConfig.ports, 0])}
                                disabled={scanning}
                            >
                                Add Port
                            </Button>
                        </Form.Label>
                        <div className="d-flex flex-wrap gap-2">
                            {scanConfig.ports.map((port, index) => (
                                <InputGroup key={index} className="w-auto">
                                    <Form.Control
                                        type="number"
                                        min="1"
                                        max="65535"
                                        value={port || ''}
                                        onChange={(e) => {
                                            const newPorts = [...scanConfig.ports];
                                            const value = parseInt(e.target.value);
                                            newPorts[index] = !isNaN(value) && value > 0 && value < 65536 ? value : 0;
                                            updateConfig('ports', newPorts);
                                        }}
                                        disabled={scanning}
                                        placeholder="Port"
                                        className="border-primary"
                                        style={{ width: '100px' }}
                                    />
                                    <Button 
                                        variant="outline-danger"
                                        onClick={() => {
                                            const newPorts = scanConfig.ports.filter((_, i) => i !== index);
                                            updateConfig('ports', newPorts);
                                        }}
                                        disabled={scanning}
                                    >
                                        ×
                                    </Button>
                                </InputGroup>
                            ))}
                        </div>
                    </Form.Group>

                    <Form.Group className="mb-4">
                        <Form.Label className="d-flex align-items-center">
                            Timeout (ms)
                        </Form.Label>
                        <InputGroup>
                            <Form.Control
                                type="number"
                                min="100"
                                max="5000"
                                value={scanConfig.timeout}
                                onChange={(e) => updateConfig('timeout', parseInt(e.target.value))}
                                disabled={scanning}
                                className="border-primary"
                            />
                            <InputGroup.Text className="bg-primary text-white">ms</InputGroup.Text>
                        </InputGroup>
                    </Form.Group>

                    <div className="d-grid gap-2">
                        {!scanning ? (
                            <Button
                                variant="primary"
                                onClick={onStartScan}
                                disabled={Object.values(validation).some(subnetValidation =>
                                    Object.values(subnetValidation || {}).some(isValid => isValid === false)
                                )}
                                className="py-2 shadow-sm"
                            >
                                <div className="d-flex align-items-center justify-content-center">
                                    <BsShieldCheck className="me-2" />
                                    Start Network Scan
                                </div>
                            </Button>
                        ) : (
                            <Button
                                variant="danger"
                                onClick={onStopScan}
                                className="py-2 shadow-sm"
                            >
                                <div className="d-flex align-items-center justify-content-center">
                                    <BsArrowRepeat className="me-2" />
                                    Stop Scan
                                </div>
                            </Button>
                        )}
                    </div>
                </Form>

                {scanning && (
                    <div className="mt-4 p-3 border rounded bg-white">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <div className="text-primary fw-bold">Scan Progress</div>
                            <div className="badge bg-primary">{progress}%</div>
                        </div>
                        <ProgressBar
                            now={progress}
                            variant="primary"
                            className="shadow-sm"
                            style={{ height: '10px' }}
                        />
                        <div className="text-center mt-2 text-muted small">
                            Scanning multiple IP ranges...
                        </div>
                    </div>
                )}
            </Card.Body>
        </Card>
    );
};

export default ConfigurationPanel;
