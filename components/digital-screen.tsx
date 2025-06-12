'use client';

import { useState, useEffect } from 'react';
import { Clock, Wifi, Activity, Zap, AlertTriangle } from 'lucide-react';

interface DigitalScreenProps {
  className?: string;
  fleetEfficiency?: number;
  aiProcessingRate?: number;
  systemStatus?: 'online' | 'maintenance' | 'offline';
}

export default function DigitalScreen({ 
  className = '', 
  fleetEfficiency = 0, 
  aiProcessingRate = 0,
  systemStatus = 'online'
}: DigitalScreenProps) {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [displayEfficiency, setDisplayEfficiency] = useState(fleetEfficiency);
  const [displayProcessingRate, setDisplayProcessingRate] = useState(aiProcessingRate);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Mark that we're on the client and set initial time
    setIsClient(true);
    setCurrentTime(new Date());

    const timer = setInterval(() => {
      setCurrentTime(new Date());
      
      // Only add minor fluctuations if we have real data (> 0)
      if (fleetEfficiency > 0) {
        setDisplayEfficiency(prev => {
          const change = (Math.random() - 0.5) * 0.1; // Smaller fluctuations for real data
          return Math.max(fleetEfficiency - 1, Math.min(fleetEfficiency + 1, prev + change));
        });
      }
      
      if (aiProcessingRate > 0) {
        setDisplayProcessingRate(prev => {
          const change = Math.floor((Math.random() - 0.5) * 10); // Smaller fluctuations for real data
          return Math.max(aiProcessingRate - 10, Math.min(aiProcessingRate + 10, prev + change));
        });
      }
    }, 2000); // Update every 2 seconds instead of 1

    return () => clearInterval(timer);
  }, [fleetEfficiency, aiProcessingRate]);

  // Update display values when props change
  useEffect(() => {
    setDisplayEfficiency(fleetEfficiency);
    setDisplayProcessingRate(aiProcessingRate);
  }, [fleetEfficiency, aiProcessingRate]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className={`terminal-border rounded-lg p-6 matrix-text ${className}`}>
      <div className="scan-line mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-green-400" />
            <span className="text-green-400 text-sm">SYSTEM TIME</span>
          </div>
          <div className="flex items-center space-x-2">
            <Wifi className={`w-4 h-4 ${systemStatus === 'online' ? 'text-green-400' : 'text-red-400'}`} />
            <span className={`text-xs ${systemStatus === 'online' ? 'text-green-400' : 'text-red-400'}`}>
              {systemStatus.toUpperCase()}
            </span>
          </div>
        </div>
        
        <div className="text-2xl font-mono text-white mb-1">
          {isClient && currentTime ? formatTime(currentTime) : '--:--:--'}
        </div>
        <div className="text-sm text-gray-400 mb-4">
          {isClient && currentTime ? formatDate(currentTime) : 'Loading...'}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="metric-card rounded p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-green-400" />
              <span className="text-xs text-gray-300">FLEET EFFICIENCY</span>
            </div>
            <span className={`text-xs pulse-green ${displayEfficiency > 0 ? 'text-green-400' : 'text-gray-400'}`}>
              {displayEfficiency > 0 ? '●' : '○'}
            </span>
          </div>
          <div className="text-xl font-mono text-white">
            {displayEfficiency > 0 ? `${displayEfficiency.toFixed(1)}%` : '---%'}
          </div>
        </div>

        <div className="metric-card rounded p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-green-400" />
              <span className="text-xs text-gray-300">AI PROCESSING</span>
            </div>
            <span className={`text-xs pulse-green ${displayProcessingRate > 0 ? 'text-green-400' : 'text-gray-400'}`}>
              {displayProcessingRate > 0 ? '●' : '○'}
            </span>
          </div>
          <div className="text-xl font-mono text-white">
            {displayProcessingRate > 0 ? `${Math.round(displayProcessingRate)} req/min` : '-- req/min'}
          </div>
        </div>

        <div className="metric-card rounded p-4 md:col-span-2">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-yellow-400" />
              <span className="text-xs text-gray-300">SYSTEM STATUS</span>
            </div>
            <span className="text-green-400 text-xs">
              {fleetEfficiency > 0 || aiProcessingRate > 0 ? 'OPERATIONAL' : 'STANDBY'}
            </span>
          </div>
          <div className="flex space-x-4 text-sm">
            <span className="text-green-400">● Core Systems</span>
            <span className={fleetEfficiency > 0 ? 'text-green-400' : 'text-gray-400'}>
              {fleetEfficiency > 0 ? '●' : '○'} Fleet Manager
            </span>
            <span className={aiProcessingRate > 0 ? 'text-green-400' : 'text-gray-400'}>
              {aiProcessingRate > 0 ? '●' : '○'} AI Agents
            </span>
            <span className="text-green-400">● Database</span>
          </div>
        </div>
      </div>
    </div>
  );
}
