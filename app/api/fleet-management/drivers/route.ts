export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
// Removed Prisma import - using mock data instead

// Mock drivers storage
let mockDrivers: any[] = [
  {
    id: 'driver-1',
    fleetId: 'fleet-1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@fleet.com',
    phone: '+1234567890',
    licenseNumber: 'DL123456789',
    licenseExpiry: new Date('2025-12-31'),
    status: 'active',
    hoursWorked: 35,
    currentLocation: { lat: 40.7128, lng: -74.0060 },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
    modernTrips: [],
    alerts: []
  },
  {
    id: 'driver-2',
    fleetId: 'fleet-1',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@fleet.com',
    phone: '+1234567891',
    licenseNumber: 'DL987654321',
    licenseExpiry: new Date('2026-06-30'),
    status: 'active',
    hoursWorked: 42,
    currentLocation: { lat: 40.7589, lng: -73.9851 },
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date(),
    modernTrips: [],
    alerts: []
  }
];

// Fleet Drivers API
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fleetId = searchParams.get('fleetId');
    const driverId = searchParams.get('driverId');
    const include = searchParams.get('include')?.split(',') || [];

    if (driverId) {
      // Get specific driver
      const driver = mockDrivers.find(d => d.id === driverId);

      if (!driver) {
        return NextResponse.json({
          success: false,
          error: 'Driver not found',
          timestamp: new Date()
        }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        data: driver,
        message: 'Driver retrieved successfully',
        timestamp: new Date()
      });
    } else {
      // Get drivers for fleet
      const drivers = fleetId 
        ? mockDrivers.filter(d => d.fleetId === fleetId)
        : mockDrivers;

      return NextResponse.json({
        success: true,
        data: drivers,
        total: drivers.length,
        fleetId,
        message: 'Drivers retrieved successfully',
        timestamp: new Date()
      });
    }

  } catch (error) {
    console.error('Fleet drivers API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch driver data',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date()
    }, { status: 500 });
  }
}

// Add driver to fleet
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      fleetId, 
      firstName, 
      lastName, 
      email, 
      phone, 
      licenseNumber, 
      licenseExpiry 
    } = body;

    if (!fleetId || !firstName || !lastName || !email || !licenseNumber || !licenseExpiry) {
      return NextResponse.json({
        success: false,
        error: 'All driver details are required',
        timestamp: new Date()
      }, { status: 400 });
    }

    const driver = {
      id: `driver-${Date.now()}`,
      fleetId,
      firstName,
      lastName,
      email,
      phone,
      licenseNumber,
      licenseExpiry: new Date(licenseExpiry),
      status: 'active',
      hoursWorked: 0,
      currentLocation: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      modernTrips: [],
      alerts: []
    };

    mockDrivers.push(driver);

    return NextResponse.json({
      success: true,
      data: driver,
      message: 'Driver added to fleet successfully',
      timestamp: new Date()
    });

  } catch (error) {
    console.error('Driver creation error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to add driver',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date()
    }, { status: 500 });
  }
}

// Update driver
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      driverId, 
      status, 
      currentLocation, 
      hoursWorked,
      phone,
      licenseExpiry
    } = body;

    if (!driverId) {
      return NextResponse.json({
        success: false,
        error: 'Driver ID is required',
        timestamp: new Date()
      }, { status: 400 });
    }

    const driverIndex = mockDrivers.findIndex(d => d.id === driverId);
    if (driverIndex === -1) {
      return NextResponse.json({
        success: false,
        error: 'Driver not found',
        timestamp: new Date()
      }, { status: 404 });
    }

    // Update driver data
    if (status) mockDrivers[driverIndex].status = status;
    if (currentLocation) mockDrivers[driverIndex].currentLocation = currentLocation;
    if (hoursWorked !== undefined) mockDrivers[driverIndex].hoursWorked = hoursWorked;
    if (phone) mockDrivers[driverIndex].phone = phone;
    if (licenseExpiry) mockDrivers[driverIndex].licenseExpiry = new Date(licenseExpiry);
    mockDrivers[driverIndex].updatedAt = new Date();

    return NextResponse.json({
      success: true,
      data: mockDrivers[driverIndex],
      message: 'Driver updated successfully',
      timestamp: new Date()
    });

  } catch (error) {
    console.error('Driver update error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update driver',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date()
    }, { status: 500 });
  }
}

// Remove driver from fleet
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const driverId = searchParams.get('driverId');

    if (!driverId) {
      return NextResponse.json({
        success: false,
        error: 'Driver ID is required',
        timestamp: new Date()
      }, { status: 400 });
    }

    const driverIndex = mockDrivers.findIndex(d => d.id === driverId);
    if (driverIndex === -1) {
      return NextResponse.json({
        success: false,
        error: 'Driver not found',
        timestamp: new Date()
      }, { status: 404 });
    }

    mockDrivers.splice(driverIndex, 1);

    return NextResponse.json({
      success: true,
      message: 'Driver removed from fleet successfully',
      timestamp: new Date()
    });

  } catch (error) {
    console.error('Driver deletion error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to remove driver',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date()
    }, { status: 500 });
  }
}
