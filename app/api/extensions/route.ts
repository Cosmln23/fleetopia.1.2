import { NextRequest, NextResponse } from 'next/server';

export const dynamic = "force-dynamic";

// Mock API integrations data
const mockIntegrations: any[] = [
  { id: 'int-001', name: 'Stripe Payment Gateway', provider: 'stripe', type: 'financial', status: 'active', createdAt: new Date(), config: {} },
  { id: 'int-002', name: 'SendGrid Email', provider: 'sendgrid', type: 'communication', status: 'active', createdAt: new Date(), config: {} },
  { id: 'int-003', name: 'Samsara Telematics', provider: 'samsara', type: 'gps_telematics', status: 'active', createdAt: new Date(), config: {} },
  { id: 'int-004', name: 'Here Maps', provider: 'here', type: 'mapping', status: 'active', createdAt: new Date(), config: {} },
  { id: 'int-005', name: 'Fleetio Maintenance', provider: 'fleetio', type: 'maintenance', status: 'active', createdAt: new Date(), config: {} },
  { id: 'int-006', name: 'GasBuddy Fuel', provider: 'gasbuddy', type: 'fuel', status: 'active', createdAt: new Date(), config: {} },
  { id: 'int-007', name: 'Uber Freight', provider: 'uber_freight', type: 'freight_matching', status: 'active', createdAt: new Date(), config: {} },
  { id: 'int-008', name: 'FMCSA Compliance', provider: 'fmcsa', type: 'compliance', status: 'active', createdAt: new Date(), config: {} }
];

// Extension capabilities based on research
const extensionCapabilities = {
  financial: {
    providers: ['stripe', 'paypal', 'square'],
    features: ['payment_processing', 'invoicing', 'expense_tracking', 'financial_reporting'],
    integration_complexity: 'medium',
    setup_time: '2-4 hours'
  },
  communication: {
    providers: ['sendgrid', 'mailgun', 'twilio'],
    features: ['email_notifications', 'sms_alerts', 'push_notifications', 'bulk_messaging'],
    integration_complexity: 'low',
    setup_time: '1-2 hours'
  },
  gps_telematics: {
    providers: ['samsara', 'geotab', 'verizon_connect'],
    features: ['real_time_tracking', 'driver_behavior', 'vehicle_diagnostics', 'fuel_monitoring'],
    integration_complexity: 'high',
    setup_time: '1-2 days'
  },
  mapping: {
    providers: ['here', 'google', 'mapbox'],
    features: ['route_optimization', 'geocoding', 'traffic_data', 'navigation'],
    integration_complexity: 'medium',
    setup_time: '4-6 hours'
  },
  maintenance: {
    providers: ['fleetio', 'fleet_complete', 'dossier'],
    features: ['preventive_maintenance', 'work_orders', 'inventory_management', 'cost_tracking'],
    integration_complexity: 'medium',
    setup_time: '4-8 hours'
  },
  fuel: {
    providers: ['gasbuddy', 'fuel_cloud', 'comdata'],
    features: ['fuel_price_tracking', 'station_locator', 'fuel_card_integration', 'cost_analysis'],
    integration_complexity: 'low',
    setup_time: '2-3 hours'
  },
  freight_matching: {
    providers: ['uber_freight', 'convoy', 'loadsmart'],
    features: ['load_matching', 'rate_negotiation', 'carrier_verification', 'shipment_tracking'],
    integration_complexity: 'high',
    setup_time: '1-3 days'
  },
  compliance: {
    providers: ['fmcsa', 'pulsar', 'trimble'],
    features: ['dot_compliance', 'hours_of_service', 'driver_qualification', 'safety_monitoring'],
    integration_complexity: 'high',
    setup_time: '2-5 days'
  }
};

// GET available extensions and integrations
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const provider = searchParams.get('provider');
    const type = searchParams.get('type');

    // Filter integrations
    let filteredIntegrations = mockIntegrations;
    if (provider) {
      filteredIntegrations = filteredIntegrations.filter(int => int.provider === provider);
    }
    if (type) {
      filteredIntegrations = filteredIntegrations.filter(int => int.type === type);
    }

    return NextResponse.json({
      success: true,
      data: {
        integrations: filteredIntegrations,
        capabilities: extensionCapabilities,
        summary: {
          total_integrations: filteredIntegrations.length,
          active_integrations: filteredIntegrations.filter(int => int.status === 'active').length,
          available_types: Object.keys(extensionCapabilities),
          setup_guide: 'Visit /docs/integrations for detailed setup instructions'
        }
      },
      message: 'Extensions and integrations data retrieved successfully',
      timestamp: new Date()
    });

  } catch (error) {
    console.error('Extensions API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch extensions data',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date()
    }, { status: 500 });
  }
}

// Create new integration
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, provider, type, config, apiKey } = body;

    if (!name || !provider || !type) {
      return NextResponse.json({
        success: false,
        error: 'Name, provider, and type are required',
        timestamp: new Date()
      }, { status: 400 });
    }

    // Mock integration creation
    const newIntegration = {
      id: `int-${Date.now()}`,
      name,
      provider,
      type,
      status: 'active',
      config: config || {},
      apiKey: apiKey ? '***HIDDEN***' : null,
      createdAt: new Date(),
      lastSync: new Date()
    };

    // Add to mock storage
    mockIntegrations.push(newIntegration);

    return NextResponse.json({
      success: true,
      data: newIntegration,
      message: `Integration ${name} created successfully`,
      timestamp: new Date()
    });

  } catch (error) {
    console.error('Integration creation error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create integration',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date()
    }, { status: 500 });
  }
}

// Update integration
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, config } = body;

    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'Integration ID is required',
        timestamp: new Date()
      }, { status: 400 });
    }

    // Find and update integration in mock storage
    const integrationIndex = mockIntegrations.findIndex(int => int.id === id);
    if (integrationIndex === -1) {
      return NextResponse.json({
        success: false,
        error: 'Integration not found',
        timestamp: new Date()
      }, { status: 404 });
    }

    const updatedIntegration = {
      ...mockIntegrations[integrationIndex],
      status: status || mockIntegrations[integrationIndex].status,
      config: config || mockIntegrations[integrationIndex].config,
      updatedAt: new Date()
    };

    mockIntegrations[integrationIndex] = updatedIntegration;

    return NextResponse.json({
      success: true,
      data: updatedIntegration,
      message: 'Integration updated successfully',
      timestamp: new Date()
    });

  } catch (error) {
    console.error('Integration update error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update integration',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date()
    }, { status: 500 });
  }
}

// Delete integration
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'Integration ID is required',
        timestamp: new Date()
      }, { status: 400 });
    }

    // Find and remove integration from mock storage
    const integrationIndex = mockIntegrations.findIndex(int => int.id === id);
    if (integrationIndex === -1) {
      return NextResponse.json({
        success: false,
        error: 'Integration not found',
        timestamp: new Date()
      }, { status: 404 });
    }

    const deletedIntegration = mockIntegrations.splice(integrationIndex, 1)[0];

    return NextResponse.json({
      success: true,
      data: deletedIntegration,
      message: 'Integration deleted successfully',
      timestamp: new Date()
    });

  } catch (error) {
    console.error('Integration deletion error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to delete integration',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date()
    }, { status: 500 });
  }
}
