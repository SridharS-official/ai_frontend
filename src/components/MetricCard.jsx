import React from 'react';

const MetricCard = ({ title, value, icon }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex items-center">
            <div className="p-3 bg-indigo-100 text-indigo-600 rounded-full">
                {icon}
            </div>
            <div className="ml-4">
                <p className="text-sm text-gray-500">{title}</p>
                <p className="text-2xl font-bold text-gray-800">{value}</p>
            </div>
        </div>
    );
};

export default MetricCard;