'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Truck, Activity } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface Vehicle {
  id: string;
  license: string;
  driver: string;
  status: 'active' | 'idle' | 'maintenance' | 'offline';
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  route: {
    origin: string;
    destination: string;
    progress: number;
    eta: string;
  };
  fuel: {
    level: number;
    efficiency: number;
    cost: number;
  };
  performance: {
    speed: number;
    distance: number;
    duration: string;
  };
}

interface FleetMapProps {
  vehicles: Vehicle[];
}

export default function FleetMap({ vehicles }: FleetMapProps) {
  const [mapCenter, setMapCenter] = useState({ lat: 44.4268, lng: 26.1025 }); // Bucharest default
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate map loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Calculate map bounds based on vehicle locations
  useEffect(() => {
    if (vehicles.length > 0) {
      const lats = vehicles.map(v => v.location.lat).filter(lat => lat !== 0);
      const lngs = vehicles.map(v => v.location.lng).filter(lng => lng !== 0);
      
      if (lats.length > 0 && lngs.length > 0) {
        const centerLat = lats.reduce((a, b) => a + b, 0) / lats.length;
        const centerLng = lngs.reduce((a, b) => a + b, 0) / lngs.length;
        setMapCenter({ lat: centerLat, lng: centerLng });
      }
    }
  }, [vehicles]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'idle': return 'bg-yellow-500';
      case 'maintenance': return 'bg-red-500';
      case 'offline': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-96 bg-slate-900/50 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <Navigation className="w-8 h-8 text-blue-400 animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading live map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-96 bg-slate-900/50 rounded-lg relative overflow-hidden">
      {/* Mock Map Background */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900"
        style={{
          backgroundImage: `
            radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(16, 185, 129, 0.1) 0%, transparent 50%),
            linear-gradient(45deg, transparent 40%, rgba(255, 255, 255, 0.02) 50%, transparent 60%)
          `
        }}
      />
      
      {/* Map Grid */}
      <div className="absolute inset-0 opacity-20">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgb(148, 163, 184)" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Center Marker */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
        <div className="w-2 h-2 bg-blue-400 rounded-full pulse-animation"></div>
        <div className="text-xs text-slate-400 mt-2 text-center whitespace-nowrap">
          Map Center: {mapCenter.lat.toFixed(4)}, {mapCenter.lng.toFixed(4)}
        </div>
      </div>

      {/* Vehicle Markers */}
      {vehicles.length === 0 ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <Truck className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">No vehicles to track</p>
            <p className="text-sm text-slate-500">Add vehicles to see them on the map</p>
          </div>
        </div>
      ) : (
        vehicles.map((vehicle, index) => (
          <div
            key={vehicle.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20 animate-pulse"
            style={{
              top: `${25 + (index * 15) % 50}%`,
              left: `${20 + (index * 20) % 60}%`,
            }}
          >
            <div className="relative group cursor-pointer">
              {/* Vehicle Marker */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getStatusColor(vehicle.status)} shadow-lg`}>
                <Truck className="w-4 h-4 text-white" />
              </div>
              
              {/* Status Ring */}
              {vehicle.status === 'active' && (
                <div className="absolute inset-0 rounded-full border-2 border-green-400 animate-ping opacity-75"></div>
              )}
              
              {/* Tooltip on Hover */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-30">
                <Card className="bg-slate-800/95 border-slate-700 shadow-xl">
                  <CardContent className="p-3 min-w-48">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-white">{vehicle.license}</span>
                        <span className={`px-2 py-1 rounded text-xs text-white ${getStatusColor(vehicle.status)}`}>
                          {vehicle.status}
                        </span>
                      </div>
                      
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center justify-between text-slate-300">
                          <span>Driver:</span>
                          <span>{vehicle.driver}</span>
                        </div>
                        
                        <div className="flex items-center justify-between text-slate-300">
                          <span>Fuel:</span>
                          <span>{vehicle.fuel.level}%</span>
                        </div>
                        
                        <div className="flex items-center justify-between text-slate-300">
                          <span>Speed:</span>
                          <span>{vehicle.performance.speed} km/h</span>
                        </div>
                        
                        <div className="flex items-center text-slate-400 mt-2">
                          <MapPin className="w-3 h-3 mr-1" />
                          <span className="text-xs truncate">{vehicle.location.address || 'Unknown location'}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        ))
      )}

      {/* Map Controls */}
      <div className="absolute top-4 right-4 space-y-2">
        <button className="w-8 h-8 bg-slate-800/80 hover:bg-slate-700 rounded flex items-center justify-center text-white text-lg font-bold transition-colors">
          +
        </button>
        <button className="w-8 h-8 bg-slate-800/80 hover:bg-slate-700 rounded flex items-center justify-center text-white text-lg font-bold transition-colors">
          −
        </button>
      </div>

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 bg-slate-800/80 rounded-lg p-3 text-xs">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-white">Active</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-white">Idle</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-white">Maintenance</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
            <span className="text-white">Offline</span>
          </div>
        </div>
      </div>

      {/* Real Map Integration Notice */}
      <div className="absolute top-4 left-4 bg-blue-600/80 rounded-lg p-2 text-xs text-white">
        🗺️ Demo Map - Connect Google Maps API for real tracking
      </div>

      <style jsx>{`
        @keyframes pulse-animation {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.1); }
        }
        
        .pulse-animation {
          animation: pulse-animation 2s infinite;
        }
      `}</style>
    </div>
  );
} 