
"use client";

import React, { useEffect, useState } from 'react';

export function HabitBuilderView() {
    const [habits, setHabits] = useState<any[]>([]);
    const [history, setHistory] = useState<any>({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeFilter, setActiveFilter] = useState('all');

    useEffect(() => {
        const checkStreaks = (habitsToCheck: any[]) => {
            const todayStr = new Date().toISOString().split('T')[0];
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toISOString().split('T')[0];
            
            habitsToCheck.forEach(habit => {
                if (habit.lastCompleted !== todayStr && habit.lastCompleted !== yesterdayStr) {
                    if (habit.streak > 0) {
                        habit.streak = 0;
                    }
                }
                if (habit.lastCompleted !== todayStr) {
                    habit.progress = 0;
                }
            });
            return habitsToCheck;
        };

        const loadData = () => {
            const habitsData = localStorage.getItem('habitsData');
            const historyData = localStorage.getItem('habitsHistory');
            let loadedHabits = [];
            if (habitsData) {
                try {
                    loadedHabits = JSON.parse(habitsData);
                } catch (e) {
                    console.error("Failed to parse habits data from localStorage", e);
                    loadedHabits = [];
                }
            }
            
            setHistory(historyData ? JSON.parse(historyData) : {});
            setHabits(checkStreaks(loadedHabits));
        };

        loadData();
    }, []);

    const saveData = (newHabits: any[], newHistory: any) => {
        setHabits(newHabits);
        setHistory(newHistory);
        localStorage.setItem('habitsData', JSON.stringify(newHabits));
        localStorage.setItem('habitsHistory', JSON.stringify(newHistory));
    };

    const getLevel = (streak: number) => {
        if (streak >= 100) return '🌳 Tree (Lvl 3)';
        if (streak >= 30) return '🌿 Plant (Lvl 2)';
        if (streak >= 7) return '🌱 Seed (Lvl 1)';
        return '🌱 Sprout';
    };

    const handleMarkDone = (id: string) => {
        const newHabits = [...habits];
        const newHistory = {...history};
        const habit = newHabits.find(h => h.id === id);
        if (!habit) return;

        habit.progress += 1;

        if (habit.progress >= habit.goal) {
            habit.progress = habit.goal;
            const todayStr = new Date().toISOString().split('T')[0];
            
            if (habit.lastCompleted !== todayStr) {
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                const yesterdayStr = yesterday.toISOString().split('T')[0];
                
                if (habit.lastCompleted === yesterdayStr) {
                    habit.streak++;
                } else {
                    habit.streak = 1;
                }
                habit.lastCompleted = todayStr;

                if (!newHistory[todayStr]) newHistory[todayStr] = [];
                if (!newHistory[todayStr].includes(id)) {
                    newHistory[todayStr].push(id);
                }
            }
        }
        saveData(newHabits, newHistory);
    };

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const newHabit = {
            id: 'h' + Date.now(),
            icon: formData.get('habit-icon-input') as string,
            title: formData.get('habit-title-input') as string,
            category: formData.get('habit-category-select') as string,
            goal: parseInt(formData.get('habit-goal-input') as string, 10),
            progress: 0,
            streak: 0,
            lastCompleted: null
        };
        const newHabits = [...habits, newHabit];
        saveData(newHabits, history);
        setIsModalOpen(false);
    };
    
    const overallStreak = habits.length > 0 ? Math.min(...habits.map(h => h.streak)) : 0;
    const topHabits = [...habits].sort((a,b) => b.streak - a.streak).slice(0, 3);
    
    const filteredHabits = activeFilter === 'all' 
            ? habits 
            : habits.filter(h => h.category === activeFilter);

    const today = new Date();
    const timelineDays = Array.from({ length: 30 }).map((_, i) => {
        const date = new Date();
        date.setDate(today.getDate() - i);
        return date;
    }).reverse();

    return (
        <div className="habit-builder-body">
            <div className="container">
                <header className="master-dashboard">
                    <div className="streak-tracker">
                         {topHabits.map((habit, index) => {
                            const radius = 90 - (index * 15);
                            const circumference = 2 * Math.PI * radius;
                            const progress = habit.goal > 0 ? Math.min(habit.progress / habit.goal, 1) : 0;
                            const offset = circumference * (1 - progress);
                            return (
                                <svg key={index} viewBox="0 0 200 200">
                                    <circle className="ring-bg" cx="100" cy="100" r={radius}></circle>
                                    <circle 
                                      className={`ring-progress ring-${index + 1}`} 
                                      cx="100" cy="100" r={radius} 
                                      strokeDasharray={circumference} 
                                      strokeDashoffset={offset}>
                                    </circle>
                                </svg>
                            );
                         })}
                        <div className="streak-center">
                            <div className="streak-flame" style={{fontSize: `${Math.min(3.5 + (overallStreak / 20), 6)}rem`}}>🔥</div>
                            <div className="streak-label">{overallStreak}-Day Overall Streak</div>
                        </div>
                    </div>
                    <div className="view-toggle">
                        <button className="toggle-btn active">All Habits View</button>
                        <button className="toggle-btn">Single Habit Focus</button>
                    </div>
                </header>

                <main>
                    <section className="habit-list-section">
                        <div className="habit-controls">
                             <div className="category-filters">
                                {['all', '🎓 Academic', '🧘 Wellness', '🌱 Lifestyle'].map(cat => (
                                     <button 
                                        key={cat}
                                        className={`filter-btn ${activeFilter === cat ? 'active' : ''}`}
                                        onClick={() => setActiveFilter(cat)}>
                                        {cat === 'all' ? 'All' : cat}
                                     </button>
                                ))}
                            </div>
                            <button className="add-habit-btn" onClick={() => setIsModalOpen(true)}>+</button>
                        </div>
                        <div className="habit-grid">
                            {filteredHabits.length === 0 ? (
                                <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-muted)' }}>
                                    No habits yet. Click the '+' button to add your first one!
                                </p>
                            ) : (
                                filteredHabits.map(habit => {
                                    const progress = habit.goal > 0 ? habit.progress / habit.goal : 0;
                                    const circumference = 2 * Math.PI * 36;
                                    const offset = circumference * (1 - Math.min(progress, 1));
                                    return (
                                        <div key={habit.id} className={`habit-card ${habit.streak > 0 ? 'glow-border' : ''}`}>
                                            <div className="habit-header">
                                                <span className="habit-icon">{habit.icon}</span>
                                                <div>
                                                    <h3 className="habit-title">{habit.title}</h3>
                                                    <p className="habit-level">{getLevel(habit.streak)}</p>
                                                </div>
                                                <div className="habit-progress">
                                                    <svg viewBox="0 0 80 80">
                                                        <circle className="ring-bg" cx="40" cy="40" r="36"></circle>
                                                        <circle className="ring-progress" cx="40" cy="40" r="36" style={{ strokeDasharray: circumference, strokeDashoffset: offset, stroke: progress >= 1 ? 'var(--green-glow)' : 'var(--blue-glow)' }}></circle>
                                                    </svg>
                                                    <span className="habit-progress-value">{habit.goal > 1 ? `${habit.progress}/${habit.goal}` : `${Math.round(progress * 100)}%`}</span>
                                                </div>
                                            </div>
                                            <div className="habit-stats">
                                                <div className="stat-item"><h4>🔥 {habit.streak}</h4><p>Current Streak</p></div>
                                                <div className="stat-item"><h4>🎯 {habit.goal}</h4><p>Daily Goal</p></div>
                                            </div>
                                            <div className="habit-actions">
                                                <button className={`action-btn ${progress >= 1 ? 'done' : ''}`} onClick={() => handleMarkDone(habit.id)}>{progress >= 1 ? '✅ Done' : 'Mark Done'}</button>
                                                <button className="action-btn">📊 Stats</button>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </section>

                    <section className="timeline-section">
                        <h2>History Timeline</h2>
                        <div className="timeline">
                           {timelineDays.map(date => {
                                const dateStr = date.toISOString().split('T')[0];
                                const completedHabits = history[dateStr] || [];
                                return (
                                    <div key={dateStr} className={`timeline-day ${dateStr === new Date().toISOString().split('T')[0] ? 'today' : ''}`}>
                                        <span className="day-label">{date.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                                        <span className="day-number">{date.getDate()}</span>
                                        <div className="day-dots">
                                            {completedHabits.slice(0, 3).map((habitId: string) => {
                                                const habit = habits.find(h => h.id === habitId);
                                                const color = habit ? (habit.category === '🧘 Wellness' ? 'var(--green-glow)' : habit.category === '🎓 Academic' ? 'var(--blue-glow)' : 'var(--purple-glow)') : 'var(--text-muted)';
                                                return <div key={habitId} className="day-dot" style={{ backgroundColor: color }}></div>
                                            })}
                                        </div>
                                    </div>
                                );
                           })}
                        </div>
                    </section>
                </main>
            </div>

            {isModalOpen && (
                <div className="modal-overlay visible">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3 className="modal-title">Add New Habit</h3>
                            <button className="close-modal-btn" onClick={() => setIsModalOpen(false)}>&times;</button>
                        </div>
                        <form onSubmit={handleFormSubmit}>
                             <div className="form-group">
                                <label htmlFor="habit-title-input">Title</label>
                                <input type="text" name="habit-title-input" placeholder="e.g., Morning Walk" required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="habit-icon-input">Icon (Emoji)</label>
                                <input type="text" name="habit-icon-input" defaultValue="💪" required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="habit-category-select">Category</label>
                                <select name="habit-category-select">
                                    <option>🧘 Wellness</option>
                                    <option>🎓 Academic</option>
                                    <option>🌱 Lifestyle</option>
                                    <option>💼 Work</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="habit-goal-input">Daily Goal (Quantitative)</label>
                                <input type="number" name="habit-goal-input" defaultValue="1" min="1" required />
                            </div>
                            <div className="modal-footer">
                                <button type="submit" className="save-btn">Save Habit</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
