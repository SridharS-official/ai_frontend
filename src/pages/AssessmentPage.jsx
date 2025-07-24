import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';

const AssessmentPage = () => {
    const { token } = useParams();
    const [assessment, setAssessment] = useState(null);
    const [answers, setAnswers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    useEffect(() => {
        const fetchAssessment = async () => {
            setIsLoading(true);
            try {
                const response = await api.get(`/assessment/public/${token}`);
                setAssessment(response.data);
                // Initialize answers state based on the fetched questions
                setAnswers(response.data.questions.map(q => ({ question: q, answer: '' })));
            } catch (err) {
                setError('This assessment link is invalid or has expired.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAssessment();
    }, [token]);

    const handleAnswerChange = (index, value) => {
        const newAnswers = [...answers];
        newAnswers[index].answer = value;
        setAnswers(newAnswers);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        try {
           await api.post(`/assessment/public/${token}`, JSON.stringify(answers));
            setIsSubmitted(true);
        } catch (err) {
            console.log('err: ', err);
            setError('There was an error submitting your answers. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return <div className="text-center p-10">Loading Assessment...</div>;
    }

    if (error) {
        return <div className="text-center p-10 text-red-500">{error}</div>;
    }

    if (isSubmitted) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="w-full max-w-2xl p-10 bg-white rounded-xl shadow-lg text-center">
                    <h1 className="text-3xl font-bold text-green-600 mb-4">Thank You!</h1>
                    <p className="text-gray-700">Your assessment has been submitted successfully.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-4xl mx-auto p-8 bg-white rounded-xl shadow-lg">
                <h1 className="text-3xl font-bold mb-2 text-gray-800">Candidate Assessment</h1>
                <div className="mb-6 text-sm text-gray-500">
                    <p><strong>Job Description:</strong> {assessment.job_description.substring(0, 150)}...</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {assessment.questions.map((q, index) => (
                        <div key={index}>
                            <label className="block font-medium text-gray-700">{index + 1}. {q}</label>
                            <textarea
                                rows="4"
                                value={answers[index].answer}
                                onChange={(e) => handleAnswerChange(index, e.target.value)}
                                required
                                className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                placeholder="Your answer..."
                            />
                        </div>
                    ))}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3 px-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-indigo-300"
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Assessment'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AssessmentPage;