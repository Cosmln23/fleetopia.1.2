'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bot, 
  Search, 
  Star, 
  Filter, 
  TrendingUp, 
  ShoppingCart,
  Download,
  Zap,
  Shield,
  Clock,
  Users,
  ExternalLink
} from 'lucide-react';
import { AgentCardEnhanced } from '@/components/marketplace/agent-card-enhanced';
import { RouteOptimizerModal } from '@/components/marketplace/route-optimizer-modal';
import { FuelMasterModal } from '@/components/marketplace/fuel-master-modal';
import { DeliveryPredictorModal } from '@/components/marketplace/delivery-predictor-modal';

  const featuredAgents = [
    {
      id: 'route-optimizer-pro',
      name: 'RouteOptimizer Pro',
      description: 'AI-powered route optimization with ML learning',
      version: '3.0.0',
      category: 'Optimization',
      capabilities: ['ML route planning', 'Neural predictions', 'Real-time learning'],
      marketplace: true,
      price: 299,
      rating: 4.9,
      downloads: 1847,
      performance: {
        accuracy: 90,
        speed: 95,
        reliability: 94,
        security: 92
      },
      status: 'active' as const,
      isTemplate: false,
      requiresAPI: ['Google Maps', 'Traffic Data'],
      owner: {
        name: 'FleetAI Labs',
        verified: true
      },
      lastUpdated: new Date(),
      validationScore: 95.2,
      mlEnhanced: true,
      features: [
        'ML-enhanced route planning',
        'Real-time traffic optimization', 
        'Neural network predictions',
        'Continuous learning',
        '5-40% cost savings',
        'TensorFlow.js integration'
      ]
    },
  {
    id: '2',
    name: 'FuelMaster AI',
    description: 'Complete fuel optimization ecosystem with 3 advanced AI engines: Predictive Fuel Consumption AI (7-day forecasting), Dynamic Fuel Pricing Optimizer (real-time cost optimization), and Micro-Optimization Fuel Engine (driving behavior coaching)',
    version: '1.8.3',
    category: 'Analytics',
    capabilities: [
      'Predictive Fuel Consumption AI', 
      'Dynamic Fuel Pricing Optimizer', 
      'Micro-Optimization Fuel Engine',
      'Real-time driving coaching',
      '7-day fuel forecasting',
      'Market trend analysis',
      'Cost optimization'
    ],
    marketplace: true,
    price: 199,
    rating: 4.8,
    downloads: 834,
    performance: {
      accuracy: 91,
      speed: 88,
      reliability: 94,
      security: 92
    },
    status: 'active' as const,
    isTemplate: false,
    requiresAPI: ['Fuel Price API', 'Vehicle Diagnostics', 'Weather API', 'IoT Sensors'],
    owner: {
      name: 'FuelTech Solutions',
      verified: true
    },
    lastUpdated: new Date(),
    validationScore: 91.7
  },
  {
    id: '3',
    name: 'DeliveryPredictor',
    description: 'ML-powered delivery time predictions and scheduling',
    version: '1.5.2',
    category: 'Prediction',
    capabilities: ['Time prediction', 'Smart scheduling', 'Customer notifications'],
    marketplace: true,
    price: 149,
    rating: 4.7,
    downloads: 567,
    performance: {
      accuracy: 88,
      speed: 85,
      reliability: 91,
      security: 87
    },
    status: 'active' as const,
    isTemplate: false,
    requiresAPI: ['Weather API', 'Calendar Integration'],
    owner: {
      name: 'PredictAI Corp',
      verified: true
    },
    lastUpdated: new Date(),
    validationScore: 88.9
  },
  {
    id: '4',
    name: 'FleetGuardian',
    description: 'Comprehensive fleet security and monitoring solution',
    version: '3.0.1',
    category: 'Security',
    capabilities: ['Real-time monitoring', 'Theft prevention', 'Driver behavior'],
    marketplace: true,
    price: 399,
    rating: 4.9,
    downloads: 923,
    performance: {
      accuracy: 96,
      speed: 93,
      reliability: 98,
      security: 99
    },
    status: 'active' as const,
    isTemplate: false,
    requiresAPI: ['GPS Tracking', 'Security Cameras'],
    owner: {
      name: 'SecureFleet Inc',
      verified: true
    },
    lastUpdated: new Date(),
    validationScore: 96.1,
    comingSoon: true
  },
  {
    id: '5',
    name: 'MaintenanceGenie',
    description: 'Predictive maintenance scheduling and cost optimization',
    version: '2.2.0',
    category: 'Maintenance',
    capabilities: ['Predictive alerts', 'Cost optimization', 'Supplier network'],
    marketplace: true,
    price: 249,
    rating: 4.6,
    downloads: 445,
    performance: {
      accuracy: 87,
      speed: 82,
      reliability: 89,
      security: 91
    },
    status: 'active' as const,
    isTemplate: false,
    requiresAPI: ['Vehicle Sensors', 'Parts Database'],
    owner: {
      name: 'MaintenanceAI Ltd',
      verified: true
    },
    lastUpdated: new Date(),
    validationScore: 87.3,
    comingSoon: true
  },
  {
    id: '6',
    name: 'CustomerConnect',
    description: 'AI-powered customer communication and satisfaction tracking',
    version: '1.9.5',
    category: 'Customer Service',
    capabilities: ['Auto-notifications', 'Satisfaction tracking', 'Support automation'],
    marketplace: true,
    price: 179,
    rating: 4.8,
    downloads: 678,
    performance: {
      accuracy: 92,
      speed: 89,
      reliability: 95,
      security: 88
    },
    status: 'active' as const,
    isTemplate: false,
    requiresAPI: ['SMS Gateway', 'Email Service'],
    owner: {
      name: 'CustomerCare AI',
      verified: true
    },
    lastUpdated: new Date(),
    validationScore: 92.4,
    comingSoon: true
  }
];

