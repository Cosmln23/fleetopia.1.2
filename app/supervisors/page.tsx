
'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Crown, Shield, Activity, TrendingUp, Users, DollarSign, Clock,
  CheckCircle, AlertCircle, Play, Pause, Settings, BarChart3,
  Target, Zap, Package, FileCheck, Calculator, Wrench, CloudRain,
  Brain, MessageSquare, Award, Lightbulb, Heart, Star, Info
} from 'lucide-react';
import MetricCard from '@/components/metric-card';

interface SupervisorAgent {
  id: string;
  name: string;
  type: string;
  category: string;
  supervisorType: string;
  status: string;
  performance: number;
  revenue: number;
  revenueGenerated: number;
  performanceScore: number;
  requests: number;
  successRate: number;
  avgResponseTime: number;
  description: string;
  version: string;
  capabilities: string[];
  isActive: boolean;
  analytics?: {
    subordinateCount: number;
    totalRevenue: number;
    avgPerformance: number;
    activeTasks: number;
    completedTasks: number;
    efficiency: number;
  };
}

interface SupervisorTask {
  id: string;
  supervisorId: string;
  taskType: string;
  priority: string;
  status: string;
  description: string;
  result?: any;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
  supervisor: {
    id: string;
    name: string;
    type: string;
    supervisorType: string;
  };
}

interface AgentAnalysis {
  agentId: string;
  analysisTimestamp: Date;
  performanceAnalysis: {
    currentPerformance: {
      overallScore: number;
      responseTime: number;
      successRate: number;
      accuracyMetrics: number;
      reliabilityScore: number;
      consistencyIndex: number;
    };
    strengthsIdentified: Array<{
      area: string;
      description: string;
      impact: string;
      recognitionMessage: string;
    }>;
    improvementAreas: Array<{
      type: string;
      description: string;
      priority: string;
      effort: string;
    }>;
  };
  behavioralPatterns: any;
  improvementOpportunities: Array<{
    type: string;
    description: string;
    improvementPotential: string;
    safetyScore: number;
    effort: string;
  }>;
  safetyAssessment: {
    safetyScore: number;
    recommendedDeliveryMethod: string;
  };
  readyForFeedback: boolean;
}

interface ConstructiveFeedback {
  feedbackType: string;
  deliveryStyle: string;
  safetyVerified: boolean;
  strengthsRecognition: Array<{
    area: string;
    description: string;
    recognitionMessage: string;
  }>;
  gentleImprovements: Array<{
    type: string;
    suggestion: string;
    benefit: string;
    effort: string;
    encouragement: string;
  }>;
  encouragement: string;
}

