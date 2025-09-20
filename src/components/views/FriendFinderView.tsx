
"use client";

import React, { useState } from 'react';
import { Search, UserPlus, MoreVertical, MessageSquare, Video, Phone, Smile, Paperclip, Mic, Send } from 'lucide-react';
import Image from 'next/image';

interface Message {
  text: string;
  sender: 'me' | 'other';
  status: 'sent' | 'delivered' | 'read';
}

interface Friend {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  online: boolean;
  messages: Message[];
}

interface Pod {
    id: number;
    name: string;
    avatar: string;
    lastMessage: string;
    timestamp: string;
    online: boolean;
}

const mockFriends: Friend[] = [
    { id: 1, name: 'Aisha K.', avatar: 'https://picsum.photos/seed/aisha/200/200', lastMessage: 'Awesome, see you there!', timestamp: '10:48 AM', online: true, messages: [{text: 'Awesome, see you there!', sender: 'other', status: 'read'}] },
    { id: 2, name: 'John Doe', avatar: 'https://picsum.photos/seed/john/200/200', lastMessage: 'I finished the pomodoro session, it was great.', timestamp: '9:32 AM', online: false, messages: [{text: 'I finished the pomodoro session, it was great.', sender: 'other', status: 'read'}] },
    { id: 3, name: 'Sarah Lee', avatar: 'https://picsum.photos/seed/sarah/200/200', lastMessage: 'Let\'s join the meditation pod later today.', timestamp: 'Yesterday', online: true, messages: [{text: 'Let\'s join the meditation pod later today.', sender: 'other', status: 'read'}] },
];

const mockPods: Pod[] = [
    { id: 1, name: 'Study Buddies', avatar: '📚', lastMessage: 'Sarah: Let\'s review chapter 5.', timestamp: '8:15 AM', online: true },
    { id: 2, name: 'Morning Meditation', avatar: '🧘', lastMessage: 'You: Great session today!', timestamp: '7:30 AM', online: true },
];

