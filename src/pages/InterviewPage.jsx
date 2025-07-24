import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api';
import ResultsDisplay from '../components/ResultsDisplay';

const InterviewPage = () => {
    const { user } = useContext(AuthContext);

    // Common State
    const [resume, setResume] = useState(null);
    const [jobDescription, setJobDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // State for HR Flow
    const [generatedLink, setGeneratedLink] = useState('');

    // State for Student Flow
    const [questions, setQuestions] = useState([]);
    const [analysisId, setAnalysisId] = useState(null);
    const [answers, setAnswers] = useState([]);
    const [results, setResults] = useState(null);

    const isHr = user?.role === 'hr';

    const handleFileChange = (e) => {
        setResume(e.target.files[0]);
    };

    const handleAnswerChange = (index, value) => {
        const newAnswers = [...answers];
        newAnswers[index].answer = value;
        setAnswers(newAnswers);
    };

    const handleHrSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        const formData = new FormData();
        formData.append('resume', resume);
        formData.append('job_description', jobDescription);
        try {
            const response = await api.post('/assessment/create', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            const assessmentUrl = `${window.location.origin}/assessment/${response.data.assessment_token}`;
            setGeneratedLink(assessmentUrl);
        } catch (err) {
            setError(err.response?.data?.detail || 'An error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleStudentGetQuestions = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setResults(null);
        const formData = new FormData();
        formData.append('resume', resume);
        formData.append('job_description', jobDescription);
        try {
            const response = await api.post('/interview/run-interview-evaluation/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setQuestions(response.data.data);
            setAnalysisId(response.data.analysis_id);
            setAnswers(response.data.data.map(q => ({ question: q, answer: '' })));
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to get questions.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleStudentSubmitAnswers = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        const formData = new FormData();
        formData.append('analysis_id', analysisId);
        formData.append('answers', JSON.stringify(answers));
        try {
            const response = await api.post('/interview/submit-mock-answers/', formData);
            setResults(response.data.data);
            setQuestions([]);
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to submit answers.');
        } finally {
            setIsLoading(false);
        }
    };

    // --- RENDER LOGIC ---

    const renderHrForm = () => (
        !generatedLink ? (
            <form onSubmit={handleHrSubmit} className="space-y-6">
                 <div>
                    <label htmlFor="jobDescription" className="block text-sm font-medium text-gray-700">Job Description</label>
                    <textarea id="jobDescription" rows="6" value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" placeholder="Paste the job description here..."/>
                </div>
                <div>
                    <label htmlFor="resume" className="block text-sm font-medium text-gray-700">Upload Candidate's Resume</label>
                    <input type="file" id="resume" onChange={handleFileChange} required className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-indigo-50"/>
                </div>
                <button type="submit" disabled={isLoading} className="w-full py-3 px-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-indigo-300">
                    {isLoading ? 'Generating...' : 'Generate Assessment Link'}
                </button>
            </form>
        ) : (
            <div className="text-center p-6 bg-green-50 border border-green-200 rounded-lg">
                <h2 className="text-2xl font-semibold text-green-800">Link Generated!</h2>
                <p className="mt-2 text-gray-600">Share this link with the candidate.</p>
                <div className="mt-4 p-3 bg-gray-100 border rounded-md text-indigo-700 break-words">{generatedLink}</div>
                <button onClick={() => navigator.clipboard.writeText(generatedLink)} className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                    Copy Link
                </button>
            </div>
        )
    );

    const renderStudentForm = () => (
        <>
            {questions.length === 0 && !results && (
                 <form onSubmit={handleStudentGetQuestions} className="space-y-6">
                    <div>
                        <label htmlFor="jobDescription" className="block text-sm font-medium text-gray-700">Job Description</label>
                        <textarea id="jobDescription" rows="6" value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" placeholder="Paste the job description here..."/>
                    </div>
                    <div>
                        <label htmlFor="resume" className="block text-sm font-medium text-gray-700">Upload Your Resume</label>
                        <input type="file" id="resume" onChange={handleFileChange} required className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-indigo-50"/>
                    </div>
                    <button type="submit" disabled={isLoading} className="w-full py-3 px-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-indigo-300">
                        {isLoading ? 'Analyzing...' : 'Get Interview Questions'}
                    </button>
                </form>
            )}

            {questions.length > 0 && (
                <form onSubmit={handleStudentSubmitAnswers} className="space-y-6">
                    <h2 className="text-2xl font-semibold text-gray-800">Your Behavioral Questions</h2>
                    {questions.map((q, index) => (
                        <div key={index}>
                            <label className="block font-medium text-gray-700">{index + 1}. {q}</label>
                            <textarea rows="4" value={answers[index].answer} onChange={(e) => handleAnswerChange(index, e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" placeholder="Your answer..."/>
                        </div>
                    ))}
                    <button type="submit" disabled={isLoading} className="w-full py-3 px-4 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 disabled:bg-green-300">
                        {isLoading ? 'Evaluating...' : 'Submit Answers & Get Results'}
                    </button>
                </form>
            )}

            {results && <ResultsDisplay results={results} />}
        </>
    );

    return (
        <div className="max-w-4xl mx-auto p-8">
            <div className="bg-white p-8 rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">
                    {isHr ? 'Create Candidate Assessment' : 'Start New Analysis'}
                </h1>
                
                {isHr ? renderHrForm() : renderStudentForm()}

                {error && <p className="mt-4 text-center text-red-500">{error}</p>}
            </div>
        </div>
    );
};

export default InterviewPage;