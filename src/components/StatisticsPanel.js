import React from 'react';
import { Card, Row, Col, ProgressBar } from 'react-bootstrap';
import { BsRouter, BsPrinter, BsCameraVideo, BsHddNetwork, BsQuestionCircle } from 'react-icons/bs';

const StatisticsPanel = ({ devices }) => {
    const stats = {
        total: devices.length,
        printers: devices.filter(d => d.type === 'printer').length,
        routers: devices.filter(d => d.type === 'router').length,
        cameras: devices.filter(d => d.type === 'camera').length,
        nas: devices.filter(d => d.type === 'nas').length,
        unknown: devices.filter(d => d.type === 'unknown').length
    };

    const getPercentage = (count) => (stats.total ? Math.round((count / stats.total) * 100) : 0);

    const StatItem = ({ icon: Icon, label, count, variant }) => (
        <div className="mb-3">
            <div className="d-flex align-items-center mb-1">
                <Icon className="me-2" />
                <span className="fw-bold">{label}:</span>
                <span className="ms-2">{count}</span>
                <span className="ms-2 text-muted small">({getPercentage(count)}%)</span>
            </div>
            <ProgressBar 
                variant={variant}
                now={getPercentage(count)}
                className="shadow-sm"
                style={{ height: '6px' }}
            />
        </div>
    );

    return (
        <Card className="mt-3 shadow-sm">
            <Card.Header className="bg-primary text-white d-flex align-items-center">
                <h5 className="mb-0">Network Statistics</h5>
                <span className="ms-auto badge bg-light text-primary">
                    Total Devices: {stats.total}
                </span>
            </Card.Header>
            <Card.Body className="bg-light">
                <Row>
                    <Col md={6}>
                        <StatItem 
                            icon={BsPrinter}
                            label="Printers"
                            count={stats.printers}
                            variant="info"
                        />
                        <StatItem 
                            icon={BsRouter}
                            label="Routers"
                            count={stats.routers}
                            variant="success"
                        />
                        <StatItem 
                            icon={BsCameraVideo}
                            label="Cameras"
                            count={stats.cameras}
                            variant="warning"
                        />
                    </Col>
                    <Col md={6}>
                        <StatItem 
                            icon={BsHddNetwork}
                            label="NAS Devices"
                            count={stats.nas}
                            variant="primary"
                        />
                        <StatItem 
                            icon={BsQuestionCircle}
                            label="Unknown"
                            count={stats.unknown}
                            variant="secondary"
                        />
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
};

export default StatisticsPanel;