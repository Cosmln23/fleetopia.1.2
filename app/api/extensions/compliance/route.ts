
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// Compliance APIs - FMCSA, European Transport integration
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const provider = searchParams.get('provider') || 'fmcsa';
    const vehicleId = searchParams.get('vehicleId');
    const driverId = searchParams.get('driverId');
    const checkType = searchParams.get('checkType') || 'all';

    // Mock compliance data based on research
    const mockComplianceData = {
      fmcsa: {
        provider: 'fmcsa',
        coverage: 'united_states',
        checks: [
          {
            type: 'dot_inspection',
            status: 'compliant',
            details: {
              inspectionDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
              inspectorId: 'DOT-12345',
              location: 'New York State Inspection Station',
              violations: [],
              score: 95,
              nextInspectionDue: new Date(Date.now() + 335 * 24 * 60 * 60 * 1000)
            },
            expiryDate: new Date(Date.now() + 335 * 24 * 60 * 60 * 1000),
            automated: true
          },
          {
            type: 'hours_of_service',
            status: 'compliant',
            details: {
              currentHours: 8.5,
              maxHours: 11,
              restPeriod: 10,
              weeklyHours: 45,
              maxWeeklyHours: 60,
              violations: [],
              lastReset: new Date(Date.now() - 10 * 60 * 60 * 1000)
            },
            automated: true
          },
          {
            type: 'vehicle_registration',
            status: 'compliant',
            details: {
              registrationNumber: 'NY-ABC-1234',
              expiryDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
              state: 'New York',
              vehicleClass: 'Commercial',
              weight: 26000
            },
            expiryDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
            automated: false
          },
          {
            type: 'driver_license',
            status: 'compliant',
            details: {
              licenseNumber: 'NY-CDL-567890',
              class: 'CDL-A',
              endorsements: ['Hazmat', 'Passenger'],
              restrictions: [],
              expiryDate: new Date(Date.now() + 720 * 24 * 60 * 60 * 1000),
              medicalCertificate: {
                valid: true,
                expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
              }
            },
            expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
            automated: false
          }
        ],
        overallScore: 92,
        riskLevel: 'low',
        lastUpdate: new Date()
      },
      european_transport: {
        provider: 'european_transport',
        coverage: 'european_union',
        checks: [
          {
            type: 'tachograph_compliance',
            status: 'compliant',
            details: {
              digitalTachograph: true,
              lastDownload: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
              violations: [],
              drivingTime: 9.5,
              maxDrivingTime: 10,
              restPeriod: 11,
              minRestPeriod: 9
            },
            automated: true
          },
          {
            type: 'emissions_compliance',
            status: 'compliant',
            details: {
              euroStandard: 'Euro VI',
              emissionLevel: 'compliant',
              lastTest: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
              nextTest: new Date(Date.now() + 275 * 24 * 60 * 60 * 1000),
              co2Emissions: 245.8
            },
            expiryDate: new Date(Date.now() + 275 * 24 * 60 * 60 * 1000),
            automated: false
          },
          {
            type: 'cabotage_rules',
            status: 'compliant',
            details: {
              currentOperations: 2,
              maxOperations: 3,
              periodStart: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
              periodEnd: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
              country: 'Germany'
            },
            automated: true
          }
        ],
        overallScore: 88,
        riskLevel: 'low',
        lastUpdate: new Date()
      }
    };

    const complianceData = mockComplianceData[provider as keyof typeof mockComplianceData] || mockComplianceData.fmcsa;

    // Filter by check type if specified (with explicit typing)
    let filteredChecks: any[] = complianceData.checks;
    if (checkType !== 'all') {
      filteredChecks = complianceData.checks.filter((check: any) => check.type === checkType);
    }

    // Mock storage since we're avoiding database operations

    return NextResponse.json({
      success: true,
      data: {
        ...complianceData,
        checks: filteredChecks
      },
      vehicleId,
      driverId,
      checkType,
      message: `Compliance data retrieved from ${provider}`,
      timestamp: new Date()
    });

  } catch (error) {
    console.error('Compliance API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch compliance data',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date()
    }, { status: 500 });
  }
}

// Manual compliance check
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { vehicleId, driverId, checkType, provider = 'fmcsa' } = body;

    if (!checkType) {
      return NextResponse.json({
        success: false,
        error: 'Check type is required',
        timestamp: new Date()
      }, { status: 400 });
    }

    // Mock manual compliance check
    const checkResult = {
      type: checkType,
      status: Math.random() > 0.1 ? 'compliant' : 'non_compliant',
      details: {
        checkDate: new Date(),
        inspector: 'System Automated Check',
        violations: Math.random() > 0.8 ? ['Minor violation detected'] : [],
        score: Math.floor(Math.random() * 20) + 80,
        notes: 'Automated compliance verification completed'
      },
      automated: true,
      provider
    };

    // Mock compliance check storage
    const complianceRecord = {
      id: `comp-${Date.now()}`,
      vehicleId,
      driverId,
      type: checkType,
      provider,
      status: checkResult.status,
      details: checkResult.details,
      violations: checkResult.details.violations,
      checkDate: new Date(),
      automated: true
    };

    return NextResponse.json({
      success: true,
      data: {
        complianceRecord,
        checkResult
      },
      message: `Manual ${checkType} check completed`,
      timestamp: new Date()
    });

  } catch (error) {
    console.error('Manual compliance check error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to perform compliance check',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date()
    }, { status: 500 });
  }
}
