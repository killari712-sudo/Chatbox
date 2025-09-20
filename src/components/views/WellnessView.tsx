
"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XCircle, ChevronLeft, ChevronRight, Lightbulb, Search, Save, Moon, Sun, Activity, Droplet, MoonStar, HeartPulse, Dumbbell, Soup, Microscope, Calendar, Loader2, Award, FileDown, Smile, BrainCircuit } from 'lucide-react';
import { getNutritionInfo } from '@/app/actions';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';


// --- UTILITY ---
const getGreeting = (hour: number, name: string) => {
  if (hour >= 5 && hour < 12) return `Good Morning, ${name} ☀️`;
  if (hour >= 12 && hour < 18) return `Good Afternoon, ${name} 👋`;
  return `Good Evening, ${name} 🌙`;
};

// --- MOCK DATA ---
const initialUserData = {
  name: 'Alex',
  metrics: {
    calories: 450,
    caloriesHistory: [{day: 'Mon', kcal: 300}, {day: 'Tue', kcal: 420}, {day: 'Wed', kcal: 350}, {day: 'Thu', kcal: 500}, {day: 'Fri', kcal: 450}, {day: 'Sat', kcal: 600}, {day: 'Sun', kcal: 450}],
    sleep: 7.5,
    sleepHistory: [{day: 'Mon', hrs: 6}, {day: 'Tue', hrs: 8}, {day: 'Wed', hrs: 7}, {day: 'Thu', hrs: 7.5}, {day: 'Fri', hrs: 6.5}, {day: 'Sat', hrs: 9}, {day: 'Sun', hrs: 7.5}],
    hydration: 4,
    heartRate: 72,
    steps: 8500,
  },
  goals: [{ goal: 'Drink 8 cups of water', progress: 0.5 }, { goal: 'Walk 10,000 steps', progress: 0.85 }],
  moodLogs: [{ name: 'Happy', count: 4 }, { name: 'Calm', count: 2 }, { name: 'Stressed', count: 1 }],
  affirmations: ["I am capable and strong.", "I choose to be happy today.", "I am grateful for my journey."]
};


// --- MODAL COMPONENTS ---

