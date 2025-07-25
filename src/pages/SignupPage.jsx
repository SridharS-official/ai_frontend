import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { AuthContext } from '../context/AuthContext';

const SignupPage = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [role, setRole] = useState('student');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        try {
            await api.post('/auth/signup', { ...formData, role });
            navigate('/login');
        } catch (err) {
            if (err.response && err.response.status === 422) {
                const newErrors = {};
                err.response.data.errors.forEach(error => {
                    newErrors[error.loc[1]] = error.msg;
                });
                setErrors(newErrors);
            } else {
                setErrors({ general: err.response?.data?.detail || 'An error occurred.' });
            }
        }
    };

    if (user) return null;

    return (
        <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8 p-10 bg-white rounded-xl shadow-lg">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                        Create your account
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {errors.general && <p className="text-red-500 text-center">{errors.general}</p>}
                    
                    <div className="flex justify-around">
                        <label className="flex items-center space-x-2">
                            <input
                                type="radio" name="role" value="student" checked={role === 'student'}
                                onChange={(e) => setRole(e.target.value)}
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                            />
                            <span className="text-gray-700">I am a Student 👩‍🎓</span>
                        </label>
                        <label className="flex items-center space-x-2">
                            <input
                                type="radio" name="role" value="hr" checked={role === 'hr'}
                                onChange={(e) => setRole(e.target.value)}
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                            />
                            <span className="text-gray-700">I am an HR 👨‍💼</span>
                        </label>
                    </div>

                    <div>
                        <input
                            type="text" name="name" value={formData.name} onChange={handleChange}
                            required className="w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500"
                            placeholder="Name"
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>
                    <div>
                        <input
                            type="email" name="email" value={formData.email} onChange={handleChange}
                            required className="w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500"
                            placeholder="Email address"
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>
                    <div>
                        <input
                            type="password" name="password" value={formData.password} onChange={handleChange}
                            required className="w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500"
                            placeholder="Password"
                        />
                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                        >
                            Sign Up
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SignupPage;