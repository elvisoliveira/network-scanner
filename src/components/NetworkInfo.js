import { useState, useEffect } from 'react';
import { Card, Button, Spinner } from 'react-bootstrap';
import { fetchJsonWithTCPSocket } from '../utils/networkUtils';

const NetworkInfo = ({ onNetworkInfoUpdate }) => {
    const [networkData, setNetworkData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchNetworkInfo = async () => {
        setLoading(true);
        setError(null);
        console.log('[NetworkInfo] Fetching network information...');

        try {
            const data = await fetchJsonWithTCPSocket();
            if (data) {
                console.log('[NetworkInfo] Network data received:', data);
                setNetworkData(data);
                if (onNetworkInfoUpdate) {
                    onNetworkInfoUpdate(data);
                }
            } else {
                setError('Failed to fetch network information');
            }
        } catch (err) {
            console.error('[NetworkInfo] Error fetching network info:', err);
            setError(err.message || 'Unknown error occurred');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Auto-fetch on component mount
        fetchNetworkInfo();
    }, []);

    return (
        <Card className="mt-3">
            <Card.Header className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Network Information</h5>
                <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={fetchNetworkInfo}
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <Spinner size="sm" className="me-1" />
                            Loading...
                        </>
                    ) : (
                        'Refresh'
                    )}
                </Button>
            </Card.Header>
            <Card.Body>
                {error && (
                    <div className="alert alert-danger" role="alert">
                        <strong>Error:</strong> {error}
                    </div>
                )}

                {loading && !networkData && (
                    <div className="text-center p-3">
                        <Spinner />
                        <div className="mt-2">Fetching network information...</div>
                    </div>
                )}

                {networkData && (
                    <div className="row">
                        <div className="col-md-6">
                            <h6>Public IP Information</h6>
                            <div className="mb-2">
                                <strong>IP Address:</strong> {networkData.ip || 'N/A'}
                            </div>
                            <div className="mb-2">
                                <strong>Country:</strong> {networkData.country || 'N/A'}
                            </div>
                            <div className="mb-2">
                                <strong>Region:</strong> {networkData.region || 'N/A'}
                            </div>
                            <div className="mb-2">
                                <strong>City:</strong> {networkData.city || 'N/A'}
                            </div>
                        </div>
                        <div className="col-md-6">
                            <h6>Connection Details</h6>
                            <div className="mb-2">
                                <strong>Local IP:</strong> {networkData.localAddress || 'N/A'}
                            </div>
                            <div className="mb-2">
                                <strong>ISP:</strong> {networkData.isp || 'N/A'}
                            </div>
                            <div className="mb-2">
                                <strong>Organization:</strong> {networkData.organization || 'N/A'}
                            </div>
                            <div className="mb-2">
                                <strong>Timezone:</strong> {networkData.timezone || 'N/A'}
                            </div>
                        </div>
                    </div>
                )}

                {!loading && !networkData && !error && (
                    <div className="text-center text-muted p-3">
                        Click "Refresh" to fetch network information
                    </div>
                )}
            </Card.Body>
        </Card>
    );
};

export default NetworkInfo;