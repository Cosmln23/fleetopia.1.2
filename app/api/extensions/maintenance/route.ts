import { NextRequest, NextResponse } from 'next/server';

export const dynamic = "force-dynamic";

// Mock maintenance data
const generateMockMaintenanceData = (provider: string, vehicleId?: string) => {
  const baseData = {
    provider,
    features: ['scheduled_maintenance', 'predictive_analytics', 'inventory_management'],
    vehicleId: vehicleId || `vehicle-${Math.floor(Math.random() * 100)}`,
    lastUpdate: new Date()
  };

  if (provider === 'fleetio') {
    return {
      ...baseData,
      records: [
        {
          id: `maint-${Date.now()}-1`,
          type: 'oil_change',
          description: 'Regular oil and filter change',
          cost: 85.50,
          mileage: 125000,
          serviceDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
          nextService: new Date(Date.now() + 75 * 24 * 60 * 60 * 1000),
          status: 'completed',
          parts: [{ name: 'Engine Oil', quantity: 1, cost: 45 }],
          predictive: false
        },
        {
          id: `maint-${Date.now()}-2`,
          type: 'brake_inspection',
          description: 'Brake system inspection and pad replacement',
          cost: 320.00,
          mileage: 124800,
          serviceDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          nextService: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
          status: 'completed',
          parts: [{ name: 'Brake Pads', quantity: 4, cost: 180 }],
          predictive: true
        }
      ],
      predictiveAlerts: [
        {
          type: 'transmission_service',
          urgency: 'medium',
          estimatedDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
          confidence: 85,
          estimatedCost: 450
        }
      ]
    };
  } else if (provider === 'mitchell1') {
    return {
      ...baseData,
      diagnostics: {
        engineStatus: 'good',
        dtcCodes: [],
        engineParameters: {
          rpm: 850,
          coolantTemp: 195,
          oilPressure: 45,
          fuelTrim: 2.5,
          intakeAirTemp: 75,
          throttlePosition: 15
        },
        emissionsData: {
          co2: 15.2,
          nox: 0.8,
          lastTest: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
        },
        lastUpdate: new Date()
      },
      alerts: [
        {
          type: 'engine_check',
          message: 'Engine performance within normal parameters',
          severity: 'info'
        }
      ]
    };
  } else {
    return {
      ...baseData,
      schedule: [
        {
          service: 'Oil Change',
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          dueMileage: 130000,
          estimatedCost: 90
        },
        {
          service: 'Tire Rotation',
          dueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
          dueMileage: 135000,
          estimatedCost: 45
        }
      ]
    };
  }
};

// GET maintenance data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const provider = searchParams.get('provider') || 'fleetio';
    const vehicleId = searchParams.get('vehicleId');
    const type = searchParams.get('type') || 'all';

    const maintenanceData = generateMockMaintenanceData(provider, vehicleId || undefined);

    return NextResponse.json({
      success: true,
      data: maintenanceData,
      provider,
      vehicleId,
      type,
      message: `Maintenance data retrieved from ${provider}`,
      timestamp: new Date()
    });

  } catch (error) {
    console.error('Maintenance API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch maintenance data',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date()
    }, { status: 500 });
  }
}

// Schedule maintenance
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      vehicleId, 
      type, 
      description, 
      scheduledDate, 
      estimatedCost, 
      provider = 'fleetio' 
    } = body;

    if (!vehicleId || !type || !scheduledDate) {
      return NextResponse.json({
        success: false,
        error: 'Vehicle ID, type, and scheduled date are required',
        timestamp: new Date()
      }, { status: 400 });
    }

    // Mock maintenance record
    const maintenanceRecord = {
      id: `sched-${Date.now()}`,
      vehicleId,
      type,
      description: description || `Scheduled ${type}`,
      scheduledDate: new Date(scheduledDate),
      estimatedCost: estimatedCost || 150,
      status: 'scheduled',
      provider,
      createdAt: new Date()
    };

    return NextResponse.json({
      success: true,
      data: maintenanceRecord,
      message: 'Maintenance scheduled successfully',
      timestamp: new Date()
    });

  } catch (error) {
    console.error('Maintenance scheduling error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to schedule maintenance',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date()
    }, { status: 500 });
  }
}

// Update maintenance record
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { recordId, status, actualCost, completedDate, notes } = body;

    if (!recordId || !status) {
      return NextResponse.json({
        success: false,
        error: 'Record ID and status are required',
        timestamp: new Date()
      }, { status: 400 });
    }

    // Mock maintenance record update
    const updatedRecord = {
      id: recordId,
      status,
      actualCost: actualCost || null,
      completedDate: status === 'completed' ? new Date(completedDate) || new Date() : null,
      notes: notes || '',
      updatedAt: new Date()
    };

    return NextResponse.json({
      success: true,
      data: updatedRecord,
      message: `Maintenance record ${status} successfully`,
      timestamp: new Date()
    });

  } catch (error) {
    console.error('Maintenance update error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update maintenance record',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date()
    }, { status: 500 });
  }
}
