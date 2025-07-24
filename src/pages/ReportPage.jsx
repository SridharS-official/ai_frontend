import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';

const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
};

const InfoCard = ({ title, data }) => {
    if (!data) return null;
    return (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">{title}</h3>
            <div className="space-y-4">
                {Object.entries(data).map(([key, value]) => {
                    if (key === 'feedback' || key === 'improvements') {
                        return (
                            <div key={key}>
                                <h4 className="font-semibold capitalize text-gray-600">{key}:</h4>
                                <ul className="list-disc list-inside pl-2 mt-1 space-y-1 text-gray-700">
                                    {value.map((item, i) => <li key={i}>{item}</li>)}
                                </ul>
                            </div>
                        );
                    }
                    if (key === 'experience') {
                         return (
                            <div key={key} className="flex justify-between items-center">
                                <p className="capitalize text-gray-600">Experience:</p>
                                <p className="text-2xl font-bold text-gray-800">{value} {value !== 1 ? 'Years' : 'Year'}</p>
                            </div>
                        );
                    }
                    if (typeof value === 'number') {
                         return (
                            <div key={key} className="flex justify-between items-center">
                                <p className="capitalize text-gray-600">{key.replace('_', ' ')}:</p>
                                <p className={`text-2xl font-bold ${getScoreColor(value)}`}>{value}<span className="text-lg">/100</span></p>
                            </div>
                        );
                    }
                    return null;
                })}
            </div>
        </div>
    );
};


const ReportPage = () => {
    const { analysis_id } = useParams();
    const [report, setReport] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

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

    if (isLoading) {
        return <div className="text-center p-10">Loading Report...</div>;
    }

    if (error) {
        return <div className="text-center p-10 text-red-500">{error}</div>;
    }

    if (!report) {
        return <div className="text-center p-10">Report not found.</div>;
    }

    const { full_result } = report;
    const { resume_analysis, mock_response, success_prediction, gap_fixer } = full_result;

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8">
            <div className="mb-6">
                <Link to="/" className="text-indigo-600 hover:text-indigo-800">&larr; Back to Dashboard</Link>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Analysis Report</h1>
                <div className="mt-2 text-sm text-gray-500">
                    <p><strong>Resume:</strong> {report.resume_filename}</p>
                    <p><strong>Job Description:</strong> {report.job_description_text.substring(0, 100)}...</p>
                </div>
            </div>

            {/* Main Score and Justification */}
            {success_prediction?.success && (
                <div className="mb-8 text-center bg-white p-6 rounded-lg shadow-lg border border-indigo-200">
                    <p className="text-lg text-gray-600">Overall Interview Score</p>
                    <p className={`text-6xl font-bold my-2 ${getScoreColor(success_prediction.data.score)}`}>
                        {success_prediction.data.score}
                    </p>
                    <p className="text-gray-700 max-w-2xl mx-auto">{success_prediction.data.justification}</p>
                </div>
            )}

            {/* Grid for detailed cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {resume_analysis?.success && <InfoCard title="📄 Resume Analysis" data={resume_analysis.data} />}
                {mock_response?.success && <InfoCard title="🎙️ Mock Interview" data={mock_response.data} />}
                {gap_fixer?.success && (
                    <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-md border border-gray-200">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">🎯 Actionable Improvement Plan</h3>
                        <div className="space-y-4">
                            <div>
                                <h4 className="font-semibold text-gray-600">Summary:</h4>
                                <p className="text-gray-700 mt-1">{gap_fixer.data.summary}</p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-600">Suggested Improvements:</h4>
                                <ul className="list-disc list-inside pl-2 mt-1 space-y-1 text-gray-700">
                                    {gap_fixer.data.improvements.map((item, i) => <li key={i}>{item}</li>)}
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-600">Helpful Resources:</h4>
                                <ul className="list-disc list-inside pl-2 mt-1 space-y-1 text-indigo-600">
                                    {gap_fixer.data.links.map((link, i) => (
                                        <li key={i}>
                                            <a href={link} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                                Resource {i + 1}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReportPage;