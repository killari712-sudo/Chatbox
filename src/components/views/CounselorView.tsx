
"use client";

import React from 'react';

export function CounselorView() {

    const counselors = [
        { name: 'Dr. Anya Sharma', degree: 'Psy.D.', specialty: 'Anxiety & Stress Management', image: 'https://picsum.photos/seed/counselor1/200/200', dataAiHint: 'woman portrait' },
        { name: 'David Chen', degree: 'LCSW', specialty: 'Relationships & Family Therapy', image: 'https://picsum.photos/seed/counselor2/200/200', dataAiHint: 'man portrait' },
        { name: 'Dr. Maria Rodriguez', degree: 'Ph.D.', specialty: 'Depression & Mood Disorders', image: 'https://picsum.photos/seed/counselor3/200/200', dataAiHint: 'woman portrait professional' },
    ];
    
    return (
        <div className="counselor-view-body">
            <div className="p-4 sm:p-6 md:p-8">
                <header className="mb-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">Professional Counseling</h1>
                    <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">A safe and confidential space to talk with licensed therapists.</p>
                </header>

                <div className="mb-8 p-6 bg-white/80 backdrop-blur-lg rounded-2xl border border-white/30 shadow-lg text-center">
                    <h2 className="text-2xl font-semibold mb-2 text-blue-800">Need to Talk Now?</h2>
                    <p className="text-gray-600 mb-4">Our 24/7 crisis support line is always available.</p>
                    <button className="bg-red-600 text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-red-700 transition-transform transform hover:scale-105 shadow-lg shadow-red-500/30">
                        Connect to Crisis Line
                    </button>
                </div>

                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-center mb-6">Schedule a Session</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                        {counselors.map((counselor, index) => (
                            <div key={index} className="counselor-card bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/40 text-center hover:-translate-y-2 transition-transform duration-300">
                                <img src={counselor.image} alt={`Portrait of ${counselor.name}`} className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-white shadow-md" data-ai-hint={counselor.dataAiHint} />
                                <h3 className="text-xl font-bold text-gray-900">{counselor.name}, {counselor.degree}</h3>
                                <p className="text-gray-500 mb-4">{counselor.specialty}</p>
                                <button className="w-full bg-blue-600 text-white font-semibold py-2.5 rounded-lg hover:bg-blue-700 transition">
                                    View Availability
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-6 bg-blue-50 border-2 border-blue-200 rounded-2xl text-center">
                    <h2 className="text-2xl font-semibold mb-2 text-blue-800">Your Privacy is Our Priority</h2>
                    <p className="text-blue-700 max-w-2xl mx-auto">All sessions are confidential and protected by end-to-end encryption. Your data is never shared.</p>
                </div>
            </div>
        </div>
    );
}

