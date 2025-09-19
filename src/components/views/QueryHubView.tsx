"use client";
import React, { useEffect } from 'react';

export function QueryHubView() {
    useEffect(() => {
        const queryFeed = document.getElementById('query-feed');
        const newQueryModal = document.getElementById('new-query-modal');
        const queryExpandedModal = document.getElementById('query-expanded-modal');
        const askButton = document.getElementById('ask-button');
        const newQueryForm = document.getElementById('new-query-form');
        const crisisOverlay = document.getElementById('crisis-overlay');
        const expandedQueryContent = document.getElementById('expanded-query-content');

        let mockQueries: any[] = [];

        const moodEmojis: { [key: string]: string } = {
            'anxious': '😥', 'stressed': '😰', 'sad': '😔', 'happy': '😊'
        };

        const userBadges: { [key: string]: string } = {
            'Student': '🧑 Student',
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
            
            card.innerHTML = `
                <div class="flex items-center space-x-3">
                    <div class="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-xl">
                        ${profileIcon}
                    </div>
                    <div class="flex-1">
                        <div class="flex items-center space-x-2">
                            <span class="font-semibold text-gray-800">${userType}</span>
                            <span class="${badgeClass}">${badgeContent}</span>
                            ${query.verified ? '<i class="fas fa-shield-alt text-green-500" title="Verified"></i>' : ''}
                        </div>
                        <div class="text-sm text-gray-500 flex items-center space-x-2">
                            <span>${query.time}</span>
                            ${query.mood ? `<span class="text-xl ml-2" title="Feeling ${query.mood}">${moodEmojis[query.mood]}</span>` : ''}
                        </div>
                    </div>
                </div>

                <div class="flex-1">
                    <h2 class="text-xl font-bold text-gray-800 mb-2">${query.title}</h2>
                    <p class="text-gray-600 line-clamp-2">${query.description}</p>
                </div>

                <div class="flex flex-wrap gap-2 text-xs text-gray-500">
                    ${query.tags.map((tag: string) => `<span class="bg-gray-200 px-2 py-1 rounded-full">${tag}</span>`).join('')}
                </div>

                <div class="flex items-center justify-between text-sm text-gray-500">
                    <div class="flex items-center space-x-4">
                        <span class="flex items-center space-x-1"><i data-lucide="eye" size="16"></i><span>${query.views}</span></span>
                        <span class="flex items-center space-x-1"><i data-lucide="message-square" size="16"></i><span>${query.replies}</span></span>
                        <button class="upvote-btn flex items-center space-x-1 hover:text-gray-800 transition-colors">
                            <i class="fas fa-star" size="16"></i>
                            <span class="upvote-count">${query.upvotes}</span>
                        </button>
                    </div>
                    <div class="flex items-center space-x-3">
                        <button class="hover:text-gray-800"><i data-lucide="bookmark" size="18"></i></button>
                        <button class="hover:text-gray-800"><i data-lucide="share-2" size="18"></i></button>
                        <button class="hover:text-gray-800"><i data-lucide="flag" size="18"></i></button>
                    </div>
                </div>
            `;
            return card;
        }

        function showExpandedView(query: any) {
            const queryHtml = `
                <div class="flex items-start space-x-4 mb-6">
                    <div class="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-2xl">
                        ${query.isAnonymous ? '🤫' : '👤'}
                    </div>
                    <div class="flex-1">
                        <div class="flex items-center space-x-2 mb-1">
                            <span class="text-xl font-bold">${query.isAnonymous ? 'Anonymous' : query.user}</span>
                            <span class="badge badge-${query.type.toLowerCase()}">${userBadges[query.type]}</span>
                        </div>
                        <h2 class="text-3xl font-bold text-gray-800 mb-2">${query.title}</h2>
                        <p class="text-gray-700 text-lg">${query.description}</p>
                        <div class="flex flex-wrap gap-2 text-xs text-gray-500 mt-2">
                            ${query.tags.map((tag: string) => `<span class="bg-gray-200 px-2 py-1 rounded-full">${tag}</span>`).join('')}
                        </div>
                    </div>
                </div>
                
                <h3 class="text-xl font-semibold mb-4">Replies (${query.replies})</h3>
                <div class="space-y-4" id="replies-container">
                    ${query.repliesData.map((reply: any) => {
                        const isCounselor = reply.type === 'Counselor';
                        const isMentor = reply.type === 'Mentor' || reply.type === 'Alumni';
                        const replyClasses = `p-4 rounded-xl frosted-card ${isCounselor ? 'counselor-reply' : ''} ${isMentor ? 'mentor-reply' : ''}`;
                        return `
                            <div class="${replyClasses}">
                                <div class="flex items-center space-x-2 mb-2">
                                    <span class="font-semibold text-gray-800">${reply.user}</span>
                                    <span class="badge badge-${reply.type.toLowerCase()}">${userBadges[reply.type]}</span>
                                    ${reply.verified ? '<i class="fas fa-shield-alt text-green-500" title="Verified"></i>' : ''}
                                </div>
                                <p class="text-gray-700">${reply.text}</p>
                                <div class="flex items-center space-x-2 text-sm text-gray-500 mt-2">
                                    <button class="upvote-btn hover:text-gray-800"><i class="fas fa-star text-sm"></i> <span class="upvote-count">${reply.upvotes}</span></button>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            `;
            if (expandedQueryContent) expandedQueryContent.innerHTML = queryHtml;
            showModal('query-expanded-modal');
            if (typeof (window as any).lucide !== 'undefined') {
                (window as any).lucide.createIcons();
            }
        }

        askButton?.addEventListener('click', () => {
            showModal('new-query-modal');
        });

        newQueryForm?.addEventListener('submit', (e) => {
            e.preventDefault();
            const description = (document.getElementById('query-description') as HTMLTextAreaElement).value;
            const isCrisis = crisisWords.some(word => description.toLowerCase().includes(word));
            
            if (isCrisis) {
                hideModal('new-query-modal');
                showCrisisOverlay();
            } else {
                const newQuery = {
                    id: `q${mockQueries.length + 1}`,
                    title: (document.getElementById('query-title') as HTMLInputElement).value,
                    description: description,
                    user: 'John Doe',
                    type: 'Student',
                    views: 0,
                    replies: 0,
                    upvotes: 0,
                    time: 'Just now',
                    tags: (document.getElementById('query-tags') as HTMLInputElement).value.split(',').map(tag => tag.trim()),
                    isAnonymous: (document.getElementById('post-anonymous') as HTMLInputElement).checked,
                    repliesData: []
                };
                
                mockQueries = [];
                mockQueries.push(newQuery);

                hideModal('new-query-modal');
                renderQueries();
            }
        });

        function renderQueries() {
            if (!queryFeed) return;
            queryFeed.innerHTML = '';
            mockQueries.forEach(query => {
                queryFeed.appendChild(renderQueryCard(query));
            });
            if (typeof (window as any).lucide !== 'undefined') {
                (window as any).lucide.createIcons();
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

        renderQueries();
        renderHashtags();
        if (typeof (window as any).lucide !== 'undefined') {
            (window as any).lucide.createIcons();
        }

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
        }

    }, []);

    return (
        <div className='query-hub-body'>
            <div id="crisis-overlay" className="hidden fixed inset-0 z-[100] bg-red-900 bg-opacity-30 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="frosted-card p-8 rounded-2xl max-w-lg w-full text-center border-red-300">
                    <div className="text-5xl mb-4 animate-bounce">🚨</div>
                    <h2 className="text-3xl font-bold text-red-600 mb-2">We are here for you.</h2>
                    <p className="text-lg text-gray-700 mb-6">We noticed your post may be urgent. Do you want to chat with a counselor right now?</p>
                    <div className="flex flex-col space-y-4">
                        <button className="w-full bg-red-600 text-white font-semibold py-3 px-6 rounded-xl transition-all hover:bg-red-700">
                            <i data-lucide="message-square-heart" className="inline-block mr-2"></i> Counselor Chat
                        </button>
                        <button className="w-full bg-gray-400 text-gray-800 font-semibold py-3 px-6 rounded-xl transition-all hover:bg-gray-500">
                            <i data-lucide="phone-call" className="inline-block mr-2"></i> SOS Helpline
                        </button>
                        <button className="w-full bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl transition-all hover:bg-blue-700">
                            <i data-lucide="leaf" className="inline-block mr-2"></i> Quick Coping Exercise
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
                                    <i data-lucide="search" ></i>
                                </div>
                            </div>
                            <button id="ask-button" className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-2 px-6 rounded-full transition-transform transform hover:scale-105 ripple-effect">
                                <i data-lucide="plus" className="inline-block mr-1"></i> Ask
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
                            <h3 className="text-xl font-semibold">Crisis Detected</h3>
                        </div>
                        <p className="text-gray-500 mb-4">Our AI has flagged a post that may need urgent attention. We are here to help.</p>
                        <button className="sos-btn w-full bg-red-600 text-white font-bold py-3 px-6 rounded-full transition-colors hover:bg-red-700">
                            <i data-lucide="message-square-heart" className="inline-block mr-2"></i> Chat with a Counselor
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
                            <i data-lucide="x" ></i>
                        </button>
                    </div>
                    <form id="new-query-form" className="space-y-4">
                        <input type="text" id="query-title" placeholder="Title" className="w-full p-3 rounded-xl frosted-card border-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent text-gray-800 placeholder-gray-500" />
                        <textarea id="query-description" placeholder="Description" rows={5} className="w-full p-3 rounded-xl frosted-card border-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent text-gray-800 placeholder-gray-500"></textarea>
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
                        <i data-lucide="x"></i>
                    </button>
                    <div id="expanded-query-content">
                    </div>
                    <div id="reply-tools" className="mt-6">
                        <textarea id="reply-textarea" placeholder="Write a reply..." rows={3} className="w-full p-3 rounded-xl frosted-card border-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent text-gray-800 placeholder-gray-500"></textarea>
                        <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                                <label htmlFor="reply-anonymous">Reply anonymously</label>
                                <input type="checkbox" id="reply-anonymous" className="form-checkbox rounded text-blue-500" />
                            </div>
                            <button className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-full transition-colors hover:bg-blue-700">Post Reply</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
