import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

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
                setDashboardData({ role: 'student', chart_data: [] }); // Default to empty state on error
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

    // --- STUDENT VIEW ---
    if (dashboardData?.role === 'student') {
        return (
            <div className="max-w-7xl mx-auto p-4 md:p-8">
                <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">Student Dashboard</h1>
                    <Link to="/analyze" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 shadow-sm">
                        + Start New Analysis
                    </Link>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">Analysis History</h2>
                    {dashboardData.chart_data && dashboardData.chart_data.length > 0 ? (
                        <div className="space-y-2">
                            {dashboardData.chart_data.map((item) => (
                                <Link to={`/report/${item.analysis_id}`} key={item.analysis_id} className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors duration-200">
                                    <div className="flex justify-between mb-1">
                                        <span className="text-base font-medium text-gray-700">{item.jd_title}</span>
                                        <span className="text-sm font-medium text-gray-700">{item.overall_score}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-4">
                                        <div 
                                            className="bg-indigo-600 h-4 rounded-full" 
                                            style={{ width: `${item.overall_score}%` }}
                                        ></div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10">
                            <p className="text-gray-500">You haven't run any analyses yet.</p>
                            <p className="text-gray-500">Click "Start New Analysis" to begin!</p>
                        </div>
                    )}
                </div>
            </div>
        );
    }
    
    // --- HR VIEW ---
    if (dashboardData?.role === 'hr') {
        return (
             <div className="max-w-7xl mx-auto p-4 md:p-8">
                <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">HR Dashboard</h1>
                     <Link to="/analyze" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 shadow-sm">
                        + Analyze a Candidate
                    </Link>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4 text-gray-700">Your Job Descriptions</h2>
                        {dashboardData.job_descriptions && dashboardData.job_descriptions.length > 0 ? (
                            <ul className="space-y-2">
                               {dashboardData.job_descriptions.map((jd, index) => (
                                   <li key={index}>
                                       <button 
                                            onClick={() => fetchHrDetails(jd)}
                                            className="w-full text-left p-2 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none focus:bg-indigo-100"
                                        >
                                           {jd.substring(0, 70)}...
                                       </button>
                                   </li>
                               ))}
                            </ul>
                        ) : (
                           <p className="text-gray-500">No analyses found. Click "Analyze a Candidate" to start.</p>
                        )}
                    </div>
                    <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4 text-gray-700">Candidate Analysis</h2>
                        {isDetailsLoading && <p>Loading details...</p>}
                        {!isDetailsLoading && !hrDetails && <p className="text-gray-500">Select a job description from the left.</p>}
                        {hrDetails && (
                            <div>
                               <h3 className="text-lg font-bold text-indigo-700 mb-4">{hrDetails.jd_title}</h3>
                               <div className="space-y-2">
                                   {hrDetails.candidate_data.length > 0 ? hrDetails.candidate_data.map((item) => (
                                        <Link to={`/report/${item.analysis_id}`} key={item.analysis_id} className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors duration-200">
                                            <div className="flex justify-between mb-1">
                                                <span className="text-base font-medium text-gray-700">{item.resume_filename}</span>
                                                <span className="text-sm font-medium text-gray-700">{item.overall_score}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${item.overall_score}%` }}></div>
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