"use client"

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Play, Pause } from 'lucide-react';
import { io } from 'socket.io-client';


// const socket = io('http://localhost:3000');
// const socket = io({
//   path: '/api/socketio'
// });

// Replace the current socket initialization

// const socketRef = React.useRef<any>(null);


type Reaction = {
  id: number;
  type: string;
  timestamp: number;
  userId: string;
  username: string;
  createdAt: string;
}

interface VideoCompanionProps {
  username: string;
}

const VideoCompanion = ({ username }: VideoCompanionProps) => {
  const socketRef = useRef<any>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCommunityMode, setIsCommunityMode] = useState(false);
  const [reactions, setReactions] = useState<Reaction[]>([]); 
  const [activeUsers, setActiveUsers] = useState<string[]>([]);
  const [activeReactions, setActiveReactions] = useState<Reaction[]>([]);

  useEffect(() => {
    const fetchInitialReactions = async () => {
      try {
        const response = await fetch('/api/reactions');
        const data = await response.json();
        
        if (Array.isArray(data)) {
          setReactions(data);
        } else {
          console.error('Expected array of reactions but got:', data);
          setReactions([]);
        }
      } catch (error) {
        console.error('Error fetching reactions:', error);
        setReactions([]);
      }
    };
  
    fetchInitialReactions();
  }, []);

  useEffect(() => {
    const initSocket = async () => {
      await fetch('/api/socket');
      socketRef.current = io({
        path: '/api/socket'
      });

      socketRef.current.on('reaction-received', (reaction: Reaction) => {
        setReactions(prev => [...prev, reaction]);
      });
    };

    initSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    let interval: string | number | NodeJS.Timeout | undefined;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= 3600) {
            clearInterval(interval);
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);
  
  useEffect(() => {
    const updateUserActivity = async () => {
      await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username })
      });
    };
  
    const interval: NodeJS.Timeout = setInterval(updateUserActivity, 30000);
    updateUserActivity();
  
    return () => clearInterval(interval);
  }, [username]);
  
  useEffect(() => {
    const fetchActiveUsers = async () => {
      const response = await fetch('/api/users');
      const data = await response.json();
      setActiveUsers(data.map((user: { username: any; }) => user.username));
    };
  
    const interval: NodeJS.Timeout = setInterval(fetchActiveUsers, 30000);
    fetchActiveUsers();
  
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isCommunityMode) {
      const currentReactions = reactions.filter(reaction => reaction.timestamp === currentTime);
      setActiveReactions(currentReactions);
      
      if (currentReactions.length > 0) {
        const timeout = setTimeout(() => {
          setActiveReactions([]);
        }, 1000);
        return () => clearTimeout(timeout);
      }
    }
  }, [currentTime, reactions, isCommunityMode]);

  // useEffect(() => {
  //   socket.on('reaction-received', (reaction: Reaction) => {
  //     setReactions(prev => [...prev, reaction]);
  //   });

  //   return () => {
  //     socket.off('reaction-received');
  //   };
  // }, []);

  const formatTime = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getReactionMessage = (type: string): string => {
    switch (type) {
      case 'gasp': return '*Gasp* I did NOT see that coming! 👀';
      case 'terrible': return 'How can anyone be THIS terrible?! 😤';
      case 'kiss': return 'JUST KISS ALREADY!!! 😩❤️';
      case 'crying': return 'Sobbing uncontrollably "Why am I crying right now!!"';
      case 'next': return 'I need the next episode right now… Please, I beg!';
      case 'outfit': return 'I want that fit!';
      case 'song': return 'This song is way too good!';
      case 'communication': return 'This could all be solved with better communication. 🤦‍♀️';
      case 'cheesy': return 'It\'s cheesy but… I love it! 🥰';
      default: return '';
    }
  };

  const handleReaction = async (type: string) => {
    const newReaction: Reaction = {
      id: Date.now(),
      type,
      timestamp: currentTime,
      userId: username,
      username: username,
      createdAt: new Date().toISOString()
    };
  
    try {
      const response = await fetch('/api/reactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReaction)
      });
  
      if (response.ok) {
        setReactions(prev => Array.isArray(prev) ? [...prev, newReaction] : [newReaction]);
        if (socketRef.current) {
          socketRef.current.emit('new-reaction', newReaction);
        }
      }
    } catch (error) {
      console.error('Error saving reaction:', error);
    }
  };

  const FloatingReaction = ({ reaction }: { reaction: Reaction }) => {
    return (
      <div className="flex items-center space-x-2 bg-white rounded-lg px-4 py-2 shadow-md animate-in fade-in slide-in-from-bottom duration-300 text-black">   
        <span className="text-sm font-medium">{reaction.username}:</span>
        <span className="text-sm">{getReactionMessage(reaction.type)}</span>
      </div>
    );
  };

  return (
    <Card className="w-full max-w-4xl relative">
      {isCommunityMode && (
        <div className="absolute top-4 left-0 right-0 flex justify-center">
          <div className="space-y-2">
            {activeReactions.map((reaction) => (
              <FloatingReaction key={reaction.id} reaction={reaction} />
            ))}
          </div>
        </div>
      )}

      <CardContent className="p-6">
        <div className="relative group">
          <div 
            role="tooltip"
            className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity"
          >
            {formatTime(currentTime)}
          </div>

          <div 
            className="w-full h-2 bg-gray-200 rounded-full cursor-pointer mb-4 relative group hover:h-3 transition-all"
            onMouseDown={(e) => {
              const progressBar = e.currentTarget;
              
              const handleMouseMove = (moveEvent: MouseEvent) => {
                const rect = progressBar.getBoundingClientRect();
                const x = moveEvent.clientX - rect.left;
                const percentage = Math.min(Math.max(x / rect.width, 0), 1);
                const newTime = Math.floor(percentage * 3600);
                setCurrentTime(newTime);
              };

              const handleMouseUp = () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
              };

              handleMouseMove(e.nativeEvent);
              document.addEventListener('mousemove', handleMouseMove);
              document.addEventListener('mouseup', handleMouseUp);
            }}
          >
            <div 
              className="h-full bg-purple-500 rounded-full relative"
              style={{ width: `${(currentTime / 3600) * 100}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg transform scale-0 group-hover:scale-100 transition-transform -translate-x-1/2" />
            </div>
            
            {isCommunityMode && reactions && reactions.map((reaction) => (
              <div
                key={reaction.id}
                className="absolute top-0 w-1 h-full hover:h-4 transition-all"
                style={{
                  left: `${(reaction.timestamp / 3600) * 100}%`,
                  backgroundColor: 'rgba(59, 130, 246, 0.5)'
                }}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <span className="text-lg font-mono">{formatTime(currentTime)}</span>
          <div className="space-x-4">
            <Button
              variant="outline"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button
              variant={isCommunityMode ? "default" : "outline"}
              onClick={() => setIsCommunityMode(!isCommunityMode)}
            >
              Community Mode
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          <Button 
            variant="outline" 
            className="text-xs leading-tight py-4 h-auto flex flex-col items-center justify-center text-center min-h-24"
            onClick={() => handleReaction('gasp')}
          >
            <span>*Gasp*</span>
            <span>"I did NOT see</span>
            <span>that coming!" 👀</span>
          </Button>
          <Button 
            variant="outline"
            className="text-xs leading-tight py-4 h-auto flex flex-col items-center justify-center text-center min-h-24"
            onClick={() => handleReaction('terrible')}
          >
            <span>"How can anyone</span>
            <span>be THIS</span>
            <span>terrible?!" 😤</span>
          </Button>
          <Button 
            variant="outline"
            className="text-xs leading-tight py-4 h-auto flex flex-col items-center justify-center text-center min-h-24"
            onClick={() => handleReaction('kiss')}
          >
            <span>"JUST KISS</span>
            <span>ALREADY!!!"</span>
            <span>😩❤️</span>
          </Button>
          <Button 
            variant="outline"
            className="text-xs leading-tight py-4 h-auto flex flex-col items-center justify-center text-center min-h-24"
            onClick={() => handleReaction('crying')}
          >
            <span>Sobbing uncontrollably</span>
            <span>"Why am I crying</span>
            <span>right now!!"</span>
          </Button>
          <Button 
            variant="outline"
            className="text-xs leading-tight py-4 h-auto flex flex-col items-center justify-center text-center min-h-24"
            onClick={() => handleReaction('next')}
          >
            <span>I need the next</span>
            <span>episode right now…</span>
            <span>Please, I beg!</span>
          </Button>
          <Button 
            variant="outline"
            className="text-xs leading-tight py-4 h-auto flex flex-col items-center justify-center text-center min-h-24"
            onClick={() => handleReaction('outfit')}
          >
            <span>"I want</span>
            <span>that fit!"</span>
          </Button>
          <Button 
            variant="outline"
            className="text-xs leading-tight py-4 h-auto flex flex-col items-center justify-center text-center min-h-24"
            onClick={() => handleReaction('song')}
          >
            <span>"This song is</span>
            <span>way too good!"</span>
          </Button>
          <Button 
            variant="outline"
            className="text-xs leading-tight py-4 h-auto flex flex-col items-center justify-center text-center min-h-24"
            onClick={() => handleReaction('communication')}
          >
            <span>"This could all</span>
            <span>be solved with</span>
            <span>better communication."</span>
            <span>🤦‍♀️</span>
          </Button>
          <Button 
            variant="outline"
            className="text-xs leading-tight py-4 h-auto flex flex-col items-center justify-center text-center min-h-24"
            onClick={() => handleReaction('cheesy')}
          >
            <span>"It's cheesy but…</span>
            <span>I love it!"</span>
            <span>🥰</span>
          </Button>
        </div>

        {isCommunityMode && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Community Reactions</h3>
            <div className="max-h-60 overflow-y-auto space-y-2">
              {reactions && reactions.map((reaction) => (
                <div key={reaction.id} className="flex items-center gap-3 text-sm bg-gray-50 p-2 rounded text-black">
                  <span className="font-mono">{formatTime(reaction.timestamp)}</span>
                  <span className="font-semibold text-blue-600">{reaction.username}</span>
                  <span className="text-sm">
                    {getReactionMessage(reaction.type)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {isCommunityMode && (
          <div className="absolute top-2 right-2 text-sm">
            <div className="text-gray-600">Active Users:</div>
            <div className="flex flex-wrap gap-1">
              {activeUsers && activeUsers.map(user => (
                <span key={user} className="px-2 py-1 bg-gray-100 rounded text-xs">
                  {user}
                </span>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VideoCompanion;