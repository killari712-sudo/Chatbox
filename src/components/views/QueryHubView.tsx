
"use client";
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { sanitizeHtml } from '@/lib/sanitize';

export function QueryHubView() {
    const { user } = useAuth();
    const [queries, setQueries] = useState<any[]>([]);

    useEffect(() => {
        // Load queries from localStorage on initial render
        try {
            const savedQueries = localStorage.getItem('queryHubQueries');
            if (savedQueries) {
                setQueries(JSON.parse(savedQueries));
            }
        } catch (error) {
            console.error("Failed to parse queries from localStorage", error);
            localStorage.removeItem('queryHubQueries');
        }
    }, []);

    useEffect(() => {
        const queryFeed = document.getElementById('query-feed');
        const newQueryModal = document.getElementById('new-query-modal');
        const queryExpandedModal = document.getElementById('query-expanded-modal');
        const askButton = document.getElementById('ask-button');
        const newQueryForm = document.getElementById('new-query-form');
        const crisisOverlay = document.getElementById('crisis-overlay');
        const expandedQueryContent = document.getElementById('expanded-query-content');

        const moodEmojis: { [key: string]: string } = {
            'anxious': '😥', 'stressed': '😰', 'sad': '😔', 'happy': '😊'
        };

        const userBadges: { [key: string]: string } = {
            'Student': '🧑‍🎓 Student',
            'Alumni': '🎓 Alumni',
            'Mentor': '🧑‍🏫 Mentor',
            'Counselor': '🧑‍⚕️ Counselor'
        };

        const crisisWords = ['suicide', 'panic attack', 'depressed', 'end it', 'give up', 'hopeless'];

        function showModal(id: string) {
            const modal = document.getElementById(id);
            if (modal) {
                modal.classList.remove('hidden');
                document.body.style.overflow = 'hidden';
            }
        }

        function hideModal(id: string) {
            const modal = document.getElementById(id);
            if (modal) {
                modal.classList.add('hidden');
                document.body.style.overflow = '';
            }
        }

        function showCrisisOverlay() {
            if(crisisOverlay) {
                crisisOverlay.classList.remove('hidden');
                document.body.style.overflow = 'hidden';
            }
        }

        (window as any).hideCrisisOverlay = () => {
             if(crisisOverlay) {
                crisisOverlay.classList.add('hidden');
                document.body.style.overflow = '';
            }
        };

        function renderQueryCard(query: any) {
            const card = document.createElement('div');
            card.className = 'frosted-card p-6 rounded-2xl flex flex-col space-y-4 cursor-pointer hover:border-gray-500 transition-colors fade-slide-up';
            card.onclick = () => showExpandedView(query);

            const userType = query.isAnonymous ? 'Anonymous' : query.user;
            const badgeClass = `badge badge-${query.type.toLowerCase()}`;
            const badgeContent = userBadges[query.type];
            const profileIcon = query.isAnonymous ? '🤫' : '👤';
            
            const cardHeader = document.createElement('div');
            cardHeader.className = "flex items-center space-x-3";
            cardHeader.innerHTML = `
                <div class="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-xl">
                    ${profileIcon}
                </div>
                <div class="flex-1">
                    <div class="flex items-center space-x-2">
                        <span class="font-semibold text-gray-800">${userType}</span>
                        <span class="${badgeClass}">${badgeContent}</span>
                        ${query.verified ? '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-green-500 lucide lucide-shield-check"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>' : ''}
                    </div>
                    <div class="text-sm text-gray-500 flex items-center space-x-2">
                        <span>${query.time}</span>
                        ${query.mood ? `<span class="text-xl ml-2" title="Feeling ${query.mood}">${moodEmojis[query.mood]}</span>` : ''}
                    </div>
                </div>
            `;

            const cardBody = document.createElement('div');
            cardBody.className = "flex-1";
            const title = document.createElement('h2');
            title.className = "text-xl font-bold text-gray-800 mb-2";
            title.textContent = query.title;
            const description = document.createElement('p');
            description.className = "text-gray-600 line-clamp-2";
            description.innerHTML = sanitizeHtml(query.description);
            cardBody.append(title, description);

            const tagsContainer = document.createElement('div');
            tagsContainer.className = "flex flex-wrap gap-2 text-xs text-gray-500";
            tagsContainer.innerHTML = query.tags.map((tag: string) => `<span class="bg-gray-200 px-2 py-1 rounded-full">${tag}</span>`).join('');
            
            const cardFooter = document.createElement('div');
            cardFooter.className = "flex items-center justify-between text-sm text-gray-500";
            cardFooter.innerHTML = `
                <div class="flex items-center space-x-4">
                    <span class="flex items-center space-x-1"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg><span>${query.views}</span></span>
                    <span class="flex items-center space-x-1"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-message-square"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg><span>${query.replies}</span></span>
                    <button class="upvote-btn flex items-center space-x-1 hover:text-gray-800 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-star"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                        <span class="upvote-count">${query.upvotes}</span>
                    </button>
                </div>
                <div class="flex items-center space-x-3">
                    <button class="hover:text-gray-800"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bookmark"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg></button>
                    <button class="hover:text-gray-800"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-share-2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/></svg></button>
                    <button class="hover:text-gray-800"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-flag"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" x2="4" y1="22" y2="15"/></svg></button>
                </div>
            `;
            
            card.append(cardHeader, cardBody, tagsContainer, cardFooter);
            return card;
        }

        function showExpandedView(query: any) {
            if (!expandedQueryContent) return;
            expandedQueryContent.innerHTML = ''; // Clear previous content

            const header = document.createElement('div');
            header.className = "flex items-start space-x-4 mb-6";
            header.innerHTML = `
                <div class="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-2xl">
                    ${query.isAnonymous ? '🤫' : '👤'}
                </div>
                <div class="flex-1">
                    <div class="flex items-center space-x-2 mb-1">
                        <span class="text-xl font-bold">${query.isAnonymous ? 'Anonymous' : query.user}</span>
                        <span class="badge badge-${query.type.toLowerCase()}">${userBadges[query.type]}</span>
                    </div>
                </div>
            `;

            const title = document.createElement('h2');
            title.className = "text-3xl font-bold text-gray-800 mb-2";
            title.textContent = query.title;

            const description = document.createElement('p');
            description.className = "text-gray-700 text-lg";
            description.innerHTML = sanitizeHtml(query.description);

            const tags = document.createElement('div');
            tags.className = "flex flex-wrap gap-2 text-xs text-gray-500 mt-2";
            tags.innerHTML = query.tags.map((tag: string) => `<span class="bg-gray-200 px-2 py-1 rounded-full">${tag}</span>`).join('');
            
            header.querySelector('.flex-1')?.append(title, description, tags);

            const repliesHeader = document.createElement('h3');
            repliesHeader.className = "text-xl font-semibold mb-4";
            repliesHeader.textContent = `Replies (${query.replies})`;

            const repliesContainer = document.createElement('div');
            repliesContainer.className = "space-y-4";
            repliesContainer.id = "replies-container";
            
            if (query.repliesData?.length > 0) {
                 query.repliesData.forEach((reply: any) => {
                    const isCounselor = reply.type === 'Counselor';
                    const isMentor = reply.type === 'Mentor' || reply.type === 'Alumni';
                    
                    const replyEl = document.createElement('div');
                    replyEl.className = `p-4 rounded-xl frosted-card ${isCounselor ? 'counselor-reply' : ''} ${isMentor ? 'mentor-reply' : ''}`;

                    const replyHeader = document.createElement('div');
                    replyHeader.className = 'flex items-center space-x-2 mb-2';
                    replyHeader.innerHTML = `
                        <span class="font-semibold text-gray-800">${reply.user}</span>
                        <span class="badge badge-${reply.type.toLowerCase()}">${userBadges[reply.type]}</span>
                        ${reply.verified ? '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-green-500 lucide lucide-shield-check"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>' : ''}
                    `;

                    const replyText = document.createElement('p');
                    replyText.className = "text-gray-700";
                    replyText.innerHTML = sanitizeHtml(reply.text);

                    const replyFooter = document.createElement('div');
                    replyFooter.className = 'flex items-center space-x-2 text-sm text-gray-500 mt-2';
                    replyFooter.innerHTML = `
                        <button class="upvote-btn hover:text-gray-800"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-star"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> <span class="upvote-count">${reply.upvotes}</span></button>
                    `;
                    
                    replyEl.appendChild(replyHeader);
                    replyEl.appendChild(replyText);
                    replyEl.appendChild(replyFooter);
                    repliesContainer.appendChild(replyEl);
                });
            } else {
                repliesContainer.innerHTML = '<p class="text-gray-500">No replies yet. Be the first to respond!</p>';
            }

            expandedQueryContent.append(header, repliesHeader, repliesContainer);
            showModal('query-expanded-modal');
        }

        askButton?.addEventListener('click', () => {
            if (user) {
                showModal('new-query-modal');
            } else {
                alert("Please sign in to ask a question.");
            }
        });

        const handleFormSubmit = (e: Event) => {
            e.preventDefault();
            if (!user) {
                alert("You must be logged in to post.");
                return;
            }
            const description = (document.getElementById('query-description') as HTMLTextAreaElement).value;
            const isCrisis = crisisWords.some(word => description.toLowerCase().includes(word));
            
            if (isCrisis) {
                hideModal('new-query-modal');
                showCrisisOverlay();
            } else {
                const newQuery = {
                    id: `q${queries.length + 1}`,
                    title: (document.getElementById('query-title') as HTMLInputElement).value,
                    description: description,
                    user: user.displayName || 'User',
                    type: 'Student',
                    views: 0,
                    replies: 0,
                    upvotes: 0,
                    time: 'Just now',
                    tags: (document.getElementById('query-tags') as HTMLInputElement).value.split(',').map(tag => tag.trim()),
                    isAnonymous: (document.getElementById('post-anonymous') as HTMLInputElement).checked,
                    repliesData: []
                };
                
                const updatedQueries = [newQuery, ...queries];
                setQueries(updatedQueries);
                localStorage.setItem('queryHubQueries', JSON.stringify(updatedQueries));

                hideModal('new-query-modal');
                 if(newQueryForm) {
                    (newQueryForm as HTMLFormElement).reset();
                 }
            }
        };

        newQueryForm?.addEventListener('submit', handleFormSubmit);

        function renderQueries(queriesToRender: any[]) {
            if (!queryFeed) return;
            queryFeed.innerHTML = '';
            if (queriesToRender.length === 0) {
                queryFeed.innerHTML = `<div class="text-center py-16">
                    <p class="text-gray-500 text-xl">No queries yet.</p>
                    <p class="text-gray-400 mt-2">Be the first one to ask a question!</p>
                </div>`;
            } else {
                queriesToRender.forEach(query => {
                    queryFeed.appendChild(renderQueryCard(query));
                });
            }
        }

        function renderHashtags() {
            const hashtagCloud = document.getElementById('hashtag-cloud');
            if(!hashtagCloud) return;
            const popularTags = ['#ExamStress', '#Focus', '#Sleep', '#Anxiety', '#SocialLife', '#Relationships', '#MentalHealth', '#Future'];
            hashtagCloud.innerHTML = popularTags.map(tag => `<span class="bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-xs hover:bg-gray-300 cursor-pointer">${tag}</span>`).join('');
        }
        
        document.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            if (target.closest('.upvote-btn')) {
                const btn = target.closest('.upvote-btn');
                if (btn) {
                    const countSpan = btn.querySelector('.upvote-count');
                    if (countSpan) {
                        let currentCount = parseInt(countSpan.textContent || '0');
                        countSpan.textContent = (currentCount + 1).toString();
                        btn.classList.add('upvote-sparkle');
                        setTimeout(() => btn.classList.remove('upvote-sparkle'), 500);
                    }
                }
            }
        });
        
        (window as any).hideModal = hideModal;

        renderQueries(queries);
        renderHashtags();

        const resizeHandler = () => {
            const isMobile = window.innerWidth <= 768;
            const modal = document.getElementById('query-expanded-modal');
            if(!modal) return;

            const card = modal.querySelector('.frosted-card');
            if(!card) return;

            if (isMobile) {
                modal.classList.add('flex-col', 'items-stretch');
                card.classList.remove('h-full', 'lg:max-h-[90vh]');
                card.classList.add('w-full', 'mt-auto', 'rounded-t-3xl', 'rounded-b-none', 'max-h-[80vh]');
            } else {
                modal.classList.remove('flex-col', 'items-stretch');
                card.classList.add('h-full', 'lg:max-h-[90vh]');
                card.classList.remove('w-full', 'mt-auto', 'rounded-t-3xl', 'rounded-b-none', 'max-h-[80vh]');
            }
        }

        window.addEventListener('resize', resizeHandler);
        
        return () => {
          window.removeEventListener('resize', resizeHandler);
          newQueryForm?.removeEventListener('submit', handleFormSubmit);
        }

    }, [user, queries]);

    return (
        <div className='query-hub-body'>
            <div id="crisis-overlay" className="hidden fixed inset-0 z-[100] bg-red-900 bg-opacity-30 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="frosted-card p-8 rounded-2xl max-w-lg w-full text-center border-red-300">
                    <div className="text-5xl mb-4 animate-bounce">🚨</div>
                    <h2 className="text-3xl font-bold text-red-600 mb-2">We are here for you.</h2>
                    <p className="text-lg text-gray-700 mb-6">We noticed your post may be urgent. Do you want to chat with a counselor right now?</p>
                    <div className="flex flex-col space-y-4">
                        <button className="w-full bg-red-600 text-white font-semibold py-3 px-6 rounded-xl transition-all hover:bg-red-700">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-message-square-heart inline-block mr-2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M17.8 10c-1.5 1.5-3 3-5.8 3-2.8 0-4.3-1.5-5.8-3-1.5-1.5 0-4.5 5.8-4.5 5.8 0 7.3 3 5.8 4.5Z"/></svg> Counselor Chat
                        </button>
                        <button className="w-full bg-gray-400 text-gray-800 font-semibold py-3 px-6 rounded-xl transition-all hover:bg-gray-500">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-phone-call inline-block mr-2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/><path d="M14.05 2a9 9 0 0 1 8 7.94"/><path d="M14.05 6A5 5 0 0 1 18 10"/></svg> SOS Helpline
                        </button>
                        <button className="w-full bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl transition-all hover:bg-blue-700">
                           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-leaf inline-block mr-2"><path d="M11 20A7 7 0 0 1 4 13V8a7.99 7.99 0 0 1 14 0v5a7 7 0 0 1-7 7z"/><path d="M12 18c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z"/></svg> Quick Coping Exercise
                        </button>
                    </div>
                    <button onClick={() => (window as any).hideCrisisOverlay()} className="mt-4 text-sm text-gray-500 hover:text-gray-600">
                        Dismiss
                    </button>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row min-h-screen p-4 md:p-8 space-y-6 lg:space-y-0 lg:space-x-8">

                <div className="flex-1 lg:w-2/3">
                    <header className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 mb-8 p-4 rounded-2xl frosted-card">
                        <h1 className="text-3xl font-bold glowing-title">💬 Query Hub</h1>
                        <div className="flex items-center space-x-2 w-full md:w-auto">
                            <div className="relative w-full md:w-80">
                                <input type="text" placeholder="🔍 How do I manage exam panic?" className="w-full pl-10 pr-4 py-2 rounded-full frosted-card border-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent text-gray-800 placeholder-gray-500" />
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-search"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                                </div>
                            </div>
                            <button id="ask-button" className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-2 px-6 rounded-full transition-transform transform hover:scale-105 ripple-effect disabled:opacity-50 disabled:cursor-not-allowed" disabled={!user}>
                               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-plus inline-block mr-1"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg> Ask
                            </button>
                        </div>
                    </header>

                    <div className="flex flex-wrap items-center justify-start gap-3 text-sm text-gray-600 mb-6 p-4 rounded-2xl frosted-card">
                        <span className="mr-2">Filters:</span>
                        <button className="bg-gray-200 px-3 py-1 rounded-full hover:bg-gray-300">Category</button>
                        <button className="bg-gray-200 px-3 py-1 rounded-full hover:bg-gray-300">Most Active</button>
                        <button className="bg-gray-200 px-3 py-1 rounded-full hover:bg-gray-300">Most Helpful</button>
                        <button className="bg-gray-200 px-3 py-1 rounded-full hover:bg-gray-300">Verified Replies</button>
                    </div>

                    <div id="query-feed" className="flex flex-col space-y-6">
                    </div>
                </div>

                <div className="lg:w-1/3 flex flex-col space-y-6 mobile-hide">
                    <div className="frosted-card p-6 rounded-2xl border-red-300/50">
                        <div className="flex items-center space-x-3 mb-4">
                            <span className="text-3xl">🚨</span>
                            <h3 className="text-xl font-semibold">Crisis Detection</h3>
                        </div>
                        <p className="text-gray-500 mb-4">Our AI has flagged a post that may need urgent attention. We are here to help.</p>
                        <button className="sos-btn w-full bg-red-600 text-white font-bold py-3 px-6 rounded-full transition-colors hover:bg-red-700">
                           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-message-square-heart inline-block mr-2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M17.8 10c-1.5 1.5-3 3-5.8 3-2.8 0-4.3-1.5-5.8-3-1.5-1.5 0-4.5 5.8-4.5 5.8 0 7.3 3 5.8 4.5Z"/></svg> Chat with a Counselor
                        </button>
                    </div>
                    
                    <div className="frosted-card p-6 rounded-2xl">
                        <h3 className="text-xl font-semibold mb-4">Trending Hashtags</h3>
                        <div id="hashtag-cloud" className="flex flex-wrap gap-2">
                        </div>
                    </div>

                    <div className="frosted-card p-6 rounded-2xl">
                        <h3 className="text-xl font-semibold mb-4">🔖 Saved Queries</h3>
                        <div id="saved-queries" className="flex flex-col space-y-2">
                        </div>
                    </div>
                </div>
            </div>

            <div id="new-query-modal" className="hidden fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay">
                <div className="frosted-card p-8 rounded-2xl max-w-2xl w-full">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold">Ask a Question</h2>
                        <button onClick={() => hideModal('new-query-modal')} className="text-gray-400 hover:text-gray-600">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-x"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>
                        </button>
                    </div>
                    <form id="new-query-form" className="space-y-4">
                        <input type="text" id="query-title" placeholder="Title" className="w-full p-3 rounded-xl frosted-card border-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent text-gray-800 placeholder-gray-500" required />
                        <textarea id="query-description" placeholder="Description" rows={5} className="w-full p-3 rounded-xl frosted-card border-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent text-gray-800 placeholder-gray-500" required></textarea>
                        <input type="text" id="query-tags" placeholder="Hashtags (e.g., #ExamStress)" className="w-full p-3 rounded-xl frosted-card border-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent text-gray-800 placeholder-gray-500" />
                        <div className="flex items-center space-x-4">
                            <label className="text-gray-600">Post as:</label>
                            <div className="flex items-center space-x-2">
                                <input type="radio" id="post-self" name="post-type" value="self" defaultChecked className="form-radio text-blue-500" />
                                <label htmlFor="post-self">Self</label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <input type="radio" id="post-anonymous" name="post-type" value="anonymous" className="form-radio text-blue-500" />
                                <label htmlFor="post-anonymous">Anonymous</label>
                            </div>
                        </div>
                        <button type="submit" className="w-full bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl transition-transform transform hover:scale-105">Submit Query</button>
                    </form>
                </div>
            </div>

            <div id="query-expanded-modal" className="hidden fixed inset-0 z-50 items-center justify-center p-4 modal-overlay">
                <div className="frosted-card p-8 rounded-2xl max-w-4xl w-full h-full lg:max-h-[90vh] overflow-y-auto relative">
                    <button onClick={() => hideModal('query-expanded-modal')} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-x"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>
                    </button>
                    <div id="expanded-query-content">
                    </div>
                    <div id="reply-tools" className="mt-6">
                        <textarea id="reply-textarea" placeholder="Write a reply..." rows={3} className="w-full p-3 rounded-xl frosted-card border-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent text-gray-800 placeholder-gray-500" disabled={!user}></textarea>
                        <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                                <label htmlFor="reply-anonymous">Reply anonymously</label>
                                <input type="checkbox" id="reply-anonymous" className="form-checkbox rounded text-blue-500" />
                            </div>
                            <button className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-full transition-colors hover:bg-blue-700 disabled:opacity-50" disabled={!user}>Post Reply</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

    