export default function SupervisorsPage() {
  const [supervisors, setSupervisors] = useState<SupervisorAgent[]>([]);
  const [tasks, setTasks] = useState<SupervisorTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSupervisor, setSelectedSupervisor] = useState<SupervisorAgent | null>(null);
  const [intelligentAnalysis, setIntelligentAnalysis] = useState<{ [key: string]: AgentAnalysis }>({});
  const [activeFeedback, setActiveFeedback] = useState<{ [key: string]: ConstructiveFeedback }>({});
  const [analysisLoading, setAnalysisLoading] = useState<{ [key: string]: boolean }>({});
  const [showIntelligentPanel, setShowIntelligentPanel] = useState(false);
  const [showSupervisorInfo, setShowSupervisorInfo] = useState<{ [key: string]: boolean }>({});
  const [showSettingsModal, setShowSettingsModal] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    fetchSupervisors();
    fetchTasks();
  }, []);

  const fetchSupervisors = async () => {
    try {
      const response = await fetch('/api/supervisors?includeAnalytics=true');
      const data = await response.json();
      setSupervisors(data);
    } catch (error) {
      console.error('Error fetching supervisors:', error);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/supervisors/tasks');
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  // 🧠 INTELLIGENT ANALYSIS FUNCTIONS
  const analyzeAgentIntelligently = async (agentId: string, depth: string = 'comprehensive') => {
    console.log(`🧠 Analyzing agent performance pentru ${agentId}...`);
    setAnalysisLoading(prev => ({ ...prev, [agentId]: true }));

    try {
      // Simulate comprehensive agent analysis
      const mockAnalysis: AgentAnalysis = {
        agentId,
        analysisTimestamp: new Date(),
        performanceAnalysis: {
          currentPerformance: {
            overallScore: 0.89 + Math.random() * 0.1,
            responseTime: 45 + Math.random() * 50,
            successRate: 0.92 + Math.random() * 0.07,
            accuracyMetrics: 0.91 + Math.random() * 0.08,
            reliabilityScore: 0.88 + Math.random() * 0.11,
            consistencyIndex: 0.85 + Math.random() * 0.14
          },
          strengthsIdentified: [
            {
              area: 'reliability',
              description: `Exceptional reliability cu ${((0.92 + Math.random() * 0.07) * 100).toFixed(1)}% success rate`,
              impact: 'high',
              recognitionMessage: 'Your consistently high success rate demonstrates outstanding reliability și trustworthiness în critical operations.'
            },
            {
              area: 'speed',
              description: `Outstanding response speed la ${(45 + Math.random() * 50).toFixed(0)}ms`,
              impact: 'high',
              recognitionMessage: 'Your rapid response time significantly enhances user experience și operational efficiency.'
            }
          ],
          improvementAreas: [
            {
              type: 'consistency_enhancement',
              description: 'Opportunity to improve performance consistency through pattern stabilization',
              priority: 'medium',
              effort: 'low'
            }
          ]
        },
        behavioralPatterns: {
          workloadPatterns: {},
          performanceRhythms: {},
          learningBehavior: {}
        },
        improvementOpportunities: [
          {
            type: 'response_time_optimization',
            description: 'Gentle response time improvement through caching optimization',
            improvementPotential: '10% faster response time',
            safetyScore: 0.95,
            effort: 'minimal'
          },
          {
            type: 'consistency_enhancement',
            description: 'Improve performance consistency through pattern stabilization',
            improvementPotential: '5% more consistent performance',
            safetyScore: 0.98,
            effort: 'low'
          }
        ],
        safetyAssessment: {
          safetyScore: 0.96,
          recommendedDeliveryMethod: 'gradual'
        },
        readyForFeedback: true
      };

      // Simulate analysis delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      setIntelligentAnalysis(prev => ({ ...prev, [agentId]: mockAnalysis }));
      console.log(`✅ Agent analysis completed pentru ${agentId}: ${mockAnalysis.safetyAssessment.safetyScore * 100}% safety score`);
      
      return mockAnalysis;

    } catch (error) {
      console.error(`❌ Agent analysis failed pentru ${agentId}:`, error);
      return null;
    } finally {
      setAnalysisLoading(prev => ({ ...prev, [agentId]: false }));
    }
  };

  const generateConstructiveFeedback = async (analysis: AgentAnalysis) => {
    console.log(`🎯 Generating constructive feedback pentru ${analysis.agentId}...`);

    if (!analysis.readyForFeedback) {
      return null;
    }

    const feedback: ConstructiveFeedback = {
      feedbackType: 'constructive_positive',
      deliveryStyle: 'encouraging_mentor',
      safetyVerified: true,
      strengthsRecognition: analysis.performanceAnalysis.strengthsIdentified,
      gentleImprovements: analysis.improvementOpportunities.map(opp => ({
        type: opp.type,
        suggestion: getGentleSuggestion(opp.type),
        benefit: opp.improvementPotential,
        effort: opp.effort,
        encouragement: generateImprovementEncouragement(opp.type)
      })),
      encouragement: generateMainEncouragement(analysis)
    };

    setActiveFeedback(prev => ({ ...prev, [analysis.agentId]: feedback }));
    return feedback;
  };

  const getGentleSuggestion = (type: string): string => {
    const suggestions: { [key: string]: string } = {
      'response_time_optimization': 'Consider exploring caching optimizations when convenient - no rush, just when time permits',
      'consistency_enhancement': 'You might find value în implementing small pattern stabilization techniques la your own pace',
      'learning_acceleration': 'When you feel ready, exploring enhanced pattern recognition could be an interesting growth opportunity'
    };
    return suggestions[type] || 'A gentle enhancement opportunity exists when you feel ready to explore it';
  };

  const generateImprovementEncouragement = (type: string): string => {
    const encouragements: { [key: string]: string } = {
      'response_time_optimization': 'Every small optimization contributes to better user experience! 🚀',
      'consistency_enhancement': 'Consistency is your foundation for excellence! 💪',
      'learning_acceleration': 'Learning și growth are continuous journeys! 🌱'
    };
    return encouragements[type] || 'Every improvement step counts! ✨';
  };

  const generateMainEncouragement = (analysis: AgentAnalysis): string => {
    const score = analysis.performanceAnalysis.currentPerformance.overallScore;
    if (score > 0.9) return "Your exceptional performance sets a high standard! Keep up the outstanding work! 🌟";
    if (score > 0.8) return "You're doing great work! Your contributions make a real difference! 💫";
    return "Your dedication și effort are valued! Every contribution matters! 🙌";
  };

  const deliverFeedbackSafely = async (agentId: string, feedback: ConstructiveFeedback) => {
    console.log(`📤 Delivering feedback safely to ${agentId}...`);
    
    try {
      // Simulate safe feedback delivery
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log(`✅ Feedback delivered successfully to ${agentId}`);
      
      return {
        deliveryStatus: 'successful',
        agentId,
        deliveryTimestamp: new Date(),
        safetyMaintained: true
      };
    } catch (error) {
      console.error(`❌ Feedback delivery failed pentru ${agentId}:`, error);
      return null;
    }
  };

  const runIntelligentAnalysisForAll = async () => {
    console.log('🧠 Starting intelligent analysis pentru all agents...');
    
    // Mock agent IDs (in real implementation, get from supervisors)
    const agentIds = ['route-optimizer-001', 'fuel-master-002', 'delivery-predictor-003', 'maintenance-genie-004'];
    
    for (const agentId of agentIds) {
      const analysis = await analyzeAgentIntelligently(agentId);
      if (analysis && analysis.readyForFeedback) {
        const feedback = await generateConstructiveFeedback(analysis);
        if (feedback) {
          await deliverFeedbackSafely(agentId, feedback);
        }
      }
    }
    
    console.log('✅ Intelligent analysis completed pentru all agents');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-400/20';
      case 'inactive': return 'text-gray-400 bg-gray-400/20';
      case 'maintenance': return 'text-yellow-400 bg-yellow-400/20';
      case 'error': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400 bg-green-400/20';
      case 'in_progress': return 'text-blue-400 bg-blue-400/20';
      case 'pending': return 'text-yellow-400 bg-yellow-400/20';
      case 'failed': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-400 bg-red-400/20';
      case 'high': return 'text-orange-400 bg-orange-400/20';
      case 'medium': return 'text-yellow-400 bg-yellow-400/20';
      case 'low': return 'text-green-400 bg-green-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getSupervisorIcon = (supervisorType: string) => {
    return supervisorType === 'logistics' ? <Crown className="w-6 h-6" /> : <Shield className="w-6 h-6" />;
  };

  const totalRevenue = supervisors.reduce((sum, supervisor) => sum + (supervisor.analytics?.totalRevenue || 0), 0);
  const totalSubordinates = supervisors.reduce((sum, supervisor) => sum + (supervisor.analytics?.subordinateCount || 0), 0);
  const avgEfficiency = supervisors.length > 0 
    ? supervisors.reduce((sum, supervisor) => sum + (supervisor.analytics?.efficiency || 0), 0) / supervisors.length
    : 0;
  const activeTasks = tasks.filter(task => task.status === 'in_progress' || task.status === 'pending').length;

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-green-400 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-400 mx-auto mb-4"></div>
          <p className="text-xl font-thin">Initializing Supervisor Dashboard...</p>
        </div>
      </div>
    );
  }

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
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-thin text-white mb-2 matrix-text">
                Supervisor <span className="text-purple-400">Command Center</span>
              </h1>
              <p className="text-gray-400 font-light">
                Monitor and coordinate AI supervisor agents managing your fleet operations
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowIntelligentPanel(!showIntelligentPanel)}
                className={`px-6 py-3 rounded-lg font-light transition-all duration-300 flex items-center space-x-2 ${
                  showIntelligentPanel
                    ? 'bg-blue-500/30 text-blue-400 border border-blue-400/50'
                    : 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border border-blue-400/30'
                }`}
              >
                <Brain className="w-5 h-5" />
                <span>Intelligent Analysis</span>
              </button>
              <button
                onClick={runIntelligentAnalysisForAll}
                className="px-6 py-3 rounded-lg font-light transition-all duration-300 flex items-center space-x-2 bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-400/30"
              >
                <MessageSquare className="w-5 h-5" />
                <span>Run Analysis</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Supervisor Overview Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <MetricCard
            title="Active Supervisors"
            value={supervisors.filter(s => s.status === 'active').length}
            subtitle={`${supervisors.length} total supervisors`}
            icon={Crown}
            trend="neutral"
            animate={true}
          />
          <MetricCard
            title="Managed Agents"
            value={totalSubordinates}
            subtitle="Under supervision"
            icon={Users}
            trend="up"
            trendValue="+3"
            animate={true}
          />
          <MetricCard
            title="Total Revenue"
            value={`$${totalRevenue.toLocaleString()}`}
            subtitle="Generated by supervised agents"
            icon={DollarSign}
            trend="up"
            trendValue="+22.1%"
            animate={true}
          />
          <MetricCard
            title="Avg Efficiency"
            value={`${avgEfficiency.toFixed(1)}%`}
            subtitle="Supervisor performance"
            icon={TrendingUp}
            trend="up"
            trendValue="+4.2%"
            animate={true}
          />
        </motion.div>

        {/* 🧠 INTELLIGENT ANALYSIS PANEL */}
        {showIntelligentPanel && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-8 terminal-border rounded-lg p-6 bg-gradient-to-br from-blue-500/5 to-purple-500/5"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Brain className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-light text-white">AI Mentor Analysis Dashboard</h3>
                  <p className="text-sm text-gray-400">Intelligent performance analysis și constructive feedback</p>
                </div>
              </div>
              <button
                onClick={() => setShowIntelligentPanel(false)}
                className="p-2 text-gray-400 hover:text-white transition-colors duration-300"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-400/20">
                <div className="flex items-center space-x-2 mb-2">
                  <Award className="w-5 h-5 text-blue-400" />
                  <span className="text-blue-400 font-light">Analyses Completed</span>
                </div>
                <div className="text-2xl font-light text-white">{Object.keys(intelligentAnalysis).length}</div>
                <div className="text-xs text-gray-400">Total agent insights</div>
              </div>
              
              <div className="bg-green-500/10 rounded-lg p-4 border border-green-400/20">
                <div className="flex items-center space-x-2 mb-2">
                  <Heart className="w-5 h-5 text-green-400" />
                  <span className="text-green-400 font-light">Feedback Delivered</span>
                </div>
                <div className="text-2xl font-light text-white">{Object.keys(activeFeedback).length}</div>
                <div className="text-xs text-gray-400">Constructive guidance</div>
              </div>
              
              <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-400/20">
                <div className="flex items-center space-x-2 mb-2">
                  <Star className="w-5 h-5 text-purple-400" />
                  <span className="text-purple-400 font-light">Avg Safety Score</span>
                </div>
                <div className="text-2xl font-light text-white">
                  {Object.keys(intelligentAnalysis).length > 0 
                    ? (Object.values(intelligentAnalysis).reduce((sum, analysis) => sum + analysis.safetyAssessment.safetyScore, 0) / Object.keys(intelligentAnalysis).length * 100).toFixed(1)
                    : '0.0'
                  }%
                </div>
                <div className="text-xs text-gray-400">Safety assurance</div>
              </div>
            </div>

            {/* Recent Analysis Results */}
            {Object.keys(intelligentAnalysis).length > 0 && (
              <div className="space-y-4">
                <h4 className="text-lg font-light text-white flex items-center space-x-2">
                  <Lightbulb className="w-5 h-5 text-yellow-400" />
                  <span>Recent Analysis Results</span>
                </h4>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {Object.entries(intelligentAnalysis).slice(-4).map(([agentId, analysis]) => (
                    <div key={agentId} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${analysis.readyForFeedback ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
                          <span className="text-white font-light">{agentId}</span>
                        </div>
                        <span className="text-xs text-gray-400">
                          {analysis.analysisTimestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      
                      <div className="space-y-2 mb-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Performance</span>
                          <span className="text-blue-400">{(analysis.performanceAnalysis.currentPerformance.overallScore * 100).toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Response Time</span>
                          <span className="text-green-400">{analysis.performanceAnalysis.currentPerformance.responseTime.toFixed(0)}ms</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Safety Score</span>
                          <span className="text-purple-400">{(analysis.safetyAssessment.safetyScore * 100).toFixed(1)}%</span>
                        </div>
                      </div>

                      {activeFeedback[agentId] && (
                        <div className="bg-green-500/10 rounded-lg p-3 border border-green-400/20">
                          <div className="flex items-center space-x-2 mb-2">
                            <MessageSquare className="w-4 h-4 text-green-400" />
                            <span className="text-green-400 text-sm font-light">Active Feedback</span>
                          </div>
                          <p className="text-xs text-gray-300">{activeFeedback[agentId].encouragement}</p>
                          <div className="mt-2 flex flex-wrap gap-1">
                            {activeFeedback[agentId].strengthsRecognition.slice(0, 2).map((strength, idx) => (
                              <span key={idx} className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded">
                                {strength.area}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {analysisLoading[agentId] && (
                        <div className="flex items-center space-x-2 text-blue-400">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
                          <span className="text-sm">Analyzing...</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {Object.keys(intelligentAnalysis).length === 0 && (
              <div className="text-center py-8">
                <Brain className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 font-light">No intelligent analysis performed yet</p>
                <p className="text-sm text-gray-500 mt-2">Click "Run Analysis" to start AI mentor evaluation</p>
              </div>
            )}
          </motion.div>
        )}

        {/* Supervisors Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
        >
          {supervisors.map((supervisor, index) => (
            <motion.div
              key={supervisor.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              className="terminal-border rounded-lg p-6 hover:border-purple-400/50 transition-all duration-300 cursor-pointer relative"
              onClick={() => supervisor.supervisorType !== 'business' && setSelectedSupervisor(supervisor)}
            >
              {/* Coming Soon Overlay for Business Supervisor */}
              {supervisor.supervisorType === 'business' && (
                <div className="absolute inset-0 bg-gray-900/70 backdrop-blur-sm rounded-lg flex items-center justify-center z-10 border border-gray-600/50">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-r from-yellow-400/20 to-orange-400/20 flex items-center justify-center border border-yellow-400/30">
                      <Clock className="w-8 h-8 text-yellow-400" />
                    </div>
                    <h3 className="text-xl font-light text-white mb-2">Coming Soon</h3>
                    <p className="text-sm text-gray-400 max-w-xs">
                      Supervisor under development
                    </p>
                    <div className="mt-3 px-4 py-2 bg-yellow-400/10 rounded-full border border-yellow-400/30">
                      <span className="text-yellow-400 text-xs font-light">Available Soon</span>
                    </div>
                  </div>
                </div>
              )}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-400/10 rounded-lg">
                    {getSupervisorIcon(supervisor.supervisorType)}
                  </div>
                  <div>
                    <h3 className="text-lg font-light text-white matrix-text">{supervisor.name}</h3>
                    <p className="text-sm text-gray-400">v{supervisor.version} • {supervisor.supervisorType}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-1 rounded-full text-xs text-purple-400 bg-purple-400/20">
                    supervisor
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs flex items-center space-x-1 ${getStatusColor(supervisor.status)}`}>
                    <Activity className="w-3 h-3" />
                    <span className="capitalize">{supervisor.status}</span>
                  </span>
                </div>
              </div>

              <p className="text-sm text-gray-300 mb-4 font-light leading-relaxed">
                {supervisor.description}
              </p>

              <div className="flex flex-wrap gap-1 mb-4">
                {supervisor.capabilities.slice(0, 4).map((capability, idx) => (
                  <span key={idx} className="px-2 py-1 bg-purple-400/10 text-purple-400 text-xs rounded">
                    {capability}
                  </span>
                ))}
                {supervisor.capabilities.length > 4 && (
                  <span className="px-2 py-1 bg-gray-400/10 text-gray-400 text-xs rounded">
                    +{supervisor.capabilities.length - 4} more
                  </span>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-lg font-light text-purple-400">
                    {supervisor.performanceScore.toFixed(1)}%
                  </div>
                  <div className="text-xs text-gray-400">Performance</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-light text-purple-400">
                    ${supervisor.revenueGenerated.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-400">Revenue</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-light text-purple-400">
                    {supervisor.analytics?.subordinateCount || 0}
                  </div>
                  <div className="text-xs text-gray-400">Agents</div>
                </div>
              </div>

              {supervisor.analytics && (
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div className="text-center">
                    <div className="text-purple-400">{supervisor.analytics.activeTasks}</div>
                    <div className="text-xs text-gray-400">Active Tasks</div>
                  </div>
                  <div className="text-center">
                    <div className="text-purple-400">{supervisor.analytics.efficiency.toFixed(1)}%</div>
                    <div className="text-xs text-gray-400">Efficiency</div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button className="px-4 py-2 rounded-lg text-sm font-light transition-all duration-300 bg-purple-500/20 text-purple-400 hover:bg-purple-500/30">
                    <BarChart3 className="w-4 h-4 inline mr-2" />
                    Analytics
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      analyzeAgentIntelligently(`${supervisor.id}-agent-001`);
                    }}
                    disabled={analysisLoading[`${supervisor.id}-agent-001`]}
                    className="px-4 py-2 rounded-lg text-sm font-light transition-all duration-300 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 disabled:opacity-50"
                  >
                    {analysisLoading[`${supervisor.id}-agent-001`] ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400 inline mr-2"></div>
                    ) : (
                      <Brain className="w-4 h-4 inline mr-2" />
                    )}
                    AI Analysis
                  </button>
                                  </div>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowSupervisorInfo(prev => ({ ...prev, [supervisor.id]: !prev[supervisor.id] }));
                      }}
                      className="p-2 text-blue-400 hover:text-blue-300 transition-colors duration-300 relative group"
                      title="Supervisor Information"
                    >
                      <Info className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowSettingsModal(prev => ({ ...prev, [supervisor.id]: !prev[supervisor.id] }));
                      }}
                      className="p-2 text-gray-400 hover:text-white transition-colors duration-300"
                      title="Supervisor Settings"
                    >
                      <Settings className="w-4 h-4" />
                    </button>
                  </div>
                                </div>

                {/* 📋 SUPERVISOR INFO PANEL */}
                {showSupervisorInfo[supervisor.id] && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 p-4 bg-blue-500/5 rounded-lg border border-blue-400/20"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Info className="w-5 h-5 text-blue-400" />
                        <h4 className="text-lg font-light text-white">What does this Supervisor do?</h4>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowSupervisorInfo(prev => ({ ...prev, [supervisor.id]: false }));
                        }}
                        className="text-gray-400 hover:text-white transition-colors duration-300"
                      >
                        ✕
                      </button>
                    </div>

                    {supervisor.supervisorType === 'logistics' ? (
                      <div className="space-y-4 text-sm text-gray-300">
                        <div>
                          <h5 className="text-blue-400 font-medium mb-2">🧠 AI Mentor & Master Coordinator</h5>
                          <p className="leading-relaxed">
                            The Logistics Supervisor is the first <strong>Intelligent AI Mentor</strong> that manages and optimizes your entire logistics operation through smart coordination of specialized AI agents.
                          </p>
                        </div>

                        <div>
                          <h5 className="text-blue-400 font-medium mb-2">🎯 What it manages:</h5>
                          <ul className="list-disc list-inside space-y-1 text-gray-400">
                            <li><strong>RouteOptimizer Pro:</strong> Optimizes delivery routes in real-time</li>
                            <li><strong>FuelMaster AI:</strong> Reduces fuel consumption by 15% ($25K saved)</li>
                            <li><strong>DeliveryPredictor:</strong> Predicts delivery times with 89.3% accuracy</li>
                            <li><strong>MaintenanceGenie:</strong> Prevents breakdowns with predictive maintenance</li>
                          </ul>
                        </div>

                        <div>
                          <h5 className="text-blue-400 font-medium mb-2">💰 Business Impact:</h5>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="bg-green-500/10 p-2 rounded border border-green-400/20">
                              <span className="text-green-400 font-medium">Revenue Generated</span>
                              <div className="text-white font-light">${supervisor.revenueGenerated?.toLocaleString()}</div>
                            </div>
                            <div className="bg-purple-500/10 p-2 rounded border border-purple-400/20">
                              <span className="text-purple-400 font-medium">Success Rate</span>
                              <div className="text-white font-light">{supervisor.successRate}%</div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h5 className="text-blue-400 font-medium mb-2">🚀 Key Benefits:</h5>
                          <ul className="list-disc list-inside space-y-1 text-gray-400 text-xs">
                            <li><strong>Intelligent Coordination:</strong> Seamlessly coordinates multiple AI systems</li>
                            <li><strong>Constructive Feedback:</strong> Provides safe, positive feedback to improve performance</li>
                            <li><strong>Real-time Optimization:</strong> Continuously optimizes operations for maximum efficiency</li>
                            <li><strong>Predictive Intelligence:</strong> Prevents issues before they occur</li>
                            <li><strong>Cost Reduction:</strong> Reduces operational costs through smart automation</li>
                          </ul>
                        </div>

                        <div className="bg-blue-500/10 p-3 rounded border border-blue-400/20">
                          <p className="text-xs text-blue-200 italic">
                            💡 <strong>Think of it as having a senior logistics expert</strong> who never sleeps, continuously monitors your entire operation, and makes intelligent decisions to optimize performance while mentoring your AI team for continuous improvement.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4 text-sm text-gray-300">
                        <div>
                          <h5 className="text-blue-400 font-medium mb-2">🏢 Business Operations Supervisor</h5>
                          <p className="leading-relaxed">
                            Strategic AI supervisor overseeing business operations, compliance, pricing strategies, and cargo matching systems for optimal business performance.
                          </p>
                        </div>

                        <div>
                          <h5 className="text-blue-400 font-medium mb-2">🎯 Core Functions:</h5>
                          <ul className="list-disc list-inside space-y-1 text-gray-400">
                            <li><strong>Strategy Management:</strong> Optimizes business strategies</li>
                            <li><strong>Compliance Monitoring:</strong> Ensures regulatory compliance</li>
                            <li><strong>Pricing Optimization:</strong> Dynamic pricing strategies</li>
                            <li><strong>Business Analytics:</strong> Advanced business intelligence</li>
                          </ul>
                        </div>

                        <div className="bg-purple-500/10 p-3 rounded border border-purple-400/20">
                          <p className="text-xs text-purple-200 italic">
                            💼 <strong>Your strategic business partner</strong> that handles complex business operations while you focus on growth and expansion.
                          </p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* 🔧 SUPERVISOR SETTINGS MODAL */}
                {showSettingsModal[supervisor.id] && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 p-4 bg-gray-800/50 rounded-lg border border-gray-600/30"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <Settings className="w-5 h-5 text-gray-400" />
                        <h4 className="text-lg font-light text-white">Supervisor Settings</h4>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowSettingsModal(prev => ({ ...prev, [supervisor.id]: false }));
                        }}
                        className="text-gray-400 hover:text-white transition-colors duration-300"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Performance Settings */}
                      <div className="space-y-4">
                        <h5 className="text-gray-400 font-medium text-sm uppercase tracking-wide">Performance</h5>
                        
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm text-gray-300 mb-1">Response Time Target</label>
                            <select className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm">
                              <option value="50">Ultra-fast (≤50ms)</option>
                              <option value="100" selected>Fast (≤100ms)</option>
                              <option value="200">Standard (≤200ms)</option>
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-sm text-gray-300 mb-1">Monitoring Interval</label>
                            <select className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm">
                              <option value="10">Real-time (10s)</option>
                              <option value="30" selected>Frequent (30s)</option>
                              <option value="60">Standard (1min)</option>
                            </select>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-300">Auto-optimization</span>
                            <div className="relative">
                              <input type="checkbox" checked className="sr-only" />
                              <div className="w-10 h-6 bg-green-600 rounded-full shadow-inner"></div>
                              <div className="absolute inset-y-0 right-0 w-4 h-4 m-1 bg-white rounded-full shadow"></div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Security & Access */}
                      <div className="space-y-4">
                        <h5 className="text-gray-400 font-medium text-sm uppercase tracking-wide">Security & Access</h5>
                        
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm text-gray-300 mb-1">Access Level</label>
                            <select className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm">
                              <option value="read">Read Only</option>
                              <option value="manage" selected>Manage Operations</option>
                              <option value="full">Full Control</option>
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-sm text-gray-300 mb-1">Notification Level</label>
                            <select className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm">
                              <option value="critical">Critical Only</option>
                              <option value="important" selected>Important + Critical</option>
                              <option value="all">All Notifications</option>
                            </select>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-300">Emergency Override</span>
                            <div className="relative">
                              <input type="checkbox" checked className="sr-only" />
                              <div className="w-10 h-6 bg-green-600 rounded-full shadow-inner"></div>
                              <div className="absolute inset-y-0 right-0 w-4 h-4 m-1 bg-white rounded-full shadow"></div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Smart Features */}
                      <div className="space-y-4">
                        <h5 className="text-gray-400 font-medium text-sm uppercase tracking-wide">AI Features</h5>
                        
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-300">Predictive Analytics</span>
                            <div className="relative">
                              <input type="checkbox" checked className="sr-only" />
                              <div className="w-10 h-6 bg-green-600 rounded-full shadow-inner"></div>
                              <div className="absolute inset-y-0 right-0 w-4 h-4 m-1 bg-white rounded-full shadow"></div>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-300">Auto-learning</span>
                            <div className="relative">
                              <input type="checkbox" checked className="sr-only" />
                              <div className="w-10 h-6 bg-green-600 rounded-full shadow-inner"></div>
                              <div className="absolute inset-y-0 right-0 w-4 h-4 m-1 bg-white rounded-full shadow"></div>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-300">Smart Recommendations</span>
                            <div className="relative">
                              <input type="checkbox" checked className="sr-only" />
                              <div className="w-10 h-6 bg-green-600 rounded-full shadow-inner"></div>
                              <div className="absolute inset-y-0 right-0 w-4 h-4 m-1 bg-white rounded-full shadow"></div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Advanced Options */}
                      <div className="space-y-4">
                        <h5 className="text-gray-400 font-medium text-sm uppercase tracking-wide">Advanced</h5>
                        
                        <div className="space-y-3">
                          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded text-sm transition-colors">
                            Export Configuration
                          </button>
                          
                          <button className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded text-sm transition-colors">
                            Reset to Defaults
                          </button>
                          
                          <button className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded text-sm transition-colors">
                            Disable Supervisor
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-600/30">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowSettingsModal(prev => ({ ...prev, [supervisor.id]: false }));
                        }}
                        className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          // Save settings logic here
                          setShowSettingsModal(prev => ({ ...prev, [supervisor.id]: false }));
                        }}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
                      >
                        Save Settings
                      </button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
        </motion.div>

        {/* Recent Tasks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-light text-white matrix-text">Recent Supervisor Tasks</h2>
            <span className="text-sm text-gray-400">{activeTasks} active tasks</span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {tasks.slice(0, 6).map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="terminal-border rounded-lg p-4 hover:border-green-400/30 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-gray-800 rounded-lg">
                      {task.supervisor.supervisorType === 'logistics' ? 
                        <Crown className="w-5 h-5 text-purple-400" /> : 
                        <Shield className="w-5 h-5 text-purple-400" />
                      }
                    </div>
                    <div>
                      <h3 className="text-white font-light">{task.description}</h3>
                      <p className="text-sm text-gray-400">
                        {task.supervisor.name} • {task.taskType}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs flex items-center space-x-1 ${getTaskStatusColor(task.status)}`}>
                      {task.status === 'completed' ? <CheckCircle className="w-3 h-3" /> : 
                       task.status === 'in_progress' ? <Activity className="w-3 h-3" /> :
                       <Clock className="w-3 h-3" />}
                      <span className="capitalize">{task.status.replace('_', ' ')}</span>
                    </span>
                  </div>
                </div>
                {task.result && (
                  <div className="mt-3 p-3 bg-green-400/5 rounded-lg border border-green-400/20">
                    <p className="text-sm text-green-400">
                      Result: {typeof task.result === 'object' ? JSON.stringify(task.result) : task.result}
                    </p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Supervisor Details Modal */}
        {selectedSupervisor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedSupervisor(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="terminal-border rounded-lg p-8 max-w-4xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-purple-400/10 rounded-lg">
                    {getSupervisorIcon(selectedSupervisor.supervisorType)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-light text-white matrix-text">{selectedSupervisor.name}</h2>
                    <p className="text-gray-400">v{selectedSupervisor.version} • {selectedSupervisor.supervisorType} supervisor</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedSupervisor(null)}
                  className="text-gray-400 hover:text-white transition-colors text-2xl"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-light text-purple-400 mb-2">Description</h3>
                    <p className="text-gray-300 font-light leading-relaxed">{selectedSupervisor.description}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-light text-purple-400 mb-2">Capabilities</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedSupervisor.capabilities.map((capability, idx) => (
                        <span key={idx} className="px-3 py-1 bg-purple-400/10 text-purple-400 text-sm rounded">
                          {capability}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-light text-purple-400 mb-2">Recent Tasks</h3>
                    <div className="space-y-2">
                      {tasks.filter(task => task.supervisorId === selectedSupervisor.id).slice(0, 3).map((task, idx) => (
                        <div key={idx} className="p-3 bg-gray-800/50 rounded-lg">
                          <div className="flex justify-between items-center">
                            <span className="text-white text-sm">{task.description}</span>
                            <span className={`px-2 py-1 rounded text-xs ${getTaskStatusColor(task.status)}`}>
                              {task.status.replace('_', ' ')}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-light text-purple-400 mb-2">Performance Analytics</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Performance Score:</span>
                        <span className="text-white">{selectedSupervisor.performanceScore.toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Success Rate:</span>
                        <span className="text-white">{selectedSupervisor.successRate.toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Avg Response Time:</span>
                        <span className="text-white">{selectedSupervisor.avgResponseTime.toFixed(0)}ms</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Revenue Generated:</span>
                        <span className="text-white">${selectedSupervisor.revenueGenerated.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {selectedSupervisor.analytics && (
                    <div>
                      <h3 className="text-lg font-light text-purple-400 mb-2">Supervision Metrics</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Managed Agents:</span>
                          <span className="text-white">{selectedSupervisor.analytics.subordinateCount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Active Tasks:</span>
                          <span className="text-white">{selectedSupervisor.analytics.activeTasks}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Completed Tasks:</span>
                          <span className="text-white">{selectedSupervisor.analytics.completedTasks}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Efficiency:</span>
                          <span className="text-white">{selectedSupervisor.analytics.efficiency.toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <h3 className="text-lg font-light text-purple-400 mb-2">System Information</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Status:</span>
                        <span className={`capitalize ${
                          selectedSupervisor.status === 'active' ? 'text-green-400' :
                          selectedSupervisor.status === 'maintenance' ? 'text-yellow-400' :
                          'text-gray-400'
                        }`}>
                          {selectedSupervisor.status}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Type:</span>
                        <span className="text-white">{selectedSupervisor.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Supervisor ID:</span>
                        <span className="text-white font-mono">{selectedSupervisor.id}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
