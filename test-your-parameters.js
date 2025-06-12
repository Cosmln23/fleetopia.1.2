// Test cu parametrii descoperiți de utilizator
const testYourParameters = async () => {
  console.log('🎯 TESTING YOUR DISCOVERED PARAMETERS\n');

  try {
    // Test exact cu parametrii tăi
    const response = await fetch('http://localhost:3003/api/route-optimizer-ml', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        "distance": 500,
        "action": "combined_optimization",
        "enableAll": true,
        "fuelData": {"currentFuel": 25, "fuelType": "diesel"},
        "realTimeData": {"speed": 85, "rpm": 2200},
        "driverId": "test_driver_advanced"
      })
    });
    
    const result = await response.json();
    
    console.log('📊 REZULTATE CU PARAMETRII TĂI:');
    console.log(`   Success: ${result.success}`);
    console.log(`   Original distance: 500km`);
    console.log(`   Optimized distance: ${result.data?.distance?.toFixed(2)}km`);
    console.log(`   Distance savings: ${((500 - result.data?.distance) / 500 * 100).toFixed(2)}%`);
    console.log(`   Duration: ${result.data?.duration?.toFixed(2)} hours`);
    
    // Check advanced features activation
    console.log('\n🔥 ADVANCED FEATURES STATUS:');
    console.log(`   Combined optimization: ${result.data?.combinedOptimization ? '✅ ACTIVE' : '❌ INACTIVE'}`);
    console.log(`   All systems enabled: ${result.data?.allSystemsEnabled ? '✅ YES' : '❌ NO'}`);
    console.log(`   Fuel optimization: ${result.data?.fuelOptimization ? '✅ ACTIVE' : '❌ INACTIVE'}`);
    console.log(`   Real-time processing: ${result.data?.realTimeProcessing ? '✅ ACTIVE' : '❌ INACTIVE'}`);
    
    // Compare with basic test
    console.log('\n📈 COMPARISON WITH BASIC TEST:');
    const basicResponse = await fetch('http://localhost:3003/api/route-optimizer-ml', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        "distance": 500,
        "driverId": "test_driver_basic"
      })
    });
    
    const basicResult = await basicResponse.json();
    
    console.log(`   Basic optimization: ${basicResult.data?.distance?.toFixed(2)}km`);
    console.log(`   Advanced optimization: ${result.data?.distance?.toFixed(2)}km`);
    console.log(`   Improvement: ${((basicResult.data?.distance - result.data?.distance) / basicResult.data?.distance * 100).toFixed(2)}% better`);
    
    // Savings analysis
    if (result.data?.savings) {
      console.log('\n💰 SAVINGS BREAKDOWN:');
      console.log(`   Fuel savings: ${result.data?.savings?.fuelLiters?.toFixed(2)}L`);
      console.log(`   Cost savings: €${result.data?.savings?.costEuros?.toFixed(2)}`);
      console.log(`   Percentage saved: ${result.data?.savings?.percentageSaved?.toFixed(2)}%`);
    }
    
    // Full response for debugging
    console.log('\n🔍 FULL RESPONSE DATA:');
    console.log(JSON.stringify(result.data, null, 2));
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
};

testYourParameters(); 