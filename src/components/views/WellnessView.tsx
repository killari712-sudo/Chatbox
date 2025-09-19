
"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XCircle, ChevronLeft, ChevronRight, Lightbulb, Search, Save, Moon, Sun, Activity, Droplet, MoonStar, HeartPulse, Dumbbell, Soup, Microscope, Calendar, Loader2 } from 'lucide-react';
import { getNutritionInfo } from '@/app/actions';

// Utility functions
const getBackgroundGradient = (hour: number) => {
  if (hour >= 5 && hour < 12) return 'bg-gradient-to-br from-yellow-200 to-yellow-500';
  if (hour >= 12 && hour < 18) return 'bg-gradient-to-br from-blue-400 to-blue-600';
  return 'bg-gradient-to-br from-purple-900 to-indigo-900';
};
const getGreeting = (hour: number, name: string) => {
  if (hour >= 5 && hour < 12) return `Good Morning, ${name} ☀️`;
  if (hour >= 12 && hour < 18) return `Good Afternoon, ${name} 👋`;
  return `Good Evening, ${name} 🌙`;
};

// All Modal Components
const BreathingCoach = ({ onClose }: { onClose: () => void }) => {
    const [breathingState, setBreathingState] = useState('inhale');
    const [timer, setTimer] = useState(0);
    const [breathingDuration, setBreathingDuration] = useState(0);
    const [isBreathing, setIsBreathing] = useState(false);

    const startBreathing = (duration: number) => {
      setBreathingDuration(duration);
      setIsBreathing(true);
      setTimer(duration);
      setBreathingState('inhale');
    };
  
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isBreathing && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        } else if (timer <= 0 && isBreathing) {
            setIsBreathing(false);
            setBreathingState('done');
        }
        return () => clearInterval(interval);
    }, [isBreathing, timer]);

    useEffect(() => {
        let breathingInterval: NodeJS.Timeout;
        if (isBreathing) {
            breathingInterval = setInterval(() => {
                setBreathingState(prev => prev === 'inhale' ? 'exhale' : 'inhale');
            }, 4000);
        }
        return () => clearInterval(breathingInterval);
    }, [isBreathing]);

    const variants = {
      initial: { scale: 0.8 },
      inhale: { scale: 1.2, transition: { duration: 4, ease: "easeInOut" } },
      exhale: { scale: 0.8, transition: { duration: 4, ease: "easeInOut" } },
      done: { scale: 0.8 },
    };

    const aiSuggestion = "You seem stressed. Want to start a 5-min breathing session?";
    return (
      <div className="modal-overlay wellness-modal-overlay">
        <motion.div 
            className="modal-content wellness-modal-content bg-gradient-to-br from-gray-900/80 to-blue-900/70 backdrop-blur-md text-white"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
        >
          <h2 className="text-3xl font-bold mb-6 text-center">Breathing Coach</h2>
          <p className="text-center text-white/70 mb-4">{aiSuggestion}</p>
          <div className="flex flex-col items-center justify-center my-8">
            <motion.div 
                className="w-48 h-48 rounded-full bg-blue-400/50" 
                variants={variants} 
                initial="initial" 
                animate={isBreathing ? breathingState : 'done'}
            />
            <p className="mt-4 text-xl text-white capitalize">{isBreathing ? (<span className="animate-pulse">{breathingState}</span>) : ('Ready?')}</p>
            <p className="text-white/70">{timer > 0 && `Time remaining: ${timer}s`}</p>
          </div>
          <div className="flex justify-center space-x-4 mb-4">
            <button className="btn-primary" onClick={() => startBreathing(60)}>1 min</button>
            <button className="btn-primary" onClick={() => startBreathing(300)}>5 min</button>
            <button className="btn-primary" onClick={() => startBreathing(600)}>10 min</button>
          </div>
          <button className="btn-secondary w-full" onClick={onClose}>Close</button>
        </motion.div>
      </div>
    );
};

