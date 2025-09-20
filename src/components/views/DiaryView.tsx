
"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Mic } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

// Define the interface for the SpeechRecognition API
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


export function DiaryView() {
  const entryAreaCardRef = useRef<HTMLDivElement>(null);
  const saveButtonRef = useRef<HTMLButtonElement>(null);
  const entryPadRef = useRef<HTMLTextAreaElement>(null);
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    const dateSubtext = document.getElementById('date-subtext');
    const now = new Date();
    if (dateSubtext) {
      dateSubtext.textContent = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    }

    const moodEmojis = document.getElementById('mood-emojis');
    const handleMoodClick = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains('mood-emoji')) {
        const parent = target.parentElement;
        if (parent) {
          [...parent.children].forEach(sib => sib.classList.remove('selected'));
        }
        target.classList.add('selected');
      }
    };
    moodEmojis?.addEventListener('click', handleMoodClick);

    const promptsList = document.getElementById('prompts-list');
    const handlePromptClick = (e: Event) => {
        const target = e.target as HTMLElement;
        if (target.tagName === 'LI' && entryPadRef.current) {
            const currentText = entryPadRef.current.value;
            const promptText = target.textContent || '';
            entryPadRef.current.value = currentText ? `${currentText}\n\n${promptText}\n` : `${promptText}\n`;
            entryPadRef.current.focus();
        }
    };
    promptsList?.addEventListener('click', handlePromptClick);
    
    const calendarGrid = document.getElementById('calendar-grid');
    const calendarTitle = document.getElementById('calendar-title');
    const today = now.getDate();
    const month = now.getMonth();
    const year = now.getFullYear();

    if (calendarTitle) {
        calendarTitle.textContent = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayIndex = new Date(year, month, 1).getDay();
    const entries: { [key: string]: string } = { '3': 'blue', '8': 'yellow', '15': 'red', '17': 'blue' };

    if (calendarGrid) {
        calendarGrid.innerHTML = '';
        ['S','M','T','W','T','F','S'].forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.className = 'day-header';
            dayHeader.textContent = day;
            calendarGrid.appendChild(dayHeader);
        });

        for (let i = 0; i < firstDayIndex; i++) {
            calendarGrid.appendChild(document.createElement('div'));
        }
        
        for (let i = 1; i <= daysInMonth; i++) {
            const dayCell = document.createElement('div');
            dayCell.className = 'calendar-day';
            dayCell.textContent = i.toString();
            if (i === today) {
                dayCell.classList.add('today');
            }
            if (entries[i]) {
                const dot = document.createElement('div');
                dot.className = 'mood-dot';
                dot.style.backgroundColor = `var(--mood-${entries[i]})`;
                dayCell.appendChild(dot);
                dayCell.title = `Entry recorded with a ${entries[i]} mood.`;
            }
            calendarGrid.appendChild(dayCell);
        }
    }

    const saveButton = saveButtonRef.current;
    const entryAreaCard = entryAreaCardRef.current;
    
    const handleSaveClick = () => {
        if (!saveButton || !entryAreaCard) return;

        const confettiCount = 50;
        for (let i = 0; i < confettiCount; i++) {
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

            setTimeout(() => {
                confettiPiece.remove();
            }, 3000);
        }
    };
    saveButton?.addEventListener('click', handleSaveClick);

    // Speech Recognition Setup
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

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
        if (entryPadRef.current) {
            const start = entryPadRef.current.selectionStart;
            const end = entryPadRef.current.selectionEnd;
            const text = entryPadRef.current.value;
            entryPadRef.current.value = text.slice(0, start) + finalTranscript + interimTranscript + text.slice(end);
        }
      };
      
      recognitionRef.current.onend = () => {
        if(isRecording){
            recognitionRef.current?.start();
        }
      };
    }


    return () => {
        moodEmojis?.removeEventListener('click', handleMoodClick);
        promptsList?.removeEventListener('click', handlePromptClick);
        saveButton?.removeEventListener('click', handleSaveClick);
        recognitionRef.current?.stop();
    };
  }, [isRecording]);

  const handleMicClick = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      recognitionRef.current?.start();
      setIsRecording(true);
    }
  };

  return (
    <ScrollArea className="h-full">
      <div className='diary-body-styles'>
        <header className="header">
          <h1 className="header-title">📓 Digital Diary</h1>
          <p className="header-subtext" id="date-subtext"></p>
        </header>

        <main className="dashboard-grid">
          <section className="card mood-tracker">
              <h2 className="card-title">How are you feeling today?</h2>
              <div className="mood-emojis" id="mood-emojis">
                  <span className="mood-emoji">🙂</span>
                  <span className="mood-emoji">😐</span>
                  <span className="mood-emoji">😢</span>
                  <span className="mood-emoji">😍</span>
                  <span className="mood-emoji">❤️</span>
              </div>
          </section>

          <section className="card daily-prompts">
              <h2 className="card-title">Daily Prompts</h2>
              <ul className="prompts-list" id="prompts-list">
                  <li>What made you smile today?</li>
                  <li>One challenge you faced?</li>
                  <li>What are you grateful for?</li>
                  <li>A small, happy moment from today…</li>
                  <li>What’s on your mind right now?</li>
              </ul>
              <button className="trends-button">📊 View Mood Trends</button>
          </section>

          <section className="card entry-area" id="entry-area-card" ref={entryAreaCardRef}>
              <div className="entry-toolbar">
                  <span>🧠</span><span>💡</span><span>#️⃣</span>
              </div>
              <textarea className="entry-pad" id="entry-pad" ref={entryPadRef} placeholder="You didn’t write an entry on this day. Click to start."></textarea>
              <div className="flex items-center justify-end mt-auto gap-4">
                <button
                    onClick={handleMicClick}
                    className={`mic-button ${isRecording ? 'recording' : ''}`}
                    title={isRecording ? 'Stop Recording' : 'Start Recording'}
                >
                    <Mic className="w-5 h-5" />
                </button>
                <button className="save-button" id="save-button" ref={saveButtonRef}>Save</button>
              </div>
          </section>

          <section className="card calendar-timeline">
              <h2 className="card-title" id="calendar-title"></h2>
              <div className="calendar-grid" id="calendar-grid">
              </div>
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

  