export default function MarketplacePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState<'marketplace' | 'my-agents' | 'connected'>('marketplace');
  const [showRouteOptimizerModal, setShowRouteOptimizerModal] = useState(false);
  const [showFuelMasterModal, setShowFuelMasterModal] = useState(false);
  const [showDeliveryPredictorModal, setShowDeliveryPredictorModal] = useState(false);

  const categories = ['All', 'Optimization', 'Analytics', 'Prediction', 'Security', 'Maintenance', 'Customer Service'];

  const filteredAgents = featuredAgents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || agent.category === selectedCategory;
    
    // For demo purposes, consider agents 2 and 5 as connected
    const isConnected = agent.id === '2' || agent.id === '5';
    
    if (viewMode === 'connected') {
      return matchesSearch && matchesCategory && isConnected;
    }
    if (viewMode === 'my-agents') {
      return matchesSearch && matchesCategory && isConnected;
    }
    return matchesSearch && matchesCategory;
  });

  const handleViewDetails = (agentId: string) => {
    if (agentId === 'route-optimizer-pro') {
      setShowRouteOptimizerModal(true);
    } else if (agentId === '2') {
      setShowFuelMasterModal(true);
    } else if (agentId === '3') {
      setShowDeliveryPredictorModal(true);
    } else {
      console.log('View details:', agentId);
    }
  };

  const handleBuyRouteOptimizer = () => {
    console.log('Buy RouteOptimizer Pro');
    // Add purchase logic here
    setShowRouteOptimizerModal(false);
  };

  const handleBuyFuelMaster = () => {
    console.log('Buy FuelMaster AI');
    // Add purchase logic here
    setShowFuelMasterModal(false);
  };

  const handleBuyDeliveryPredictor = () => {
    console.log('Buy DeliveryPredictor');
    // Add purchase logic here
    setShowDeliveryPredictorModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="container mx-auto px-6 py-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                AI Marketplace
              </h1>
              <p className="text-slate-400 text-lg">
                Discover, connect, and optimize with intelligent fleet agents
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-green-400 border-green-400">
                <Bot className="w-4 h-4 mr-2" />
                {featuredAgents.length} Agents Available
              </Badge>
              <Button>
                <ShoppingCart className="w-4 h-4 mr-2" />
                My Cart (0)
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Total Agents</p>
                  <p className="text-2xl font-bold text-white">{featuredAgents.length}</p>
                </div>
                <Bot className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
          
                           <Card className="bg-slate-800/50 border-slate-700">
             <CardContent className="p-4">
               <div className="flex items-center justify-between">
                 <div>
                   <p className="text-sm text-slate-400">Connected</p>
                   <p className="text-2xl font-bold text-green-400">
                     {featuredAgents.filter(a => a.id === '2' || a.id === '5').length}
                   </p>
                 </div>
                 <Zap className="w-8 h-8 text-green-400" />
               </div>
             </CardContent>
           </Card>
          
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Avg Rating</p>
                  <p className="text-2xl font-bold text-yellow-400">4.8</p>
                </div>
                <Star className="w-8 h-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Total Users</p>
                  <p className="text-2xl font-bold text-purple-400">4.7K</p>
                </div>
                <Users className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search */}
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <Input
                      placeholder="Search agents..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-slate-700/50 border-slate-600"
                    />
                  </div>
                </div>

                {/* Category Filter */}
                <div className="flex gap-2 overflow-x-auto">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                      className="whitespace-nowrap"
                    >
                      {category}
                    </Button>
                  ))}
                </div>

                {/* View Mode */}
                <div className="flex gap-2">
                  <Button
                    variant={viewMode === 'marketplace' ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode('marketplace')}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Marketplace
                  </Button>
                  <Button
                    variant={viewMode === 'connected' ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode('connected')}
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Connected
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Agents Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
        >
          {filteredAgents.map((agent, index) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <AgentCardEnhanced
                agent={agent}
                view={viewMode}
                onConnect={() => console.log('Connect agent:', agent.id)}
                onEdit={() => console.log('Edit agent:', agent.id)}
                onDelete={() => console.log('Delete agent:', agent.id)}
                onToggleStatus={() => console.log('Toggle status:', agent.id)}
                onViewDetails={handleViewDetails}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {filteredAgents.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Bot className="w-16 h-16 mx-auto text-slate-600 mb-4" />
            <h3 className="text-xl font-semibold text-slate-300 mb-2">No agents found</h3>
            <p className="text-slate-400 mb-6">
              Try adjusting your search criteria or browse different categories
            </p>
            <Button onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }}>
              Reset Filters
            </Button>
          </motion.div>
        )}

        {/* RouteOptimizer Pro Modal */}
        <RouteOptimizerModal
          isOpen={showRouteOptimizerModal}
          onClose={() => setShowRouteOptimizerModal(false)}
          onBuy={handleBuyRouteOptimizer}
        />

        {/* FuelMaster AI Modal */}
        <FuelMasterModal
          isOpen={showFuelMasterModal}
          onClose={() => setShowFuelMasterModal(false)}
          onBuy={handleBuyFuelMaster}
        />

        {/* DeliveryPredictor Modal */}
        <DeliveryPredictorModal
          isOpen={showDeliveryPredictorModal}
          onClose={() => setShowDeliveryPredictorModal(false)}
          onBuy={handleBuyDeliveryPredictor}
        />
      </div>
    </div>
  );
}
