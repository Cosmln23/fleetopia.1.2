'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Activity, 
  MapPin, 
  Cloud, 
  Navigation, 
  Fuel, 
  AlertTriangle,
  Truck,
  Clock,
  TrendingUp,
  RefreshCw,
  Zap,
  Eye
} from 'lucide-react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

// Dynamic imports for Leaflet components (client-side only)
const MapContainer = dynamic(() => import('react-leaflet').then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then((mod) => mod.Popup), { ssr: false });

// Custom marker icons
const createCustomIcon = (status: string) => {
  const color = status === 'active' ? '#22c55e' :
                status === 'idle' ? '#eab308' :
                status === 'maintenance' ? '#ef4444' : '#6b7280';

  if (typeof window !== 'undefined') {
    const L = require('leaflet');
    return L.divIcon({
      html: `
        <div style="
          background-color: ${color};
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        ">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
            <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/>
            <path d="M15 18H9"/>
            <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/>  
            <circle cx="17" cy="18" r="2"/>
            <circle cx="7" cy="18" r="2"/>
          </svg>
        </div>
      `,
      className: 'custom-marker',
      iconSize: [30, 30],
      iconAnchor: [15, 15],
      popupAnchor: [0, -15]
    });
  }
  return null;
};

interface RealTimeData {
  vehicleTracking: any[];
  weatherAlerts: any[];
  trafficIncidents: any[];
  fuelPrices: any[];
  systemAlerts: any[];
}

interface LiveMetrics {
  activeVehicles: number;
  ongoingTrips: number;
  fuelEfficiency: number;
  averageSpeed: number;
  alertsCount: number;
  complianceStatus: number;
}

interface IntegrationStatus {
  freight: boolean;
  gps: boolean;
  mapping: boolean;
  weather: boolean;
  traffic: boolean;
  communication: boolean;
  fuel: boolean;
  compliance: boolean;
  maintenance: boolean;
  financial: boolean;
}

