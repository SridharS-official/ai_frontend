import React, { useState } from 'react';
import api from '../api';

const BatchAssessmentPage = () => {
    const [jobDescription, setJobDescription] = useState('');
    const [resumes, setResumes] = useState([]);
    const [generatedAssessments, setGeneratedAssessments] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleFileChange = (e) => {
        setResumes([...e.target.files]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (resumes.length === 0 || !jobDescription) {
            setError('Please provide a job description and select at least one resume.');
            return;
        }
        setIsLoading(true);
        setError('');
        setGeneratedAssessments([]);

        const formData = new FormData();
        formData.append('job_description', jobDescription);
        resumes.forEach(resume => {
            formData.append('resumes', resume);
        });

        try {
            const response = await api.post('/batch-assessment/create-batch', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setGeneratedAssessments(response.data.assessments);
        } catch (err) {
            setError(err.response?.data?.detail || 'An error occurred during batch creation.');
        } finally {
            setIsLoading(false);
        }
    };

    const createMailToLink = (assessmentLink) => {
        const subject = "Invitation to Complete Candidate Assessment";
        const body = `Hello,\n\nPlease complete your candidate assessment by clicking the link below:\n\n${assessmentLink}\n\nBest regards,\nThe Hiring Team`;
        return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    };

    return (
        <div className="max-w-4xl mx-auto p-8">
            <div className="bg-white p-8 rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">Create Batch Assessments</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="jobDescription" className="block text-sm font-medium text-gray-700">Job Description</label>
                        <textarea
                            id="jobDescription"
                            rows="6"
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                            placeholder="Paste the job description here..."
                        />
                    </div>
                    <div>
                        <label htmlFor="resumes" className="block text-sm font-medium text-gray-700">Upload Candidate Resumes</label>
                        <input
                            type="file"
                            id="resumes"
                            onChange={handleFileChange}
                            multiple 
                            required
                            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                        />
                        {resumes.length > 0 && (
                             <p className="text-sm text-gray-500 mt-2">{resumes.length} file(s) selected.</p>
                        )}
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 px-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-indigo-300"
                    >
                        {isLoading ? `Processing ${resumes.length} Resumes...` : 'Generate Assessment Links'}
                    </button>
                    {error && <p className="mt-2 text-center text-red-500">{error}</p>}
                </form>

                {generatedAssessments.length > 0 && (
                    <div className="mt-8">
                        <h2 className="text-2xl font-semibold text-gray-800">Generated Links</h2>
                        <div className="mt-4 space-y-4">
                            {generatedAssessments.map(({ filename, token }) => {
                                const assessmentLink = `${window.location.origin}/assessment/${token}`;
                                return (
                                    <div key={token} className="p-4 border rounded-lg flex flex-col md:flex-row justify-between items-center gap-4">
                                        <p className="font-medium text-gray-700 break-all">{filename}</p>
                                        <div className="flex items-center space-x-2 flex-shrink-0">
                                            <button
                                                onClick={() => navigator.clipboard.writeText(assessmentLink)}
                                                className="px-3 py-1.5 bg-gray-200 text-gray-800 text-sm rounded-md hover:bg-gray-300"
                                            >
                                                Copy
                                            </button>
                                            <a
                                                href={createMailToLink(assessmentLink)}
                                                className="px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700"
                                            >
                                                Share via Email
                                            </a>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BatchAssessmentPage;