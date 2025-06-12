// Test script pentru Route Optimizer API
const testRequest = async () => {
  console.log('🧪 Testing Route Optimizer API...');
  
  try {
    const response = await fetch('http://localhost:3003/api/route-optimizer-ml', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        distance: 125.5,
        driverId: "driver_test_001",
        vehicleId: "vehicle_test_001",
        trafficData: {
          congestionLevel: 0.6,
          avgSpeed: 45,
          incidents: []
        },
        vehicle: {
          type: "truck",
          currentFuel: 80,
          fuelCapacity: 300
        }
      })
    });
    
    const result = await response.json();
    console.log('\n📥 API Response:');
    console.log(JSON.stringify(result, null, 2));
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
};

testRequest(); 