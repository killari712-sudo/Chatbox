
"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';

interface Mentor {
    name: string;
    title: string;
    specialty: string;
    avatar: string;
    status: 'Online' | 'Away' | 'Do Not Disturb' | 'Offline';
    match: number;
}

interface MentorViewProps {
    onNavigate: (view: string) => void;
}

export function MentorView({ onNavigate }: MentorViewProps) {
    
    const [mentors, setMentors] = useState<Mentor[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Online': return 'bg-green-500';
            case 'Away': return 'bg-yellow-500';
            case 'Do Not Disturb': return 'bg-red-500';
            default: return 'bg-gray-400';
        }
    };

    const handleRegisterMentor = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const name = formData.get('name') as string;
        const title = formData.get('title') as string;
        const specialty = formData.get('specialty') as string;

        const nameParts = name.split(' ');
        const avatar = (nameParts[0]?.[0] || '') + (nameParts[1]?.[0] || '');

        const newMentor: Mentor = {
            name,
            title,
            specialty,
            avatar: avatar.toUpperCase(),
            status: 'Online', // Default status
            match: Math.floor(Math.random() * (95 - 75 + 1) + 75), // Random match score
        };

        setMentors(prevMentors => [...prevMentors, newMentor]);
        setIsModalOpen(false);
    };

    return (
        <div className="mentor-view-body">
            <div className="p-4 sm:p-6 md:p-8">
                <header className="mb-8 text-center relative">
                    <Button
                        onClick={() => onNavigate('Home')}
                        variant="ghost"
                        size="icon"
                        className="absolute top-0 left-0"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </Button>
                    <h1 className="text-4xl md:text-5xl font-bold mb-2">Find Your Mentor</h1>
                    <p className="text-lg md:text-xl text-gray-600">Connect with experienced professionals to guide your journey.</p>
                </header>

                <div className="mb-8 flex flex-col sm:flex-row justify-center items-center gap-4">
                    <input type="text" placeholder="🔍 Search by name or specialty..." className="w-full sm:w-1/2 p-3 rounded-full border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"/>
                    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-green-600 text-white font-semibold py-3 px-6 rounded-full hover:bg-green-700 transition-transform transform hover:scale-105 h-auto text-base">
                                Register as Mentor
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Become a Mentor</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleRegisterMentor}>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="name" className="text-right">Name</Label>
                                        <Input id="name" name="name" placeholder="e.g., Jane Doe" className="col-span-3" required />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="title" className="text-right">Title</Label>
                                        <Input id="title" name="title" placeholder="e.g., Senior Developer" className="col-span-3" required />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="specialty" className="text-right">Specialty</Label>
                                        <Input id="specialty" name="specialty" placeholder="e.g., Tech & Startups" className="col-span-3" required />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="submit">Register</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {mentors.length === 0 ? (
                     <div className="text-center py-16">
                        <p className="text-gray-500 text-xl">No mentors have registered yet.</p>
                        <p className="text-gray-400 mt-2">Be the first one to guide others!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {mentors.map((mentor, index) => (
                            <div key={index} className="mentor-card bg-white/60 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-shadow duration-300">
                                <div className="flex items-center mb-4">
                                    <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-2xl mr-4 relative">
                                        {mentor.avatar}
                                        <span className={`absolute bottom-0 right-0 block h-4 w-4 rounded-full ${getStatusColor(mentor.status)} border-2 border-white`}></span>
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold">{mentor.name}</h2>
                                        <p className="text-gray-500">{mentor.title}</p>
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <h3 className="font-semibold mb-1">Specialty:</h3>
                                    <p className="text-gray-700">{mentor.specialty}</p>
                                </div>
                                <div className="mb-6">
                                    <h3 className="font-semibold mb-1">Match Score:</h3>
                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                        <div className="bg-blue-600 h-2.5 rounded-full" style={{width: `${mentor.match}%`}}></div>
                                    </div>
                                    <p className="text-right text-sm text-gray-500 mt-1">{mentor.match}% Match</p>
                                </div>
                                <button className="w-full bg-black text-white font-semibold py-3 rounded-lg hover:bg-gray-800 transition">
                                    Connect
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

    