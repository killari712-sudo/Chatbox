"use client";

import React, { useState, useEffect, useRef } from 'react';
import type { FC } from 'react';

interface ChallengesViewProps {
  isOpen: boolean;
  onClose: () => void;
}

const challengesData = {
    study: [
        { title: 'Complete 3 Pomodoro cycles', icon: '⏱️' },
        { title: 'Review last week\'s notes', icon: '📓' },
        { title: 'Learn 5 new vocabulary words', icon: '🗣️' },
    ],
    wellness: [
        { title: 'Meditate for 10 minutes', icon: '🧘' },
        { title: 'Go for a 15-minute walk', icon: '🚶' },
        { title: 'Stretch your body for 5 minutes', icon: '🤸' },
    ],
    lifestyle: [
        { title: 'Drink 8 glasses of water', icon: '💧' },
        { title: 'Tidy up your workspace', icon: '🧹' },
        { title: 'Plan your meals for tomorrow', icon: '🥗' },
    ]
};

type Challenge = {
    title: string;
    icon: string;
};

export const ChallengesView: FC<ChallengesViewProps> = ({ isOpen, onClose }) => {
    const [currentChallenges, setCurrentChallenges] = useState<Challenge[]>([]);
    const [acceptedCount, setAcceptedCount] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const [activeCategory, setActiveCategory] = useState('all');

    const deckRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);
    const activeCard = useRef<HTMLDivElement | null>(null);
    const startX = useRef(0);
    const startY = useRef(0);

    const getChallengesForCategory = (category: string): Challenge[] => {
        if (category === 'all') {
            return ([] as Challenge[]).concat(...Object.values(challengesData));
        }
        return challengesData[category as keyof typeof challengesData] || [];
    };
    
    const renderDeck = (category = 'all') => {
        const newChallenges = getChallengesForCategory(category).sort(() => Math.random() - 0.5);
        setCurrentChallenges(newChallenges);
        setTotalCount(newChallenges.length);
        setAcceptedCount(0);
    };

    useEffect(() => {
        renderDeck('all');
    }, []);

    const updateCardStack = () => {
        if (!deckRef.current) return;
        const cards = deckRef.current.querySelectorAll('.challenge-card:not(.removing)');
        cards.forEach((card, index) => {
            (card as HTMLElement).style.setProperty('--index', index.toString());
            (card as HTMLElement).style.zIndex = (cards.length - index).toString();
        });
    };

    useEffect(() => {
        updateCardStack();
    }, [currentChallenges]);

    const updateProgress = () => {
        const percentage = totalCount > 0 ? (acceptedCount / totalCount) * 100 : 0;
        const progressBar = document.getElementById('progress-bar-fg');
        if (progressBar) {
            progressBar.style.width = `${percentage}%`;
        }
    };
    
    useEffect(() => {
      updateProgress();
    }, [acceptedCount, totalCount]);

    const showXPFloater = () => {
        if (!deckRef.current) return;
        const xpText = document.createElement('div');
        xpText.classList.add('xp-floater');
        xpText.textContent = '+10 XP';
        deckRef.current.appendChild(xpText);
        xpText.addEventListener('animationend', () => xpText.remove());
    };

    const processDecision = (action: 'accept' | 'skip') => {
        const newChallenges = [...currentChallenges];
        const cardData = newChallenges.pop();
        if (!cardData) return;

        setCurrentChallenges(newChallenges);
        
        if (action === 'accept') {
            setAcceptedCount(prev => prev + 1);
            showXPFloater();
        }
    };
    
    const handleTabClick = (category: string) => {
        setActiveCategory(category);
        renderDeck(category);
    };

    if (!isOpen) return null;

    return (
        <div className={`challenges-modal-overlay ${isOpen ? 'active' : ''}`} onClick={onClose}>
            <div className={`challenges-modal-container ${isOpen ? 'active' : ''}`} onClick={(e) => e.stopPropagation()}>
                <div className="challenges-modal-content">
                    <header className="top-bar">
                        <h1 className="title">Daily Challenges</h1>
                        <div className="close-btn" onClick={onClose}>&times;</div>
                    </header>

                    <div className="category-tabs">
                        <button className={`tab ${activeCategory === 'all' ? 'active' : ''}`} onClick={() => handleTabClick('all')}>All</button>
                        <button className={`tab ${activeCategory === 'study' ? 'active' : ''}`} onClick={() => handleTabClick('study')}>📖</button>
                        <button className={`tab ${activeCategory === 'wellness' ? 'active' : ''}`} onClick={() => handleTabClick('wellness')}>🧘</button>
                        <button className={`tab ${activeCategory === 'lifestyle' ? 'active' : ''}`} onClick={() => handleTabClick('lifestyle')}>🌱</button>
                    </div>

                    <main id="challenge-deck" className="challenge-deck" ref={deckRef}>
                        {currentChallenges.map((challenge, index) => (
                             <div 
                                key={challenge.title + index} 
                                className="challenge-card"
                                style={{
                                    '--index': currentChallenges.length - 1 - index,
                                    zIndex: 10 - (currentChallenges.length - 1 - index)
                                } as React.CSSProperties}
                             >
                                <div className="card-icon">{challenge.icon}</div>
                                <h2 className="card-title">{challenge.title}</h2>
                            </div>
                        )).reverse()}
                    </main>
                    
                    <div className="action-buttons">
                        <button id="reject-btn" className="action-btn" onClick={() => processDecision('skip')}>&times;</button>
                        <button id="accept-btn" className="action-btn" onClick={() => processDecision('accept')}>&#10003;</button>
                    </div>

                    <footer className="bottom-section">
                        <div className="progress-container">
                            <p id="progress-label" className="progress-label">{acceptedCount}/{totalCount} Challenges Done ✅</p>
                            <div className="progress-bar-bg">
                                <div id="progress-bar-fg" className="progress-bar-fg" style={{ width: `${totalCount > 0 ? (acceptedCount / totalCount) * 100 : 0}%` }}></div>
                            </div>
                        </div>
                    </footer>
                </div>
            </div>
