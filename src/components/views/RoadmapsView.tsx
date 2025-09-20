
"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Zap, Moon, Brain, Heart, AlertTriangle, X, Check, Gamepad2, Award, User } from 'lucide-react';

// --- MOCK DATA ---
const roadmapData = [
  { id: 'urgent-1', title: 'Immediate Support', tagline: 'Feeling overwhelmed? Start here.', icon: AlertTriangle, category: 'Wellness', progress: 0, urgent: true, iconBg: 'bg-red-100 text-red-600', steps: [
      { title: 'Grounding Exercise', tip: 'Focus on your senses. Name 5 things you see.', resource: { type: 'video', label: 'Watch 2-min Guide' } },
      { title: 'Connect with Support', tip: 'You are not alone. Reach out now.', resource: { type: 'link', label: 'Chat with a Counselor' } },
  ]},
  { id: 'study-1', title: 'Exam Stress Relief', tagline: 'Techniques to stay calm and focused.', icon: Brain, category: 'Study Stress', progress: 0.25, iconBg: 'bg-blue-100 text-blue-600', steps: [
      { title: 'The 5-4-3-2-1 Method', tip: 'A quick sensory grounding technique.', resource: { type: 'pdf', label: 'Download PDF' }, completed: true },
      { title: 'Pomodoro Technique', tip: 'Break study sessions into 25-min intervals.', resource: { type: 'game', label: 'Start Timer' } },
      { title: 'Mindful Breathing', tip: 'A 5-minute guided breathing exercise.', resource: { type: 'audio', label: 'Listen Now' } },
      { title: 'Post-Exam Relaxation', tip: 'Plan a reward for after your exam.', resource: { type: 'link', label: 'Get Ideas' } },
  ]},
  { id: 'sleep-1', title: 'Better Sleep Hygiene', tagline: 'Build habits for restful nights.', icon: Moon, category: 'Sleep', progress: 0.6, iconBg: 'bg-indigo-100 text-indigo-600', steps: [
      { title: 'Digital Detox', tip: 'No screens 1 hour before bed.', completed: true },
      { title: 'Create a Wind-Down Routine', tip: 'Read a book, listen to calm music, or stretch.', completed: true },
      { title: 'Optimize Your Environment', tip: 'Keep your room cool, dark, and quiet.', completed: true },
      { title: 'Consistent Sleep Schedule', tip: 'Go to bed and wake up around the same time daily.' },
  ]},
  { id: 'prod-1', title: 'Productivity Boost', tagline: 'Stop procrastinating, start doing.', icon: Zap, category: 'Productivity', progress: 0.1, iconBg: 'bg-yellow-100 text-yellow-600', steps: [
      { title: 'The Two-Minute Rule', tip: 'If a task takes less than two minutes, do it now.', completed: true },
      { title: 'Eat The Frog', tip: 'Tackle your most difficult task first thing in the morning.' },
      { title: 'Time Blocking', tip: 'Schedule your day in blocks of time for specific tasks.' },
  ]},
];

const filters = ['All', 'Study Stress', 'Sleep', 'Productivity', 'Wellness'];

// --- COMPONENTS ---

