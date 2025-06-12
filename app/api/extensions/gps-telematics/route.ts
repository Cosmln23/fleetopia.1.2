import { NextRequest, NextResponse } from 'next/server';

export const dynamic = "force-dynamic";

// Mock GPS tracking data
const generateMockTelematicsData = (vehicleId?: string) => {
  const baseId = vehicleId || `vehicle-${Math.floor(Math.random() * 100)}`;
  
  return {
    vehicleId: baseId,
    timestamp: new Date(),
    gps: {
      latitude: 40.7128 + (Math.random() - 0.5) * 0.1,
      longitude: -74.0060 + (Math.random() - 0.5) * 0.1,
      speed: Math.floor(Math.random() * 80) + 10,
      heading: Math.floor(Math.random() * 360),
      altitude: Math.floor(Math.random() * 1000) + 100,
      accuracy: Math.random() * 5 + 1
    },
    engine: {
      status: Math.random() > 0.1 ? 'running' : 'stopped',
      rpm: Math.floor(Math.random() * 3000) + 800,
      temperature: Math.floor(Math.random() * 40) + 80,
      fuelLevel: Math.floor(Math.random() * 100),
      oilPressure: Math.floor(Math.random() * 50) + 30
    },
    vehicle: {
      mileage: Math.floor(Math.random() * 100000) + 50000,
      fuelConsumption: (Math.random() * 2 + 6).toFixed(1),
      batteryVoltage: (Math.random() * 2 + 12).toFixed(1),
      tirePressure: {
        frontLeft: Math.floor(Math.random() * 10) + 30,
        frontRight: Math.floor(Math.random() * 10) + 30,
        rearLeft: Math.floor(Math.random() * 10) + 30,
        rearRight: Math.floor(Math.random() * 10) + 30
      }
    },
    driver: {
      status: Math.random() > 0.2 ? 'active' : 'break',
      hoursOnDuty: Math.floor(Math.random() * 10) + 1,
      score: Math.floor(Math.random() * 30) + 70
    },
    alerts: Math.random() > 0.8 ? ['Speed limit exceeded'] : []
  };
};

// GET Telematics data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const vehicleId = searchParams.get('vehicleId');
    const provider = searchParams.get('provider') || 'samsara';
    const realTime = searchParams.get('realTime') === 'true';

    // Generate mock data for multiple vehicles or specific vehicle
    let telematicsData;
    
    if (!vehicleId) {
      // Generate data for multiple vehicles
      telematicsData = Array.from({ length: 5 }, (_, i) => 
        generateMockTelematicsData(`vehicle-00${i + 1}`)
      );
    } else {
      // Generate data for specific vehicle
      telematicsData = [generateMockTelematicsData(vehicleId)];
    }

    // Mock provider capabilities
    const providerCapabilities = {
      samsara: {
        features: ['gps_tracking', 'engine_diagnostics', 'driver_monitoring', 'fuel_monitoring'],
        updateFrequency: '30 seconds',
        accuracy: 'high'
      },
      geotab: {
        features: ['gps_tracking', 'vehicle_diagnostics', 'maintenance_alerts', 'route_optimization'],
        updateFrequency: '1 minute',
        accuracy: 'very_high'
      },
      fleetio: {
        features: ['gps_tracking', 'maintenance_tracking', 'fuel_management', 'driver_logs'],
        updateFrequency: '2 minutes',
        accuracy: 'high'
      }
    };

    const capabilities = providerCapabilities[provider as keyof typeof providerCapabilities] || providerCapabilities.samsara;

    return NextResponse.json({
      success: true,
      data: {
        telematics: telematicsData,
        capabilities,
        realTime,
        lastUpdate: new Date()
      },
      provider,
      vehicleId,
      total: telematicsData.length,
      message: `GPS telematics data retrieved from ${provider}`,
      timestamp: new Date()
    });

  } catch (error) {
    console.error('GPS Telematics API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch telematics data',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date()
    }, { status: 500 });
  }
}

// Start real-time tracking
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { vehicleId, trackingMode = 'continuous', provider = 'samsara' } = body;

    if (!vehicleId) {
      return NextResponse.json({
        success: false,
        error: 'Vehicle ID is required for tracking',
        timestamp: new Date()
      }, { status: 400 });
    }

    // Mock tracking session
    const trackingSession = {
      id: `tracking-${Date.now()}`,
      vehicleId,
      provider,
      mode: trackingMode,
      status: 'active',
      startTime: new Date(),
      updateInterval: trackingMode === 'continuous' ? 30 : 300, // seconds
      estimatedBatteryImpact: trackingMode === 'continuous' ? 'high' : 'low'
    };

    return NextResponse.json({
      success: true,
      data: {
        trackingSession,
        initialData: generateMockTelematicsData(vehicleId)
      },
      message: `Real-time tracking started for vehicle ${vehicleId}`,
      timestamp: new Date()
    });

  } catch (error) {
    console.error('Real-time tracking error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to start real-time tracking',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date()
    }, { status: 500 });
  }
}

// Stop tracking or update settings
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { trackingId, action = 'stop' } = body;

    if (!trackingId) {
      return NextResponse.json({
        success: false,
        error: 'Tracking ID is required',
        timestamp: new Date()
      }, { status: 400 });
    }

    // Mock tracking update
    const result = {
      trackingId,
      action,
      status: action === 'stop' ? 'stopped' : 'updated',
      endTime: action === 'stop' ? new Date() : null,
      duration: action === 'stop' ? '2 hours 15 minutes' : null
    };

    return NextResponse.json({
      success: true,
      data: result,
      message: `Tracking session ${action}ped successfully`,
      timestamp: new Date()
    });

  } catch (error) {
    console.error('Tracking update error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update tracking',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date()
    }, { status: 500 });
  }
}
