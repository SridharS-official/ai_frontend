import React, { useState, useEffect } from 'react';
import api from '../api';
import MetricCard from '../components/MetricCard'; 

const AdminDashboardPage = () => {
    const [logData, setLogData] = useState(null);
    const [metrics, setMetrics] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchLogs = async () => {
            setIsLoading(true);
            try {
                const response = await api.get('/admin/logs', {
                    params: { page: currentPage, limit: 10 }
                });
                setLogData(response.data);
            } catch (err) {
                console.log('err: ', err);
                setError('Failed to load logs. You may not have admin privileges.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchLogs();
    }, [currentPage]);

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const response = await api.get('/admin/logs/metrics');
                setMetrics(response.data);
            } catch (err) {
                console.error("Could not load metrics:", err);
            }
        };
        fetchMetrics();
    }, []);

    if (error) {
        return <div className="text-center p-10 text-red-500">{error}</div>;
    }

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard: LLM Logs</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {metrics ? (
                    <>
                        <MetricCard title="Total LLM Calls" value={metrics.total_calls.toLocaleString()} icon={'📞'} />
                        <MetricCard title="Total Input Tokens" value={metrics.total_input_tokens.toLocaleString()} icon={'📥'} />
                        <MetricCard title="Total Output Tokens" value={metrics.total_output_tokens.toLocaleString()} icon={'📤'} />
                        <MetricCard title="Avg. Response Time" value={`${metrics.avg_response_time_ms} ms`} icon={'⏱️'} />
                    </>
                ) : <p>Loading metrics...</p>}
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4 text-gray-700">Recent Agent Calls</h2>
                {isLoading ? <p>Loading logs...</p> : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Agent Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Input Tokens</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Output Tokens</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Response (ms)</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Timestamp</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {logData?.logs.map(log => (
                                    <tr key={log._id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{log.agent_name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.input_tokens}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.output_tokens}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.response_time_ms}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(log.timestamp).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                
                {logData && logData.total_pages > 1 && (
                     <div className="mt-4 flex justify-between items-center">
                        <button
                            onClick={() => setCurrentPage(currentPage - 1)}
                            disabled={currentPage <= 1}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>
                        <span className="text-sm text-gray-700">
                            Page {logData.page} of {logData.total_pages}
                        </span>
                        <button
                            onClick={() => setCurrentPage(currentPage + 1)}
                            disabled={currentPage >= logData.total_pages}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboardPage;