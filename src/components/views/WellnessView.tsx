
"use client";

import React, { useState, useEffect, useTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XCircle, Lightbulb, Search, Dumbbell, Soup, Microscope, Loader2, Award, FileDown, Smile, BrainCircuit, HeartPulse } from 'lucide-react';
import { getNutritionInfo, getWellnessData, updateWellnessMetric } from '@/app/actions';
import { getWellnessFact } from '@/ai/flows/wellness-facts';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useAuth } from '@/hooks/use-auth';
import type { WellnessMetric, WellnessGoal } from '@/lib/types';


// --- UTILITY ---
const getGreeting = (hour: number, name: string) => {
  if (hour >= 5 && hour < 12) return `Good Morning, ${name} ☀️`;
  if (hour >= 12 && hour < 18) return `Good Afternoon, ${name} 👋`;
  return `Good Evening, ${name} 🌙`;
};


// --- MODAL COMPONENTS ---

const BmrCalculator = ({ onClose }: { onClose: () => void }) => {
    const [bmr, setBmr] = useState<number | null>(null);
    const [gender, setGender] = useState('male');
    
    const calculateBmr = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const weight = parseFloat(formData.get('weight') as string);
        const height = parseFloat(formData.get('height') as string);
        const age = parseInt(formData.get('age') as string);

        if(weight > 0 && height > 0 && age > 0) {
            let calculatedBmr;
            if (gender === 'male') {
                calculatedBmr = 10 * weight + 6.25 * height - 5 * age + 5;
            } else {
                calculatedBmr = 10 * weight + 6.25 * height - 5 * age - 161;
            }
            setBmr(calculatedBmr);
        }
    };

    return (
        <div className="wellness-modal-overlay">
            <motion.div className="wellness-modal-content" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><XCircle size={24} /></button>
                <h2 className="text-3xl font-bold mb-6 text-center">BMR Calculator</h2>
                <form onSubmit={calculateBmr} className="space-y-4">
                    <div>
                        <label className="block mb-1 font-medium">Gender</label>
                        <select onChange={(e) => setGender(e.target.value)} value={gender} className="w-full p-2 border rounded">
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                    </div>
                    <div>
                        <label className="block mb-1 font-medium">Weight (kg)</label>
                        <input type="number" name="weight" className="w-full p-2 border rounded" required />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium">Height (cm)</label>
                        <input type="number" name="height" className="w-full p-2 border rounded" required />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium">Age</label>
                        <input type="number" name="age" className="w-full p-2 border rounded" required />
                    </div>
                    <button type="submit" className="wellness-btn-primary w-full">Calculate</button>
                </form>
                {bmr && (
                    <div className="mt-6 text-center">
                        <p className="text-lg">Your Basal Metabolic Rate is:</p>
                        <p className="text-3xl font-bold">{Math.round(bmr)} kcal/day</p>
                    </div>
                )}
            </motion.div>
        </div>
    );
};