const RoadmapDetailsModal = ({ roadmap, onClose, onStepComplete }: { roadmap: any; onClose: () => void; onStepComplete: (roadmapId: string, stepIndex: number) => void; }) => {
    return (
        <div className="roadmap-modal-overlay">
            <motion.div
                className="roadmap-modal-content custom-scrollbar"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
            >
                <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600"><X size={24} /></button>
                <div className="flex items-center gap-4 mb-4">
                    <div className={`roadmap-card-icon ${roadmap.iconBg}`}>{React.createElement(roadmap.icon, { size: 28 })}</div>
                    <div>
                        <h2 className="text-3xl font-bold">{roadmap.title}</h2>
                        <p className="text-gray-500">{roadmap.tagline}</p>
                    </div>
                </div>

                <div className="flex items-center gap-6 my-6">
                    <div className="flex-grow">
                        <h3 className="font-semibold text-gray-500">Progress</h3>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                            <motion.div className="bg-blue-600 h-2.5 rounded-full" initial={{width: 0}} animate={{width: `${roadmap.progress * 100}%`}} transition={{ duration: 0.5, ease: "easeInOut" }}></motion.div>
                        </div>
                    </div>
                     <div className="text-center">
                        <h3 className="font-semibold text-gray-500">XP Earned</h3>
                        <p className="font-bold text-2xl text-blue-600 flex items-center gap-1"><Gamepad2 size={20} /> {(roadmap.steps.filter((s:any) => s.completed).length * 10)}</p>
                    </div>
                    <div className="text-center">
                        <h3 className="font-semibold text-gray-500">Badges</h3>
                        <p className="font-bold text-2xl text-yellow-500 flex items-center gap-1"><Award size={20} /> {roadmap.progress > 0.5 ? 1 : 0}</p>
                    </div>
                </div>

                <div>
                    {roadmap.steps.map((step: any, index: number) => (
                         <div key={index} className={`roadmap-step ${step.completed ? 'completed' : ''}`}>
                            <div className="roadmap-step-checkpoint">
                                {step.completed ? <Check size={14} /> : index + 1}
                            </div>
                            <div className="roadmap-step-card">
                                <h4 className="font-bold text-lg">{step.title}</h4>
                                <p className="text-gray-500 text-sm my-2">{step.tip}</p>
                                {step.resource && <a href="#" className="text-blue-600 font-semibold text-sm hover:underline">{step.resource.label}</a>}
                                <div className="border-t my-4"></div>
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">How do you feel after this step?</p>
                                        <div className="flex gap-2">
                                            {['😞','😐','🙂','😊','🥳'].map(emoji => (
                                                <button key={emoji} className="text-2xl hover:scale-125 transition-transform">{emoji}</button>
                                            ))}
                                        </div>
                                    </div>
                                    {!step.completed && (
                                        <button 
                                            onClick={() => onStepComplete(roadmap.id, index)}
                                            className="bg-green-500 text-white font-semibold py-2 px-4 rounded-full text-sm hover:bg-green-600 transition-colors"
                                        >
                                            Complete Step
                                        </button>
                                    )}
                                </div>
                            </div>
                         </div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
};


const RoadmapCard = ({ roadmap, onOpen }: { roadmap: any; onOpen: (id: string) => void; }) => {
    return (
        <motion.div
            className={`roadmap-card ${roadmap.urgent ? 'urgent' : ''}`}
            onClick={() => onOpen(roadmap.id)}
            whileHover={{ y: -5 }}
        >
            <div className="flex-grow">
                <div className={`roadmap-card-icon ${roadmap.iconBg}`}>
                    {React.createElement(roadmap.icon, { size: 24 })}
                </div>
                <h3 className="font-bold text-xl mb-1">{roadmap.title}</h3>
                <p className="text-sm text-gray-500">{roadmap.tagline}</p>
            </div>
            <div className="roadmap-card-progress mt-4">
                <div className="progress-bar">
                    <motion.div 
                        className="progress-fill bg-blue-500" 
                        initial={{ width: 0 }}
                        animate={{ width: `${roadmap.progress * 100}%` }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                    />
                </div>
                <p className="progress-text">{Math.round(roadmap.progress * 100)}% Complete</p>
            </div>
            <button className={`w-full mt-4 py-2 px-4 rounded-full font-semibold text-sm transition-colors ${roadmap.progress > 0 ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                {roadmap.progress > 0 ? 'Continue' : 'Start'}
            </button>
        </motion.div>
    );
};

interface RoadmapsViewProps {
    onNavigate: (view: string) => void;
}

export function RoadmapsView({ onNavigate }: RoadmapsViewProps) {
    const [activeFilter, setActiveFilter] = useState('All');
    const [activeRoadmap, setActiveRoadmap] = useState<any | null>(null);
    const [currentRoadmaps, setCurrentRoadmaps] = useState(roadmapData);

    const filteredRoadmaps = activeFilter === 'All'
        ? currentRoadmaps
        : currentRoadmaps.filter(r => r.category === activeFilter);
    
    const urgentRoadmap = filteredRoadmaps.find(r => r.urgent);
    const regularRoadmaps = filteredRoadmaps.filter(r => !r.urgent);

    const handleOpenRoadmap = (id: string) => {
        const roadmap = currentRoadmaps.find(r => r.id === id);
        setActiveRoadmap(roadmap);
    };

    const handleCloseRoadmap = () => {
        setActiveRoadmap(null);
    };
    
    const handleStepComplete = (roadmapId: string, stepIndex: number) => {
        setCurrentRoadmaps(prev => 
            prev.map(r => {
                if (r.id === roadmapId) {
                    const newSteps = [...r.steps];
                    newSteps[stepIndex].completed = true;
                    const completedCount = newSteps.filter(s => s.completed).length;
                    const newProgress = completedCount / newSteps.length;
                    
                    const updatedRoadmap = { ...r, steps: newSteps, progress: newProgress };

                    // Also update the active roadmap if it's the one being changed
                    if (activeRoadmap && activeRoadmap.id === roadmapId) {
                        setActiveRoadmap(updatedRoadmap);
                    }
                    
                    return updatedRoadmap;
                }
                return r;
            })
        );
    }

    return (
        <div className="roadmaps-body">
            <header className="text-center mb-8">
                <h1 className="text-4xl font-bold mb-2">Choose Your Guided Roadmap</h1>
                <p className="text-lg text-gray-500">Find relief, stay consistent, and track your journey.</p>
            </header>

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input type="text" placeholder="Search roadmaps..." className="w-full pl-12 pr-4 py-3 rounded-full bg-white/70 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="roadmap-filter-tabs">
                    {filters.map(filter => (
                        <button key={filter} onClick={() => setActiveFilter(filter)} className={`tab ${activeFilter === filter ? 'active' : ''}`}>
                            {filter}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {urgentRoadmap && <RoadmapCard roadmap={urgentRoadmap} onOpen={handleOpenRoadmap} />}
                {regularRoadmaps.map(roadmap => (
                    <RoadmapCard key={roadmap.id} roadmap={roadmap} onOpen={handleOpenRoadmap} />
                ))}
            </div>

            <div className="flex justify-end mt-8">
                <button
                    onClick={() => onNavigate('Mentors')}
                    className="bg-indigo-600 text-white p-4 rounded-full shadow-lg flex items-center gap-2 hover:bg-indigo-700 transition-colors"
                >
                    <User size={24} />
                    <span className="font-semibold">Mentor</span>
                </button>
            </div>

            <AnimatePresence>
                {activeRoadmap && (
                    <RoadmapDetailsModal roadmap={activeRoadmap} onClose={handleCloseRoadmap} onStepComplete={handleStepComplete} />
                )}
            </AnimatePresence>
        </div>
    );
}

    