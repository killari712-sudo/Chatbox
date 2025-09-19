
"use client";

import React, { useState, useEffect } from 'react';

// Define types for habits and form data
type Habit = {
  id: string;
  icon: string;
  title: string;
  frequency: string;
  goal: number;
  current: number;
  streak: number;
  unit: string;
};

type FormData = {
  wakeUp: string;
  sleep: string;
  meals: number;
  walk: boolean;
  walkMinutes: number;
  jog: boolean;
  read: boolean;
  meditate: boolean;
  newHabit: string;
};

const initialFormData: FormData = {
  wakeUp: '07:00',
  sleep: '23:00',
  meals: 3,
  walk: false,
  walkMinutes: 30,
  jog: false,
  read: false,
  meditate: false,
  newHabit: '',
};

const OnboardingForm = ({ onComplete }: { onComplete: (habits: Habit[]) => void }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
        const { checked } = e.target as HTMLInputElement;
        setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = () => {
    const newHabits: Habit[] = [];
    if (formData.wakeUp) newHabits.push({ id: 'wake-up', icon: '🌅', title: `Wake up before ${formData.wakeUp}`, frequency: 'Daily', goal: 1, current: 0, streak: 0, unit: '' });
    if (formData.meals) newHabits.push({ id: 'meals', icon: '🍽️', title: `Track ${formData.meals} meals`, frequency: 'Daily', goal: formData.meals, current: 0, streak: 0, unit: 'meals' });
    if (formData.walk) newHabits.push({ id: 'walk', icon: '🚶', title: `Daily Walk (${formData.walkMinutes} min)`, frequency: 'Daily', goal: formData.walkMinutes, current: 0, streak: 0, unit: 'min' });
    if (formData.read) newHabits.push({ id: 'read', icon: '📖', title: `Read daily (10 min)`, frequency: 'Daily', goal: 10, current: 0, streak: 0, unit: 'min' });
    if (formData.meditate) newHabits.push({ id: 'meditate', icon: '🧘', title: `Breathing for 5 min`, frequency: 'Daily', goal: 5, current: 0, streak: 0, unit: 'min' });
    if (formData.newHabit) newHabits.push({ id: 'custom', icon: '✨', title: formData.newHabit, frequency: 'Daily', goal: 1, current: 0, streak: 0, unit: '' });
    
    onComplete(newHabits);
  };
  
  return (
    <div className="habit-modal-overlay">
        <div className="habit-modal-content">
            <h2 className="text-3xl font-bold mb-2">Build Your Habit Profile</h2>
            <p className="text-gray-400 mb-6">Let's set up some healthy routines together.</p>

            <div className="flex items-center justify-center mb-6">
                <div className={`step-indicator ${step >= 1 ? 'active' : ''}`}>1</div>
                <div className={`step-connector ${step >= 2 ? 'active' : ''}`}></div>
                <div className={`step-indicator ${step >= 2 ? 'active' : ''}`}>2</div>
                <div className={`step-connector ${step >= 3 ? 'active' : ''}`}></div>
                <div className={`step-indicator ${step >= 3 ? 'active' : ''}`}>3</div>
            </div>

            {step === 1 && (
                <div className="form-step-content">
                    <h3 className="text-xl font-semibold mb-4 text-center">Your Daily Rhythm</h3>
                    <div className="space-y-4">
                        <div className="habit-form-group">
                            <label>⏰ What time do you usually wake up?</label>
                            <input type="time" name="wakeUp" value={formData.wakeUp} onChange={handleChange} className="habit-input"/>
                        </div>
                        <div className="habit-form-group">
                            <label>🌙 What time do you usually go to sleep?</label>
                            <input type="time" name="sleep" value={formData.sleep} onChange={handleChange} className="habit-input"/>
                        </div>
                        <div className="habit-form-group">
                            <label>🍽️ How many meals do you take per day? ({formData.meals})</label>
                            <input type="range" name="meals" min="1" max="5" value={formData.meals} onChange={handleChange} className="habit-slider"/>
                        </div>
                    </div>
                </div>
            )}

            {step === 2 && (
                <div className="form-step-content">
                    <h3 className="text-xl font-semibold mb-4 text-center">Your Activities</h3>
                    <div className="space-y-4">
                        <div className="habit-toggle">
                            <span>🚶 Do you usually walk daily?</span>
                            <label className="switch"><input type="checkbox" name="walk" checked={formData.walk} onChange={handleChange} /><span className="slider round"></span></label>
                        </div>
                        {formData.walk && (
                            <div className="habit-form-group pl-8">
                                <label>How many minutes? ({formData.walkMinutes})</label>
                                <input type="range" name="walkMinutes" min="15" max="120" step="15" value={formData.walkMinutes} onChange={handleChange} className="habit-slider"/>
                            </div>
                        )}
                        <div className="habit-toggle">
                            <span>🏃 Do you jog/run regularly?</span>
                            <label className="switch"><input type="checkbox" name="jog" checked={formData.jog} onChange={handleChange} /><span className="slider round"></span></label>
                        </div>
                        <div className="habit-toggle">
                            <span>📖 Do you read at least 10 min/day?</span>
                             <label className="switch"><input type="checkbox" name="read" checked={formData.read} onChange={handleChange} /><span className="slider round"></span></label>
                        </div>
                         <div className="habit-toggle">
                            <span>🧘 Do you do mindfulness/meditation?</span>
                             <label className="switch"><input type="checkbox" name="meditate" checked={formData.meditate} onChange={handleChange} /><span className="slider round"></span></label>
                        </div>
                    </div>
                </div>
            )}
            
            {step === 3 && (
                 <div className="form-step-content">
                     <h3 className="text-xl font-semibold mb-4 text-center">Anything New?</h3>
                     <div className="habit-form-group">
                         <label>🎮 Do you want to build any new habits?</label>
                         <textarea name="newHabit" value={formData.newHabit} onChange={handleChange} placeholder="e.g., Learn a new language for 15 minutes" className="habit-textarea"></textarea>
                     </div>
                </div>
            )}

            <div className="flex justify-between mt-8">
                <button onClick={handleBack} className={`habit-btn-secondary ${step === 1 ? 'invisible' : ''}`}>Back</button>
                {step < 3 && <button onClick={handleNext} className="habit-btn-primary">Next</button>}
                {step === 3 && <button onClick={handleSubmit} className="habit-btn-generate">✨ Generate Habits</button>}
            </div>
        </div>
    </div>
  );
};


