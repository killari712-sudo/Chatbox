
"use client";

import React from 'react';

export function MentorView() {
    
    const mentors = [
        { name: 'Dr. Evelyn Reed', title: 'Ph.D. in Psychology', specialty: 'Career & Life Coaching', avatar: 'ER', status: 'Online', match: 95 },
        { name: 'Marcus Chen', title: 'Senior Software Engineer', specialty: 'Tech & Startups', avatar: 'MC', status: 'Away', match: 88 },
        { name: 'Aisha Khan', title: 'Founder & CEO', specialty: 'Entrepreneurship', avatar: 'AK', status: 'Online', match: 82 },
        { name: 'Ben Carter', title: 'Creative Director', specialty: 'Arts & Design', avatar: 'BC', status: 'Do Not Disturb', match: 78 },
        { name: 'Sophia Loren', title: 'Certified Financial Planner', specialty: 'Finance & Investment', avatar: 'SL', status: 'Online', match: 91 },
        { name: 'David Lee', title: 'Product Manager', specialty: 'Business Strategy', avatar: 'DL', status: 'Offline', match: 85 },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Online': return 'bg-green-500';
            case 'Away': return 'bg-yellow-500';
            case 'Do Not Disturb': return 'bg-red-500';
            default: return 'bg-gray-400';
        }
    };

    return (
        <div className="mentor-view-body">
            <div className="p-4 sm:p-6 md:p-8">
                <header className="mb-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-2">Find Your Mentor</h1>
                    <p className="text-lg md:text-xl text-gray-600">Connect with experienced professionals to guide your journey.</p>
                </header>

                <div className="mb-8 flex flex-col sm:flex-row justify-center items-center gap-4">
                    <input type="text" placeholder="🔍 Search by name or specialty..." className="w-full sm:w-1/2 p-3 rounded-full border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"/>
                    <button className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-full hover:bg-blue-700 transition-transform transform hover:scale-105">
                        Filter Results
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {mentors.map((mentor, index) => (
                        <div key={index} className="mentor-card bg-white/60 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-shadow duration-300">
                            <div className="flex items-center mb-4">
                                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-2xl mr-4 relative">
                                    {mentor.avatar}
                                    <span className={`absolute bottom-0 right-0 block h-4 w-4 rounded-full ${getStatusColor(mentor.status)} border-2 border-white`}></span>
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold">{mentor.name}</h2>
                                    <p className="text-gray-500">{mentor.title}</p>
                                </div>
                            </div>
                            <div className="mb-4">
                                <h3 className="font-semibold mb-1">Specialty:</h3>
                                <p className="text-gray-700">{mentor.specialty}</p>
                            </div>
                            <div className="mb-6">
                                 <h3 className="font-semibold mb-1">Match Score:</h3>
                                 <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div className="bg-blue-600 h-2.5 rounded-full" style={{width: `${mentor.match}%`}}></div>
                                 </div>
                                 <p className="text-right text-sm text-gray-500 mt-1">{mentor.match}% Match</p>
                            </div>
                            <button className="w-full bg-black text-white font-semibold py-3 rounded-lg hover:bg-gray-800 transition">
                                Connect
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
