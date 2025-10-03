import React from 'react';
import { Card, Table, Badge } from 'react-bootstrap';
import { BsRouter, BsPrinter, BsQuestionCircle, BsCameraFill, BsModemFill } from 'react-icons/bs';

const DeviceList = ({ devices, scanning }) => {
    const getDeviceIcon = (type) => {
        const icons = {
            'router': BsRouter,
            'printer': BsPrinter,
            'nas': BsModemFill,
            'camera': BsCameraFill,
            'unknown': BsQuestionCircle
        };
        const Icon = icons[type] || icons['unknown'];
        return <Icon className="me-2" />;
    };
    return (
        <Card>
            <Card.Header>
                <h5>Devices Found ({devices.length})</h5>
            </Card.Header>
            <Card.Body style={{ maxHeight: '600px', overflowY: 'auto' }}>
                {devices.length === 0 ? (
                    <div className="text-center text-muted p-4">
                        {scanning ? 'Scanning network...' : 'No devices found. Click "Start Scan" to begin.'}
                    </div>
                ) : (
                    <Table striped bordered hover className="mb-0" size="sm">
                        <thead>
                            <tr>
                                <th></th>
                                <th>IP</th>
                                <th>Open Ports</th>
                                <th>Response</th>
                                <th>Confidence</th>
                            </tr>
                        </thead>
                        <tbody>
                            {devices.map((device, index) => (
                                <tr key={index}>
                                    <td>
                                        {getDeviceIcon(device.type)} {device.type}
                                    </td>
                                    <td>
                                        <strong>{device.ip}</strong>
                                    </td>
                                    <td>
                                        {device.openPorts.map(port => (
                                            <Badge
                                                key={port.port}
                                                bg="success"
                                                className="me-1"
                                                title={port.banner}
                                            >
                                                {port.port}
                                            </Badge>
                                        ))}
                                    </td>
                                    <td>
                                        {device.responseTime}ms
                                    </td>
                                    <td>
                                        {device.confidence}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
            </Card.Body>
        </Card>
    );
};

export default DeviceList;
