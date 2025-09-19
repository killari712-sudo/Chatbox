
"use client";

import React, { useEffect } from 'react';

export function RoadmapsView() {
    useEffect(() => {
        const roadmapsData = {
            "exam-stress": {
                title: "Exam Stress",
                description: "Find calm and focus during your study period.",
                totalTime: 45,
                insight: "Feeling overwhelmed is normal. Breaking tasks into smaller steps can help manage stress effectively.",
                steps: [
                    { title: "5-Min Breathing Video", description: "Center your mind and calm your body with this guided breathing exercise.", duration: 5, details: "This guided video will walk you through a simple 'box breathing' technique. This method is proven to calm the nervous system, reduce immediate feelings of stress, and improve focus. <strong>How to do it:</strong> You'll be guided to inhale for 4 seconds, hold your breath for 4 seconds, exhale for 4 seconds, and hold again for 4 seconds. Find a quiet place, sit upright, and just follow the instructions." },
                    { title: "Plan Your Study Session", description: "Use the Pomodoro technique for focused work and breaks.", duration: 10, details: "The Pomodoro Technique helps you resist all of those self-interruptions and re-train your brains to focus. <strong>Instructions:</strong> Decide on the task to be done, set a timer for 25 minutes, work on the task, and end work when the timer rings. Take a short 5-minute break. After four sessions, take a longer break of 15-30 minutes." },
                    { title: "Mindful Hydration", description: "Take a break to drink a full glass of water.", duration: 5, details: "Dehydration can impair cognitive function and increase feelings of anxiety. This exercise turns a simple act into a mindful moment. <strong>Instructions:</strong> As you drink, pay full attention to the sensation of the cool water, the feeling of it going down your throat, and the sense of refreshment." },
                    { title: "Quick Stretch", description: "Release tension from your neck and shoulders.", duration: 5, details: "Sitting for long periods causes physical tension, which contributes to mental stress. <strong>Instructions:</strong> Gently tilt your head from side to side, holding for 15 seconds each way. Roll your shoulders backwards and forwards slowly. Reach your arms up to the ceiling and hold." },
                    { title: "Positive Affirmation", description: "Acknowledge your hard work and capabilities.", duration: 10, details: "Counteract negative self-talk and build a more resilient mindset. <strong>Instructions:</strong> Take a piece of paper and write down one thing you are proud of accomplishing today and one positive quality about yourself as a learner. For example: 'I am proud that I focused for two full sessions. I am persistent.'" },
                    { title: "Review & Relax", description: "Consolidate learning and transition out of study mode.", duration: 10, details: "A brief review helps with memory retention, while dedicated relaxation prevents burnout. <strong>Instructions:</strong> Spend 5 minutes scanning your notes without trying to memorize. Then, completely switch gears: listen to a song, chat with a friend, or watch something funny." }
                ]
            },
            "career-confusion": {
                title: "Career Confusion",
                description: "Gain clarity and direction for your future path.",
                totalTime: 60,
                insight: "Career clarity comes from self-exploration, not from a single moment of revelation. It's a journey of discovery.",
                steps: [
                    { title: "Self-Reflection: Ikigai", description: "Explore what you love, what you're good at, what the world needs, and what you can be paid for.", duration: 20, details: "Ikigai is a Japanese concept that means 'a reason for being'. <strong>Instructions:</strong> Take a paper and draw four overlapping circles. Label them: 'What I Love', 'What I'm Good At', 'What the World Needs', 'What I Can Be Paid For'. Brainstorm and fill in each circle. The intersection is where you can find fulfilling career paths." },
                    { title: "Research Two Potential Paths", description: "Investigate two career options that seem interesting from your Ikigai exercise.", duration: 30, details: "Move from abstract ideas to concrete information. <strong>Instructions:</strong> Use the internet to research two potential careers. Look for: day-to-day responsibilities, required skills/education, salary range, and future outlook. Note down your findings." },
                    { title: "Informational Interview Prep", description: "Plan to talk to someone in a field that interests you.", duration: 10, details: "Real-world insights are invaluable. <strong>Instructions:</strong> Think of one person you could talk to (a senior, a family friend, a professor) in a field you researched. Write down 3-5 questions you would like to ask them about their job and career journey." }
                ]
            },
            "peer-pressure": {
                title: "Handling Peer Pressure",
                description: "Stay true to yourself and make confident choices.",
                totalTime: 30,
                insight: "True friends respect your choices. Setting boundaries is a sign of self-respect, not rejection.",
                steps: [
                    { title: "Identify Your Values", description: "Understand what is most important to you.", duration: 10, details: "When you know your values, it's easier to say no to things that don't align with them. <strong>Instructions:</strong> Write down 3-5 things that are non-negotiable for you. (e.g., honesty, my health, my studies). Keep this list somewhere private you can see it." },
                    { title: "Practice Saying 'No'", description: "Develop polite but firm ways to decline.", duration: 10, details: "It can be hard to say no, so practicing helps. <strong>Instructions:</strong> Think of a situation where you felt pressured. Practice saying these phrases out loud: 'No, thank you, I'm not interested,' 'I appreciate the offer, but I'll pass,' or 'That's not for me, but have fun!'" },
                    { title: "Identify Your True Friends", description: "Recognize who supports your real self.", duration: 10, details: "Supportive friends won't pressure you to do things you're uncomfortable with. <strong>Instructions:</strong> Think about your friends. Write down the names of those who listen to you, respect your decisions, and make you feel good about yourself. Make an effort to spend more time with them." }
                ]
            },
            "cyberbullying": {
                title: "Dealing with Cyberbullying",
                description: "Protect your well-being and take control online.",
                totalTime: 25,
                insight: "Your safety and mental health are more important than any online interaction. You have the power to control your digital space.",
                steps: [
                    { title: "Don't Respond, Document", description: "Avoid engaging with the bully and save the evidence.", duration: 5, details: "Engaging can escalate the situation. Evidence is crucial for reporting. <strong>Instructions:</strong> Take screenshots of the hurtful messages, comments, or posts. Note the date, time, and platform." },
                    { title: "Block & Report", description: "Use the platform's tools to stop contact and flag the behavior.", duration: 10, details: "All social media platforms have features to protect you. <strong>Instructions:</strong> Go to the profile of the person bullying you. Find the 'Block' and 'Report' buttons. Block them to stop further contact. Report the specific content and the profile for harassment or bullying." },
                    { title: "Talk to Someone You Trust", description: "Share what's happening with a trusted adult or friend.", duration: 10, details: "You do not have to go through this alone. Sharing the burden can bring relief and support. <strong>Instructions:</strong> Choose a parent, teacher, counselor, or close friend you trust. Tell them what has been happening and show them the evidence you collected. Asking for help is a sign of strength." }
                ]
            },
            "anxiety-relief": {
                title: "Anxiety Relief",
                description: "Ground yourself and find calm in the moment.",
                totalTime: 20,
                insight: "Grounding yourself in the present moment is a powerful way to calm an anxious mind.",
                steps: [
                    { title: "5-4-3-2-1 Grounding", description: "Use your five senses to connect with the present.", duration: 5, details: "The 5-4-3-2-1 method is a powerful grounding technique that brings you back to the present moment when your mind is racing. <strong>Instructions:</strong> Look around you and silently name five things you can see. Then, notice four things you can feel with your skin. Listen for three distinct sounds. Identify two different smells. Finally, notice one thing you can taste." },
                    { title: "Box Breathing", description: "A simple technique to regulate your breathing and heart rate.", duration: 3, details: "This technique can lower stress hormones and blood pressure. <strong>Instructions:</strong> Find a comfortable seat. Inhale slowly through your nose for a count of 4. Hold your breath for a count of 4. Exhale completely through your mouth for a count of 4. Hold your breath again for a count of 4. Repeat for 3 minutes." },
                    { title: "Write It Down", description: "Externalize your anxious thoughts to reduce their power.", duration: 10, details: "Getting thoughts out of your head and onto paper can provide immense relief and clarity. <strong>Instructions:</strong> Use a journal or a piece of paper and write down everything that is making you anxious. Don't worry about grammar or structure; just let it flow." },
                    { title: "Cold Water Splash", description: "A physiological trick to calm your nervous system.", duration: 2, details: "This activates the 'mammalian dive reflex,' which slows the heart rate and redirects blood flow to the brain, promoting a sense of calm. <strong>Instructions:</strong> Go to a sink, take a deep breath, hold it, and splash your face with cold (but not ice-cold) water for 15-30 seconds." }
                ]
            },
            "sleep-better": {
                title: "Sleep Better",
                description: "A nightly routine to improve sleep quality.",
                totalTime: 30,
                insight: "A consistent wind-down routine signals to your body that it's time for sleep.",
                steps: [
                    { title: "Digital Sunset", description: "Reduce blue light exposure before bed.", duration: 5, details: "The blue light from screens suppresses the production of melatonin, the hormone that regulates sleep. <strong>Instructions:</strong> Set an alarm for 1 hour before your intended bedtime. When it rings, put all electronic devices with screens away." },
                    { title: "Dim the Lights", description: "Signal to your brain that it's time to wind down.", duration: 2, details: "Bright overhead lights can be stimulating. Lower light levels encourage melatonin production. <strong>Instructions:</strong> Turn off main lights and use a dim, warm-colored lamp instead for your pre-sleep activities." },
                    { title: "Journal Your Thoughts", description: "Clear your mind of the day's worries.", duration: 10, details: "A 'brain dump' can prevent you from ruminating on thoughts once you're in bed. <strong>Instructions:</strong> Write down any tasks for tomorrow, any lingering worries, or simply a summary of your day to get them out of your head." },
                    { title: "Calming Herbal Tea", description: "A warm, soothing drink to relax your body.", duration: 8, details: "Certain herbs have mild sedative properties. <strong>Instructions:</strong> Brew a cup of caffeine-free tea such as chamomile, valerian root, or lavender. Sip it slowly and mindfully, enjoying the warmth and aroma." },
                    { title: "Read a Book", description: "An excellent way to disconnect and relax.", duration: 5, details: "Reading a physical book is a calming activity that doesn't involve stimulating blue light. <strong>Instructions:</strong> Choose a book that is engaging but not overly thrilling. Read until you feel your eyelids getting heavy." }
                ]
            },
            "overthinking": {
                title: "Managing Overthinking",
                description: "Break the cycle of constant worry and rumination.",
                totalTime: 25,
                insight: "You can't stop the waves, but you can learn to surf. You can learn to manage your thoughts instead of letting them manage you.",
                steps: [
                    { title: "Schedule 'Worry Time'", description: "Contain your worries into a specific time slot.", duration: 5, details: "This technique prevents worrying from taking over your entire day. <strong>Instructions:</strong> Designate a 15-minute period each day (e.g., 4:30 PM) as your official 'Worry Time'. If a worry pops up outside this time, jot it down and tell yourself you will address it during your scheduled slot." },
                    { title: "Challenge Your Thoughts", description: "Question the validity of your anxious thoughts.", duration: 10, details: "Our thoughts are not always facts. Questioning them can reduce their power. <strong>Instructions:</strong> Take a worrying thought (e.g., 'I'm going to fail my exam'). Ask yourself: What is the evidence for this thought? What is the evidence against it? What is a more balanced, realistic way of looking at this?" },
                    { title: "Engage Your Senses", description: "Get out of your head and into the present moment.", duration: 10, details: "This is a powerful grounding technique. <strong>Instructions:</strong> Stop what you're doing and engage your senses fully in a simple task. For example, slowly peel and eat an orange, noticing the smell, the texture, the sound, and the taste. Or, listen to a piece of music and try to identify every single instrument you can hear." }
                ]
            },
            "productivity": {
                title: "Productivity",
                description: "Boost your focus and get more done.",
                totalTime: 60,
                insight: "True productivity isn't about doing more, it's about making what you do more effective.",
                steps: [
                    { title: "Define Your Top 3", description: "Identify your Most Important Tasks (MITs).", duration: 5, details: "Clarity on priorities prevents you from getting lost in busywork. <strong>Instructions:</strong> Look at your to-do list and select the 1-3 tasks that will have the biggest impact. These are your focus for the day." },
                    { title: "First Focus Block", description: "Dedicate a block of time to your most important task.", duration: 45, details: "Your willpower and focus are strongest at the start of the day. Use it for your hardest task. <strong>Instructions:</strong> Turn off all notifications, close unnecessary tabs, and work on your #1 priority task for 45 minutes without interruption." },
                    { title: "Active Break", description: "Rest your mind and body to maintain performance.", duration: 10, details: "Breaks are not a waste of time; they are essential for focus and preventing burnout. <strong>Instructions:</strong> Get up from your chair. Walk around, do some stretches, get some water, or look out a window. Avoid checking your phone." }
                ]
            },
            "immediate-support": {
                title: "Immediate Support",
                isCritical: true,
                description: "For when you are in crisis and need help now.",
                totalTime: 5,
                insight: "You are not alone, and there is immediate help available. Reaching out is the bravest step you can take.",
                steps: [
                    { title: "Call a Helpline", description: "Speak to a trained professional right now.", duration: 5, details: "These services are free, confidential, and available 24/7. They are here to listen and support you. <strong>Instructions:</strong> Please call one of these numbers immediately. <br><strong>AASRA:</strong> +91-9820466726 (24x7) <br><strong>Vandrevala Foundation:</strong> 1860-2662-345" },
                    { title: "Contact Emergency Services", description: "If you are in immediate danger, get help.", duration: 5, details: "If you feel you might harm yourself, it is a medical emergency. <strong>Instructions:</strong> Please call <strong>112</strong> for emergency services or ask someone nearby to take you to the nearest hospital emergency room." },
                    { title: "Tell Someone Nearby", description: "Let someone around you know that you are not okay.", duration: 5, details: "If you are with family, friends, or even in a public place, tell someone that you need help immediately. <strong>Instructions:</strong> Find a person you trust, or even a stranger, and say 'I am in a crisis and I need help right now.' Let them help you contact a helpline or emergency services." }
                ]
            }
        };

        const selectionView = document.getElementById('roadmap-selection-view');
        const detailView = document.getElementById('roadmap-detail-view');
        const roadmapGrid = document.querySelector('.roadmap-grid');
        const roadmapStepsContainer = document.getElementById('roadmap-steps');
        const pathNodesContainer = document.getElementById('path-nodes');
        const progressBar = document.getElementById('progress-bar') as HTMLElement;
        const timeRemainingEl = document.getElementById('time-remaining');
        const aiInsightText = document.getElementById('ai-insight-text');
        const roadmapTitleEl = document.getElementById('roadmap-title');
        const backButton = document.getElementById('back-to-selection-btn');
        const searchInput = document.getElementById('search-roadmaps') as HTMLInputElement;

        let currentRoadmapId: string | null = null;
        let completedSteps = 0;

        function populateSelectionGrid(filteredData: any = roadmapsData) {
            if (!roadmapGrid) return;
            roadmapGrid.innerHTML = '';
            for (const id in filteredData) {
                const roadmap = filteredData[id];
                const card = document.createElement('div');
                card.classList.add('roadmap-card');
                if (roadmap.isCritical) {
                    card.classList.add('critical');
                }
                card.dataset.roadmap = id;
                card.innerHTML = `
                    <h3>${roadmap.title}</h3>
                    <p>${roadmap.description}</p>
                `;
                roadmapGrid.appendChild(card);
            }
        }

        function showDetailView(roadmapId: string) {
            currentRoadmapId = roadmapId;
            loadRoadmap(roadmapId);
            selectionView?.classList.add('hidden');
            detailView?.classList.remove('hidden');
        }

        function showSelectionView() {
            currentRoadmapId = null;
            selectionView?.classList.remove('hidden');
            detailView?.classList.add('hidden');
            if (aiInsightText) aiInsightText.textContent = 'Select a roadmap to see personalized suggestions.';
            if (timeRemainingEl) timeRemainingEl.textContent = '-- min';
            if (progressBar) progressBar.style.width = '0%';
        }

        function loadRoadmap(roadmapId: string) {
            const roadmap = roadmapsData[roadmapId as keyof typeof roadmapsData];
            if (!roadmap || !roadmapStepsContainer || !pathNodesContainer || !roadmapTitleEl) return;

            roadmapStepsContainer.innerHTML = '';
            pathNodesContainer.innerHTML = '';
            completedSteps = 0;
            roadmapTitleEl.textContent = roadmap.title;

            roadmap.steps.forEach((step, index) => {
                const stepCard = document.createElement('div');
                stepCard.classList.add('step-card');
                stepCard.dataset.index = index.toString();
                stepCard.innerHTML = `
                    <div class="step-header">
                        <h4>${step.title}</h4>
                        <span class="details-toggle-icon">▼</span>
                    </div>
                    <p class="step-description">${step.description}</p>
                    <div class="step-details">
                        <p>${step.details || 'Detailed instructions will be available here.'}</p>
                    </div>
                    <div class="step-actions">
                        <button class="btn btn-primary complete-btn">Mark Complete</button>
                    </div>
                `;
                roadmapStepsContainer.appendChild(stepCard);

                const pathNode = document.createElement('div');
                pathNode.classList.add('path-node');
                pathNode.dataset.index = index.toString();
                pathNodesContainer.appendChild(pathNode);
            });

            updateUI();
            if (aiInsightText) aiInsightText.textContent = roadmap.insight;
        }

        function updateUI() {
            if (!currentRoadmapId) return;

            const roadmap = roadmapsData[currentRoadmapId as keyof typeof roadmapsData];
            const totalSteps = roadmap.steps.length;

            const progressPercentage = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;
            if (progressBar) progressBar.style.width = `${progressPercentage}%`;

            const timeCompleted = roadmap.steps.slice(0, completedSteps).reduce((acc, step) => acc + step.duration, 0);
            const timeRemaining = roadmap.totalTime - timeCompleted;
            if (timeRemainingEl) timeRemainingEl.textContent = `${timeRemaining} min`;

            document.querySelectorAll('.path-node').forEach(node => {
                const htmlNode = node as HTMLElement;
                if (parseInt(htmlNode.dataset.index || '0') < completedSteps) {
                    htmlNode.classList.add('completed');
                } else {
                    htmlNode.classList.remove('completed');
                }
            });
        }

        searchInput?.addEventListener('input', (e) => {
            const searchTerm = (e.target as HTMLInputElement).value.toLowerCase();
            if (searchTerm === '') {
                populateSelectionGrid(roadmapsData);
                return;
            }
            const filtered = Object.fromEntries(
                Object.entries(roadmapsData).filter(([id, roadmap]) =>
                    roadmap.title.toLowerCase().includes(searchTerm) ||
                    roadmap.description.toLowerCase().includes(searchTerm)
                )
            );
            populateSelectionGrid(filtered);
        });

        roadmapGrid?.addEventListener('click', (e) => {
            const card = (e.target as HTMLElement).closest('.roadmap-card') as HTMLElement;
            if (card) {
                showDetailView(card.dataset.roadmap!);
            }
        });

        backButton?.addEventListener('click', showSelectionView);

        roadmapStepsContainer?.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            const completeBtn = target.closest('.complete-btn');
            const header = target.closest('.step-header');

            if (completeBtn) {
                const stepCard = completeBtn.closest('.step-card') as HTMLElement;
                const stepIndex = parseInt(stepCard.dataset.index || '0');

                if (!stepCard.classList.contains('completed') && stepIndex === completedSteps) {
                    stepCard.classList.add('completed');
                    if (stepCard.classList.contains('expanded')) {
                        stepCard.classList.remove('expanded');
                    }
                    completedSteps++;
                    updateUI();
                }
                return;
            }

            if (header) {
                const stepCard = header.closest('.step-card') as HTMLElement;
                if (!stepCard.classList.contains('completed')) {
                    stepCard.classList.toggle('expanded');
                }
            }
        });

        populateSelectionGrid();
        showSelectionView();
    }, []);

    return (
        <div className="roadmaps-body">
            <header className="top-bar">
                <div className="page-title">Guided Roadmaps</div>
                <div className="filters">
                    <input type="search" id="search-roadmaps" placeholder="🔍 Search Roadmaps..." />
                    <select name="mood" id="mood-filter">
                        <option value="all">🎭 Any Mood</option>
                        <option value="stress">Stress</option>
                        <option value="focus">Focus</option>
                        <option value="wellness">Wellness</option>
                    </select>
                    <select name="pace" id="pace-filter">
                        <option value="balanced">⚙️ Balanced Pace</option>
                        <option value="fast">Fast Pace</option>
                        <option value="deep">Deep Pace</option>
                    </select>
                </div>
            </header>

            <main className="main-content">
                <div id="roadmap-selection-view" className="view">
                    <div className="roadmap-grid"></div>
                </div>

                <div id="roadmap-detail-view" className="view hidden">
                    <div className="detail-header">
                        <button id="back-to-selection-btn" className="btn btn-secondary">← Back</button>
                        <h2 id="roadmap-title"></h2>
                    </div>
                    <div className="steps-container">
                        <div className="roadmap-steps" id="roadmap-steps"></div>
                        <div className="path-visualization">
                            <div className="path-line"></div>
                            <div className="path-nodes" id="path-nodes"></div>
                        </div>
                    </div>
                </div>
            </main>

            <aside className="right-sidebar">
                <div className="sidebar-panel ai-insights">
                    <h4>🤖 AI Insights</h4>
                    <p id="ai-insight-text">Select a roadmap to see personalized suggestions.</p>
                </div>
                <div className="sidebar-panel support-boosts">
                    <h4>🤝 Support Boosts</h4>
                    <p>32 peers are on this roadmap right now.</p>
                    <ul>
                        <li><img src="https://i.pravatar.cc/40?img=1" alt="avatar" /></li>
                        <li><img src="https://i.pravatar.cc/40?img=2" alt="avatar" /></li>
                        <li><img src="https://i.pravatar.cc/40?img=3" alt="avatar" /></li>
                        <li><img src="https://i.pravatar.cc/40?img=4" alt="avatar" /></li>
                    </ul>
                    <button className="btn btn-primary" style={{ width: '100%', marginTop: '15px' }}>Join Study Circle</button>
                </div>
            </aside>

            <footer className="bottom-bar">
                <div className="time-remaining">⏱️ Est. Time: <span id="time-remaining">-- min</span></div>
                <div className="progress-bar-container">
                    <div className="progress-bar-fill" id="progress-bar"></div>
                </div>
                <div className="controls"><button className="btn btn-primary">🎯 Modify Step</button></div>
            </footer>
            
            <div className="fab">
                <div className="fab-main">+</div>
            </div>
        </div>
    );
}

    