import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import { Radar } from 'react-chartjs-2';
import {
    Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend,
    RadialLinearScale, PointElement, LineElement, Filler,
} from 'chart.js';

ChartJS.register(
    CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend,
    RadialLinearScale, PointElement, LineElement, Filler
);

const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
};

const ReportPage = () => {
    const { analysis_id } = useParams();
    const [report, setReport] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('summary');

    useEffect(() => {
        const fetchReport = async () => {
            setIsLoading(true);
            try {
                const response = await api.get(`/analysis/${analysis_id}`);
                setReport(response.data);
            } catch (err) {
                setError('Failed to load report data.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchReport();
    }, [analysis_id]);

    if (isLoading) return <div className="text-center p-10">Loading Report...</div>;
    if (error) return <div className="text-center p-10 text-red-500">{error}</div>;
    if (!report?.full_result) return <div className="text-center p-10">Report data is incomplete or not found.</div>;

    const { full_result, resume_filename, job_description_text } = report;
    const { resume_analysis, mock_response, success_prediction, gap_fixer } = full_result;

    const radarChartData = {
        labels: [
            'Resume Clarity', 'Resume Relevance', 'Resume Structure', 
            'Interview Tone', 'Interview Confidence', 'Interview Relevance'
        ],
        datasets: [{
            label: 'Competencies',
            data: [
                resume_analysis?.data?.clarity ?? 0,
                resume_analysis?.data?.relevance ?? 0,
                resume_analysis?.data?.structure ?? 0,
                mock_response?.data?.tone ?? 0,
                mock_response?.data?.confidence ?? 0,
                mock_response?.data?.relevance ?? 0,
            ],
            backgroundColor: 'rgba(79, 70, 229, 0.2)',
            borderColor: 'rgba(79, 70, 229, 1)',
            borderWidth: 2,
        }],
    };

    const radarOptions = {
        scales: { r: { beginAtZero: true, max: 100, ticks: { backdropColor: 'transparent' } } },
        plugins: { legend: { display: false } }
    };

    const tabContent = {
        summary: { title: 'Overall Summary', content: success_prediction?.data?.justification ?? 'No summary available.' },
        resume: { title: 'Resume Feedback', content: resume_analysis?.data?.feedback ?? [] },
        interview: { title: 'Interview Feedback', content: mock_response?.data?.feedback ?? [] },
        action_plan: { title: 'Action Plan', content: gap_fixer?.data?.improvements ?? [], links: gap_fixer?.data?.links ?? [] },
    };

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6">
            <div className="mb-2"><Link to="/" className="text-indigo-600 hover:text-indigo-800">&larr; Back to Dashboard</Link></div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold text-gray-800">Consolidated Candidate Report</h1>
                <div className="mt-2 text-sm text-gray-500">
                    <p><strong>Candidate Resume:</strong> {resume_filename}</p>
                    <p><strong>Target Job:</strong> {job_description_text.substring(0, 100)}...</p>
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 flex flex-col gap-6">
                    <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                        <p className="text-lg text-gray-600">Overall Score</p>
                        <p className={`text-7xl font-bold my-2 ${getScoreColor(success_prediction?.data?.score)}`}>
                            {success_prediction?.data?.score ?? 'N/A'}
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Key Metrics</h3>
                        <div className="space-y-3">
                           <div className="flex justify-between"><span>Years of Experience:</span> <span className="font-bold">{resume_analysis?.data?.experience ?? 'N/A'}</span></div>
                           <div className="flex justify-between"><span>Avg. Resume Score:</span> <span className="font-bold">{(((resume_analysis?.data?.clarity ?? 0) + (resume_analysis?.data?.relevance ?? 0) + (resume_analysis?.data?.structure ?? 0)) / 3).toFixed(0)}%</span></div>
                           <div className="flex justify-between"><span>Avg. Interview Score:</span> <span className="font-bold">{(mock_response?.data?.total_marks ?? 0).toFixed(0)}%</span></div>
                        </div>
                    </div>
                </div>
                <div className="lg:col-span-2 flex flex-col gap-6">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Competency Radar</h3>
                        <div className="w-full max-w-lg mx-auto"><Radar data={radarChartData} options={radarOptions} /></div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <div className="border-b border-gray-200">
                            <nav className="-mb-px flex space-x-6">
                                {Object.keys(tabContent).map(key => (
                                    <button key={key} onClick={() => setActiveTab(key)} className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === key ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                                        {tabContent[key].title}
                                    </button>
                                ))}
                            </nav>
                        </div>
                        <div className="pt-6">
                            {typeof tabContent[activeTab].content === 'string' ? (
                                <p className="text-gray-700">{tabContent[activeTab].content}</p>
                            ) : (
                                <ul className="list-disc list-inside space-y-2 text-gray-700">
                                    {tabContent[activeTab].content.map((item, i) => <li key={i}>{item}</li>)}
                                </ul>
                            )}
                            {activeTab === 'action_plan' && (
                                <div className="mt-4">
                                     <h4 className="font-semibold text-gray-600">Helpful Resources:</h4>
                                     <ul className="list-disc list-inside mt-1 space-y-1 text-indigo-600">
                                        {(tabContent[activeTab].links || []).map((link, i) => (
                                            <li key={i}><a href={link} target="_blank" rel="noopener noreferrer" className="hover:underline">Resource {i + 1}</a></li>
                                        ))}
                                     </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportPage;