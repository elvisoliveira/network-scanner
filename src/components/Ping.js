import React, { useState, useRef } from 'react';
import { Card, Form, Button, ListGroup, Row, Col } from 'react-bootstrap';
import { tcpPing } from '../utils/networkUtils';

const Ping = () => {
    const [ipAddress, setIpAddress] = useState('');
    const [port, setPort] = useState(80);
    const [interval, setInterval] = useState(1000);
    const [pinging, setPinging] = useState(false);
    const [results, setResults] = useState([]);
    const pingIntervalRef = useRef(null);

    const isValidIP = (ip) => {
        const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        return ipRegex.test(ip);
    };

    const pingHost = async (ip, targetPort) => {
        const result = await tcpPing(ip, targetPort, 5000);
        return {
            success: result.success,
            time: result.responseTime || 0,
            error: result.error,
            service: result.service
        };
    };

    const startPing = async () => {
        if (!isValidIP(ipAddress)) {
            alert('Please enter a valid IP address');
            return;
        }

        setPinging(true);
        setResults([]);

        const doPing = async () => {
            const timestamp = new Date().toLocaleTimeString();
            const result = await pingHost(ipAddress, port);

            setResults(prev => [...prev.slice(-9), {
                timestamp,
                ip: ipAddress,
                port,
                ...result
            }]);
        };

        // Initial ping
        await doPing();

        // Set up interval
        pingIntervalRef.current = setInterval(doPing, interval);
    };

    const stopPing = () => {
        if (pingIntervalRef.current) {
            clearInterval(pingIntervalRef.current);
            pingIntervalRef.current = null;
        }
        setPinging(false);
    };

    return (
        <Card className="mt-3">
            <Card.Header>
                <h5>Ping Tool</h5>
            </Card.Header>
            <Card.Body>
                <Form>
                    <Row className="align-items-end">
                        <Col md={4}>
                            <Form.Group className="mb-3">
                                <Form.Label>IP Address</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="192.168.1.1"
                                    value={ipAddress}
                                    onChange={(e) => setIpAddress(e.target.value)}
                                    disabled={pinging}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={2}>
                            <Form.Group className="mb-3">
                                <Form.Label>Port</Form.Label>
                                <Form.Control
                                    type="number"
                                    min="1"
                                    max="65535"
                                    value={port}
                                    onChange={(e) => setPort(parseInt(e.target.value))}
                                    disabled={pinging}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={3}>
                            <Form.Group className="mb-3">
                                <Form.Label>Interval (ms)</Form.Label>
                                <Form.Control
                                    type="number"
                                    min="500"
                                    max="10000"
                                    value={interval}
                                    onChange={(e) => setInterval(parseInt(e.target.value))}
                                    disabled={pinging}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={3}>
                            <div className="mb-3">
                                {!pinging ? (
                                    <Button variant="primary" onClick={startPing} className="w-100">
                                        Start Ping
                                    </Button>
                                ) : (
                                    <Button variant="danger" onClick={stopPing} className="w-100">
                                        Stop Ping
                                    </Button>
                                )}
                            </div>
                        </Col>
                    </Row>
                </Form>

                {results.length > 0 && (
                    <div className="mt-3">
                        <h6>Results</h6>
                        <ListGroup style={{ maxHeight: '200px', overflowY: 'auto' }}>
                            {results.map((result, index) => (
                                <ListGroup.Item
                                    key={index}
                                    variant={result.success ? 'success' : 'danger'}
                                >
                                    <small>
                                        {result.timestamp} - {result.ip}:{result.port} {' '}
                                        {result.success
                                            ? `Response time: ${result.time}ms ${result.service ? `(${result.service})` : ''}`
                                            : `Failed: ${result.error || 'timeout'}`
                                        }
                                    </small>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </div>
                )}
            </Card.Body>
        </Card>
    );
};

export default Ping;