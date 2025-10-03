import React, { useState, useRef, useEffect } from 'react';
import { Card, Form, Button, ListGroup, Row, Col, InputGroup } from 'react-bootstrap';
import { tcpPing } from '../utils/networkUtils';

const Ping = ({ selectedTarget }) => {
    const [ipAddress, setIpAddress] = useState('192.168.1.1');
    const [port, setPort] = useState(8080);
    const [interval, setIntervalTime] = useState(1000);
    const [pinging, setPinging] = useState(false);
    const [results, setResults] = useState([]);
    const pingIntervalRef = useRef(null);

    useEffect(() => {
        if (selectedTarget?.ip && selectedTarget.ip !== ipAddress) {
            setIpAddress(selectedTarget.ip);
        }
        if (selectedTarget?.port && selectedTarget.port !== port) {
            setPort(selectedTarget.port);
        }
    }, [selectedTarget]);

    const isValidIP = (ip) => {
        const segments = ip.split('.');
        return segments.length === 4 && segments.every(segment => {
            const num = parseInt(segment);
            return !isNaN(num) && num >= 0 && num <= 255;
        });
    };

    const handleIPSegmentChange = (segmentIndex, value) => {
        const segments = ipAddress.split('.');
        segments[segmentIndex] = value;
        setIpAddress(segments.join('.'));
    };

    const pingHost = async (ip, targetPort) => {
        console.log(`[Ping] Starting ping to ${ip}:${targetPort}`);
        const startTime = Date.now();

        const result = await tcpPing(ip, targetPort, 5000);
        const totalTime = Date.now() - startTime;

        console.log(`[Ping] Result for ${ip}:${targetPort}:`, {
            success: result.success,
            responseTime: result.responseTime,
            totalTime: totalTime,
            error: result.error
        });

        return {
            success: result.success,
            time: result.responseTime || 0,
            error: result.error
        };
    };

    const startPing = async () => {
        if (!isValidIP(ipAddress)) {
            console.log('[Ping] Invalid IP address:', ipAddress);
            alert('Please enter a valid IP address');
            return;
        }

        console.log(`[Ping] Starting ping session to ${ipAddress}:${port} with ${interval}ms interval`);
        setPinging(true);
        setResults([]);

        const doPing = async () => {
            const timestamp = new Date().toLocaleTimeString();
            console.log(`[Ping] Executing ping at ${timestamp}`);

            const result = await pingHost(ipAddress, port);

            const newResult = {
                timestamp,
                ip: ipAddress,
                port,
                ...result
            };

            console.log('[Ping] Adding result to list:', newResult);
            setResults(prev => [newResult, ...prev.slice(0, 9)]);
        };

        // Initial ping
        console.log('[Ping] Executing initial ping');
        await doPing();

        // Set up interval
        console.log(`[Ping] Setting up interval every ${interval}ms`);
        pingIntervalRef.current = setInterval(doPing, interval);
    };

    const stopPing = () => {
        console.log('[Ping] Stopping ping session');
        if (pingIntervalRef.current) {
            clearInterval(pingIntervalRef.current);
            pingIntervalRef.current = null;
            console.log('[Ping] Interval cleared');
        }
        setPinging(false);
        console.log('[Ping] Ping session stopped');
    };

    return (
        <Card className="mt-3">
            <Card.Header>
                Ping Tool
            </Card.Header>
            <Card.Body>
                <Form>
                    <Row className="align-items-end">
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>IP Address</Form.Label>
                                <InputGroup>
                                    {ipAddress.split('.').map((segment, segmentIndex) => (
                                        <React.Fragment key={segmentIndex}>
                                            <Form.Control
                                                type="number"
                                                min="0"
                                                max="255"
                                                value={segment}
                                                onChange={(e) => handleIPSegmentChange(segmentIndex, e.target.value)}
                                                disabled={pinging}
                                                placeholder="0"
                                                className="text-center"
                                                style={{ width: '60px' }}
                                            />
                                            {segmentIndex < 3 && <InputGroup.Text>.</InputGroup.Text>}
                                        </React.Fragment>
                                    ))}
                                </InputGroup>
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
                        <Col md={2}>
                            <Form.Group className="mb-3">
                                <Form.Label>Interval (ms)</Form.Label>
                                <Form.Control
                                    type="number"
                                    min="500"
                                    max="10000"
                                    value={interval}
                                    onChange={(e) => setIntervalTime(parseInt(e.target.value))}
                                    disabled={pinging}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={2}>
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
                                            ? `Response time: ${result.time}ms`
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