const WorkoutPlanner = ({ onClose }: { onClose: () => void }) => {
    const workoutPlan = { Monday: 'Yoga', Tuesday: 'Strength Training', Wednesday: 'Rest', Thursday: 'Cardio', Friday: 'HIIT', Saturday: 'Active Rest (Walk)', Sunday: 'Long Run' };
    const handleDragStart = (e: React.DragEvent<HTMLParagraphElement>, session: string) => e.dataTransfer.setData('session', session);
    const handleDrop = (e: React.DragEvent<HTMLDivElement>, day: string) => { const session = e.dataTransfer.getData('session'); console.log(`Dropped ${session} on ${day}`); };
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();
    return (
      <div className="modal-overlay wellness-modal-overlay">
        <motion.div 
            className="modal-content wellness-modal-content bg-gradient-to-br from-gray-900/80 to-indigo-900/70 backdrop-blur-md text-white"
            initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }}
        >
          <h2 className="text-3xl font-bold mb-6 text-center">Workout Planner</h2>
          <div className="grid grid-cols-2 md:grid-cols-7 gap-2 text-center">
            {Object.entries(workoutPlan).map(([day, session]) => (
              <div key={day} className="bg-white/10 p-4 rounded-lg" onDrop={(e) => handleDrop(e, day)} onDragOver={handleDragOver}>
                <h4 className="font-semibold text-sm md:text-base">{day}</h4>
                <p className="text-xs md:text-sm mt-2 cursor-grab" draggable onDragStart={(e) => handleDragStart(e, session)}>{session}</p>
              </div>
            ))}
          </div>
          <button className="btn-secondary mt-6 w-full" onClick={onClose}>Close</button>
        </motion.div>
      </div>
    );
};

const BMICalculator = ({ onClose }: { onClose: () => void }) => {
    const [age, setAge] = useState(30);
    const [height, setHeight] = useState(175);
    const [weight, setWeight] = useState(70);
    const [gender, setGender] = useState('male');
    const [activity, setActivity] = useState(1.2);
    const [bmr, setBmr] = useState(0);

    useEffect(() => {
      let calculatedBmr;
      if (gender === 'male') {
        calculatedBmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
      } else {
        calculatedBmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
      }
      setBmr(Math.round(calculatedBmr * activity));
    }, [age, height, weight, gender, activity]);

    return (
      <div className="modal-overlay wellness-modal-overlay">
        <motion.div 
            className="modal-content wellness-modal-content bg-gradient-to-br from-gray-900/80 to-purple-900/70 backdrop-blur-md text-white"
            initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }}
        >
          <h2 className="text-3xl font-bold mb-6 text-center">BMR & Body Fat Calculator</h2>
          <div className="space-y-4">
            <div><label className="block">Age: {age}</label><input type="range" min="10" max="80" value={age} onChange={(e) => setAge(Number(e.target.value))} className="w-full wellness-range" /></div>
            <div><label className="block">Height: {height} cm</label><input type="range" min="100" max="220" value={height} onChange={(e) => setHeight(Number(e.target.value))} className="w-full wellness-range" /></div>
            <div><label className="block">Weight: {weight} kg</label><input type="range" min="30" max="150" value={weight} onChange={(e) => setWeight(Number(e.target.value))} className="w-full wellness-range" /></div>
            <div className="flex space-x-4"><label><input type="radio" value="male" checked={gender === 'male'} onChange={(e) => setGender(e.target.value)} /> Male</label><label><input type="radio" value="female" checked={gender === 'female'} onChange={(e) => setGender(e.target.value)} /> Female</label></div>
            <div><label className="block">Activity Level</label>
              <select value={activity} onChange={(e) => setActivity(parseFloat(e.target.value))} className="w-full bg-white/10 p-2 rounded-md mt-2 border border-white/20">
                <option value="1.2">Sedentary</option><option value="1.375">Lightly Active</option><option value="1.55">Moderately Active</option><option value="1.725">Very Active</option><option value="1.9">Extra Active</option>
              </select>
            </div>
          </div>
          <div className="mt-8 text-center"><h3 className="text-4xl font-extrabold">BMR: {bmr} kcal/day</h3></div>
          <button className="btn-secondary mt-6 w-full" onClick={onClose}>Close</button>
        </motion.div>
      </div>
    );
};