const WellnessFacts = ({ onClose }: { onClose: () => void }) => {
    const [fact, setFact] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchFact = async () => {
        setLoading(true);
        try {
            const result = await getWellnessFact();
            if (result.fact) {
                setFact(result.fact);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFact();
    }, []);

    return (
        <div className="wellness-modal-overlay">
            <motion.div className="wellness-modal-content" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><XCircle size={24} /></button>
                <h2 className="text-3xl font-bold mb-6 text-center">Wellness Fact</h2>
                <div className="text-center p-4 min-h-[100px] flex items-center justify-center">
                    {loading ? <Loader2 className="animate-spin" /> : <p className="text-xl">{fact}</p>}
                </div>
                <button onClick={fetchFact} className="wellness-btn-secondary w-full mt-4" disabled={loading}>
                    {loading ? 'Loading...' : 'Get Another Fact'}
                </button>
            </motion.div>
        </div>
    );
};

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

const affirmations = ["I am capable and strong.", "I choose to be happy today.", "I am grateful for my journey."];

const DailyAffirmations = ({ onClose }: { onClose: () => void }) => {
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

const MetricCard = ({ title, value, unit, icon, onClick, children }: { title: string, value: any, unit: string, icon: React.ReactNode, onClick?: () => void, children?: React.ReactNode }) => (
    <motion.div className={`bg-white/60 backdrop-blur-lg rounded-2xl p-6 shadow-md border border-white/30 h-full flex flex-col ${onClick ? 'cursor-pointer' : ''}`}
        whileHover={onClick ? { scale: 1.02, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' } : {}}
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
    const { user } = useAuth();
    const [metrics, setMetrics] = useState<WellnessMetric | null>(null);
    const [caloriesHistory, setCaloriesHistory] = useState<any[]>([]);
    const [sleepHistory, setSleepHistory] = useState<any[]>([]);
    const [goals, setGoals] = useState<WellnessGoal[]>([]);
    const [moodLogs, setMoodLogs] = useState<any[]>([]);
    const [isPending, startTransition] = useTransition();

    const [activeModal, setActiveModal] = useState<string | null>(null);
    const [currentTime, setCurrentTime] = useState(new Date());

    const userName = user?.displayName?.split(' ')[0] || 'User';

    const fetchWellnessData = () => {
        if (!user) return;
        startTransition(async () => {
            const data = await getWellnessData(user.uid);
            setMetrics(data.metrics);
            setCaloriesHistory(data.caloriesHistory);
            setSleepHistory(data.sleepHistory);
            setGoals(data.goals);
            setMoodLogs(data.moodLogs);
        });
    }

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        fetchWellnessData();
        return () => clearInterval(timer);
    }, [user]);


    const handleUpdateHydration = () => {
        if (!user || !metrics) return;
        const newHydration = (metrics.hydration || 0) < 8 ? (metrics.hydration || 0) + 1 : 8;
        startTransition(async () => {
            await updateWellnessMetric(user.uid, { hydration: newHydration });
            fetchWellnessData(); // Refetch data to update UI
        });
    };

    const renderModal = () => {
      switch (activeModal) {
        case 'breathing': return <BreathingCoach onClose={() => setActiveModal(null)} />;
        case 'nutrition': return <NutritionDatabase onClose={() => setActiveModal(null)} />;
        case 'affirmations': return <DailyAffirmations onClose={() => setActiveModal(null)} />;
        case 'bmi': return <BmrCalculator onClose={() => setActiveModal(null)} />;
        case 'facts': return <WellnessFacts onClose={() => setActiveModal(null)} />;
        // Placeholder modals for new features
        case 'workout':
        case 'goals':
        case 'stress':
        case 'report':
             return <div className="wellness-modal-overlay"><div className="wellness-modal-content">
                <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4"><XCircle/></button>
                <h2 className="text-2xl font-bold text-center capitalize">{activeModal}</h2><p className="text-center mt-4">This feature is coming soon!</p></div></div>;
        default: return null;
      }
    };
    
    if (isPending && !metrics) {
        return (
            <div className="wellness-body flex items-center justify-center">
                <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
            </div>
        );
    }
    
    if (!user) {
         return (
            <div className="wellness-body flex items-center justify-center text-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-700">Please sign in</h2>
                    <p className="text-gray-500">Sign in to track and view your wellness journey.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="wellness-body">
            <header className="p-8">
                <h1 className="text-4xl font-bold text-gray-800">{getGreeting(currentTime.getHours(), userName)}</h1>
                <p className="text-lg text-gray-500">Here's your wellness summary for today.</p>
            </header>

            <main className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Section - Metrics */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <MetricCard title="Calories Burned" value={metrics?.calories || 0} unit="kcal" icon={<Dumbbell />}>
                        <ResponsiveContainer width="100%" height={80}>
                            <LineChart data={caloriesHistory}>
                                <Line type="monotone" dataKey="kcal" stroke="#f97316" strokeWidth={2} dot={false} />
                                <Tooltip wrapperStyle={{ outline: 'none' }} contentStyle={{ backgroundColor: 'rgba(255,255,255,0.8)', border: '1px solid #ddd', borderRadius: '8px' }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </MetricCard>
                    <MetricCard title="Sleep" value={metrics?.sleep || 0} unit="hrs" icon={<HeartPulse />}>
                         <ResponsiveContainer width="100%" height={80}>
                            <LineChart data={sleepHistory}>
                                <Line type="monotone" dataKey="hrs" stroke="#8b5cf6" strokeWidth={2} dot={false} />
                                <Tooltip wrapperStyle={{ outline: 'none' }} contentStyle={{ backgroundColor: 'rgba(255,255,255,0.8)', border: '1px solid #ddd', borderRadius: '8px' }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </MetricCard>
                    <MetricCard title="Hydration" value={metrics?.hydration || 0} unit="cups" icon={<Soup />} onClick={handleUpdateHydration}>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <motion.div className="bg-blue-500 h-2.5 rounded-full" animate={{ width: `${((metrics?.hydration || 0) / 8) * 100}%` }} />
                        </div>
                    </MetricCard>
                    <MetricCard title="Heart Rate" value={metrics?.heartRate || 0} unit="bpm" icon={<HeartPulse />} />
                    <MetricCard title="Steps" value={(metrics?.steps || 0).toLocaleString()} unit="" icon={<Dumbbell />} />
                    <MetricCard title="Mood" value={metrics?.mood || 'Neutral'} unit="" icon={<Smile />}>
                        <ResponsiveContainer width="100%" height={80}>
                            <BarChart data={moodLogs}>
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