const BreathingCoach = ({ onClose }: { onClose: () => void }) => {
    const [breathingState, setBreathingState] = useState('inhale');
    const [timer, setTimer] = useState(0);
    const [isBreathing, setIsBreathing] = useState(false);

    const startBreathing = (duration: number) => {
      setIsBreathing(true);
      setTimer(duration);
      setBreathingState('inhale');
    };
  
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isBreathing && timer > 0) {
            interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
        } else if (timer <= 0 && isBreathing) {
            setIsBreathing(false);
            setBreathingState('done');
        }
        return () => clearInterval(interval);
    }, [isBreathing, timer]);

    useEffect(() => {
        let breathingInterval: NodeJS.Timeout;
        if (isBreathing) {
            const cycle = () => setBreathingState(prev => prev === 'inhale' ? 'exhale' : 'inhale');
            cycle(); // start immediately
            breathingInterval = setInterval(cycle, 4000);
        }
        return () => clearInterval(breathingInterval);
    }, [isBreathing]);

    const variants = {
      initial: { scale: 0.8, opacity: 0.7 },
      inhale: { scale: 1.2, opacity: 1, transition: { duration: 4, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" } },
      exhale: { scale: 0.8, opacity: 0.7, transition: { duration: 4, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" } },
      done: { scale: 1, opacity: 1 },
    };

    return (
      <div className="wellness-modal-overlay">
        <motion.div className="wellness-modal-content" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><XCircle size={24} /></button>
          <h2 className="text-3xl font-bold mb-6 text-center">Breathing Coach</h2>
          <div className="flex flex-col items-center justify-center my-8 h-48">
            <motion.div className="w-48 h-48 rounded-full bg-blue-400/50" variants={variants} animate={isBreathing ? 'inhale' : 'done'} />
            <p className="mt-4 text-xl capitalize font-semibold">{isBreathing ? (<span className="animate-pulse">{breathingState}...</span>) : ('Ready to relax?')}</p>
            {isBreathing && <p className="text-slate-500">Time remaining: {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}</p>}
          </div>
          <div className="flex justify-center space-x-4 mb-4">
            <button className="wellness-btn-primary" onClick={() => startBreathing(60)}>1 min</button>
            <button className="wellness-btn-primary" onClick={() => startBreathing(300)}>5 min</button>
            <button className="wellness-btn-secondary" onClick={() => setIsBreathing(false)}>Stop</button>
          </div>
        </motion.div>
      </div>
    );
};

const NutritionDatabase = ({ onClose }: { onClose: () => void }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!searchQuery.trim()) return;
      setLoading(true);
      setError(null);
      setSearchResults([]);
      try {
        const result = await getNutritionInfo(searchQuery);
        if (result.error) throw new Error(result.error);
        setSearchResults(result.nutritionData || []);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch data.');
      } finally {
        setLoading(false);
      }
    };
    
    return (
      <div className="wellness-modal-overlay">
        <motion.div className="wellness-modal-content flex flex-col" initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }}>
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><XCircle size={24} /></button>
          <h2 className="text-3xl font-bold mb-4">Nutrition Database</h2>
          <form onSubmit={handleSearch} className="flex gap-2 mb-4">
            <input type="text" className="flex-grow p-2 rounded-full border border-gray-300" placeholder="e.g., 'apple', 'chicken breast'" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            <button type="submit" className="wellness-btn-primary" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" /> : <Search />}
            </button>
          </form>
          <div className="flex-grow overflow-y-auto custom-scrollbar pr-2">
            {error && <p className="text-red-500 text-center">{error}</p>}
            {searchResults.map((item, index) => (
              <div key={index} className="bg-white rounded-lg p-4 mb-4 flex items-center gap-4">
                <img src={item.image} alt={item.label} className="w-20 h-20 object-cover rounded-md" />
                <div className="flex-grow">
                  <h3 className="font-bold text-lg">{item.label}</h3>
                  <p className="text-sm text-gray-600">Protein: {item.macros.protein}g, Carbs: {item.macros.carbs}g, Fat: {item.macros.fat}g</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    );
};

const DailyAffirmations = ({ affirmations, onClose }: { affirmations: string[]; onClose: () => void }) => {
    return (
        <div className="wellness-modal-overlay">
            <motion.div className="wellness-modal-content" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><XCircle size={24} /></button>
                <h2 className="text-3xl font-bold mb-6 text-center">Daily Affirmations</h2>
                <div className="space-y-4">
                    {affirmations.map((affirmation, index) => (
                        <motion.div key={index} className="bg-gradient-to-r from-blue-100 to-purple-100 p-4 rounded-lg text-lg text-center font-semibold text-gray-700"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}>
                            {affirmation}
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
};

// --- MAIN VIEW ---

const MetricCard = ({ title, value, unit, icon, onClick, children }: { title: string, value: any, unit: string, icon: React.ReactNode, onClick: () => void, children?: React.ReactNode }) => (
    <motion.div className="bg-white/60 backdrop-blur-lg rounded-2xl p-6 shadow-md border border-white/30 cursor-pointer h-full flex flex-col"
        whileHover={{ scale: 1.02, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
        onClick={onClick}>
        <div className="flex items-center gap-2 text-gray-600">
            {icon}
            <h3 className="font-semibold text-lg">{title}</h3>
        </div>
        <div className="flex-grow flex flex-col justify-center items-center text-center my-4">
            <AnimatePresence mode="wait">
                <motion.p key={value} className="text-5xl font-bold text-gray-800"
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    {value}<span className="text-2xl font-medium text-gray-500 ml-1">{unit}</span>
                </motion.p>
            </AnimatePresence>
            {children && <div className="w-full mt-auto">{children}</div>}
        </div>
    </motion.div>
);

const ToolCard = ({ title, icon, onClick }: { title: string, icon: React.ReactNode, onClick: () => void }) => (
    <motion.div className="bg-white/60 backdrop-blur-lg rounded-2xl p-6 shadow-md border border-white/30 cursor-pointer flex flex-col items-center justify-center text-center"
        whileHover={{ scale: 1.05, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
        onClick={onClick}>
        <div className="text-blue-500 mb-3">{icon}</div>
        <h3 className="font-semibold text-lg text-gray-700">{title}</h3>
    </motion.div>
);


export function WellnessView() {
    const [userData, setUserData] = useState(initialUserData);
    const [activeModal, setActiveModal] = useState<string | null>(null);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        
        // Simulate real-time updates
        const metricInterval = setInterval(() => {
            setUserData(prev => ({
                ...prev,
                metrics: {
                    ...prev.metrics,
                    calories: prev.metrics.calories + Math.floor(Math.random() * 5),
                    heartRate: 65 + Math.floor(Math.random() * 10),
                    steps: prev.metrics.steps + Math.floor(Math.random() * 100),
                }
            }))
        }, 5000);

        return () => {
            clearInterval(timer);
            clearInterval(metricInterval);
        };
    }, []);

    const handleUpdateHydration = () => {
        setUserData(prev => ({
            ...prev,
            metrics: {
                ...prev.metrics,
                hydration: prev.metrics.hydration < 8 ? prev.metrics.hydration + 1 : 8,
            }
        }));
    };

    const renderModal = () => {
      switch (activeModal) {
        case 'breathing': return <BreathingCoach onClose={() => setActiveModal(null)} />;
        case 'nutrition': return <NutritionDatabase onClose={() => setActiveModal(null)} />;
        case 'affirmations': return <DailyAffirmations affirmations={userData.affirmations} onClose={() => setActiveModal(null)} />;
        // Placeholder modals for new features
        case 'workout':
        case 'bmi':
        case 'facts':
        case 'goals':
        case 'stress':
        case 'report':
             return <div className="wellness-modal-overlay"><div className="wellness-modal-content">
                <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4"><XCircle/></button>
                <h2 className="text-2xl font-bold text-center capitalize">{activeModal}</h2><p className="text-center mt-4">This feature is coming soon!</p></div></div>;
        default: return null;
      }
    };

    return (
        <div className="wellness-body">
            <header className="p-8">
                <h1 className="text-4xl font-bold text-gray-800">{getGreeting(currentTime.getHours(), userData.name)}</h1>
                <p className="text-lg text-gray-500">Here's your wellness summary for today.</p>
            </header>

            <main className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Section - Metrics */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <MetricCard title="Calories Burned" value={userData.metrics.calories} unit="kcal" icon={<Activity />} onClick={() => {}}>
                        <ResponsiveContainer width="100%" height={80}>
                            <LineChart data={userData.metrics.caloriesHistory}>
                                <Line type="monotone" dataKey="kcal" stroke="#f97316" strokeWidth={2} dot={false} />
                                <Tooltip wrapperStyle={{ outline: 'none' }} contentStyle={{ backgroundColor: 'rgba(255,255,255,0.8)', border: '1px solid #ddd', borderRadius: '8px' }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </MetricCard>
                    <MetricCard title="Sleep" value={userData.metrics.sleep} unit="hrs" icon={<Moon />} onClick={() => {}}>
                         <ResponsiveContainer width="100%" height={80}>
                            <LineChart data={userData.metrics.sleepHistory}>
                                <Line type="monotone" dataKey="hrs" stroke="#8b5cf6" strokeWidth={2} dot={false} />
                                <Tooltip wrapperStyle={{ outline: 'none' }} contentStyle={{ backgroundColor: 'rgba(255,255,255,0.8)', border: '1px solid #ddd', borderRadius: '8px' }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </MetricCard>
                    <MetricCard title="Hydration" value={userData.metrics.hydration} unit="cups" icon={<Droplet />} onClick={handleUpdateHydration}>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <motion.div className="bg-blue-500 h-2.5 rounded-full" animate={{ width: `${(userData.metrics.hydration / 8) * 100}%` }} />
                        </div>
                    </MetricCard>
                    <MetricCard title="Heart Rate" value={userData.metrics.heartRate} unit="bpm" icon={<HeartPulse />} onClick={() => {}} />
                    <MetricCard title="Steps" value={userData.metrics.steps.toLocaleString()} unit="" icon={<Dumbbell />} onClick={() => {}} />
                    <MetricCard title="Mood" value={userData.moodLogs[0].name} unit="" icon={<Smile />} onClick={() => {}}>
                        <ResponsiveContainer width="100%" height={80}>
                            <BarChart data={userData.moodLogs}>
                                <Bar dataKey="count" fill="#3b82f6" />
                                <XAxis dataKey="name" tick={{fontSize: 10}}/>
                                <Tooltip wrapperStyle={{ outline: 'none' }} contentStyle={{ backgroundColor: 'rgba(255,255,255,0.8)', border: '1px solid #ddd', borderRadius: '8px' }} />
                            </BarChart>
                        </ResponsiveContainer>
                    </MetricCard>
                </section>

                {/* Right Section - Tools */}
                <section className="grid grid-cols-2 md:grid-cols-3 gap-8">
                    <ToolCard title="Breathing Coach" icon={<HeartPulse size={40} />} onClick={() => setActiveModal('breathing')} />
                    <ToolCard title="Workout Planner" icon={<Dumbbell size={40} />} onClick={() => setActiveModal('workout')} />
                    <ToolCard title="BMR Calculator" icon={<Microscope size={40} />} onClick={() => setActiveModal('bmi')} />
                    <ToolCard title="Nutrition" icon={<Soup size={40} />} onClick={() => setActiveModal('nutrition')} />
                    <ToolCard title="Wellness Facts" icon={<Lightbulb size={40} />} onClick={() => setActiveModal('facts')} />
                    <ToolCard title="Micro Goals" icon={<Award size={40} />} onClick={() => setActiveModal('goals')} />
                    <ToolCard title="Affirmations" icon={<Smile size={40} />} onClick={() => setActiveModal('affirmations')} />
                    <ToolCard title="Stress Checker" icon={<BrainCircuit size={40} />} onClick={() => setActiveModal('stress')} />
                    <ToolCard title="Progress Report" icon={<FileDown size={40} />} onClick={() => setActiveModal('report')} />
                </section>
            </main>
            
            <AnimatePresence>{renderModal()}</AnimatePresence>
        </div>
    );
};