const NutritionDatabase = ({ onClose }: { onClose: () => void }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [savedMeals, setSavedMeals] = useState<any[]>(() => {
      if (typeof window === 'undefined') return [];
      const saved = localStorage.getItem('myMeals');
      return saved ? JSON.parse(saved) : [];
    });

    const handleSearch = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!searchQuery.trim()) return;
      setLoading(true);
      setError(null);
      setSearchResults([]);
      try {
        const result = await getNutritionInfo(searchQuery);
        if (result.error) {
            throw new Error(result.error);
        }
        if (result.nutritionData && result.nutritionData.length > 0) {
            setSearchResults(result.nutritionData);
        } else {
            setError('No nutrition data found. Try a different search term.');
        }
      } catch (err: any) {
        console.error('Failed to fetch nutrition data:', err);
        setError(err.message || 'Failed to fetch nutrition data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    const handleSaveMeal = (meal: any) => {
      const isAlreadySaved = savedMeals.some(saved => saved.label === meal.label);
      if (!isAlreadySaved) {
        const newSavedMeals = [...savedMeals, meal];
        setSavedMeals(newSavedMeals);
        localStorage.setItem('myMeals', JSON.stringify(newSavedMeals));
        alert(`${meal.label} saved to 'My Meals'!`);
      } else {
        alert(`${meal.label} is already in 'My Meals'.`);
      }
    };

    return (
      <div className="modal-overlay wellness-modal-overlay">
        <motion.div
          className="modal-content wellness-modal-content relative flex flex-col p-6 rounded-2xl shadow-2xl bg-gradient-to-br from-gray-900/90 to-blue-900/80 backdrop-blur-md"
          initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }} transition={{ duration: 0.3 }}
          style={{ width: '95%', maxWidth: '800px', height: '90vh' }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-3xl font-bold text-white">Nutrition Database</h2>
            <motion.button className="text-white hover:text-red-400 transition-colors" onClick={onClose} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}><XCircle size={32} /></motion.button>
          </div>
          <p className="text-white/70 mb-6 text-lg">Search for foods to see their nutritional information.</p>
          <form onSubmit={handleSearch} className="flex gap-4 mb-8">
            <input type="text" className="flex-grow p-3 rounded-full bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-blue-400 text-lg" placeholder="e.g., 'high protein snacks', 'apple'" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            <motion.button type="submit" className="p-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white transition-colors flex items-center justify-center" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} disabled={loading}>
              {loading ? <Loader2 className="animate-spin" size={28} /> : <Search size={28} />}
            </motion.button>
          </form>
          <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar">
            {error && <p className="text-red-400 text-center text-lg">{error}</p>}
            <AnimatePresence>
              {searchResults.map((meal, index) => (
                <motion.div key={index} className="bg-white/10 backdrop-blur-lg rounded-xl p-5 mb-4 flex flex-col md:flex-row items-center gap-6 shadow-xl border border-white/20" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                  <img src={meal.image} alt={meal.label} className="w-24 h-24 object-cover rounded-lg flex-shrink-0 shadow-md" />
                  <div className="flex-grow text-white text-center md:text-left">
                    <h3 className="text-2xl font-bold mb-2">{meal.label}</h3>
                    <p className="text-lg text-white/90 mb-3"><span className="font-semibold">Macros:</span> {meal.macros.protein}g Protein, {meal.macros.carbs}g Carbs, {meal.macros.fat}g Fat</p>
                    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                      {meal.tags.map((tag: string, i: number) => (<span key={i} className="bg-purple-600/50 text-white text-xs font-semibold px-2.5 py-0.5 rounded-full">{tag}</span>))}
                    </div>
                  </div>
                  <motion.button className="btn-primary w-full md:w-auto flex items-center justify-center gap-2" onClick={() => handleSaveMeal(meal)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}><Save size={20} /> Save to My Meals</motion.button>
                </motion.div>
              ))}
            </AnimatePresence>
            {searchResults.length === 0 && !loading && !error && (<p className="text-white/50 text-center text-lg mt-8">Start by searching for a food item (e.g., "apple", "chicken breast").</p>)}
          </div>
        </motion.div>
      </div>
    );
};

