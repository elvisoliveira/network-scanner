import { Card, Table, Badge } from 'react-bootstrap';

const DeviceList = ({ devices, scanning, onPortClick }) => {
    return (
        <Card>
            <Card.Header>
                Devices Found ({devices.length})
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
                                <th>IP Address</th>
                                <th>Open Ports</th>
                                <th>Avg Response Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {devices.map((device, index) => (
                                <tr key={index}>
                                    <td><strong>{device.ip}</strong></td>
                                    <td>
                                        {device.openPorts.map(port => (
                                            <Badge 
                                                key={port.port} 
                                                bg="success" 
                                                className="me-1" 
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => onPortClick && onPortClick(device.ip, port.port)}
                                                title={`Click to ping ${device.ip}:${port.port}`}
                                            >
                                                {port.port}
                                            </Badge>
                                        ))}
                                    </td>
                                    <td>{device.responseTime}ms</td>
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
