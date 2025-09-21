
"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Volume2, Play, Loader2 } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const availableAvatars = PlaceHolderImages.filter(p => p.id.startsWith('ai-avatar-'));
const availableVoices = [
  { id: 'alloy', name: 'Alloy' },
  { id: 'echo', name: 'Echo' },
  { id: 'fable', name: 'Fable' },
  { id: 'onyx', name: 'Onyx' },
  { id: 'nova', name: 'Nova' },
  { id: 'shimmer', name: 'Shimmer' },
];

export function AvatarVoiceView() {
  const [selectedAvatar, setSelectedAvatar] = useState(availableAvatars[0]?.imageUrl || '');
  const [selectedVoice, setSelectedVoice] = useState(availableVoices[0].id);
  const [testText, setTestText] = useState('Hello! I am your personal AI assistant. This is a preview of my voice.');
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = React.useRef<HTMLAudioElement>(null);

  useEffect(() => {
    // Pre-select the first avatar on load
    if (availableAvatars.length > 0) {
      const savedAvatar = localStorage.getItem('selectedAiAvatar');
      setSelectedAvatar(savedAvatar || availableAvatars[0].imageUrl);
    }
    // Pre-select saved voice
    const savedVoice = localStorage.getItem('selectedAiVoice');
    if (savedVoice) {
      setSelectedVoice(savedVoice);
    }
  }, []);

  const handleAvatarSelect = (imageUrl: string) => {
    setSelectedAvatar(imageUrl);
    localStorage.setItem('selectedAiAvatar', imageUrl);
    // In a real app, you would also update the AI avatar in the main ChatView context/state
  };

  const handleVoiceSelect = (voiceId: string) => {
    setSelectedVoice(voiceId);
    localStorage.setItem('selectedAiVoice', voiceId);
  };
  
  const handlePlayTest = async () => {
    // This is a mock function. In a real application, this would call a text-to-speech API.
    setIsPlaying(true);
    setAudioUrl(null);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // For demonstration, we'll use the browser's built-in speech synthesis
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(testText);
      // Here you could try to map selectedVoice to available browser voices, but it's not guaranteed.
      // For a real implementation, you'd receive an audio file URL from your backend.
      speechSynthesis.speak(utterance);
      utterance.onend = () => setIsPlaying(false);
    } else {
        alert("Sorry, your browser doesn't support speech synthesis. This is a demo feature.");
        setIsPlaying(false);
    }
  };


  return (
    <div className="h-full p-4 md:p-8 bg-gray-50/50">
        <header className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800">Avatar & Voice</h1>
            <p className="text-lg text-gray-500">Customize the look and sound of your AI assistant.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Avatar Selection */}
            <div className="glassmorphic p-6 rounded-2xl">
                <h2 className="text-2xl font-semibold mb-4">Choose Your Avatar</h2>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                    {availableAvatars.map(avatar => (
                        <div key={avatar.id} onClick={() => handleAvatarSelect(avatar.imageUrl)} 
                             className={`p-1 rounded-full cursor-pointer transition-all duration-300 ${selectedAvatar === avatar.imageUrl ? 'ring-4 ring-blue-500' : 'ring-2 ring-transparent hover:ring-blue-300'}`}>
                            <Image 
                                src={avatar.imageUrl} 
                                alt={avatar.description} 
                                width={100} 
                                height={100}
                                className="w-full h-auto rounded-full aspect-square object-cover"
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Voice Selection */}
            <div className="glassmorphic p-6 rounded-2xl">
                <h2 className="text-2xl font-semibold mb-4">Select a Voice</h2>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="voice-select" className="font-medium text-gray-700">AI Voice</label>
                        <Select value={selectedVoice} onValueChange={handleVoiceSelect}>
                            <SelectTrigger id="voice-select" className="w-full mt-1">
                                <SelectValue placeholder="Select a voice" />
                            </SelectTrigger>
                            <SelectContent>
                                {availableVoices.map(voice => (
                                    <SelectItem key={voice.id} value={voice.id}>{voice.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <label htmlFor="test-text" className="font-medium text-gray-700">Test phrase</label>
                        <Textarea 
                            id="test-text"
                            value={testText}
                            onChange={(e) => setTestText(e.target.value)}
                            className="mt-1"
                            rows={3}
                        />
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <Button onClick={handlePlayTest} disabled={isPlaying}>
                            {isPlaying ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <Play className="mr-2 h-4 w-4" />
                                    Test Voice
                                </>
                            )}
                        </Button>
                        <p className="text-sm text-gray-500">Note: Voice selection is a demo. Uses browser's default speech synthesis.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}
