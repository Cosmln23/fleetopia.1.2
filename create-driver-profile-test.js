// Script pentru crearea profilurilor driver să activezi personalizarea
const createDriverProfile = async () => {
  console.log('👤 Creating driver profile...');
  
  try {
    const response = await fetch('http://localhost:3003/api/route-optimizer-ml', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        routeId: 'route_profile_creation',
        driverId: 'driver_test_001',
        actualResult: {
          actualDistance: 463.8,
          actualTime: 6.2,
          actualFuel: 32.1,
          driverBehaviorScore: 88,
          fuelEfficiency: 1.15  // 15% mai eficient decât media
        }
      })
    });
    
    const result = await response.json();
    console.log('✅ Driver profile creation:', result);
    
    // Test din nou cu profil creat
    console.log('\n🔄 Testing with driver profile...');
    const testResponse = await fetch('http://localhost:3003/api/route-optimizer-ml', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        distance: 500,
        driverId: 'driver_test_001',
        vehicleId: 'vehicle_test_001'
      })
    });
    
    const testResult = await testResponse.json();
    console.log('🎯 Personalization status:', testResult.data.driverPersonalizationApplied);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
};

createDriverProfile(); 