export function FriendFinderView() {
    const [activeTab, setActiveTab] = useState('friends-dashboard');
    const [activeChat, setActiveChat] = useState<Friend | null>(mockFriends[0] || null);
    const [leftPanelTab, setLeftPanelTab] = useState('friends');
    const [messages, setMessages] = useState<Message[]>(activeChat?.messages || []);
    const [newMessage, setNewMessage] = useState('');

    const handleTabClick = (tabId: string) => {
        setActiveTab(tabId);
    };
    
    const handleFriendClick = (friend: Friend) => {
        setActiveChat(friend);
        setMessages(friend.messages);
    };
    
    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if(newMessage.trim() === '' || !activeChat) return;

        const newMsg: Message = { text: newMessage, sender: 'me', status: 'sent' };
        const updatedMessages = [...messages, newMsg];
        setMessages(updatedMessages);
        
        // This is where you would update the friend object in a real DB
        // For now, we just update the local state
        const updatedFriend = { ...activeChat, messages: updatedMessages, lastMessage: newMessage, timestamp: 'Just now' };
        
        setNewMessage('');
    };

    const ChatArea = () => (
        <div className="flex flex-col h-full bg-gray-100">
            {activeChat ? (
                <>
                    <header className="flex items-center p-3 border-b bg-white shadow-sm">
                        <Image src={activeChat.avatar} alt={activeChat.name} width={40} height={40} className="rounded-full" data-ai-hint="person avatar" />
                        <div className="ml-3">
                            <h2 className="font-semibold text-gray-800">{activeChat.name}</h2>
                            <p className="text-sm text-green-600">{activeChat.online ? 'Online' : 'Offline'}</p>
                        </div>
                        <div className="ml-auto flex items-center space-x-4 text-gray-500">
                           <button className="hover:text-gray-700"><Video size={20}/></button>
                           <button className="hover:text-gray-700"><Phone size={20}/></button>
                           <button className="hover:text-gray-700"><MoreVertical size={20}/></button>
                        </div>
                    </header>
                    <main className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`px-4 py-2 rounded-xl max-w-sm shadow ${msg.sender === 'me' ? 'bg-blue-500 text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none'}`}>
                                    <p>{msg.text}</p>
                                    <div className={`text-xs mt-1 text-right ${msg.sender === 'me' ? 'text-blue-100' : 'text-gray-400'}`}>
                                       {msg.status === 'read' ? '✓✓' : '✓'}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </main>
                    <footer className="p-3 bg-white border-t">
                        <form onSubmit={handleSendMessage} className="flex items-center bg-gray-100 rounded-full px-3 py-2">
                           <button type="button" className="text-gray-500 hover:text-gray-700"><Smile size={24}/></button>
                           <button type="button" className="text-gray-500 hover:text-gray-700 ml-2"><Paperclip size={24}/></button>
                           <input type="text" placeholder="Type a message" className="flex-1 bg-transparent px-4 border-none focus:outline-none text-gray-800" value={newMessage} onChange={e => setNewMessage(e.target.value)} />
                           {newMessage ? (
                             <button type="submit" className="bg-blue-500 text-white rounded-full p-2 w-10 h-10 flex items-center justify-center"><Send size={20}/></button>
                           ) : (
                             <button type="button" className="text-gray-500 hover:text-gray-700"><Mic size={24}/></button>
                           )}
                        </form>
                    </footer>
                </>
            ) : (
                <div className="flex flex-col items-center justify-center h-full bg-gray-100 text-center">
                    <MessageSquare size={80} className="text-gray-300"/>
                    <h2 className="mt-4 text-2xl text-gray-500">Select a chat to start messaging</h2>
                    <p className="text-gray-400">Or find new friends in the Friend Finder tab!</p>
                </div>
            )}
        </div>
    );
    
    const FriendsList = () => (
        <>
            {mockFriends.map(friend => (
                <div key={friend.id} onClick={() => handleFriendClick(friend)} className={`flex items-center p-3 cursor-pointer hover:bg-gray-100 ${activeChat?.id === friend.id ? 'bg-gray-100' : ''}`}>
                    <div className="relative">
                        <Image src={friend.avatar} alt={friend.name} width={50} height={50} className="rounded-full" data-ai-hint="person avatar" />
                        {friend.online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>}
                    </div>
                    <div className="ml-3 flex-1 border-b border-gray-200 pb-3">
                        <div className="flex justify-between items-center">
                            <h3 className="font-semibold text-gray-800">{friend.name}</h3>
                            <p className="text-xs text-gray-500">{friend.timestamp}</p>
                        </div>
                        <p className="text-sm text-gray-500 truncate">{friend.lastMessage}</p>
                    </div>
                </div>
            ))}
        </>
    );

    const PodsList = () => (
         <>
            {mockPods.map(pod => (
                <div key={pod.id} className="flex items-center p-3 cursor-pointer hover:bg-gray-100">
                    <div className="relative w-[50px] h-[50px] bg-gray-200 rounded-full flex items-center justify-center text-2xl">
                        {pod.avatar}
                    </div>
                    <div className="ml-3 flex-1 border-b border-gray-200 pb-3">
                        <div className="flex justify-between items-center">
                            <h3 className="font-semibold text-gray-800">{pod.name}</h3>
                            <p className="text-xs text-gray-500">{pod.timestamp}</p>
                        </div>
                        <p className="text-sm text-gray-500 truncate">{pod.lastMessage}</p>
                    </div>
                </div>
            ))}
        </>
    );


    return (
        <div className="friend-finder-body flex flex-col h-full bg-white font-sans">
            {/* Top Navigation */}
            <header className="p-4 border-b">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-bold text-gray-800">Support</h1>
                     <div className="top-bar-right flex items-center gap-4">
                        <button className="text-gray-500 hover:text-gray-700"><Search size={20}/></button>
                        <button className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-blue-600"><UserPlus size={16}/></button>
                        <button className="text-gray-500 hover:text-gray-700"><MoreVertical size={20}/></button>
                    </div>
                </div>
                <nav className="mt-4">
                    <div className="tabs flex space-x-8">
                        <button onClick={() => handleTabClick('friends-dashboard')} className={`tab-btn pb-2 font-semibold ${activeTab === 'friends-dashboard' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}>Friends Dashboard</button>
                        <button onClick={() => handleTabClick('friend-finder')} className={`tab-btn pb-2 font-semibold ${activeTab === 'friend-finder' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}>Friend Finder</button>
                        <button onClick={() => handleTabClick('pods-groups')} className={`tab-btn pb-2 font-semibold ${activeTab === 'pods-groups' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}>Pods & Groups</button>
                    </div>
                </nav>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex overflow-hidden">
                {activeTab === 'friends-dashboard' && (
                    <div className="flex w-full h-full">
                        {/* Left Sidebar */}
                        <div className="w-full md:w-1/3 lg:w-1/4 h-full border-r flex flex-col">
                            <div className="p-3 border-b">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20}/>
                                    <input type="text" placeholder="Search or start new chat" className="w-full bg-gray-100 rounded-full pl-10 pr-4 py-2 border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                                </div>
                                <div className="flex mt-2">
                                  <button onClick={() => setLeftPanelTab('friends')} className={`flex-1 p-2 text-sm font-semibold rounded-l-lg ${leftPanelTab==='friends' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'}`}>Friends</button>
                                  <button onClick={() => setLeftPanelTab('pods')} className={`flex-1 p-2 text-sm font-semibold rounded-r-lg ${leftPanelTab==='pods' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'}`}>Pods</button>
                                </div>
                            </div>
                            <div className="flex-1 overflow-y-auto">
                               {leftPanelTab === 'friends' ? <FriendsList /> : <PodsList />}
                            </div>
                        </div>

                        {/* Right Main Chat Area */}
                        <div className="flex-1 hidden md:flex h-full">
                            <ChatArea />
                        </div>
                    </div>
                )}
                {activeTab === 'friend-finder' && (
                    <div className="w-full flex items-center justify-center text-center p-8">
                       <div>
                         <h2 className="text-2xl font-semibold text-gray-700">Find New Friends</h2>
                         <p className="text-gray-500 mt-2">AI will suggest relevant connections here. Start by logging your habits and moods!</p>
                         <button className="mt-6 px-8 py-3 rounded-full font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90">Start My Journey</button>
                       </div>
                    </div>
                )}
                {activeTab === 'pods-groups' && (
                    <div className="w-full flex items-center justify-center text-center p-8">
                        <div>
                         <h2 className="text-2xl font-semibold text-gray-700">Join Pods & Groups</h2>
                         <p className="text-gray-500 mt-2">Discover communities based on your interests and goals.</p>
                         <button className="mt-6 px-8 py-3 rounded-full font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90">Explore Pods</button>
                       </div>
                    </div>
                )}
            </main>
        </div>
    );
}
