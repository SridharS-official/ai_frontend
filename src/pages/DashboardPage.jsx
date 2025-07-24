import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import MetricCard from '../components/MetricCard';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const DashboardPage = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [hrDetails, setHrDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isDetailsLoading, setIsDetailsLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const response = await api.get('/dashboard');
                setDashboardData(response.data);
            } catch (err) {
                console.error("Failed to load dashboard data:", err);
                setDashboardData({ role: 'student', chart_data: [] }); // Default to empty
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const fetchHrDetails = async (jdText) => {
        setIsDetailsLoading(true);
        setHrDetails(null);
        try {
            const response = await api.get(`/dashboard/hr-details`, {
                params: { jd_text: jdText }
            });
            setHrDetails(response.data);
        } catch (err) {
            console.error('Failed to load job description details:', err);
        } finally {
            setIsDetailsLoading(false);
        }
    };

    if (isLoading) {
        return <div className="text-center p-10">Loading Dashboard...</div>;
    }

    if (dashboardData?.role === 'student') {
        const analyses = dashboardData.chart_data || [];
        const totalAnalyses = analyses.length;
        const avgScore = totalAnalyses > 0 ? (analyses.reduce((sum, item) => sum + item.overall_score, 0) / totalAnalyses).toFixed(1) : 0;
        
        const chartData = {
            labels: analyses.map(a => a.jd_title),
            datasets: [{
                label: 'Overall Score',
                data: analyses.map(a => a.overall_score),
                backgroundColor: 'rgba(79, 70, 229, 0.8)',
                borderColor: 'rgba(79, 70, 229, 1)',
                borderWidth: 1,
            }]
        };

        const chartOptions = {
            responsive: true,
            plugins: { legend: { display: false }, title: { display: true, text: 'Performance Across Job Descriptions' } },
            scales: { y: { beginAtZero: true, max: 100 } }
        };

        return (
            <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6">
                 <div className="flex flex-wrap justify-between items-center gap-4">
                    <h1 className="text-3xl font-bold text-gray-800">Student Dashboard</h1>
                    <Link to="/analyze" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 shadow-sm">
                        + Start New Analysis
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <MetricCard title="Total Analyses" value={totalAnalyses} icon={'📊'} />
                    <MetricCard title="Average Score" value={`${avgScore}%`} icon={'🎯'} />
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                     {totalAnalyses > 0 ? (
                        <Bar options={chartOptions} data={chartData} />
                    ) : (
                        <div className="text-center py-10">
                            <p className="text-gray-500">No data to display. Run an analysis to see your chart!</p>
                        </div>
                    )}
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">Analysis History</h2>
                    {totalAnalyses > 0 ? (
                        <div className="space-y-2">
                           {analyses.map((item) => (
                                <Link to={`/report/${item.analysis_id}`} key={item.analysis_id} className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors duration-200">
                                    <div className="flex justify-between">
                                        <span className="font-medium text-gray-700">{item.jd_title}</span>
                                        <span className="font-bold text-indigo-600">{item.overall_score}%</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                         <div className="text-center py-10">
                            <p className="text-gray-500">You haven't run any analyses yet.</p>
                        </div>
                    )}
                </div>
            </div>
        );
    }
    
    if (dashboardData?.role === 'hr') {
        const jds = dashboardData.job_descriptions || [];

        return (
             <div className="max-w-7xl mx-auto p-4 md:p-8">
                <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">HR Dashboard</h1>
                     <div className="flex items-center space-x-2">
                        <Link to="/batch-create" className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 shadow-sm">
                            + Create Batch
                        </Link>
                        <Link to="/analyze" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 shadow-sm">
                            Analyze Single Candidate
                        </Link>
                     </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4 text-gray-700">Job Descriptions</h2>
                        {jds.length > 0 ? (
                            <ul className="space-y-2">
                               {jds.map((jd, index) => (
                                   <li key={index}>
                                       <button onClick={() => fetchHrDetails(jd)} className="w-full text-left p-2 rounded-md text-gray-600 hover:bg-gray-100 focus:bg-indigo-100">
                                           {jd.substring(0, 70)}...
                                       </button>
                                   </li>
                               ))}
                            </ul>
                        ) : (
                           <p className="text-gray-500">No analyses found.</p>
                        )}
                    </div>
                    <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4 text-gray-700">Candidate Analysis</h2>
                        {isDetailsLoading && <p>Loading candidates...</p>}
                        {!isDetailsLoading && !hrDetails && <p className="text-gray-500">Select a job description to see results.</p>}
                        {hrDetails && (
                            <div>
                               <h3 className="text-lg font-bold text-indigo-700 mb-4">{hrDetails.jd_title}</h3>
                               <div className="space-y-3">
                                   {hrDetails.candidate_data.length > 0 ? hrDetails.candidate_data.map((item) => (
                                        <Link to={`/report/${item.analysis_id}`} key={item.analysis_id} className="block p-3 border rounded-lg hover:shadow-md transition-shadow">
                                            <div className="flex justify-between items-center">
                                                <span className="font-medium text-gray-700">{item.resume_filename}</span>
                                                <span className="font-bold text-lg text-green-600">{item.overall_score}%</span>
                                            </div>
                                        </Link>
                                   )) : <p className="text-gray-500">No candidates analyzed for this job yet.</p>}
                               </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )
    }

    return <div className="text-center p-10">Welcome! Setting up your dashboard...</div>;
};

export default DashboardPage;