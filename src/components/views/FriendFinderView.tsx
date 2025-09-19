
"use client";

import React, { useEffect } from 'react';
import { SupportCirclesView } from './SupportCirclesView';

export function FriendFinderView() {
    useEffect(() => {
        const modal = document.getElementById('addFriendModal') as HTMLElement;
        const plusBtn = document.querySelector('.add-btn') as HTMLElement;
        const closeBtn = document.querySelector('.friend-finder-modal-close-btn') as HTMLElement;
        const getStartedBtn = document.getElementById('getStartedBtn') as HTMLElement;
        const friendFinderSection = document.getElementById('friend-finder') as HTMLElement;
        const interestsContainer = document.getElementById('interests-container') as HTMLElement;

        let selectedInterests: string[] = [];

        if (plusBtn) {
            plusBtn.onclick = function () {
                if(modal) modal.style.display = 'flex';
            }
        }
        
        if (closeBtn) {
            closeBtn.onclick = function() {
                if(modal) modal.style.display = "none";
            }
        }

        window.onclick = function(event) {
            if (event.target == modal) {
                if(modal) modal.style.display = "none";
            }
        }
        
        if (interestsContainer) {
            interestsContainer.addEventListener('click', function(e) {
                const target = e.target as HTMLElement;
                if (target.classList.contains('interest-tag')) {
                    target.classList.toggle('selected');
                    const interest = target.getAttribute('data-interest');
                    if(interest) {
                        if (target.classList.contains('selected')) {
                            selectedInterests.push(interest);
                        } else {
                            selectedInterests = selectedInterests.filter(item => item !== interest);
                        }
                    }
                }
            });
        }

        if (getStartedBtn) {
            getStartedBtn.onclick = function() {
                if (modal) modal.style.display = "none";
                displayFoundFriends(selectedInterests);
            }
        }

        const tabButtons = document.querySelectorAll('.tab-btn');
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabId = button.getAttribute('data-tab');
                if (tabId) showTab(tabId);
            });
        });
        
        function showTab(tabId: string) {
            const sections = document.querySelectorAll('.content-section');
            sections.forEach(section => {
                section.classList.remove('active');
            });
            const tabs = document.querySelectorAll('.tab-btn');
            tabs.forEach(tab => {
                tab.classList.remove('active');
            });
            const activeSection = document.getElementById(tabId);
            if (activeSection) {
                activeSection.classList.add('active');
            }
            const activeTab = document.querySelector(`.tab-btn[data-tab='${tabId}']`);
            if (activeTab) {
                activeTab.classList.add('active');
            }
        }
        
        function displayFoundFriends(interests: string[]) {
            if (!friendFinderSection) return;

            friendFinderSection.innerHTML = '';
            const allFriends = [
                { name: 'Chloe', bio: 'Loves to read and cook new recipes.', hashtags: '#Reading #Cooking', commonInterests: ['Reading', 'Cooking'] },
                { name: 'Ethan', bio: 'A true gym fanatic who also loves hiking.', hashtags: '#Gym #Hiking', commonInterests: ['Gym workouts', 'Hiking'] },
                { name: 'Sophia', bio: 'Enjoys photography and yoga for wellness.', hashtags: '#Photography #Yoga', commonInterests: ['Photography', 'Yoga'] },
                { name: 'Liam', bio: 'Into gaming and exploring new restaurants.', hashtags: '#Gaming #Food', commonInterests: ['Gaming', 'Food Exploring'] },
                { name: 'Olivia', bio: 'Loves music and planning road trips.', hashtags: '#Music #Travel', commonInterests: ['Music', 'Road Trips'] },
                { name: 'Noah', bio: 'Spends weekends hiking and watching movies.', hashtags: '#Hiking #Movies', commonInterests: ['Hiking', 'Movies'] }
            ];
    
            const matchedFriends = allFriends.map(friend => {
                const score = friend.commonInterests.filter(interest => interests.includes(interest)).length;
                const matchPercentage = (interests.length > 0) ? Math.round((score / interests.length) * 100) : 0;
                return { ...friend, match: `${matchPercentage}%`, score: score };
            }).filter(friend => friend.score > 0)
              .sort((a, b) => b.score - a.score);
    
            if (matchedFriends.length === 0) {
                friendFinderSection.innerHTML = `
                    <div class="empty-state">
                        <p>No matches found with your selected interests.</p>
                        <p>Try selecting a few more tags to broaden your search!</p>
                        <button class="cta-btn" onclick="document.getElementById('addFriendModal').style.display='flex'">Select More Interests</button>
                    </div>
                `;
            } else {
                const cardGrid = document.createElement('div');
                cardGrid.classList.add('card-grid');
    
                matchedFriends.forEach(friend => {
                    const card = document.createElement('div');
                    card.classList.add('finder-card');
                    card.innerHTML = `
                        <div class="card-header">
                            <div class="avatar">${friend.name.charAt(0)}</div>
                            <div>
                                <h3>${friend.name}</h3>
                                <div class="badge">${friend.match} Match</div>
                            </div>
                        </div>
                        <div class="bio">${friend.bio}</div>
                        <div class="hashtags">${friend.hashtags}</div>
                        <button class="connect-btn">Connect</button>
                    `;
                    cardGrid.appendChild(card);
                });
                friendFinderSection.appendChild(cardGrid);
            }
            showTab('friend-finder');
        }

        const createPodCta = document.querySelector("#pods-groups .cta-btn") as HTMLElement;
        if(createPodCta) {
          createPodCta.onclick = () => {
             alert("Creating a new pod!");
          }
        }
    }, []);

    return (
        <div className="friend-finder-body">
            <div className="app-container">
                <div className="top-bar">
                    <h1>Friends & Finder 👫</h1>
                    <div className="top-bar-right">
                        <button className="icon-btn">🔍</button>
                        <button className="add-btn">+</button>
                        <button className="icon-btn">⚙</button>
                    </div>
                </div>

                <div className="main-content">
                    <div className="left-section">
                        <div className="tabs">
                            <button className="tab-btn active" data-tab="friends-dashboard">Friends Dashboard</button>
                            <button className="tab-btn" data-tab="friend-finder">Friend Finder</button>
                            <button className="tab-btn" data-tab="pods-groups">Pods & Groups</button>
                        </div>

                        <div id="friends-dashboard" className="content-section active">
                            <div className="empty-state">
                                <p>It looks like you havent added any friends yet.</p>
                                <p>Go to the Friend Finder to start making connections!</p>
                                <button className="cta-btn" onClick={() => document.querySelector<HTMLButtonElement>('.tab-btn[data-tab="friend-finder"]')?.click()}>Find Friends Now</button>
                            </div>
                        </div>

                        <div id="friend-finder" className="content-section">
                            <div className="empty-state">
                                <p>AI will suggest relevant connections here.</p>
                                <p>Start logging your habits and moods to get personalized matches!</p>
                                <button className="cta-btn">Start My Journey</button>
                            </div>
                        </div>

                        <div id="pods-groups" className="content-section">
                           <SupportCirclesView />
                        </div>
                    </div>

                    <div className="right-sidebar">
                        <div className="sidebar-section">
                            <h4>Activity Feed</h4>
                            <div className="activity-feed-item">🎯 Aisha completed 3 challenges</div>
                            <div className="activity-feed-item">📖 John studied for 2 hours with Buddy Room</div>
                            <div className="activity-feed-item">🧘 Sarah joined the Morning Meditation Pod</div>
                        </div>
                        <div className="sidebar-section">
                            <h4>Smart Tools</h4>
                            <div className="smart-tool-item">🤝 Volunteer / Mentor Matching</div>
                            <div className="smart-tool-item">🎧 Study Buddy Match (Pomodoro)</div>
                            <div className="smart-tool-item">🎮 Challenge Together</div>
                        </div>
                        <div className="sidebar-section">
                            <h4>Mood Radar</h4>
                            <div className="mood-radar">
                                <span>😊</span>
                                <span>😐</span>
                                <span>😢</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div id="addFriendModal" className="friend-finder-modal">
                <div className="friend-finder-modal-content">
                    <span className="friend-finder-modal-close-btn">&times;</span>
                    <h2>Find Your Match</h2>
                    <p>What are your interests? Select all that apply.</p>

                    <div id="interests-container" className="interests-container">
                        <span className="interest-tag" data-interest="Reading">Reading 📚</span>
                        <span className="interest-tag" data-interest="Cooking">Cooking 🍳</span>
                        <span className="interest-tag" data-interest="Photography">Photography 📷</span>
                        
                        <span className="interest-tag" data-interest="Gym workouts">Gym workouts 💪</span>
                        <span className="interest-tag" data-interest="Yoga">Yoga 🧘</span>
                        <span className="interest-tag" data-interest="Hiking">Hiking ⛰</span>
                        
                        <span className="interest-tag" data-interest="Gaming">Gaming 🎮</span>
                        <span className="interest-tag" data-interest="Movies">Movies 🎬</span>
                        <span className="interest-tag" data-interest="Music">Music 🎵</span>
                        
                        <span className="interest-tag" data-interest="Food Exploring">Food Exploring 🍔</span>
                        <span className="interest-tag" data-interest="Road Trips">Road Trips 🚗</span>
                    </div>
                    <button id="getStartedBtn" className="cta-btn empty-state-cta-btn">Get Started</button>
                </div>
            </div>
        </div>
    );
}
