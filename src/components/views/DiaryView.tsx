
"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Mic, Brain, Lightbulb, Hash, X } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import Image from 'next/image';
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Button } from "@/components/ui/button";


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

export function DiaryView() {
    const entryAreaCardRef = useRef<HTMLDivElement>(null);
    const saveButtonRef = useRef<HTMLButtonElement>(null);
    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const entryPadRef = useRef<HTMLDivElement>(null);
    const aiAvatar = PlaceHolderImages.find((p) => p.id === "ai-avatar");


    const [selectedDate, setSelectedDate] = useState(new Date());
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [entryHtml, setEntryHtml] = useState('');
    const [allEntries, setAllEntries] = useState<AllEntries>({});
    const [isRecording, setIsRecording] = useState(false);
    const [warningMessage, setWarningMessage] = useState('');
    const [isVoiceOverlayVisible, setVoiceOverlayVisible] = useState(false);
    const [transcript, setTranscript] = useState('');


    // Load entries from localStorage on initial render
    useEffect(() => {
        const savedEntries = localStorage.getItem('diaryEntries');
        if (savedEntries) {
            setAllEntries(JSON.parse(savedEntries));
        }

        // Speech Recognition Setup
        const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognitionAPI) {
          recognitionRef.current = new SpeechRecognitionAPI();
          recognitionRef.current.continuous = true;
          recognitionRef.current.interimResults = true;
          // By not setting lang, it uses the browser's default, allowing for multiple languages
    
          recognitionRef.current.onresult = (event) => {
            let interimTranscript = '';
            let finalTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
              if (event.results[i].isFinal) {
                finalTranscript += event.results[i][0].transcript;
              } else {
                interimTranscript += event.results[i][0].transcript;
              }
            }
            setTranscript(interimTranscript); // Show real-time transcription in overlay
            if(finalTranscript && entryPadRef.current) {
                entryPadRef.current.innerHTML += finalTranscript.trim() + '. ';
                setEntryHtml(entryPadRef.current.innerHTML);
            }
          };
          
          recognitionRef.current.onend = () => {
             if (isRecording) { // Automatically restart if it was supposed to be recording
                recognitionRef.current?.start();
             }
          };

          recognitionRef.current.onerror = (event) => {
            console.error('Speech recognition error', event.error);
            setIsRecording(false);
            setVoiceOverlayVisible(false);
          };

        } else {
            console.log("Speech Recognition not supported in this browser.");
        }
    }, [isRecording]);

    // Update view when selectedDate or allEntries change
    useEffect(() => {
        const dateKey = selectedDate.toDateString();
        const entry = allEntries[dateKey];
        setEntryHtml(entry?.text || '');
        if (entryPadRef.current) {
            entryPadRef.current.innerHTML = entry?.text || '';
        }


        if (!entry && isPast(selectedDate)) {
            const dateString = selectedDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
            const warning = `⚠️ Warning: No data saved on ${dateString}.`;
            setWarningMessage(warning);
            alert(warning);
        } else {
            setWarningMessage('');
        }
    }, [selectedDate, allEntries]);


    const handleSave = () => {
        if (!isToday(selectedDate) || !entryPadRef.current) return;

        const currentHtml = entryPadRef.current.innerHTML;
        const dateKey = selectedDate.toDateString();
        const newEntries: AllEntries = {
            ...allEntries,
            [dateKey]: { text: currentHtml }
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
        if (!isToday(selectedDate) || !entryPadRef.current) return;
        const promptHtml = `<p><span class="diary-prompt-text">${prompt}</span></p>`;
        entryPadRef.current.innerHTML += entryPadRef.current.innerHTML ? `<br>${promptHtml}`: promptHtml;
        setEntryHtml(entryPadRef.current.innerHTML);
    };

    const handleMicClick = () => {
        if (!recognitionRef.current) return;
        if (isRecording) {
            stopRecording();
        } else {
            setVoiceOverlayVisible(true);
            setIsRecording(true);
            recognitionRef.current.start();
        }
    };
    
    // This is a manual stop, so we tell the onend handler not to restart
    const stopRecording = () => {
        if (recognitionRef.current) {
            setIsRecording(false); // Set state first to prevent restart
            setVoiceOverlayVisible(false);
            recognitionRef.current.stop();
            setTranscript(''); // Clear transcript on close
        }
    };

    const handleDayClick = (date: Date) => {
        if (isFuture(date)) return;
        setSelectedDate(date);
    };
    
    const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
        setEntryHtml(e.currentTarget.innerHTML);
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

            days.push(
                <div key={i} className={dayClass} onClick={() => handleDayClick(date)}>
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
    
    const isEditable = isToday(selectedDate);


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
                        <div className="entry-pad-container">
                            <div 
                                ref={entryPadRef}
                                className="entry-pad"
                                contentEditable={isEditable}
                                onInput={handleInput}
                                dangerouslySetInnerHTML={{ __html: entryHtml }}
                                suppressContentEditableWarning={true}
                            />
                             {isVoiceOverlayVisible && (
                                <div className="voice-overlay">
                                    <div className="voice-overlay-content">
                                        <p className="voice-listening-text">Listening...</p>
                                        <p className="voice-transcript">{transcript}</p>
                                        <Button onClick={stopRecording} variant="destructive" size="sm" className="mt-4">
                                            Stop
                                        </Button>
                                    </div>
                                </div>
                            )}
                            {warningMessage && (
                                <div className="entry-pad-overlay">
                                    {warningMessage}
                                </div>
                            )}
                        </div>

                        <div className="flex items-center justify-end mt-auto gap-4">
                            {isEditable && (
                                <button
                                    onClick={handleMicClick}
                                    className={`mic-button ${isRecording ? 'recording' : ''}`}
                                    title={isRecording ? 'Stop Recording' : 'Start Recording'}
                                >
                                    <Mic className="w-5 h-5" />
                                </button>
                            )}
                            <button 
                                className="save-button" 
                                ref={saveButtonRef} 
                                onClick={handleSave}
                                disabled={!isEditable || !entryHtml.trim()}
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
                        <div className="fab-option" title="Voice Entry" onClick={handleMicClick}>🎤</div>
                        <div className="fab-option" title="Add Photo/Doodle">📷</div>
                    </div>
                    <div className="fab">+</div>
                </div>
            </div>
        </ScrollArea>
    );
}