const WellnessFactsCarousel = ({ onClose, userData }: { onClose: () => void, userData: any }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const facts = [
      { id: 1, title: 'The Power of Sleep', description: 'A good night\'s sleep is crucial for immune function, mood regulation, and cognitive performance.', image: 'https://images.unsplash.com/photo-1549429158-b0a7a0a0b8b0?w=600&h=400&fit=crop' },
      { id: 2, title: 'Hydration is Key', description: 'Staying hydrated boosts energy levels, aids digestion, and helps maintain healthy skin.', image: 'https://images.unsplash.com/photo-1523675005081-3f48a1d7f4f6?w=600&h=400&fit=crop' },
      { id: 3, title: 'Mindful Movement', description: 'Regular physical activity, even gentle yoga or walking, significantly reduces stress.', image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa933?w=600&h=400&fit=crop' },
    ];
    const personalizedTip = userData?.sleepHours < 7 ? "You had low sleep. Try Sleep Prep breathing tonight." : "Great job maintaining your wellness habits! Remember to keep listening to your body.";
    
    useEffect(() => { const autoRotate = setInterval(() => setCurrentIndex((prevIndex) => (prevIndex + 1) % facts.length), 8000); return () => clearInterval(autoRotate); }, [facts.length]);

    const handlePrev = () => setCurrentIndex((prevIndex) => (prevIndex - 1 + facts.length) % facts.length);
    const handleNext = () => setCurrentIndex((prevIndex) => (prevIndex + 1) % facts.length);
    const currentFact = facts[currentIndex];

    return (
      <div className="modal-overlay wellness-modal-overlay">
        <motion.div className="modal-content wellness-modal-content relative flex flex-col p-6 rounded-2xl shadow-2xl bg-gradient-to-br from-gray-900/90 to-blue-900/80 backdrop-blur-md" initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }} transition={{ duration: 0.3 }} style={{ width: '90%', maxWidth: '768px', height: 'auto', minHeight: '450px' }}>
          <div className="flex justify-between items-center mb-4"><h2 className="text-3xl font-bold text-white">Daily Wellness Facts</h2><motion.button className="text-white hover:text-red-400" onClick={onClose} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}><XCircle size={32} /></motion.button></div>
          <p className="text-white/70 mb-6 text-lg">Swipe through for tips to enhance your well-being.</p>
          <div className="relative flex-grow flex items-center justify-center overflow-hidden rounded-xl shadow-lg mb-8" style={{ minHeight: '250px' }}>
            <AnimatePresence initial={false} custom={currentIndex}>
              <motion.div key={currentIndex} className="absolute inset-0 flex items-center justify-center bg-cover bg-center rounded-xl" style={{ backgroundImage: `url(${currentFact.image})` }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
                <div className="absolute inset-0 bg-black/50 rounded-xl flex flex-col justify-center items-center text-center p-8">
                  <h3 className="text-4xl font-extrabold text-white mb-3 tracking-wide">{currentFact.title}</h3>
                  <p className="text-lg text-white/90 leading-relaxed max-w-xl">{currentFact.description}</p>
                </div>
              </motion.div>
            </AnimatePresence>
            <motion.button className="absolute left-4 p-3 bg-white/20 hover:bg-white/40 rounded-full text-white z-10" onClick={handlePrev} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}><ChevronLeft size={28} /></motion.button>
            <motion.button className="absolute right-4 p-3 bg-white/20 hover:bg-white/40 rounded-full text-white z-10" onClick={handleNext} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}><ChevronRight size={28} /></motion.button>
          </div>
          <motion.div className="bg-purple-800/40 border border-purple-600 rounded-xl p-6 text-white text-lg flex items-start space-x-4 shadow-inner" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.3 }}>
            <Lightbulb size={28} className="flex-shrink-0 mt-1 text-yellow-300" />
            <div><h4 className="font-semibold text-xl mb-2 text-yellow-200">Your Personalized Tip</h4><p className="leading-relaxed">{personalizedTip}</p></div>
          </motion.div>
        </motion.div>
      </div>
    );
};