const HabitCard = ({ habit, onComplete }: { habit: Habit; onComplete: (id: string, isComplete: boolean) => void }) => {
    const isDone = habit.current >= habit.goal;
    const progress = habit.goal > 0 ? (habit.current / habit.goal) * 100 : 0;
  
    const handleComplete = () => {
        onComplete(habit.id, !isDone);
    };

    return (
        <div className={`habit-card ${isDone ? 'done' : ''}`}>
            <div className="habit-card-header">
                <span className="habit-icon">{habit.icon}</span>
                <h3 className="habit-title">{habit.title}</h3>
            </div>
            <div className="habit-progress">
                <div className="progress-bar-background">
                    <div className="progress-bar-foreground" style={{ width: `${progress}%` }}></div>
                </div>
                <span className="progress-text">{habit.current}/{habit.goal} {habit.unit}</span>
            </div>
            <div className="habit-stats">
                <div>
                    <span>🔥</span>
                    <p>{habit.streak}</p>
                    <small>Streak</small>
                </div>
                <div>
                    <span>🎯</span>
                    <p>Daily</p>
                    <small>Frequency</small>
                </div>
            </div>
            <button onClick={handleComplete} className={`habit-complete-btn ${isDone ? 'completed' : ''}`}>
                {isDone ? '✅ Done' : 'Mark Done'}
            </button>
        </div>
    );
};


export function HabitBuilderView() {
    const [habits, setHabits] = useState<Habit[]>([]);
    const [showOnboarding, setShowOnboarding] = useState(false);

    useEffect(() => {
        const storedHabits = localStorage.getItem('user-habits');
        if (storedHabits) {
            setHabits(JSON.parse(storedHabits));
        } else {
            setShowOnboarding(true);
        }
    }, []);

    const handleOnboardingComplete = (newHabits: Habit[]) => {
        setHabits(newHabits);
        localStorage.setItem('user-habits', JSON.stringify(newHabits));
        setShowOnboarding(false);
    };

    const handleHabitComplete = (id: string, isComplete: boolean) => {
        setHabits(prevHabits => {
            const updatedHabits = prevHabits.map(h => {
                if (h.id === id) {
                    const newCurrent = isComplete ? h.goal : 0;
                    const newStreak = isComplete ? h.streak + 1 : h.streak;
                    return { ...h, current: newCurrent, streak: newStreak };
                }
                return h;
            });
            localStorage.setItem('user-habits', JSON.stringify(updatedHabits));
            return updatedHabits;
        });
    };
    
    const totalStreak = habits.reduce((acc, h) => acc + h.streak, 0);

    return (
        <div className="habit-builder-body">
            {showOnboarding && <OnboardingForm onComplete={handleOnboardingComplete} />}

            <header className="habit-header">
                <h1>Habit Builder</h1>
                <p>Craft your ideal routine and watch your life transform.</p>
            </header>

            <main className="habit-main-content">
                <aside className="habit-sidebar">
                    <h2>My Habit List</h2>
                    <ul>
                        {habits.map(habit => (
                            <li key={habit.id}>
                                <span>{habit.icon} {habit.title}</span>
                                <button 
                                    onClick={() => handleHabitComplete(habit.id, habit.current < habit.goal)}
                                    className={`sidebar-complete-btn ${habit.current >= habit.goal ? 'done' : ''}`}
                                >
                                    ✅
                                </button>
                            </li>
                        ))}
                    </ul>
                </aside>
                <section className="habit-dashboard">
                    <div className="streak-tracker">
                        🔥 Total Streak: {totalStreak} Days
                    </div>
                    <div className="habit-grid">
                        {habits.length > 0 ? (
                           habits.map(habit => (
                            <HabitCard key={habit.id} habit={habit} onComplete={handleHabitComplete} />
                           ))
                        ) : (
                            <div className="empty-habits">
                                <p>No habits yet. Start by building your profile!</p>
                                <button onClick={() => setShowOnboarding(true)} className="habit-btn-primary">Build My Habits</button>
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
}

    