
"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Brain, X, Mic } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getSummary, analyzeMood } from "@/app/actions";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAuth } from '@/hooks/useAuth';


// Define interfaces for data structures
interface DiaryEntry {
    text: string;
    mood: string;
}

interface AllEntries {
    [dateKey: string]: DiaryEntry;
}

const PROMPTS = [
    'What made you smile today?',
    'One challenge you faced?',
    'What are you grateful for?',
    'A small, happy moment from today…',
    'What’s on your mind right now?'
];

// Helper to check if a date is today
const isToday = (someDate: Date) => {
    const today = new Date();
    return someDate.getDate() === today.getDate() &&
           someDate.getMonth() === today.getMonth() &&
           someDate.getFullYear() === today.getFullYear();
};

// Helper to check if a date is in the past
const isPast = (someDate: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of today
    return someDate < today;
};

// Helper to check if a date is in the future
const isFuture = (someDate: Date) => {
    const today = new Date();
    today.setHours(23, 59, 59, 999); // Set to end of today
    return someDate > today;
};

const MoodTrendsModal = ({ isOpen, onClose, data }: { isOpen: boolean, onClose: () => void, data: any[] }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-8 max-w-2xl w-full relative shadow-2xl border border-white/20">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
                    <X size={24} />
                </button>
                <h2 className="text-2xl font-bold text-center mb-6">Your Mood Trends (Last 30 Days)</h2>
                <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                        <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(200, 200, 200, 0.4)" />
                            <XAxis dataKey="name" stroke="#4a5568" />
                            <YAxis stroke="#4a5568" allowDecimals={false}/>
                            <Tooltip
                                contentStyle={{
                                    background: 'rgba(255, 255, 255, 0.8)',
                                    backdropFilter: 'blur(5px)',
                                    borderRadius: '8px',
                                    border: '1px solid rgba(200, 200, 200, 0.4)',
                                }}
                            />
                            <Legend />
                            <Bar dataKey="count" fill="rgba(74, 144, 226, 0.6)" name="Mood Count" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};


