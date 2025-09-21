
"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Phone, Video, MoreVertical, Smile, Paperclip, Mic, Send } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

interface FriendFinderViewProps {
    onNavigate: (view: string) => void;
}

const friendsData = [
  { id: 1, name: 'Dr. Emily Carter', avatar: 'https://picsum.photos/seed/friend1/40/40', lastMessage: 'Let\'s discuss your progress tomorrow.', time: '10:42 AM', online: true },
];

const messagesData = [
    { id: 1, text: 'Hi Alex, I wanted to check in and see how you\'re feeling about the upcoming exams.', from: 'them', time: '10:30 AM' },
    { id: 2, text: 'Hey Dr. Carter. A bit stressed, but I\'m managing. Thanks for asking!', from: 'me', time: '10:31 AM', state: 'seen' },
    { id: 3, text: 'That\'s understandable. Remember the breathing exercises we talked about. They can be very helpful for managing stress.', from: 'them', time: '10:32 AM' },
];

export function FriendFinderView({ onNavigate }: FriendFinderViewProps) {
    const [activeChat, setActiveChat] = useState(friendsData[0]);

    const ReadReceipt = ({ state }: { state?: string }) => {
        if (state === 'seen') return <span className="text-blue-400">✓✓</span>;
        if (state === 'delivered') return <span>✓✓</span>;
        return <span>✓</span>;
    };

    return (
        <div className="friend-finder-body">
            {/* Left Sidebar */}
            <aside className="support-sidebar">
                <div className="p-4 border-b border-[var(--border-color)]">
                    <h2 className="text-2xl font-bold">Support Circle</h2>
                </div>
                
                <div className="p-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--secondary-text-color)]" size={20} />
                        <Input placeholder="Search..." className="pl-10 rounded-full bg-black/5 border-none focus-visible:ring-1 focus-visible:ring-[var(--primary-glow)]" />
                    </div>
                </div>

                <Tabs defaultValue="friends" className="w-full px-4">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="friends">Friends</TabsTrigger>
                        <TabsTrigger value="pods">Pods</TabsTrigger>
                    </TabsList>
                </Tabs>

                <ScrollArea className="flex-grow">
                    {friendsData.map(friend => (
                        <div key={friend.id} className={`flex items-center p-4 cursor-pointer border-l-4 ${activeChat?.id === friend.id ? 'border-[var(--primary-glow)] bg-blue-500/10' : 'border-transparent'}`} onClick={() => setActiveChat(friend)}>
                            <div className="relative">
                                <Image src={friend.avatar} alt={friend.name} width={48} height={48} className="rounded-full" />
                                {friend.online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>}
                            </div>
                            <div className="flex-grow ml-3">
                                <p className="font-semibold">{friend.name}</p>
                                <p className="text-sm text-[var(--secondary-text-color)] truncate">{friend.lastMessage}</p>
                            </div>
                            <div className="text-xs text-[var(--secondary-text-color)] self-start">{friend.time}</div>
                        </div>
                    ))}
                </ScrollArea>
            </aside>
            
            {/* Right Chat Area */}
            <main className="support-chat-area">
                {activeChat ? (
                    <>
                        <header className="support-chat-header">
                            <div className="flex items-center">
                                <div className="relative">
                                    <Image src={activeChat.avatar} alt={activeChat.name} width={40} height={40} className="rounded-full" />
                                    {activeChat.online && <div className="online-dot absolute bottom-0 right-0 bg-green-500"></div>}
                                </div>
                                <div className="ml-3">
                                    <h3 className="font-semibold text-lg">{activeChat.name}</h3>
                                    <p className="text-sm text-[var(--secondary-text-color)]">{activeChat.online ? 'Online' : 'Offline'}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4 text-[var(--secondary-text-color)]">
                                <button className="hover:text-[var(--text-color)]"><Phone /></button>
                                <button className="hover:text-[var(--text-color)]"><Video /></button>
                                <button className="hover:text-[var(--text-color)]"><MoreVertical /></button>
                            </div>
                        </header>

                        <ScrollArea className="support-messages">
                            <div className="space-y-6">
                                {messagesData.map(msg => (
                                    <div key={msg.id} className={`flex ${msg.from === 'me' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`message-bubble ${msg.from === 'me' ? 'sent' : 'received'}`}>
                                            <p>{msg.text}</p>
                                            <div className={`text-right text-xs mt-1 ${msg.from === 'me' ? 'text-blue-100/70' : 'text-gray-400'}`}>
                                                {msg.time} {msg.from === 'me' && <ReadReceipt state={msg.state} />}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>

                        <footer className="support-input-bar">
                            <div className="flex items-center bg-white rounded-full p-2 border border-gray-200">
                                <button className="p-2 text-gray-500 hover:text-gray-700"><Smile /></button>
                                <button className="p-2 text-gray-500 hover:text-gray-700"><Paperclip /></button>
                                <Input placeholder="Type a message..." className="flex-grow bg-transparent border-none focus-visible:ring-0 text-base" />
                                <button className="p-2 text-gray-500 hover:text-gray-700"><Mic /></button>
                                <Button size="icon" className="rounded-full bg-[var(--primary-glow)] hover:bg-blue-700">
                                    <Send className="text-white"/>
                                </Button>
                            </div>
                        </footer>
                    </>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-lg text-[var(--secondary-text-color)]">Select a chat to start messaging</p>
                    </div>
                )}
            </main>
        </div>
    );
}

    