export default function RealTimePage() {
  const [realTimeData, setRealTimeData] = useState<RealTimeData>({
    vehicleTracking: [],
    weatherAlerts: [],
    trafficIncidents: [],
    fuelPrices: [],
    systemAlerts: []
  });
  const [liveMetrics, setLiveMetrics] = useState<LiveMetrics>({
    activeVehicles: 0,
    ongoingTrips: 0,
    fuelEfficiency: 0,
    averageSpeed: 0,
    alertsCount: 0,
    complianceStatus: 0
  });
  const [integrationStatus, setIntegrationStatus] = useState<IntegrationStatus>({
    freight: false,
    gps: false,
    mapping: false,
    weather: false,
    traffic: false,
    communication: false,
    fuel: false,
    compliance: false,
    maintenance: false,
    financial: false
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);

  useEffect(() => {
    fetchRealTimeData();
    
    // Set up real-time updates every 10 seconds
    const interval = setInterval(() => {
      fetchRealTimeData(true);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const fetchRealTimeData = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    
    try {
      const response = await fetch('/api/real-time?type=all');
      const data = await response.json();
      
      if (data.success) {
        setRealTimeData(data.data);
        setLiveMetrics(data.data.liveMetrics);
        setIntegrationStatus(data.data.integrationStatus);
        setLastUpdate(new Date());
      }
    } catch (error) {
      console.error('Failed to fetch real-time data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleVehicleClick = (vehicle: any) => {
    setSelectedVehicle(vehicle);
    // Force map resize after vehicle selection
    setTimeout(() => {
      if (typeof window !== 'undefined' && window.dispatchEvent) {
        window.dispatchEvent(new Event('resize'));
      }
    }, 100);
  };

  const MetricCard = ({ icon: Icon, title, value, unit, color, trend }: any) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="relative overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <Icon className={`h-4 w-4 ${color}`} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {typeof value === 'number' ? value.toLocaleString() : value}
            {unit && <span className="text-sm font-normal text-muted-foreground ml-1">{unit}</span>}
          </div>
          {trend && (
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              {trend}% from last update
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );

  const AlertCard = ({ alert, type }: { alert: any, type: string }) => {
    const getAlertIcon = () => {
      switch (type) {
        case 'weather': return Cloud;
        case 'traffic': return Navigation;
        case 'fuel': return Fuel;
        case 'system': return AlertTriangle;
        default: return AlertTriangle;
      }
    };

    const getAlertColor = (severity: string) => {
      switch (severity) {
        case 'critical': return 'text-red-600';
        case 'high': return 'text-orange-600';
        case 'medium': return 'text-yellow-600';
        case 'low': return 'text-blue-600';
        default: return 'text-gray-600';
      }
    };

    const Icon = getAlertIcon();

    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Icon className={`h-5 w-5 mt-0.5 ${getAlertColor(alert.severity)}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-sm">{alert.title}</h4>
                  <Badge variant={alert.severity === 'critical' ? 'destructive' : 'secondary'}>
                    {alert.severity}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{alert.message}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {new Date(alert.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  const IntegrationStatusCard = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Integration Status
        </CardTitle>
        <CardDescription>Real-time system integration health</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Object.entries(integrationStatus).map(([key, status]) => (
            <div key={key} className="flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full ${status ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-sm capitalize">{key}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Loading real-time data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Real-Time Dashboard</h1>
          <p className="text-muted-foreground">
            Live data streaming from all integrated systems
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </div>
          <Button 
            onClick={() => fetchRealTimeData(true)} 
            disabled={refreshing}
            size="sm"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Live Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
        <MetricCard
          icon={Truck}
          title="Active Vehicles"
          value={liveMetrics.activeVehicles}
          color="text-blue-600"
        />
        <MetricCard
          icon={MapPin}
          title="Ongoing Trips"
          value={liveMetrics.ongoingTrips}
          color="text-green-600"
        />
        <MetricCard
          icon={Fuel}
          title="Fuel Efficiency"
          value={liveMetrics.fuelEfficiency}
          unit="L/100km"
          color="text-yellow-600"
          trend={-2.1}
        />
        <MetricCard
          icon={Navigation}
          title="Avg Speed"
          value={liveMetrics.averageSpeed}
          unit="km/h"
          color="text-purple-600"
        />
        <MetricCard
          icon={AlertTriangle}
          title="Active Alerts"
          value={liveMetrics.alertsCount}
          color="text-red-600"
        />
        <MetricCard
          icon={Clock}
          title="Compliance"
          value={liveMetrics.complianceStatus}
          unit="%"
          color="text-emerald-600"
          trend={0.1}
        />
      </div>

      {/* Integration Status */}
      <IntegrationStatusCard />

      {/* Real-time Data Tabs */}
      <Tabs defaultValue="tracking" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="tracking">Vehicle Tracking</TabsTrigger>
          <TabsTrigger value="alerts">System Alerts</TabsTrigger>
          <TabsTrigger value="weather">Weather</TabsTrigger>
          <TabsTrigger value="traffic">Traffic</TabsTrigger>
          <TabsTrigger value="fuel">Fuel Prices</TabsTrigger>
        </TabsList>

                <TabsContent value="tracking" className="space-y-4">
          {/* Combined Vehicle List + Map Layout */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Fleet Vehicle Tracking & Live Map
              </CardTitle>
              <CardDescription>
                Real-time vehicle locations and status - Click on any vehicle to focus on map
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Vehicle List - Left Side */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg mb-4">Active Vehicles</h3>
                  {realTimeData.vehicleTracking.length > 0 ? (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {realTimeData.vehicleTracking.map((tracking, index) => (
                        <div 
                          key={index} 
                          className={`p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                            selectedVehicle?.id === tracking.id ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500' : ''
                          }`}
                          onClick={() => handleVehicleClick(tracking)}
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <Truck className="h-4 w-4 text-blue-600" />
                            <div className="font-medium flex items-center gap-2">
                              Vehicle {tracking.vehicleId.slice(-6)}
                              {selectedVehicle?.id === tracking.id && (
                                <Badge variant="secondary" className="text-xs">
                                  <Eye className="h-3 w-3 mr-1" />
                                  Focused
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground grid grid-cols-2 gap-2">
                            <span>Speed: {tracking.speed}km/h</span>
                            <span>Status: {tracking.status}</span>
                            <span>Fuel: {tracking.fuel}%</span>
                            <span>Driver: {tracking.driver}</span>
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {tracking.location.lat.toFixed(4)}, {tracking.location.lng.toFixed(4)} • {new Date(tracking.timestamp).toLocaleTimeString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No tracking data available</p>
                    </div>
                  )}
                </div>

                {/* Map - Right Side */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg">Live Fleet Map</h3>
                    <div className="text-sm text-muted-foreground">
                      {selectedVehicle 
                        ? `Focused: ${selectedVehicle.vehicleId.slice(-6)}`
                        : 'All vehicles visible'
                      }
                    </div>
                  </div>
                  <div className="h-96 rounded-lg overflow-hidden border">
                    {typeof window !== 'undefined' ? (
                      <MapContainer
                        center={selectedVehicle 
                          ? [selectedVehicle.location.lat, selectedVehicle.location.lng]
                          : [45.7489, 21.2087] // Timișoara center as default
                        }
                        zoom={selectedVehicle ? 13 : 7}
                        style={{ height: '100%', width: '100%' }}
                        className="rounded-lg"
                        key={selectedVehicle?.id || 'default-map'}
                      >
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      />
                      {/* Show all vehicles */}
                      {realTimeData.vehicleTracking.map((vehicle, index) => (
                        <Marker
                          key={index}
                          position={[vehicle.location.lat, vehicle.location.lng]}
                          icon={createCustomIcon(vehicle.status)}
                        >
                          <Popup>
                            <div className="p-2">
                              <h3 className="font-semibold">{vehicle.name}</h3>
                              <p className="text-sm text-gray-600">Driver: {vehicle.driver}</p>
                              <p className="text-sm text-gray-600">Speed: {vehicle.speed} km/h</p>
                              <p className="text-sm text-gray-600">Fuel: {vehicle.fuel}%</p>
                              <p className="text-sm text-gray-600">Status: {vehicle.status}</p>
                              <p className="text-sm text-gray-600">Route: {vehicle.route}</p>
                            </div>
                          </Popup>
                        </Marker>
                      ))}
                      </MapContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center bg-gray-800 text-white">
                        <div className="text-center">
                          <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>Loading map...</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Selected Vehicle Details - Bottom */}
              {selectedVehicle && (
                <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <h4 className="font-medium mb-3">Selected Vehicle Details</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Speed:</span>
                      <div className="font-medium">{selectedVehicle.speed} km/h</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Fuel:</span>
                      <div className="font-medium">{selectedVehicle.fuel}%</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Driver:</span>
                      <div className="font-medium">{selectedVehicle.driver}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Route:</span>
                      <div className="font-medium">{selectedVehicle.route}</div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {realTimeData.systemAlerts.length > 0 ? (
              realTimeData.systemAlerts.map((alert, index) => (
                <AlertCard key={index} alert={alert} type="system" />
              ))
            ) : (
              <div className="col-span-2 text-center py-8 text-muted-foreground">
                <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No active alerts</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="weather" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {realTimeData.weatherAlerts.length > 0 ? (
              realTimeData.weatherAlerts.map((alert, index) => (
                <AlertCard key={index} alert={alert} type="weather" />
              ))
            ) : (
              <div className="col-span-2 text-center py-8 text-muted-foreground">
                <Cloud className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No weather alerts</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="traffic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Navigation className="h-5 w-5" />
                Traffic Incidents
              </CardTitle>
              <CardDescription>Current traffic incidents and road conditions</CardDescription>
            </CardHeader>
            <CardContent>
              {realTimeData.trafficIncidents.length > 0 ? (
                <div className="space-y-4">
                  {realTimeData.trafficIncidents.map((incident, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant={incident.severity === 'high' ? 'destructive' : 'secondary'}>
                          {incident.severity}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {new Date(incident.startTime).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm mb-2">{incident.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {incident.location}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Navigation className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No traffic incidents</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fuel" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Fuel className="h-5 w-5" />
                Fuel Prices
              </CardTitle>
              <CardDescription>Latest fuel prices from nearby stations</CardDescription>
            </CardHeader>
            <CardContent>
              {realTimeData.fuelPrices.length > 0 ? (
                <div className="space-y-4">
                  {realTimeData.fuelPrices.slice(0, 5).map((price, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{price.fuelType}</div>
                        <div className="text-sm text-muted-foreground">{price.station}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">${price.price}</div>
                        <div className="text-xs text-muted-foreground">per liter</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Fuel className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No fuel price data available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Live Data Stream Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="fixed bottom-4 right-4 bg-background border rounded-lg shadow-lg p-4 max-w-sm z-50"
      >
        <div className="flex items-center gap-2 mb-2">
          <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium">Live Data Stream</span>
        </div>
        <div className="text-xs text-muted-foreground space-y-1">
          <div>Updates: Every 10 seconds</div>
          <div>Data Sources: {Object.values(integrationStatus).filter(Boolean).length}/10 Active</div>
          <div>Latency: {Math.floor(Math.random() * 50) + 20}ms</div>
          {selectedVehicle && (
            <div className="text-green-600 font-medium">
              🗺️ Map: Vehicle {selectedVehicle.vehicleId.slice(-6)}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
} 