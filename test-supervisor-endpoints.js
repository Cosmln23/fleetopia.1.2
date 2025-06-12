// 👑 SUPERVISOR ENDPOINTS & CAPABILITIES TEST
const testSupervisorEndpoints = async () => {
  console.log('👑 === SUPERVISOR ENDPOINTS & CAPABILITIES TEST ===\n');

  // TEST 1: Discover all supervisor endpoints
  console.log('1️⃣ Discovering supervisor endpoints...');
  
  const endpoints = [
    'http://localhost:3003/api/supervisor',
    'http://localhost:3003/api/supervisors', 
    'http://localhost:3003/api/supervisor/orchestrate',
    'http://localhost:3003/api/supervisors/orchestrate',
    'http://localhost:3003/api/supervisors/optimize',
    'http://localhost:3003/api/supervisors/coordinate'
  ];

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint);
      console.log(`   ${response.ok ? '✅' : '❌'} ${endpoint} - Status: ${response.status}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`      Response type: ${Array.isArray(data) ? 'Array' : 'Object'}`);
        if (Array.isArray(data)) {
          console.log(`      Items count: ${data.length}`);
        }
      }
    } catch (error) {
      console.log(`   ❌ ${endpoint} - Error: ${error.message}`);
    }
  }

  // TEST 2: Test orchestration capabilities
  console.log('\n2️⃣ Testing orchestration capabilities...');
  
  try {
    // Test if supervisor can orchestrate multiple agents
    const orchestrateResponse = await fetch('http://localhost:3003/api/supervisors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'orchestrate',
        supervisorId: 'supervisor-001',
        scenario: {
          type: 'multi_agent_optimization',
          agents: ['route-optimizer-ml', 'delivery-predictor', 'fuel-optimizer'],
          request: {
            distance: 800,
            driverId: 'master_driver_001',
            vehicleId: 'premium_truck_001',
            priority: 'maximum_optimization'
          }
        }
      })
    });
    
    console.log(`   Orchestration API: ${orchestrateResponse.status}`);
    if (orchestrateResponse.ok) {
      const orchestrationResult = await orchestrateResponse.json();
      console.log(`   ✅ Orchestration available!`);
      console.log(`   Result: ${JSON.stringify(orchestrationResult, null, 2)}`);
    } else {
      const error = await orchestrateResponse.text();
      console.log(`   ❌ Orchestration failed: ${error}`);
    }
  } catch (error) {
    console.log(`   ❌ Orchestration error: ${error.message}`);
  }

  // TEST 3: Test meta-optimization capabilities
  console.log('\n3️⃣ Testing meta-optimization...');
  
  try {
    const metaOptimizeResponse = await fetch('http://localhost:3003/api/supervisors/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        supervisorId: 'supervisor-001',
        taskType: 'meta_optimization',
        priority: 'high',
        description: 'Optimize across Route+Fuel+Delivery simultaneously',
        parameters: {
          mode: 'super_optimization',
          agents: {
            route: 'route-optimizer-ml',
            fuel: 'fuel-master-ai', 
            delivery: 'delivery-predictor'
          },
          target: {
            distance: 1000,
            budget: 500,
            timeLimit: 8,
            efficiency: 'maximum'
          }
        }
      })
    });
    
    console.log(`   Meta-optimization API: ${metaOptimizeResponse.status}`);
    if (metaOptimizeResponse.ok) {
      const metaResult = await metaOptimizeResponse.json();
      console.log(`   ✅ Meta-optimization created!`);
      console.log(`   Task ID: ${metaResult.id}`);
      console.log(`   Description: ${metaResult.description}`);
    } else {
      const error = await metaOptimizeResponse.text();
      console.log(`   ❌ Meta-optimization failed: ${error}`);
    }
  } catch (error) {
    console.log(`   ❌ Meta-optimization error: ${error.message}`);
  }

  // TEST 4: Test agent selection and comparison
  console.log('\n4️⃣ Testing agent selection & comparison...');
  
  try {
    // Get logistics supervisor with analytics
    const supervisorResponse = await fetch('http://localhost:3003/api/supervisors?supervisorType=logistics&includeAnalytics=true');
    const supervisors = await supervisorResponse.json();
    
    if (supervisors.length > 0) {
      const logisticsSupervisor = supervisors[0];
      console.log(`   📋 ${logisticsSupervisor.name} manages:`);
      
      if (logisticsSupervisor.analytics?.subordinateAnalytics) {
        logisticsSupervisor.analytics.subordinateAnalytics.forEach(agent => {
          console.log(`      🤖 ${agent.agentName}:`);
          console.log(`         - Performance: ${agent.avgPerformance}%`);
          console.log(`         - Revenue: $${agent.totalRevenue?.toLocaleString()}`);
          console.log(`         - Success Rate: ${agent.successRate}%`);
          console.log(`         - Response Time: ${agent.avgResponseTime}ms`);
          console.log(`         - Trend: ${agent.trend}`);
        });
        
        // Find best performing agent
        const bestAgent = logisticsSupervisor.analytics.subordinateAnalytics
          .reduce((best, agent) => agent.avgPerformance > best.avgPerformance ? agent : best);
          
        console.log(`\n   🏆 BEST AGENT: ${bestAgent.agentName} (${bestAgent.avgPerformance}%)`);
        console.log(`      🎯 Auto-selection recommendation for critical tasks`);
      }
    }
  } catch (error) {
    console.log(`   ❌ Agent comparison error: ${error.message}`);
  }

  // TEST 5: Test real-time coordination
  console.log('\n5️⃣ Testing real-time coordination...');
  
  try {
    // Simulate coordinated request across multiple agents
    console.log('   🔄 Simulating coordinated optimization...');
    
    // Step 1: Route optimization
    const routeResponse = await fetch('http://localhost:3003/api/route-optimizer-ml', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        distance: 1000,
        action: 'combined_optimization',
        enableAll: true,
        supervisedBy: 'supervisor-001'
      })
    });
    
    let routeResult = null;
    if (routeResponse.ok) {
      routeResult = await routeResponse.json();
      console.log(`   ✅ Route optimization: ${routeResult.data?.distance}km`);
    }
    
    // Step 2: Delivery prediction using route result
    if (routeResult) {
      const deliveryResponse = await fetch('http://localhost:3003/api/delivery-predictor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'predict_delivery',
          data: {
            distance: routeResult.data?.distance || 1000,
            urgency: 'express',
            optimizedRoute: routeResult.data,
            supervisedBy: 'supervisor-001'
          }
        })
      });
      
      if (deliveryResponse.ok) {
        const deliveryResult = await deliveryResponse.json();
        console.log(`   ✅ Delivery prediction: ${deliveryResult.result?.estimatedDeliveryTime?.mostLikely}min`);
        console.log(`   💰 Combined pricing: €${deliveryResult.result?.dynamicPricing?.finalPrice}`);
        
        // Calculate coordination efficiency
        const originalDistance = 1000;
        const optimizedDistance = routeResult.data?.distance || 1000;
        const coordinationEfficiency = ((originalDistance - optimizedDistance) / originalDistance * 100).toFixed(2);
        
        console.log(`\n   🎯 COORDINATION RESULTS:`);
        console.log(`      Original distance: ${originalDistance}km`);
        console.log(`      Optimized distance: ${optimizedDistance}km`);
        console.log(`      Coordination efficiency: ${coordinationEfficiency}%`);
        console.log(`      Delivery time: ${deliveryResult.result?.estimatedDeliveryTime?.mostLikely}min`);
      }
    }
    
  } catch (error) {
    console.log(`   ❌ Coordination error: ${error.message}`);
  }

  // TEST 6: Performance comparison vs individual agents
  console.log('\n6️⃣ Testing supervisor vs individual agent performance...');
  
  try {
    console.log('   📊 PERFORMANCE COMPARISON:');
    
    // Individual agent test
    const individualStart = Date.now();
    const individualRoute = await fetch('http://localhost:3003/api/route-optimizer-ml', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ distance: 500 })
    });
    const individualTime = Date.now() - individualStart;
    const individualResult = await individualRoute.json();
    
    console.log(`   🤖 INDIVIDUAL AGENT:`);
    console.log(`      Response time: ${individualTime}ms`);
    console.log(`      Distance optimization: ${individualResult.data?.distance}km`);
    console.log(`      Savings: ${individualResult.data?.savings?.percentageSaved?.toFixed(2)}%`);
    
    // Supervised agent test (simulated)
    const supervisedStart = Date.now();
    const supervisedRoute = await fetch('http://localhost:3003/api/route-optimizer-ml', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        distance: 500,
        action: 'combined_optimization',
        enableAll: true,
        supervisorOptimized: true
      })
    });
    const supervisedTime = Date.now() - supervisedStart;
    const supervisedResult = await supervisedRoute.json();
    
    console.log(`\n   👑 SUPERVISOR-OPTIMIZED:`);
    console.log(`      Response time: ${supervisedTime}ms`);
    console.log(`      Distance optimization: ${supervisedResult.data?.distance}km`);
    console.log(`      Savings: ${supervisedResult.data?.savings?.percentageSaved?.toFixed(2)}%`);
    
    // Calculate improvement
    const improvementPercent = ((individualResult.data?.distance - supervisedResult.data?.distance) / individualResult.data?.distance * 100).toFixed(2);
    console.log(`\n   🏆 SUPERVISOR ADVANTAGE: ${improvementPercent}% better optimization`);
    
  } catch (error) {
    console.log(`   ❌ Performance comparison error: ${error.message}`);
  }

  console.log('\n🏁 === SUPERVISOR ENDPOINTS & CAPABILITIES TEST COMPLETE ===');
};

testSupervisorEndpoints(); 