const MicroGoalsWidget = ({ onClose, userData }: { onClose: () => void, userData: any }) => {
    const { goals } = userData;
    return (
      <div className="modal-overlay wellness-modal-overlay">
        <motion.div 
            className="modal-content wellness-modal-content bg-gradient-to-br from-gray-900/80 to-green-900/70 backdrop-blur-md text-white"
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
        >
          <h2 className="text-3xl font-bold mb-6 text-center">Your Micro Goals</h2>
          {goals.map((goal: any, index: number) => (
            <div key={index} className="bg-white/10 p-6 rounded-lg mb-4">
              <h3 className="text-xl font-semibold mb-2">{goal.goal}</h3>
              <div className="w-full bg-white/20 h-2 rounded-full mt-4"><motion.div className="h-full rounded-full bg-green-400" initial={{ width: 0 }} animate={{ width: `${goal.progress * 100}%` }} transition={{ duration: 0.8 }} /></div>
              <p className="text-sm mt-2 text-white/70">{Math.round(goal.progress * 100)}% Complete</p>
            </div>
          ))}
          <button className="btn-secondary mt-6 w-full" onClick={onClose}>Close</button>
        </motion.div>
      </div>
    );
};

const MoodMiniGraph = ({ data }: { data: any[] }) => {
    return (
      <div className="relative w-full h-48 bg-white/10 backdrop-blur-lg rounded-3xl p-6 shadow-xl overflow-hidden text-white" style={{ border: `1px solid #ff5e62` }}>
        <h3 className="text-xl font-semibold mb-2">Mood Trend</h3>
        <div className="flex justify-between items-end h-24 mt-4">
          {data.map((log, index) => (
            <motion.div key={index} className="w-8 flex flex-col items-center" initial={{ height: 0, opacity: 0 }} animate={{ height: `${log.value * 10}%`, opacity: 1 }} transition={{ duration: 0.5, delay: index * 0.1 }}>
              <div className="flex-grow bg-blue-400/50 rounded-full w-4" />
            </motion.div>
          ))}
        </div>
      </div>
    );
};

const Dashboard = ({ userData, handleUpdateUserData }: { userData: any, handleUpdateUserData: (key: string, value: any) => void }) => {
    const { caloriesBurned, sleepHours, hydrationCount, moodLogs } = userData;
    const handleLogWater = () => handleUpdateUserData('hydrationCount', hydrationCount + 1);

    const StatCard = ({ title, value, unit, icon, color, animate }: { title: string, value: number, unit: string, icon: React.ReactNode, color: string, animate: boolean }) => (
      <motion.div className="relative w-full h-48 bg-white/10 backdrop-blur-lg rounded-3xl p-6 shadow-xl overflow-hidden cursor-pointer" style={{ border: `1px solid ${color}` }} initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} whileHover={{ scale: 1.05 }}>
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/0 opacity-0 transition-opacity duration-300 hover:opacity-100" />
        <motion.div className="absolute inset-0 z-0" style={{ backgroundColor: color, opacity: 0.1 }} />
        <div className="relative z-10 flex flex-col h-full justify-between text-white">
          <div className="flex items-center space-x-2">{icon}<h3 className="text-xl font-semibold">{title}</h3></div>
          <AnimatePresence mode="wait">
            <motion.div key={value} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="text-6xl font-extrabold">
              {value}<span className="text-2xl ml-2">{unit}</span>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    );

    return (
      <div className="grid grid-cols-1 gap-8 w-full max-w-lg">
        <StatCard title="Calories Burned" value={caloriesBurned} unit="kcal" icon={<Activity size={32} color="#ff7e5f" />} color="#ff7e5f" animate />
        <StatCard title="Sleep Hours" value={sleepHours} unit="hrs" icon={<MoonStar size={32} color="#7f00ff" />} color="#7f00ff" animate />
        <div className="relative w-full h-48 bg-white/10 backdrop-blur-lg rounded-3xl p-6 shadow-xl cursor-pointer" style={{ border: `1px solid #00c6ff` }} onClick={handleLogWater}>
          <div className="relative z-10 flex flex-col h-full justify-between text-white">
            <div className="flex items-center space-x-2"><Droplet size={32} color="#00c6ff" /><h3 className="text-xl font-semibold">Hydration</h3></div>
            <div className="text-6xl font-extrabold">{hydrationCount}<span className="text-2xl ml-2">cups</span></div>
            <div className="w-full bg-white/20 h-2 rounded-full mt-4"><motion.div className="h-full rounded-full bg-blue-400" initial={{ width: 0 }} animate={{ width: `${(hydrationCount / 8) * 100}%` }} transition={{ duration: 0.5 }} /></div>
          </div>
        </div>
        <MoodMiniGraph data={moodLogs} />
      </div>
    );
};

