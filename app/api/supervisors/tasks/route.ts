import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    // Return mock data for demonstration
    return NextResponse.json([
      {
        id: 'task-001',
        supervisorId: 'supervisor-001',
        taskType: 'optimization',
        priority: 'high',
        status: 'completed',
        description: 'Optimize fuel consumption across all logistics agents',
        result: { fuelSavings: '15%', costReduction: '$25000' },
        startedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        completedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        supervisor: {
          id: 'supervisor-001',
          name: 'Logistics Supervisor',
          type: 'logistics-supervisor',
          supervisorType: 'logistics'
        }
      },
      {
        id: 'task-002',
        supervisorId: 'supervisor-002',
        taskType: 'analysis',
        priority: 'medium',
        status: 'in_progress',
        description: 'Analyze pricing strategies for Q2',
        startedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
        supervisor: {
          id: 'supervisor-002',
          name: 'Business Supervisor',
          type: 'business-supervisor',
          supervisorType: 'business'
        }
      }
    ]);
  } catch (error) {
    console.error('Supervisor tasks API error:', error);
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Mock successful response
    const task = {
      id: `task-${Date.now()}`,
      supervisorId: body.supervisorId,
      taskType: body.taskType,
      priority: body.priority || 'medium',
      status: body.status || 'pending',
      description: body.description,
      parameters: body.parameters,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      supervisor: {
        id: body.supervisorId,
        name: 'Mock Supervisor',
        type: 'supervisor',
        supervisorType: 'logistics'
      }
    };

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error('Create supervisor task error:', error);
    return NextResponse.json({ error: 'Failed to create supervisor task' }, { status: 500 });
  }
}
