// Fleetopia.co - Self-Evolving AI Marketplace for Transport Paradise
// Enhanced Agents API with Standard Protocol Implementation

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { TreeLayer, EvolutionStatus, ProtocolCompliance } from '@/lib/types';

export const dynamic = "force-dynamic";

// STANDARD PROTOCOL VALIDATION
function validateStandardInput(input: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!input.version || input.version !== '2.0') {
    errors.push('Invalid or missing protocol version. Required: 2.0');
  }
  
  if (!input.agentId) {
    errors.push('Missing agentId in standard input');
  }
  
  if (!input.requestId) {
    errors.push('Missing requestId in standard input');
  }
  
  if (input.confidenceRequired && (typeof input.confidenceRequired !== 'number' || input.confidenceRequired < 0 || input.confidenceRequired > 1)) {
    errors.push('Invalid confidenceRequired. Must be a number between 0 and 1');
  }
  
  return { valid: errors.length === 0, errors };
}

function generateStandardOutput(data: any, agentId: string, requestId: string, confidenceScore: number): any {
  return {
    version: '2.0',
    timestamp: new Date(),
    agentId,
    requestId,
    result: data,
    confidenceScore,
    transparencyLog: {
      calculation_steps: 'Agent data retrieval and processing',
      decision_factors: ['database_query', 'data_filtering', 'response_formatting'],
      confidence_breakdown: {
        data_quality: 0.95,
        processing_accuracy: 0.98,
        system_reliability: 0.99
      }
    },
    dataContribution: {
      query_patterns: 'anonymized',
      performance_metrics: 'aggregated',
      usage_statistics: 'collected'
    },
    metadata: {
      processing_time: Date.now(),
      protocol_version: '2.0',
      tree_layer: 'TRUNK',
      evolution_cycle: 'current'
    }
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const protocolMode = searchParams.get('protocol') === 'standard';
    const requestId = searchParams.get('requestId') || `req_${Date.now()}`;
    const agentId = searchParams.get('agentId') || 'system';
    const category = searchParams.get('category');
    const supervisorType = searchParams.get('supervisorType');
    const includeSubordinates = searchParams.get('includeSubordinates') === 'true';
    const includeAnalytics = searchParams.get('includeAnalytics') === 'true';
    
    const whereClause: any = {};
    
    if (category) {
      whereClause.category = category;
    }
    
    if (supervisorType) {
      whereClause.supervisorType = supervisorType;
    }

    // Enhanced query with all new relations
    const agents = await prisma.aIAgent.findMany({
      where: whereClause,
      include: {
        supervisor: true,
        subordinates: includeSubordinates,
        parentAgent: true,
        childAgents: true,
        performanceLogs: {
          take: includeAnalytics ? 10 : 5,
          orderBy: { timestamp: 'desc' }
        },
        revenueLogs: {
          take: includeAnalytics ? 10 : 5,
          orderBy: { timestamp: 'desc' }
        },
        supervisorTasks: {
          take: 5,
          orderBy: { createdAt: 'desc' }
        },
        evolutionLogs: {
          take: 3,
          orderBy: { timestamp: 'desc' }
        },
        protocolValidations: {
          take: 3,
          orderBy: { timestamp: 'desc' }
        },
        digitalTwins: true,
        transactions: {
          where: { type: 'revenue' },
          select: { amount: true }
        }
      },
      orderBy: [
        { category: 'asc' }, // supervisors first
        { createdAt: 'desc' }
      ]
    });

    // Calculate enhanced metrics
    const enhancedAgents = agents.map(agent => {
      const revenue = agent.transactions?.reduce((sum, t) => sum + (t as any).amount, 0) || agent.revenue || 0;
      
      let analytics = {};
      if (includeAnalytics) {
        const recentPerformance = agent.performanceLogs || [];
        const recentRevenue = agent.revenueLogs || [];
        
        const avgPerformance = recentPerformance.length > 0 
          ? recentPerformance.reduce((sum, log) => sum + log.value, 0) / recentPerformance.length
          : agent.performanceScore;

        const totalRevenue = recentRevenue.reduce((sum, log) => sum + log.amount, 0);

        analytics = {
          avgPerformance,
          totalRevenue,
          recentPerformanceCount: recentPerformance.length,
          recentRevenueCount: recentRevenue.length,
          trend: avgPerformance > agent.performanceScore ? 'up' : 
                 avgPerformance < agent.performanceScore ? 'down' : 'stable'
        };
      }

      return {
        ...agent,
        revenue,
        // Digital Tree Metrics
        treeMetrics: {
          layer: agent.treeLayer,
          depth: agent.treeDepth,
          weight: agent.branchWeight,
          children_count: agent.childAgents?.length || 0,
          parent_name: agent.parentAgent?.name || null
        },
        // Evolution Metrics
        evolutionMetrics: {
          cycle: agent.evolutionCycle,
          status: agent.evolutionStatus,
          last_evolution: agent.lastEvolution,
          next_evolution: agent.nextEvolution,
          modifications_count: agent.selfModifications?.modification_count || 0,
          success_rate: agent.selfModifications?.success_rate || 0
        },
        // Protocol Metrics
        protocolMetrics: {
          compliance: agent.protocolCompliance,
          confidence: agent.confidenceScore,
          validation_score: agent.protocolValidations?.[0]?.validationScore || 0,
          mcp_compatible: agent.usbcCompatibility
        },
        // Paradise Metrics
        paradiseMetrics: {
          happiness_contribution: agent.dataContribution?.marketplace_value || 0,
          community_impact: agent.dataContribution?.insights_shared || 0,
          innovation_rate: agent.learningData?.optimization_opportunities || 0
        },
        ...(includeAnalytics && { analytics })
      };
    });

    if (protocolMode) {
      // Return in Standard Protocol format
      const standardOutput = generateStandardOutput(
        enhancedAgents,
        agentId,
        requestId,
        0.98
      );
      
      return NextResponse.json({
        success: true,
        ...standardOutput,
        count: agents.length,
        protocolVersion: '2.0',
        treeLayer: TreeLayer.TRUNK
      });
    }

    return NextResponse.json({
      success: true,
      data: enhancedAgents,
      count: agents.length,
      metadata: {
        total_agents: agents.length,
        active_agents: agents.filter(a => a.isActive).length,
        evolution_cycles_total: agents.reduce((sum, a) => sum + a.evolutionCycle, 0),
        avg_confidence_score: agents.length > 0 ? agents.reduce((sum, a) => sum + a.confidenceScore, 0) / agents.length : 0,
        protocol_compliance_rate: agents.length > 0 ? agents.filter(a => a.protocolCompliance === 'FULL').length / agents.length : 0,
        tree_layers: {
          TRUNK: agents.filter(a => a.treeLayer === 'TRUNK').length,
          BRANCHES: agents.filter(a => a.treeLayer === 'BRANCHES').length,
          LEAVES: agents.filter(a => a.treeLayer === 'LEAVES').length,
          FRUITS: agents.filter(a => a.treeLayer === 'FRUITS').length
        },
        paradise_status: {
          self_evolution_active: agents.filter(a => a.evolutionStatus === 'EVOLVING' || a.evolutionStatus === 'LEARNING').length,
          marketplace_contributors: agents.filter(a => a.dataContribution && Object.keys(a.dataContribution).length > 0).length,
          mcp_compatible_agents: agents.filter(a => a.usbcCompatibility).length
        }
      }
    });
  } catch (error) {
    console.error('Error fetching agents:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch agents',
        protocolVersion: '2.0',
        confidenceScore: 0.0,
        transparencyLog: {
          error_type: 'database_error',
          error_details: 'Agent retrieval failed'
        }
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const requestId = body.requestId || `req_${Date.now()}`;
    
    // Validate Standard Protocol input if provided
    if (body.standardProtocol) {
      const validation = validateStandardInput(body);
      if (!validation.valid) {
        return NextResponse.json({
          success: false,
          error: 'Standard Protocol validation failed',
          errors: validation.errors,
          protocolVersion: '2.0',
          confidenceScore: 0.0
        }, { status: 400 });
      }
    }

    // Create agent with enhanced fields
    const agent = await prisma.aIAgent.create({
      data: {
        name: body.name,
        type: body.type,
        category: body.category || 'standard',
        supervisorType: body.supervisorType,
        description: body.description,
        version: body.version || '1.0.0',
        status: body.status || 'active',
        performance: body.performance || 0,
        revenue: body.revenue || 0,
        revenueGenerated: body.revenueGenerated || 0,
        performanceScore: body.performanceScore || 0,
        requests: body.requests || 0,
        successRate: body.successRate || 100,
        avgResponseTime: body.avgResponseTime || 0,
        capabilities: body.capabilities || [],
        apiEndpoint: body.apiEndpoint,
        apiConfig: body.apiConfig,
        supervisorId: body.supervisorId,
        isActive: body.isActive !== undefined ? body.isActive : true,
        
        // SELF-EVOLVING AI ARCHITECTURE
        evolutionCycle: body.evolutionCycle || 0,
        evolutionStatus: body.evolutionStatus || EvolutionStatus.LEARNING,
        lastEvolution: body.lastEvolution,
        nextEvolution: body.nextEvolution || new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
        goalInput: body.goalInput,
        actionsOutput: body.actionsOutput,
        learningData: body.learningData,
        codeVersion: body.codeVersion || '1.0.0',
        selfModifications: body.selfModifications,
        
        // DIGITAL TREE METAPHOR
        treeLayer: body.treeLayer || TreeLayer.BRANCHES,
        parentAgentId: body.parentAgentId,
        treeDepth: body.treeDepth || 0,
        branchWeight: body.branchWeight || 1.0,
        
        // STANDARD PROTOCOL IMPLEMENTATION
        protocolCompliance: body.protocolCompliance || ProtocolCompliance.PENDING,
        confidenceScore: body.confidenceScore || 0.0,
        standardInput: body.standardInput,
        standardOutput: body.standardOutput,
        dataContribution: body.dataContribution,
        transparencyLog: body.transparencyLog,
        
        // AGENTIC WEB INTEGRATION (MCP)
        mcpEndpoint: body.mcpEndpoint,
        mcpCapabilities: body.mcpCapabilities,
        agentOrchestration: body.agentOrchestration,
        usbcCompatibility: body.usbcCompatibility || false,
        
        // MICROSERVICES SIMULATION
        grpcEndpoint: body.grpcEndpoint,
        messageQueue: body.messageQueue,
        kafkaTopics: body.kafkaTopics,
        elasticsearchIndex: body.elasticsearchIndex
      },
      include: {
        supervisor: true,
        subordinates: true,
        parentAgent: true,
        childAgents: true,
        evolutionLogs: true,
        protocolValidations: true,
        digitalTwins: true
      }
    });

    // Create initial protocol validation
    await prisma.protocolValidation.create({
      data: {
        agentId: agent.id,
        inputValid: true,
        outputValid: true,
        confidenceValid: agent.confidenceScore >= 0.8,
        transparencyValid: !!agent.transparencyLog,
        dataContributed: !!agent.dataContribution,
        validationScore: agent.confidenceScore,
        errors: null,
        warnings: agent.confidenceScore < 0.8 ? ['Confidence score below recommended threshold'] : null
      }
    });

    // Create initial digital twin
    await prisma.digitalTwin.create({
      data: {
        agentId: agent.id,
        twinType: 'performance',
        twinData: {
          initial_state: {
            performance: agent.performance,
            confidence: agent.confidenceScore,
            evolution_cycle: agent.evolutionCycle
          },
          creation_timestamp: new Date(),
          sync_frequency: 'real_time'
        },
        accuracy: 1.0
      }
    });

    if (body.standardProtocol) {
      // Return in Standard Protocol format
      const standardOutput = generateStandardOutput(
        agent,
        body.agentId || 'system',
        requestId,
        0.95
      );
      
      return NextResponse.json({
        success: true,
        ...standardOutput
      });
    }

    return NextResponse.json({
      success: true,
      data: agent,
      message: 'Self-evolving AI agent created successfully in Transport Paradise!',
      protocolVersion: '2.0',
      confidenceScore: 0.95
    });
  } catch (error) {
    console.error('Error creating agent:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create agent',
        protocolVersion: '2.0',
        confidenceScore: 0.0,
        transparencyLog: {
          error_type: 'creation_error',
          error_details: 'Agent creation failed'
        }
      },
      { status: 500 }
    );
  }
}
