'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Bot, 
  Users, 
  ShoppingCart, 
  Activity, 
  TrendingUp, 
  Zap, 
  TreePine,
  Target,
  Sparkles,
  Heart,
  Cpu,
  Network,
  BarChart3,
  Clock,
  CheckCircle,
  AlertCircle,
  Truck,
  MapPin,
  Fuel,
  Navigation,
  DollarSign
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import DigitalScreen from '@/components/digital-screen';
import MetricCard from '@/components/metric-card';

interface EnhancedDashboardMetrics {
  totalAgents: number;
  activeAgents: number;
  totalRevenue: number;
  avgPerformance: number;
  totalRequests: number;
  avgResponseTime: number;
  evolutionCycles: number;
  learningAgents: number;
  avgConfidenceScore: number;
  treeDepth: number;
  branchEfficiency: number;
  protocolCompliance: number;
  validationScore: number;
  happinessScore: number;
  sustainabilityIndex: number;
  innovationRate: number;
  // Modern fleet metrics
  totalFleets: number;
  modernVehicles: number;
  modernDrivers: number;
  modernTrips: number;
  apiIntegrations: number;
  realTimeAlerts: number;
  fuelStations: number;
  complianceScore: number;
  // API integration metrics
  freightLoads: number;
  weatherAlerts: number;
  trafficIncidents: number;
  maintenanceAlerts: number;
  financialTransactions: number;
}

export default function Home() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-6">
        Welcome to Fleetopia.co
      </h1>
      <p className="text-xl mb-4">
        Self-Evolving AI Marketplace for Transport Paradise
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-6 bg-gray-800 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">AI Agents</h2>
          <p>7 specialized agents that evolve daily</p>
        </div>
        <div className="p-6 bg-gray-800 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Digital Tree</h2>
          <p>Hierarchical structure inspired by nature</p>
        </div>
        <div className="p-6 bg-gray-800 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Protocol v2.0</h2>
          <p>Standardized INPUT/OUTPUT for all agents</p>
        </div>
      </div>
    </div>
  );
} 