export function DiaryView({ user, onSignIn }: { user: any; onSignIn: () => void; }) {
    const entryAreaCardRef = useRef<HTMLDivElement>(null);
    const saveButtonRef = useRef<HTMLButtonElement>(null);
    const entryPadRef = useRef<HTMLDivElement>(null);
    const recognitionRef = useRef<any>(null);


    const [selectedDate, setSelectedDate] = useState(new Date());
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [allEntries, setAllEntries] = useState<AllEntries>({});
    const [warningMessage, setWarningMessage] = useState('');
    const [isSummarizing, setIsSummarizing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isTrendsModalOpen, setIsTrendsModalOpen] = useState(false);
    const [moodData, setMoodData] = useState<any[]>([]);
    const [isRecording, setIsRecording] = useState(false);
    const [isVoicePopupVisible, setIsVoicePopupVisible] = useState(false);
    const [currentEntryText, setCurrentEntryText] = useState('');
    

    // Load entries from localStorage on initial render
    useEffect(() => {
        if (!user) {
            setAllEntries({});
            return;
        }
        try {
            const savedEntries = localStorage.getItem(`diaryEntries_${user.uid}`);
            if (savedEntries) {
                setAllEntries(JSON.parse(savedEntries));
            }
        } catch (error) {
            console.error("Failed to parse diary entries from localStorage", error);
        }
        
        // Setup Speech Recognition
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;

            let finalTranscript = '';

            recognitionRef.current.onresult = (event: any) => {
                let interimTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript + ' ';
                    } else {
                        interimTranscript += event.results[i][0].transcript;
                    }
                }
                if (entryPadRef.current) {
                    entryPadRef.current.innerHTML = entryPadRef.current.innerHTML + finalTranscript + interimTranscript;
                }
            };
            
            recognitionRef.current.onend = () => {
                setIsRecording(false);
                setIsVoicePopupVisible(false);
                if (entryPadRef.current) {
                    setCurrentEntryText(entryPadRef.current.innerHTML);
                }
            };
        }

    }, [user]);


    // Update view when selectedDate or allEntries change
    useEffect(() => {
        const dateKey = selectedDate.toDateString();
        const entry = allEntries[dateKey];
        const newHtml = entry?.text || '';
        
        if (entryPadRef.current) {
            entryPadRef.current.innerHTML = newHtml;
        }
        setCurrentEntryText(newHtml);

        if (!entry && isPast(selectedDate)) {
            const dateString = selectedDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
            const warning = `⚠️ Warning: No data saved on ${dateString}.`;
            setWarningMessage(warning);
        } else {
            setWarningMessage('');
        }
    }, [selectedDate, allEntries]);


    const handleSave = async () => {
        if (!isEditable || !entryPadRef.current || !entryPadRef.current.innerHTML.trim()) return;

        setIsSaving(true);
        const currentHtml = entryPadRef.current.innerHTML;
        const currentText = entryPadRef.current.innerText;

        try {
            const moodResult = await analyzeMood(currentText);
            const mood = moodResult.mood?.toLowerCase() || 'neutral';
            
            const dateKey = selectedDate.toDateString();
            const newEntries: AllEntries = {
                ...allEntries,
                [dateKey]: { text: currentHtml, mood: mood }
            };
            setAllEntries(newEntries);
            localStorage.setItem(`diaryEntries_${user.uid}`, JSON.stringify(newEntries));

            // Confetti effect
            const saveButton = saveButtonRef.current;
            const entryAreaCard = entryAreaCardRef.current;
            if (!saveButton || !entryAreaCard) return;

            for (let i = 0; i < 50; i++) {
                const confettiPiece = document.createElement('div');
                confettiPiece.className = 'confetti-piece';
                const colors = ['#4a90e2', '#e24a90', '#facc15', '#ef4444', '#3b82f6'];
                confettiPiece.style.background = colors[Math.floor(Math.random() * colors.length)];
                confettiPiece.style.left = `${saveButton.offsetLeft + (saveButton.offsetWidth / 2)}px`;
                confettiPiece.style.top = `${saveButton.offsetTop}px`;
                const transform = `rotate(${Math.random() * 360}deg) translateX(${ (Math.random() - 0.5) * 300 }px)`;
                confettiPiece.style.transform = transform;
                confettiPiece.style.animationDelay = `${Math.random() * 0.2}s`;
                entryAreaCard.appendChild(confettiPiece);
                setTimeout(() => confettiPiece.remove(), 3000);
            }
        } catch (error) {
            console.error("Failed to analyze mood and save entry", error);
            alert("Could not analyze mood. Entry saved without mood data.");
            // Optionally save without mood
            const dateKey = selectedDate.toDateString();
            const newEntries: AllEntries = { ...allEntries, [dateKey]: { text: currentHtml, mood: 'unknown' } };
            setAllEntries(newEntries);
            localStorage.setItem(`diaryEntries_${user.uid}`, JSON.stringify(newEntries));
        } finally {
            setIsSaving(false);
        }
    };

    const handlePromptClick = (prompt: string) => {
        if (!isEditable || !entryPadRef.current) return;
        const promptHtml = `<p><span class="diary-prompt-text">${prompt}</span>&nbsp;</p>`;
        entryPadRef.current.innerHTML += entryPadRef.current.innerHTML ? `<br>${promptHtml}`: promptHtml;
        handleInput({ currentTarget: entryPadRef.current } as React.FormEvent<HTMLDivElement>);
    };

    const handleDayClick = (date: Date) => {
        if (isFuture(date)) return;
        setSelectedDate(date);
    };
    
    const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
        setCurrentEntryText(e.currentTarget.innerHTML);
    };

    const handleSummarize = async () => {
        if (!entryPadRef.current || !entryPadRef.current.innerHTML.trim() || isSummarizing) return;
        setIsSummarizing(true);
        const textToSummarize = entryPadRef.current.innerText; // Use innerText to get clean text without HTML
        try {
            const result = await getSummary(textToSummarize);

            if (result.summary && entryPadRef.current) {
                const summaryHtml = `<p>${result.summary}</p>`;
                entryPadRef.current.innerHTML = summaryHtml;
                setCurrentEntryText(summaryHtml);
            } else if (result.error) {
                alert(`Summarization failed: ${result.error}`);
            }
        } catch (error) {
            console.error("Summarization error:", error);
            alert("An error occurred while summarizing.");
        } finally {
            setIsSummarizing(false);
        }
    };

    const handleViewTrends = () => {
        if (!user) return;
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const recentEntries = Object.entries(allEntries).filter(([dateKey]) => new Date(dateKey) >= thirtyDaysAgo);

        const moodCounts: { [mood: string]: number } = {};
        recentEntries.forEach(([, entry]) => {
            if (entry.mood) {
                moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
            }
        });

        const formattedData = Object.entries(moodCounts).map(([name, count]) => ({ name, count }));
        setMoodData(formattedData);
        setIsTrendsModalOpen(true);
    };

    const startRecording = () => {
        if (!isEditable || isRecording) return;
        
        if (entryPadRef.current) {
            setCurrentEntryText(entryPadRef.current.innerHTML);
        }
        
        recognitionRef.current?.start();
        setIsRecording(true);
        setIsVoicePopupVisible(true);
    };

    const stopRecording = () => {
        if (!isRecording) return;
        recognitionRef.current?.stop();
        setIsRecording(false);
        setIsVoicePopupVisible(false);
    };


    const renderCalendar = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDayIndex = new Date(year, month, 1).getDay();

        const days = [];
        for (let i = 0; i < firstDayIndex; i++) {
            days.push(<div key={`empty-${i}`}></div>);
        }

        for (let i = 1; i <= daysInMonth; i++) {
            const date = new Date(year, month, i);
            const dateKey = date.toDateString();
            const entry = allEntries[dateKey];
            
            let dayClass = 'calendar-day';
            if (isToday(date)) dayClass += ' today';
            if (date.toDateString() === selectedDate.toDateString()) dayClass += ' selected';
            if (isFuture(date)) dayClass += ' disabled';

            let moodColor;
            if (entry && entry.mood) {
                const mood = entry.mood.toLowerCase();
                if (mood.includes('happy')) moodColor = 'var(--mood-happy)';
                else if (mood.includes('sad') || mood.includes('blue')) moodColor = 'var(--mood-blue)';
                else if (mood.includes('grateful') || mood.includes('love')) moodColor = 'var(--mood-loving)';
                else if (mood.includes('angry') || mood.includes('stressed')) moodColor = 'var(--mood-red)';
                else moodColor = 'var(--mood-neutral)';
            }


            days.push(
                <div key={i} className={dayClass} onClick={() => handleDayClick(date)}>
                    {i}
                    {moodColor && <div className="mood-dot" style={{ backgroundColor: moodColor }}></div>}
                </div>
            );
        }

        const headers = ['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
            <div key={day} className="day-header">{day}</div>
        ));

        return (
            <>
                <div className="flex justify-between items-center mb-2">
                    <button onClick={() => setCurrentMonth(new Date(year, month - 1, 1))}>&lt;</button>
                    <h2 className="card-title text-center">{currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h2>
                    <button onClick={() => setCurrentMonth(new Date(year, month + 1, 1))}>&gt;</button>
                </div>
                <div className="calendar-grid">
                    {headers}
                    {days}
                </div>
            </>
        );
    };
    
    const isEditable = isToday(selectedDate) && !!user;


    return (
        <ScrollArea className="h-full">
            <div className='diary-body-styles'>
                <header className="header">
                    <h1 className="header-title">📓 Digital Diary</h1>
                    <p className="header-subtext">{selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </header>

                <main className="dashboard-grid">
                    <section className="card daily-prompts">
                        <h2 className="card-title">Daily Prompts</h2>
                        <ul className="prompts-list">
                            {PROMPTS.map((prompt, i) => (
                                <li key={i} onClick={() => handlePromptClick(prompt)}>{prompt}</li>
                            ))}
                        </ul>
                        <button className="trends-button" onClick={handleViewTrends} disabled={!user}>📊 View Mood Trends</button>
                    </section>

                    <section className="card entry-area" ref={entryAreaCardRef}>
                        <div className="entry-toolbar">
                             <button onClick={handleSummarize} disabled={isSummarizing || !isEditable} className="disabled:opacity-50 disabled:cursor-not-allowed hover:text-[--glow-color] transition-colors">
                                <Brain size={18} className={isSummarizing ? 'animate-pulse' : ''}/>
                            </button>
                        </div>
                        <div className="entry-pad-container">
                            {isVoicePopupVisible && (
                                <div className="voice-popup-overlay">
                                    <div className="voice-popup-content">
                                        <div className="mic-listening-indicator">
                                            <Mic size={32} />
                                        </div>
                                        <p className="listening-text">Listening...</p>
                                        <button className="stop-listening-btn" onClick={stopRecording}>
                                            Stop
                                        </button>
                                    </div>
                                </div>
                            )}
                            <div 
                                ref={entryPadRef}
                                className="entry-pad"
                                contentEditable={isEditable}
                                onInput={handleInput}
                                suppressContentEditableWarning={true}
                                style={{ WebkitUserModify: isEditable ? 'read-write' : 'read-only' }}
                            />
                            {warningMessage && !isEditable && (
                                <div className="entry-pad-overlay">
                                    {warningMessage}
                                </div>
                            )}
                            {!user && (
                                <div className="entry-pad-overlay flex-col !bg-white/50 backdrop-blur-sm">
                                    <p className="font-semibold text-lg">Please sign in to use the diary.</p>
                                    <button onClick={onSignIn} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-full">Sign In</button>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center justify-end mt-auto gap-4">
                             <button
                                onClick={startRecording}
                                disabled={!isEditable || isRecording}
                                className="mic-button"
                                title="Start recording"
                            >
                                <Mic size={20} />
                            </button>
                            <button 
                                className="save-button" 
                                ref={saveButtonRef} 
                                onClick={handleSave}
                                disabled={!isEditable || !currentEntryText.trim() || isSaving}
                            >
                                {isSaving ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    </section>

                    <section className="card calendar-timeline">
                        {renderCalendar()}
                    </section>
                </main>
            
                <div className="fab-container">
                    <div className="fab-options">
                        <div className="fab-option" title="Text Entry">✍️</div>
                        <div className="fab-option" title="Add Photo/Doodle">📷</div>
                    </div>
                    <div className="fab">+</div>
                </div>

                <MoodTrendsModal 
                    isOpen={isTrendsModalOpen} 
                    onClose={() => setIsTrendsModalOpen(false)}
                    data={moodData}
                />
            </div>
        </ScrollArea>
    );
}
