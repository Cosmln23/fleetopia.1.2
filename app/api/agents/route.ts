import { NextRequest, NextResponse } from 'next/server';

// Mock data pentru agenți AI
const mockAgents = [
  {
    id: 'agent-1',
    name: 'RouteOptimizer Pro',
    description: 'AI agent for route optimization and fuel efficiency',
    type: 'optimization',
    category: 'transport',
    version: '2.1.0',
    status: 'active',
    performance: 94.5,
    revenue: 15200,
    performanceScore: 94.5,
    requests: 1247,
    successRate: 98.2,
    avgResponseTime: 150,
    capabilities: ['route-optimization', 'fuel-efficiency', 'real-time-tracking'],
    isActive: true,
    evolutionCycle: 3,
    evolutionStatus: 'EVOLVING',
    protocolCompliance: 'FULL',
    confidenceScore: 0.95,
    treeLayer: 'TRUNK',
    treeDepth: 1,
    branchWeight: 0.8,
    usbcCompatibility: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: 'agent-2',
    name: 'FuelMaster AI',
    description: 'Advanced fuel consumption optimization',
    type: 'optimization',
    category: 'fuel',
    version: '1.8.3',
    status: 'active',
    performance: 92.1,
    revenue: 12800,
    performanceScore: 92.1,
    requests: 986,
    successRate: 96.7,
    avgResponseTime: 180,
    capabilities: ['fuel-optimization', 'cost-analysis', 'predictive-maintenance'],
    isActive: true,
    evolutionCycle: 2,
    evolutionStatus: 'LEARNING',
    protocolCompliance: 'FULL',
    confidenceScore: 0.92,
    treeLayer: 'BRANCHES',
    treeDepth: 2,
    branchWeight: 0.7,
    usbcCompatibility: true,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-19')
  },
  {
    id: 'agent-3',
    name: 'DeliveryPredictor',
    description: 'Predictive analytics for delivery optimization',
    type: 'prediction',
    category: 'logistics',
    version: '3.0.1',
    status: 'active',
    performance: 89.3,
    revenue: 9600,
    performanceScore: 89.3,
    requests: 756,
    successRate: 94.1,
    avgResponseTime: 220,
    capabilities: ['delivery-prediction', 'demand-forecasting', 'inventory-optimization'],
    isActive: true,
    evolutionCycle: 4,
    evolutionStatus: 'EVOLVING',
    protocolCompliance: 'PARTIAL',
    confidenceScore: 0.89,
    treeLayer: 'LEAVES',
    treeDepth: 3,
    branchWeight: 0.6,
    usbcCompatibility: false,
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-18')
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const includeAnalytics = searchParams.get('includeAnalytics') === 'true';

    let filteredAgents = [...mockAgents];

    // Apply filters
    if (category && category !== 'all') {
      filteredAgents = filteredAgents.filter(agent => agent.category === category);
    }

    if (status && status !== 'all') {
      filteredAgents = filteredAgents.filter(agent => agent.status === status);
    }

    // Add enhanced metrics
    const enhancedAgents = filteredAgents.map(agent => ({
      ...agent,
      treeMetrics: {
        layer: agent.treeLayer,
        depth: agent.treeDepth,
        weight: agent.branchWeight,
        children_count: 0,
        parent_name: null
      },
      evolutionMetrics: {
        cycle: agent.evolutionCycle,
        status: agent.evolutionStatus,
        last_evolution: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
        next_evolution: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000),
        modifications_count: Math.floor(Math.random() * 10),
        success_rate: 0.85 + Math.random() * 0.15
      },
      protocolMetrics: {
        compliance: agent.protocolCompliance,
        confidence: agent.confidenceScore,
        validation_score: Math.random() * 100,
        mcp_compatible: agent.usbcCompatibility
      },
      paradiseMetrics: {
        happiness_contribution: Math.random() * 1000,
        community_impact: Math.random() * 500,
        innovation_rate: Math.random() * 100
      },
      ...(includeAnalytics && {
        analytics: {
          avgPerformance: agent.performanceScore,
          totalRevenue: agent.revenue,
          recentPerformanceCount: Math.floor(Math.random() * 20),
          recentRevenueCount: Math.floor(Math.random() * 15),
          trend: ['up', 'down', 'stable'][Math.floor(Math.random() * 3)]
        }
      })
    }));

    return NextResponse.json({
      success: true,
      data: enhancedAgents,
      count: enhancedAgents.length,
      metadata: {
        total_agents: enhancedAgents.length,
        active_agents: enhancedAgents.filter(a => a.isActive).length,
        evolution_cycles_total: enhancedAgents.reduce((sum, a) => sum + a.evolutionCycle, 0),
        avg_confidence_score: enhancedAgents.length > 0 ? 
          enhancedAgents.reduce((sum, a) => sum + a.confidenceScore, 0) / enhancedAgents.length : 0,
        protocol_compliance_rate: enhancedAgents.length > 0 ? 
          enhancedAgents.filter(a => a.protocolCompliance === 'FULL').length / enhancedAgents.length : 0
      }
    });
  } catch (error) {
    console.error('Error fetching agents:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch agents'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Simulate creating a new agent
    const newAgent = {
      id: `agent-${Date.now()}`,
      name: body.name || 'New Agent',
      description: body.description || 'AI Agent description',
      type: body.type || 'standard',
      category: body.category || 'general',
      version: body.version || '1.0.0',
      status: 'active',
      performance: 0,
      revenue: 0,
      performanceScore: 0,
      requests: 0,
      successRate: 100,
      avgResponseTime: 0,
      capabilities: body.capabilities || [],
      isActive: true,
      evolutionCycle: 1,
      evolutionStatus: 'LEARNING',
      protocolCompliance: 'PARTIAL',
      confidenceScore: 0.5,
      treeLayer: 'LEAVES',
      treeDepth: 1,
      branchWeight: 0.5,
      usbcCompatibility: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return NextResponse.json({
      success: true,
      data: newAgent,
      message: 'Agent created successfully'
    });
  } catch (error) {
    console.error('Error creating agent:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create agent'
      },
      { status: 500 }
    );
  }
} 