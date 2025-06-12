'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Zap, CheckCircle, AlertTriangle, Download, ShoppingCart, Eye, ExternalLink, Settings, Activity, TrendingUp, Clock, Users, MapPin, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface AgentDetailsModalProps {
  agentId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onBuy?: (agent: any) => void;
}

interface AgentDetails {
  id: string;
  name: string;
  description: string;
  longDescription?: string;
  price: number;
  rating: number;
  downloads: number;
  version: string;
  category: string;
  status: string;
  features: string[];
  requirements: string[];
  performanceStats?: {
    accuracy: number;
    responseTime: number;
    uptime: number;
    successRate: number;
  };
  pricing?: {
    basic: number;
    pro: number;
    enterprise: number;
  };
  apiRequirements?: string[];
  systemRequirements?: string[];
}

export function AgentDetailsModal({ agentId, isOpen, onClose, onBuy }: AgentDetailsModalProps) {
  const [agent, setAgent] = useState<AgentDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'pro' | 'enterprise'>('basic');

  useEffect(() => {
    if (isOpen && agentId) {
      fetchAgentDetails(agentId);
    }
  }, [isOpen, agentId]);

  const fetchAgentDetails = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Fallback data in case API is unavailable
      const fallbackAgents = [
        {
          id: 'route-optimizer-pro',
          name: 'RouteOptimizer Pro',
          description: 'AI-powered route optimization with ML learning',
          longDescription: 'Advanced route optimization system that uses machine learning to continuously improve delivery routes. Features real-time traffic analysis, weather optimization, and predictive analytics to reduce fuel consumption by up to 45%.',
          price: 89,
          rating: 4.9,
          downloads: 12847,
          version: '3.0.0',
          category: 'Route Optimization',
          status: 'active',
          features: [
            'ML route planning',
            'Neural predictions', 
            'Real-time learning',
            'Traffic analysis',
            'Weather optimization',
            'Fuel optimization',
            'Driver behavior analysis',
            'Cost reduction tracking'
          ],
          requirements: ['Google Maps API', 'Traffic Data'],
          requiresAPI: ['Google Maps', 'Traffic Data', 'Weather API'],
          systemRequirements: ['Node.js 18+', 'Redis', 'PostgreSQL', 'TensorFlow'],
          performanceScore: 95.2,
          avgResponseTime: 125,
          successRate: 92,
          uptime: 99.8
        },
        {
          id: '2',
          name: 'FuelMaster AI',
          description: 'Complete fuel optimization ecosystem with 3 advanced AI engines',
          longDescription: 'Comprehensive fuel management solution featuring Predictive Fuel Consumption AI, Dynamic Fuel Pricing Optimizer, and Micro-Optimization Fuel Engine. Delivers real-time cost optimization and 7-day fuel forecasting.',
          price: 89,
          rating: 4.8,
          downloads: 8934,
          version: '2.1.0',
          category: 'Fuel Management',
          status: 'active',
          features: [
            'Micro-Optimization Fuel Engine',
            'Real-time driving coaching',
            '7-day fuel forecasting',
            'Market trend analysis',
            'Cost optimization',
            'Dynamic pricing',
            'Fuel consumption prediction',
            'Driver behavior analytics'
          ],
          requirements: ['Fuel Price API', 'Vehicle Diagnostics'],
          requiresAPI: ['Fuel Price API', 'Vehicle Diagnostics', 'IoT Sensors'],
          systemRequirements: ['Node.js 18+', 'MongoDB', 'Redis', 'Machine Learning APIs'],
          performanceScore: 88.9,
          avgResponseTime: 145,
          successRate: 88,
          uptime: 99.5
        },
        {
          id: '3',
          name: 'DeliveryPredictor',
          description: 'ML-powered delivery time predictions and scheduling',
          longDescription: 'Advanced delivery prediction system using machine learning algorithms to provide accurate delivery time estimates, optimize scheduling, and enhance customer satisfaction through smart notifications.',
          price: 29,
          rating: 4.7,
          downloads: 15623,
          version: '1.5.2',
          category: 'Delivery Management',
          status: 'active',
          features: [
            'Time prediction',
            'Smart scheduling',
            'Customer notifications',
            'Route optimization',
            'Real-time tracking',
            'Delivery analytics',
            'Performance monitoring',
            'API integration'
          ],
          requirements: ['Weather API', 'Calendar Integration'],
          requiresAPI: ['Weather API', 'Calendar Integration', 'SMS Service'],
          systemRequirements: ['Node.js 16+', 'PostgreSQL', 'Redis'],
          performanceScore: 88.9,
          avgResponseTime: 98,
          successRate: 87,
          uptime: 99.2
        }
      ];
      
      // Try to fetch from API first, fallback to local data
      let agentData = null;
      try {
        const response = await fetch('/api/ai-agents?marketplace=true');
        if (response.ok) {
          const agentsData = await response.json();
          agentData = Array.isArray(agentsData) ? agentsData.find((a: any) => a.id === id) : null;
        }
      } catch (apiError) {
        console.warn('API unavailable, using fallback data');
      }
      
      // If API fails, use fallback data
      if (!agentData) {
        agentData = fallbackAgents.find(a => a.id === id);
      }
      
      if (!agentData) {
        throw new Error('Agent not found');
      }
      
      // Transform API data to component format
      const detailedAgent: AgentDetails = {
        id: agentData.id,
        name: agentData.name,
        description: agentData.description,
        longDescription: agentData.longDescription || agentData.description,
        price: agentData.price || 0,
        rating: agentData.rating || 0,
        downloads: agentData.downloads || 0,
        version: agentData.version || '1.0.0',
        category: agentData.category || 'General',
        status: agentData.status || 'active',
        features: agentData.features || agentData.enhancedFeatures ? Object.keys(agentData.enhancedFeatures) : [],
        requirements: agentData.requirements || agentData.requiresAPI || [],
        performanceStats: {
          accuracy: agentData.performance?.accuracy || agentData.performanceScore || 0,
          responseTime: agentData.avgResponseTime || 0,
          uptime: agentData.uptime || 99.9,
          successRate: agentData.successRate || 0
        },
        pricing: {
          basic: agentData.price || 29,
          pro: (agentData.price || 29) * 2,
          enterprise: (agentData.price || 29) * 4
        },
        apiRequirements: agentData.requiresAPI || [],
        systemRequirements: agentData.systemRequirements || ['Node.js 18+', 'Redis', 'PostgreSQL']
      };
      
      setAgent(detailedAgent);
    } catch (error) {
      console.error('Error fetching agent details:', error);
      setError('Failed to load agent details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBuyAgent = () => {
    if (agent && onBuy) {
      onBuy({
        ...agent,
        selectedPlan,
        finalPrice: agent.pricing?.[selectedPlan] || agent.price
      });
    }
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={handleBackdropClick}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-slate-900 rounded-xl border border-slate-700 w-full max-w-4xl max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-700">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {loading ? 'Loading...' : agent?.name || 'Agent Details'}
                </h2>
                {agent && (
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant="secondary">v{agent.version}</Badge>
                    <Badge variant="outline" className="text-green-400 border-green-400">
                      {agent.status}
                    </Badge>
                    <div className="flex items-center text-yellow-400">
                      <Star className="w-4 h-4 mr-1" />
                      <span className="text-sm">{agent.rating.toFixed(1)}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                  <p className="text-red-400">{error}</p>
                  <Button onClick={() => agentId && fetchAgentDetails(agentId)} className="mt-4">
                    Try Again
                  </Button>
                </div>
              </div>
            ) : agent ? (
              <div className="p-6">
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-4 bg-slate-800">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="features">Features</TabsTrigger>
                    <TabsTrigger value="performance">Performance</TabsTrigger>
                    <TabsTrigger value="pricing">Pricing</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-6 mt-6">
                    {/* Description */}
                    <Card className="bg-slate-800/50 border-slate-700">
                      <CardHeader>
                        <CardTitle className="text-white">Description</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-slate-300 leading-relaxed">
                          {agent.longDescription}
                        </p>
                      </CardContent>
                    </Card>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card className="bg-slate-800/50 border-slate-700">
                        <CardContent className="p-4 text-center">
                          <Download className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                          <p className="text-2xl font-bold text-white">{agent.downloads.toLocaleString()}</p>
                          <p className="text-sm text-slate-400">Downloads</p>
                        </CardContent>
                      </Card>
                      <Card className="bg-slate-800/50 border-slate-700">
                        <CardContent className="p-4 text-center">
                          <Users className="w-8 h-8 text-green-400 mx-auto mb-2" />
                          <p className="text-2xl font-bold text-white">{Math.floor(agent.downloads * 0.7).toLocaleString()}</p>
                          <p className="text-sm text-slate-400">Active Users</p>
                        </CardContent>
                      </Card>
                      <Card className="bg-slate-800/50 border-slate-700">
                        <CardContent className="p-4 text-center">
                          <TrendingUp className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                          <p className="text-2xl font-bold text-white">{agent.rating.toFixed(1)}</p>
                          <p className="text-sm text-slate-400">User Rating</p>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Requirements */}
                    <Card className="bg-slate-800/50 border-slate-700">
                      <CardHeader>
                        <CardTitle className="text-white">Requirements</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium text-slate-300 mb-2">API Requirements</h4>
                          <div className="flex flex-wrap gap-2">
                            {agent.apiRequirements?.map((req, index) => (
                              <Badge key={index} variant="outline" className="text-blue-400 border-blue-400">
                                {req}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-slate-300 mb-2">System Requirements</h4>
                          <div className="flex flex-wrap gap-2">
                            {agent.systemRequirements?.map((req, index) => (
                              <Badge key={index} variant="outline" className="text-green-400 border-green-400">
                                {req}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="features" className="space-y-6 mt-6">
                    <Card className="bg-slate-800/50 border-slate-700">
                      <CardHeader>
                        <CardTitle className="text-white">Key Features</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {agent.features.map((feature, index) => (
                            <div key={index} className="flex items-center space-x-3 p-3 bg-slate-700/30 rounded-lg">
                              <CheckCircle className="w-5 h-5 text-green-400" />
                              <span className="text-slate-200">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="performance" className="space-y-6 mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card className="bg-slate-800/50 border-slate-700">
                        <CardHeader>
                          <CardTitle className="text-white">Performance Metrics</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <div className="flex justify-between mb-2">
                              <span className="text-slate-300">Accuracy</span>
                              <span className="text-green-400">{agent.performanceStats?.accuracy.toFixed(1)}%</span>
                            </div>
                            <Progress value={agent.performanceStats?.accuracy} className="h-2" />
                          </div>
                          <div>
                            <div className="flex justify-between mb-2">
                              <span className="text-slate-300">Uptime</span>
                              <span className="text-green-400">{agent.performanceStats?.uptime.toFixed(1)}%</span>
                            </div>
                            <Progress value={agent.performanceStats?.uptime} className="h-2" />
                          </div>
                          <div>
                            <div className="flex justify-between mb-2">
                              <span className="text-slate-300">Success Rate</span>
                              <span className="text-blue-400">{agent.performanceStats?.successRate.toFixed(1)}%</span>
                            </div>
                            <Progress value={agent.performanceStats?.successRate} className="h-2" />
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-slate-800/50 border-slate-700">
                        <CardHeader>
                          <CardTitle className="text-white">Response Times</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                            <span className="text-slate-300">Average Response</span>
                            <span className="text-blue-400 font-semibold">{agent.performanceStats?.responseTime.toFixed(0)}ms</span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                            <span className="text-slate-300">Peak Performance</span>
                            <span className="text-green-400 font-semibold">{Math.floor((agent.performanceStats?.responseTime || 0) * 0.7)}ms</span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                            <span className="text-slate-300">Processing Load</span>
                            <span className="text-purple-400 font-semibold">Medium</span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="pricing" className="space-y-6 mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {(['basic', 'pro', 'enterprise'] as const).map((plan) => (
                        <Card 
                          key={plan} 
                          className={`bg-slate-800/50 border-slate-700 cursor-pointer transition-all hover:border-blue-500 ${
                            selectedPlan === plan ? 'border-blue-500 bg-blue-500/10' : ''
                          }`}
                          onClick={() => setSelectedPlan(plan)}
                        >
                          <CardHeader className="text-center">
                            <CardTitle className="text-white capitalize">{plan}</CardTitle>
                            <div className="text-3xl font-bold text-blue-400">
                              €{agent.pricing?.[plan]}
                              <span className="text-sm text-slate-400">/month</span>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              <div className="flex items-center text-sm text-slate-300">
                                <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                                {plan === 'basic' ? 'Basic features' : plan === 'pro' ? 'Advanced features' : 'Enterprise features'}
                              </div>
                              <div className="flex items-center text-sm text-slate-300">
                                <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                                {plan === 'basic' ? '24/7 support' : plan === 'pro' ? 'Priority support' : 'Dedicated support'}
                              </div>
                              <div className="flex items-center text-sm text-slate-300">
                                <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                                {plan === 'basic' ? 'Standard SLA' : plan === 'pro' ? 'Enhanced SLA' : 'Premium SLA'}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            ) : null}
          </div>

          {/* Footer */}
          {agent && !loading && !error && (
            <div className="border-t border-slate-700 p-6">
              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-400">
                  Selected Plan: <span className="text-white capitalize">{selectedPlan}</span> - €{agent.pricing?.[selectedPlan]}/month
                </div>
                <div className="flex space-x-3">
                  <Button variant="outline" onClick={onClose}>
                    Close
                  </Button>
                  <Button onClick={handleBuyAgent} className="bg-blue-600 hover:bg-blue-700">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Buy Now
                  </Button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
} 