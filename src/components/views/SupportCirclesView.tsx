
"use client";

import React, { useState, useEffect, useRef } from 'react';

// Define the type for a circle
interface Circle {
  name: string;
  tagline: string;
  icon: string;
}

export function SupportCirclesView() {
    const [circles, setCircles] = useState<Circle[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isChatActive, setIsChatActive] = useState(false);
    const [activeCircleName, setActiveCircleName] = useState('');
    const [messages, setMessages] = useState<{ text: string; sender: 'me' | 'other' }[]>([]);

    const nameInputRef = useRef<HTMLInputElement>(null);
    const nameHintRef = useRef<HTMLParagraphElement>(null);
    const categoryChipsRef = useRef<HTMLDivElement>(null);
    const categoryHintRef = useRef<HTMLParagraphElement>(null);
    const privacyToggleRef = useRef<HTMLDivElement>(null);
    const formRef = useRef<HTMLFormElement>(null);
    const createBtnRef = useRef<HTMLButtonElement>(null);
    const modalContentRef = useRef<HTMLDivElement>(null);
    const chatInputRef = useRef<HTMLInputElement>(null);
    const snackbarRef = useRef<HTMLDivElement>(null);


    useEffect(() => {
        // Initial load can have some default circles if needed
        // setCircles([...]);
    }, []);

    const showSnackbar = (message: string) => {
        if (snackbarRef.current) {
            snackbarRef.current.textContent = message;
            snackbarRef.current.classList.add('show');
            setTimeout(() => {
                snackbarRef.current?.classList.remove('show');
            }, 4000);
        }
    };
    
    const handleCategoryClick = (e: React.MouseEvent) => {
        const target = e.target as HTMLDivElement;
        if (target.classList.contains('chip')) {
            const selectedChips = categoryChipsRef.current?.querySelectorAll('.chip.selected') || [];
            const isSelected = target.classList.contains('selected');
            if (!isSelected && selectedChips.length < 2) {
                target.classList.add('selected');
            } else if (isSelected) {
                target.classList.remove('selected');
            }
        }
    };
    
    const handlePrivacyClick = (e: React.MouseEvent) => {
        const target = e.target as HTMLDivElement;
        if (target.classList.contains('privacy-option')) {
            privacyToggleRef.current?.querySelector('.selected')?.classList.remove('selected');
            target.classList.add('selected');
        }
    };

    const validateForm = () => {
        let isValid = true;
        formRef.current?.classList.remove('shake');
        
        // Name validation
        if (nameInputRef.current && nameHintRef.current) {
            if (nameInputRef.current.value.length < 3 || nameInputRef.current.value.length > 25) {
                nameHintRef.current.classList.add('error');
                isValid = false;
            } else {
                nameHintRef.current.classList.remove('error');
            }
        }

        // Category validation
        if (categoryChipsRef.current && categoryHintRef.current) {
            const selectedCategories = categoryChipsRef.current.querySelectorAll('.chip.selected');
            if (selectedCategories.length === 0) {
                categoryHintRef.current.classList.add('error');
                isValid = false;
            } else {
                categoryHintRef.current.classList.remove('error');
            }
        }

        if (!isValid) {
            formRef.current?.classList.add('shake');
        }
        
        return isValid;
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            const btn = createBtnRef.current;
            const btnText = btn?.querySelector('.btn-text');
            const spinner = btn?.querySelector('.loading-spinner');
            
            if (btnText) (btnText as HTMLElement).style.display = 'none';
            if (spinner) (spinner as HTMLElement).style.display = 'block';
            if (btn) btn.disabled = true;

            setTimeout(() => {
                const successCheckmark = modalContentRef.current?.querySelector('.success-checkmark') as SVGElement;
                if (formRef.current) formRef.current.style.display = 'none';
                if (successCheckmark) successCheckmark.style.display = 'block';

                const selectedCategory = categoryChipsRef.current?.querySelector('.chip.selected');
                const newCircleData: Circle = {
                    name: (document.getElementById('circle-name-input') as HTMLInputElement).value,
                    tagline: (document.getElementById('circle-description') as HTMLTextAreaElement).value || "A brand new circle!",
                    icon: selectedCategory?.textContent?.split(' ')[0] || '✨'
                };

                setTimeout(() => {
                    setIsModalOpen(false);
                    setCircles(prev => [...prev, newCircleData]);
                    showSnackbar(`Circle '${newCircleData.name}' created successfully 🎉`);
                    
                    if (btnText) (btnText as HTMLElement).style.display = 'inline';
                    if (spinner) (spinner as HTMLElement).style.display = 'none';
                    if (btn) btn.disabled = false;
                    if (formRef.current) formRef.current.style.display = 'block';
                    if (successCheckmark) successCheckmark.style.display = 'none';
                    formRef.current?.reset();
                     categoryChipsRef.current?.querySelectorAll('.chip.selected').forEach(c => c.classList.remove('selected'));
                }, 2000);
            }, 1500);
        }
    };
    
    const handleSendMessage = () => {
        if (chatInputRef.current && chatInputRef.current.value.trim()) {
            setMessages(prev => [...prev, { text: chatInputRef.current!.value, sender: 'me' }]);
            chatInputRef.current.value = '';
        }
    };

    return (
        <div className="support-circles-body">
            <main id="circle-page" className={isChatActive ? 'hidden' : ''}>
                <h2 className="grid-header">✨ Discover Circles</h2>
                <div className="circle-grid">
                    {circles.length === 0 ? (
                        <p className="empty-state-message">No circles found. Be the first to create one by pressing the ➕ button!</p>
                    ) : (
                        circles.map((circle, index) => (
                            <div className="circle-card" key={index}>
                                <div className="card-header">
                                    <div className="card-icon">{circle.icon}</div>
                                    <div>
                                        <h3 className="circle-name">{circle.name}</h3>
                                        <p className="circle-tagline">{circle.tagline}</p>
                                    </div>
                                </div>
                                <div className="card-footer">
                                    <div className="member-info">
                                        <div className="avatars">
                                            <img src={`https://i.pravatar.cc/30?u=${Math.random()}`} alt="Avatar" data-ai-hint="person avatar" />
                                        </div>
                                        <span className="activity-status">1 active now</span>
                                    </div>
                                    <button className="join-btn" onClick={() => { setActiveCircleName(circle.name); setIsChatActive(true); }}>Join</button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </main>
            
            <div className="create-circle-fab" id="fab-create-circle" onClick={() => setIsModalOpen(true)} style={{ display: isChatActive ? 'none' : 'flex' }}>+</div>

            <div id="create-modal" className={`modal-backdrop ${isModalOpen ? 'active' : ''}`} onClick={(e) => { if (e.target === e.currentTarget) setIsModalOpen(false);}}>
                <div className="modal-content" ref={modalContentRef}>
                    <form id="create-circle-form" noValidate ref={formRef} onSubmit={handleFormSubmit}>
                        <div className="form-step">
                            <label htmlFor="circle-name-input">Circle Name</label>
                            <input type="text" id="circle-name-input" placeholder="e.g., Exam Warriors, Code Buddies" required minLength={3} maxLength={25} ref={nameInputRef} />
                            <p className="validation-hint" id="name-hint" ref={nameHintRef}>Must be 3-25 characters.</p>
                        </div>

                        <div className="form-step">
                            <label>Circle Photo</label>
                            <div className="photo-upload-area">
                                <div className="avatar-placeholder" title="Upload Photo or Pick Emoji">
                                    <div className="camera-icon">📷</div>
                                </div>
                                <p className="text-muted">Upload a photo or pick an emoji/illustration for your circle.</p>
                            </div>
                        </div>

                        <div className="form-step">
                            <label>What’s your circle about?</label>
                            <div className="category-chips" id="category-chips" onClick={handleCategoryClick} ref={categoryChipsRef}>
                                <div className="chip" data-category="studies">📚 Studies</div>
                                <div className="chip" data-category="workouts">🏋️‍♂️ Workouts</div>
                                <div className="chip" data-category="health">💆 Health</div>
                                <div className="chip" data-category="gaming">🎮 Gaming</div>
                                <div className="chip" data-category="career">💼 Career</div>
                                <div className="chip" data-category="other">✨ Other</div>
                            </div>
                            <p className="validation-hint" id="category-hint" ref={categoryHintRef}>Select at least one category (max 2).</p>
                        </div>

                        <div className="form-step">
                            <label htmlFor="circle-description">Description (Optional)</label>
                            <textarea id="circle-description" placeholder="A safe space for NEET aspirants..." maxLength={150}></textarea>
                        </div>

                        <div className="form-step">
                            <label>Privacy Settings</label>
                            <div className="privacy-toggle" id="privacy-toggle" onClick={handlePrivacyClick} ref={privacyToggleRef}>
                                <div className="privacy-option selected" data-value="public" title="Anyone can find and join this circle.">🔓 Public</div>
                                <div className="privacy-option" data-value="private" title="Only users with an invite link can join.">🔒 Private</div>
                            </div>
                        </div>

                        <div className="modal-actions">
                            <button type="button" className="modal-btn btn-cancel" onClick={() => setIsModalOpen(false)}>Cancel</button>
                            <button type="submit" className="modal-btn btn-create" ref={createBtnRef}>
                                <span className="btn-text">Create Circle</span>
                                <div className="loading-spinner"></div>
                            </button>
                        </div>
                    </form>
                    <svg className="success-checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                        <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
                        <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                    </svg>
                </div>
            </div>
            
            <div id="snackbar" ref={snackbarRef} className="snackbar"></div>

            <div className={`chat-container ${isChatActive ? 'active' : ''}`}>
                <div className="chat-header">
                    <span className="back-btn" onClick={() => setIsChatActive(false)}>←</span>
                    <div className="circle-info">
                        <h3 className="circle-name">{activeCircleName}</h3>
                    </div>
                </div>
                <div className="chat-messages">
                    <div className="message">
                        <p>Welcome to the circle!</p>
                    </div>
                    {messages.map((msg, i) => (
                         <div key={i} className={`message ${msg.sender === 'me' ? 'my-message' : ''}`}>
                            <p>{msg.text}</p>
                        </div>
                    ))}
                </div>
                <div className="chat-input-area">
                    <input type="text" placeholder="Type a message..." ref={chatInputRef} onKeyPress={e => e.key === 'Enter' && handleSendMessage()} />
                    <button onClick={handleSendMessage}>↑</button>
                </div>
            </div>
        </div>
    );
}
