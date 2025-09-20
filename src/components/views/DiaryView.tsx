
"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Mic, Brain, Lightbulb, Hash } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

// Define interfaces for data structures
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: ((this: SpeechRecognition, ev: any) => any) | null;
  onerror: ((this: SpeechRecognition, ev: any) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
}

interface Window {
  SpeechRecognition: new () => SpeechRecognition;
  webkitSpeechRecognition: new () => SpeechRecognition;
}

declare var window: Window;

interface DiaryEntry {
    text: string;
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


export function DiaryView() {
    const entryAreaCardRef = useRef<HTMLDivElement>(null);
    const saveButtonRef = useRef<HTMLButtonElement>(null);
    const recognitionRef = useRef<SpeechRecognition | null>(null);

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [entryText, setEntryText] = useState('');
    const [allEntries, setAllEntries] = useState<AllEntries>({});
    const [isRecording, setIsRecording] = useState(false);

    // Load entries from localStorage on initial render
    useEffect(() => {
        const savedEntries = localStorage.getItem('diaryEntries');
        if (savedEntries) {
            setAllEntries(JSON.parse(savedEntries));
        }

        // Speech Recognition Setup
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
          recognitionRef.current = new SpeechRecognition();
          recognitionRef.current.continuous = true;
          recognitionRef.current.interimResults = true;
          recognitionRef.current.lang = 'en-US';
    
          recognitionRef.current.onresult = (event) => {
            let finalTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
              if (event.results[i].isFinal) {
                finalTranscript += event.results[i][0].transcript;
              }
            }
            if(finalTranscript) {
                setEntryText(prev => prev + finalTranscript + ' ');
            }
          };
          
          recognitionRef.current.onend = () => {
            if(isRecording){ // restart if it was stopped automatically
                recognitionRef.current?.start();
            }
          };
        }
    }, []);

    // Update view when selectedDate or allEntries change
    useEffect(() => {
        const dateKey = selectedDate.toDateString();
        const entry = allEntries[dateKey];
        setEntryText(entry?.text || '');
    }, [selectedDate, allEntries]);


    const handleSave = () => {
        const dateKey = selectedDate.toDateString();
        const newEntries: AllEntries = {
            ...allEntries,
            [dateKey]: { text: entryText }
        };
        setAllEntries(newEntries);
        localStorage.setItem('diaryEntries', JSON.stringify(newEntries));
        
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
    };

    const handlePromptClick = (prompt: string) => {
        setEntryText(prev => prev ? `${prev}\n\n${prompt}\n` : `${prompt}\n`);
    };

    const handleMicClick = () => {
        if (isRecording) {
            recognitionRef.current?.stop();
            setIsRecording(false);
        } else if (recognitionRef.current) {
            recognitionRef.current.start();
            setIsRecording(true);
        }
    };

    const renderCalendar = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const today = new Date();
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
            if (date.toDateString() === today.toDateString()) dayClass += ' today';
            if (date.toDateString() === selectedDate.toDateString()) dayClass += ' selected';

            days.push(
                <div key={i} className={dayClass} onClick={() => setSelectedDate(date)}>
                    {i}
                    {entry && <div className="mood-dot" style={{ backgroundColor: `var(--mood-blue)` }}></div>}
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
                        <button className="trends-button">📊 View Mood Trends</button>
                    </section>

                    <section className="card entry-area" ref={entryAreaCardRef}>
                        <div className="entry-toolbar">
                            <Brain size={18} />
                            <Lightbulb size={18} />
                            <Hash size={18} />
                        </div>
                        <textarea 
                            className="entry-pad" 
                            placeholder="Start writing your entry..."
                            value={entryText}
                            onChange={(e) => setEntryText(e.target.value)}
                        />
                        <div className="flex items-center justify-end mt-auto gap-4">
                            <button
                                onClick={handleMicClick}
                                className={`mic-button ${isRecording ? 'recording' : ''}`}
                                title={isRecording ? 'Stop Recording' : 'Start Recording'}
                            >
                                <Mic className="w-5 h-5" />
                            </button>
                            <button 
                                className="save-button" 
                                ref={saveButtonRef} 
                                onClick={handleSave}
                                disabled={!entryText.trim()}
                            >
                                Save
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
                        <div className="fab-option" title="Voice Entry">🎤</div>
                        <div className="fab-option" title="Add Photo/Doodle">📷</div>
                    </div>
                    <div className="fab">+</div>
                </div>
            </div>
        </ScrollArea>
    );
}
