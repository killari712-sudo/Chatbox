
"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Mic, Brain } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getSummary } from "@/app/actions";


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

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [entryHtml, setEntryHtml] = useState('');
    const [allEntries, setAllEntries] = useState<AllEntries>({});
    const [isRecording, setIsRecording] = useState(false);
    const [warningMessage, setWarningMessage] = useState('');
    const [isVoicePopupVisible, setVoicePopupVisible] = useState(false);
    const [isSummarizing, setIsSummarizing] = useState(false);
    
    // This effect should run only once to set up speech recognition
    useEffect(() => {
        const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognitionAPI) {
          recognitionRef.current = new SpeechRecognitionAPI();
          const recognition = recognitionRef.current;
          recognition.continuous = true;
          recognition.interimResults = true;
          // Not setting `lang` makes it auto-detect the language
    
          recognition.onresult = (event) => {
            let finalTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                }
            }

            if(finalTranscript && entryPadRef.current) {
                // Append the new transcript with a space
                entryPadRef.current.innerHTML += finalTranscript + ' ';
                // Manually trigger the input event to update state
                const event = new Event('input', { bubbles: true, cancelable: true });
                entryPadRef.current.dispatchEvent(event);
            }
          };
          
          recognition.onend = () => {
             // The onend event can fire unexpectedly. Only stop if it wasn't a manual stop.
             if (isRecording) {
                recognition.start();
             }
          };

          recognition.onerror = (event) => {
            console.error('Speech recognition error', event.error);
            setIsRecording(false);
            setVoicePopupVisible(false);
          };

        } else {
            console.warn("Speech Recognition not supported in this browser.");
        }
    }, []); // Empty dependency array ensures this runs only once.


    // Load entries from localStorage on initial render
    useEffect(() => {
        try {
            const savedEntries = localStorage.getItem('diaryEntries');
            if (savedEntries) {
                setAllEntries(JSON.parse(savedEntries));
            }
        } catch (error) {
            console.error("Failed to parse diary entries from localStorage", error);
        }
    }, []);


    // Update view when selectedDate or allEntries change
    useEffect(() => {
        const dateKey = selectedDate.toDateString();
        const entry = allEntries[dateKey];
        const newHtml = entry?.text || '';
        setEntryHtml(newHtml);
        if (entryPadRef.current) {
            entryPadRef.current.innerHTML = newHtml;
        }

        if (!entry && isPast(selectedDate)) {
            const dateString = selectedDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
            const warning = `⚠️ Warning: No data saved on ${dateString}.`;
            setWarningMessage(warning);
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
        handleInput({ currentTarget: entryPadRef.current } as React.FormEvent<HTMLDivElement>);
    };

    const handleMicClick = () => {
        if (!recognitionRef.current) return;

        if (isRecording) {
            stopRecording();
        } else {
            setIsRecording(true);
            setVoicePopupVisible(true);
            recognitionRef.current.start();
        }
    };
    
    const stopRecording = () => {
        if (recognitionRef.current) {
            setIsRecording(false); 
            setVoicePopupVisible(false);
            recognitionRef.current.stop();
        }
    };

    const handleDayClick = (date: Date) => {
        if (isFuture(date)) return;
        setSelectedDate(date);
    };
    
    const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
        setEntryHtml(e.currentTarget.innerHTML);
    };

    const handleSummarize = async () => {
        if (!entryPadRef.current || !entryHtml.trim() || isSummarizing) return;
        setIsSummarizing(true);
        const textToSummarize = entryPadRef.current.innerText; // Use innerText to get clean text without HTML
        try {
            const result = await getSummary(textToSummarize);

            if (result.summary && entryPadRef.current) {
                const summaryHtml = `<p>${result.summary}</p>`;
                entryPadRef.current.innerHTML = summaryHtml;
                setEntryHtml(summaryHtml);
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
                             <button onClick={handleSummarize} disabled={isSummarizing || !isEditable} className="disabled:opacity-50 disabled:cursor-not-allowed hover:text-[--glow-color] transition-colors">
                                <Brain size={18} className={isSummarizing ? 'animate-pulse' : ''}/>
                            </button>
                        </div>
                        <div className="entry-pad-container">
                            <div 
                                ref={entryPadRef}
                                className="entry-pad"
                                contentEditable={isEditable}
                                onInput={handleInput}
                                suppressContentEditableWarning={true}
                            />
                            {isVoicePopupVisible && (
                                <div className={`voice-popup ${isVoicePopupVisible ? 'visible' : ''}`}>
                                    <p className="voice-popup-text">🎤 Listening...</p>
                                    <button onClick={stopRecording} className="voice-popup-stop-button">
                                        Stop
                                    </button>
                                </div>
                            )}
                            {warningMessage && !isEditable && (
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
                                    disabled={!isEditable}
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