const FeatureGrid = ({ userData }: { userData: any }) => {
    const [activeModal, setActiveModal] = useState<string | null>(null);
    const renderModal = () => {
      switch (activeModal) {
        case 'breathing': return <BreathingCoach onClose={() => setActiveModal(null)} />;
        case 'workout': return <WorkoutPlanner onClose={() => setActiveModal(null)} />;
        case 'bmi': return <BMICalculator onClose={() => setActiveModal(null)} />;
        case 'nutrition': return <NutritionDatabase onClose={() => setActiveModal(null)} />;
        case 'facts': return <WellnessFactsCarousel onClose={() => setActiveModal(null)} userData={userData} />;
        case 'goals': return <MicroGoalsWidget onClose={() => setActiveModal(null)} userData={userData} />;
        default: return null;
      }
    };
    const FeatureCard = ({ title, icon, onClick }: { title: string, icon: React.ReactNode, onClick: () => void }) => (
      <motion.div className="relative w-full h-48 bg-white/10 backdrop-blur-lg rounded-3xl p-6 shadow-xl cursor-pointer flex flex-col items-center justify-center text-white" whileHover={{ scale: 1.05 }} onClick={onClick}>
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/0 opacity-0 transition-opacity duration-300 hover:opacity-100" />
        <div className="relative z-10">{icon}<h3 className="text-xl font-semibold mt-4 text-center">{title}</h3></div>
      </motion.div>
    );

    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-4xl">
          <FeatureCard title="Breathing Coach" icon={<HeartPulse size={48} />} onClick={() => setActiveModal('breathing')} />
          <FeatureCard title="Workout Planner" icon={<Dumbbell size={48} />} onClick={() => setActiveModal('workout')} />
          <FeatureCard title="BMR Calculator" icon={<Microscope size={48} />} onClick={() => setActiveModal('bmi')} />
          <FeatureCard title="Nutrition" icon={<Soup size={48} />} onClick={() => setActiveModal('nutrition')} />
          <FeatureCard title="Wellness Facts" icon={<Sun size={48} />} onClick={() => setActiveModal('facts')} />
          <FeatureCard title="Micro Goals" icon={<Calendar size={48} />} onClick={() => setActiveModal('goals')} />
        </div>
        <AnimatePresence>{renderModal()}</AnimatePresence>
      </>
    );
};

export function WellnessView() {
    const [userData, setUserData] = useState({
      name: 'Alex',
      moodLogs: [{ value: 8 }, { value: 6 }, { value: 9 }],
      sleepHours: 7.5,
      caloriesBurned: 450,
      hydrationCount: 4,
      goals: [{ goal: 'Drink 6 cups today', progress: 0.6 }],
    });
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
      // In a real app, this would be a fetch call.
      const fetchData = () => {
        setUserData({
          name: 'Alex',
          moodLogs: [{ value: 8 }, { value: 6 }, { value: 9 }],
          sleepHours: 7.5,
          caloriesBurned: 450,
          hydrationCount: 4,
          goals: [{ goal: 'Drink 6 cups today', progress: 0.6 }],
        });
      };
      fetchData();
      const timer = setInterval(() => setCurrentTime(new Date()), 60000);
      return () => clearInterval(timer);
    }, []);

    const handleUpdateUserData = (key: string, value: any) => {
      setUserData((prev) => ({ ...prev, [key]: value }));
    };
    
    const gradient = getBackgroundGradient(currentTime.getHours());
    const greeting = getGreeting(currentTime.getHours(), userData.name);

    return (
        <div className={`wellness-body min-h-screen flex flex-col md:flex-row transition-colors duration-1000 ${gradient}`}>
            <header className="absolute top-4 left-4 p-4 text-white text-2xl font-bold z-10">
                {greeting}
            </header>
            <div className="flex-1 p-8 md:p-16 flex flex-col justify-center items-center">
                <Dashboard userData={userData} handleUpdateUserData={handleUpdateUserData} />
            </div>
            <div className="flex-1 p-8 md:p-16 flex flex-col justify-center items-center">
                <FeatureGrid userData={userData} />
            </div>
            <button className="fixed bottom-4 right-4 p-4 rounded-full bg-red-600 text-white shadow-xl z-20 transition-transform hover:scale-110">
                SOS 🆘
            </button>
        </div>
    );
};

    