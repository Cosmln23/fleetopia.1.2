
'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Store, Download, Star, TrendingUp, Users, Euro, Bot, Plus, Search } from 'lucide-react';
import MetricCard from '@/components/metric-card';

interface MarketplaceAgent {
  id: string;
  name: string;
  type: string;
  description: string;
  price: number;
  rating: number;
  downloads: number;
  revenue: number;
  owner: string;
  version: string;
  capabilities: string[];
}

export default function MarketplacePage() {
  const [agents, setAgents] = useState<MarketplaceAgent[]>([
    {
      id: 'mp-001',
      name: 'Fuel Optimizer Pro',
      type: 'fuel-optimizer',
      description: 'Advanced AI agent that optimizes fuel consumption across your fleet using real-time data analysis and predictive algorithms.',
      price: 99,
      rating: 4.8,
      downloads: 1247,
      revenue: 8420,
      owner: 'fleetopia-core',
      version: '2.1.0',
      capabilities: ['Real-time monitoring', 'Predictive analysis', 'Route optimization', 'Driver behavior analysis']
    },
    {
      id: 'mp-002',
      name: 'Route Genius Elite',
      type: 'route-genius',
      description: 'Intelligent routing system that calculates optimal paths considering traffic, weather, and delivery constraints.',
      price: 149,
      rating: 4.9,
      downloads: 892,
      revenue: 12650,
      owner: 'fleetopia-core',
      version: '1.8.3',
      capabilities: ['Dynamic routing', 'Traffic analysis', 'Multi-stop optimization', 'Real-time rerouting']
    },
    {
      id: 'mp-003',
      name: 'Weather Prophet',
      type: 'weather-prophet',
      description: 'Weather prediction and fleet adaptation system that helps optimize operations based on weather conditions.',
      price: 79,
      rating: 4.6,
      downloads: 634,
      revenue: 5230,
      owner: 'fleetopia-core',
      version: '1.5.2',
      capabilities: ['Weather forecasting', 'Risk assessment', 'Route adaptation', 'Maintenance scheduling']
    },
    {
      id: 'mp-004',
      name: 'Cost Analyzer',
      type: 'cost-analyzer',
      description: 'Comprehensive cost analysis and optimization agent for fleet operations and budget management.',
      price: 129,
      rating: 4.7,
      downloads: 456,
      revenue: 7890,
      owner: 'third-party-dev',
      version: '1.2.1',
      capabilities: ['Cost tracking', 'Budget optimization', 'ROI analysis', 'Expense forecasting']
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || agent.type === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalRevenue = agents.reduce((sum, agent) => sum + agent.revenue, 0);
  const totalDownloads = agents.reduce((sum, agent) => sum + agent.downloads, 0);
  const avgRating = agents.reduce((sum, agent) => sum + agent.rating, 0) / agents.length;

  // Revenue distribution (40% Core, 35% Agents, 15% Innovation, 10% Users)
  const revenueDistribution = {
    core: totalRevenue * 0.40,
    agents: totalRevenue * 0.35,
    innovation: totalRevenue * 0.15,
    users: totalRevenue * 0.10
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-thin text-white mb-2 matrix-text">
            AI Agent <span className="text-green-400">Marketplace</span>
          </h1>
          <p className="text-gray-400 font-light">
            Discover, deploy, and trade intelligent fleet optimization agents
          </p>
        </motion.div>

        {/* Marketplace Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <MetricCard
            title="Total Revenue"
            value={`€${totalRevenue.toLocaleString()}`}
            subtitle="Marketplace volume"
            icon={Euro}
            trend="up"
            trendValue="+24%"
            animate={true}
          />
          <MetricCard
            title="Active Agents"
            value={agents.length}
            subtitle="Available for download"
            icon={Bot}
            trend="up"
            trendValue="+3"
            animate={true}
          />
          <MetricCard
            title="Total Downloads"
            value={totalDownloads.toLocaleString()}
            subtitle="Agent installations"
            icon={Download}
            trend="up"
            trendValue="+156"
            animate={true}
          />
          <MetricCard
            title="Avg Rating"
            value={avgRating.toFixed(1)}
            subtitle="User satisfaction"
            icon={Star}
            trend="up"
            trendValue="+0.2"
            animate={true}
          />
        </motion.div>

        {/* Revenue Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="terminal-border rounded-lg p-6 mb-8"
        >
          <h3 className="text-lg font-light text-white mb-4 matrix-text">Revenue Distribution Model</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-light text-green-400">40%</div>
              <div className="text-sm text-gray-400">Core Platform</div>
              <div className="text-xs text-gray-500">€{revenueDistribution.core.toLocaleString()}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-light text-blue-400">35%</div>
              <div className="text-sm text-gray-400">AI Agents</div>
              <div className="text-xs text-gray-500">€{revenueDistribution.agents.toLocaleString()}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-light text-purple-400">15%</div>
              <div className="text-sm text-gray-400">Innovation Fund</div>
              <div className="text-xs text-gray-500">€{revenueDistribution.innovation.toLocaleString()}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-light text-yellow-400">10%</div>
              <div className="text-sm text-gray-400">User Rewards</div>
              <div className="text-xs text-gray-500">€{revenueDistribution.users.toLocaleString()}</div>
            </div>
          </div>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col md:flex-row gap-4 mb-8"
        >
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search agents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-green-400 focus:outline-none"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-green-400 focus:outline-none"
          >
            <option value="all">All Categories</option>
            <option value="fuel-optimizer">Fuel Optimizer</option>
            <option value="route-genius">Route Genius</option>
            <option value="weather-prophet">Weather Prophet</option>
            <option value="cost-analyzer">Cost Analyzer</option>
          </select>
          <button className="px-6 py-2 bg-green-400/20 text-green-400 border border-green-400 rounded-lg hover:bg-green-400/30 transition-all duration-300 flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Register Agent</span>
          </button>
        </motion.div>

        {/* Agent Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {filteredAgents.map((agent, index) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              className="terminal-border rounded-lg p-6 hover:border-green-400/50 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-400/10 rounded-lg">
                    <Bot className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-light text-white matrix-text">{agent.name}</h3>
                    <p className="text-sm text-gray-400">v{agent.version} • by {agent.owner}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-light text-green-400">€{agent.price}</div>
                  <div className="flex items-center space-x-1 text-sm text-yellow-400">
                    <Star className="w-4 h-4 fill-current" />
                    <span>{agent.rating}</span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-300 mb-4 font-light leading-relaxed">
                {agent.description}
              </p>

              <div className="mb-4">
                <h4 className="text-sm font-light text-green-400 mb-2">Capabilities</h4>
                <div className="flex flex-wrap gap-2">
                  {agent.capabilities.map((capability, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded"
                    >
                      {capability}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-sm font-light text-white">{agent.downloads}</div>
                  <div className="text-xs text-gray-400">Downloads</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-light text-white">€{agent.revenue.toLocaleString()}</div>
                  <div className="text-xs text-gray-400">Revenue</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-light text-white">{agent.rating}</div>
                  <div className="text-xs text-gray-400">Rating</div>
                </div>
              </div>

              <div className="flex space-x-3">
                <button className="flex-1 px-4 py-2 bg-green-400/20 text-green-400 border border-green-400 rounded-lg hover:bg-green-400/30 transition-all duration-300 flex items-center justify-center space-x-2">
                  <Download className="w-4 h-4" />
                  <span>Install</span>
                </button>
                <button className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-all duration-300">
                  Preview
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {filteredAgents.length === 0 && (
          <div className="text-center py-12">
            <Bot className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 font-light">No agents found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
