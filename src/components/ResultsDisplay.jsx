import React from 'react';

// A helper function to get a color based on a score (0-100)
const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
};

// A reusable card component for displaying scores and feedback
const InfoCard = ({ title, data }) => (
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
                            <p className="text-2xl font-bold text-gray-800">{value} {value > 1 ? 'Years' : 'Year'}</p>
                        </div>
                    );
                }
                if (key === 'score' || typeof value === 'number') {
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


const ResultsDisplay = ({ results }) => {
    if (!results) return null;

    const { resume_analysis, mock_response, success_prediction, gap_fixer } = results;

    return (
        <div className="mt-8 p-6 bg-gray-50 rounded-lg animate-fade-in">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Your Evaluation Results</h2>

            {/* Main Score and Justification */}
            <div className="mb-8 text-center bg-white p-6 rounded-lg shadow-lg border border-indigo-200">
                <p className="text-lg text-gray-600">Overall Interview Score</p>
                <p className={`text-6xl font-bold my-2 ${getScoreColor(success_prediction.data.score)}`}>
                    {success_prediction.data.score}
                </p>
                <p className="text-gray-700 max-w-2xl mx-auto">{success_prediction.data.justification}</p>
            </div>

            {/* Grid for detailed cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Resume Analysis Card */}
                {resume_analysis.success && <InfoCard title="📄 Resume Analysis" data={resume_analysis.data} />}

                {/* Mock Response Card */}
                {mock_response.success && <InfoCard title="🎙️ Mock Interview" data={mock_response.data} />}

                {/* Gap Fixer Card */}
                {gap_fixer.success && (
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

export default ResultsDisplay;