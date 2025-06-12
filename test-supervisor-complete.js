// 👑 SUPERVISOR COMPLETE TEST SUITE
const testSupervisorComplete = async () => {
  console.log('👑 === SUPERVISOR COMPLETE ANALYSIS & TEST ===\n');

  // TEST 1: Get all supervisors
  console.log('1️⃣ Testing supervisor discovery...');
  try {
    const response1 = await fetch('http://localhost:3003/api/supervisors');
    const supervisors = await response1.json();
    
    console.log(`   ✅ Found ${supervisors.length} supervisors:`);
    supervisors.forEach(sup => {
      console.log(`   📋 ${sup.name} (${sup.supervisorType})`);
      console.log(`      - ID: ${sup.id}`);
      console.log(`      - Performance: ${sup.performanceScore}%`);
      console.log(`      - Success Rate: ${sup.successRate}%`);
      console.log(`      - Revenue: $${sup.revenueGenerated?.toLocaleString() || 'N/A'}`);
      console.log(`      - Capabilities: ${sup.capabilities?.join(', ') || 'N/A'}`);
    });
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
  }

  // TEST 2: Get supervisors with analytics
  console.log('\n2️⃣ Testing supervisor analytics...');
  try {
    const response2 = await fetch('http://localhost:3003/api/supervisors?includeAnalytics=true');
    const supervisorsWithAnalytics = await response2.json();
    
    console.log('   📊 SUPERVISOR ANALYTICS:');
    supervisorsWithAnalytics.forEach(sup => {
      if (sup.analytics) {
        console.log(`   👑 ${sup.name}:`);
        console.log(`      - Subordinates: ${sup.analytics.subordinateCount}`);
        console.log(`      - Total Revenue: $${sup.analytics.totalRevenue?.toLocaleString()}`);
        console.log(`      - Avg Performance: ${sup.analytics.avgPerformance}%`);
        console.log(`      - Active Tasks: ${sup.analytics.activeTasks}`);
        console.log(`      - Efficiency: ${sup.analytics.efficiency}%`);
        
        if (sup.analytics.subordinateAnalytics) {
          console.log(`      - Managed Agents:`);
          sup.analytics.subordinateAnalytics.forEach(agent => {
            console.log(`        🤖 ${agent.agentName}: $${agent.totalRevenue?.toLocaleString()} (${agent.avgPerformance}%)`);
          });
        }
      }
    });
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
  }

  // TEST 3: Filter by supervisor type
  console.log('\n3️⃣ Testing supervisor type filtering...');
  const supervisorTypes = ['logistics', 'business', 'safety'];
  
  for (const type of supervisorTypes) {
    try {
      const response = await fetch(`http://localhost:3003/api/supervisors?supervisorType=${type}`);
      const filtered = await response.json();
      
      console.log(`   🔍 ${type.toUpperCase()} supervisors: ${filtered.length} found`);
      filtered.forEach(sup => {
        console.log(`      - ${sup.name}: ${sup.performanceScore}% performance`);
      });
    } catch (error) {
      console.log(`   ❌ ${type} filter error: ${error.message}`);
    }
  }

  // TEST 4: Get supervisor tasks
  console.log('\n4️⃣ Testing supervisor tasks...');
  try {
    const response4 = await fetch('http://localhost:3003/api/supervisors/tasks');
    const tasks = await response4.json();
    
    console.log(`   📋 Found ${tasks.length} supervisor tasks:`);
    tasks.forEach(task => {
      console.log(`   🎯 ${task.description}`);
      console.log(`      - Type: ${task.taskType}`);
      console.log(`      - Priority: ${task.priority}`);
      console.log(`      - Status: ${task.status}`);
      console.log(`      - Supervisor: ${task.supervisor?.name || 'N/A'}`);
      
      if (task.result) {
        console.log(`      - Result: ${JSON.stringify(task.result)}`);
      }
      
      if (task.completedAt) {
        const duration = new Date(task.completedAt) - new Date(task.startedAt);
        console.log(`      - Duration: ${Math.round(duration / (1000 * 60))} minutes`);
      }
    });
  } catch (error) {
    console.log(`   ❌ Tasks error: ${error.message}`);
  }

  // TEST 5: Filter tasks by supervisor
  console.log('\n5️⃣ Testing task filtering by supervisor...');
  try {
    const response5 = await fetch('http://localhost:3003/api/supervisors/tasks?supervisorId=supervisor-001');
    const logisticsTasks = await response5.json();
    
    console.log(`   📋 Logistics Supervisor tasks: ${logisticsTasks.length}`);
    logisticsTasks.forEach(task => {
      console.log(`      - ${task.description} (${task.status})`);
    });
  } catch (error) {
    console.log(`   ❌ Task filtering error: ${error.message}`);
  }

  // TEST 6: Create new supervisor task
  console.log('\n6️⃣ Testing supervisor task creation...');
  try {
    const newTaskResponse = await fetch('http://localhost:3003/api/supervisors/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        supervisorId: 'supervisor-001',
        taskType: 'testing',
        priority: 'high',
        description: 'Test all subordinate agents for optimal performance',
        parameters: {
          testType: 'comprehensive',
          agents: ['fuel-optimizer', 'route-genius', 'delivery-predictor'],
          metrics: ['performance', 'accuracy', 'response_time']
        }
      })
    });
    
    if (newTaskResponse.ok) {
      const newTask = await newTaskResponse.json();
      console.log(`   ✅ Task created successfully:`);
      console.log(`      - ID: ${newTask.id}`);
      console.log(`      - Description: ${newTask.description}`);
      console.log(`      - Status: ${newTask.status}`);
    } else {
      const error = await newTaskResponse.text();
      console.log(`   ❌ Task creation failed: ${error}`);
    }
  } catch (error) {
    console.log(`   ❌ Task creation error: ${error.message}`);
  }

  // TEST 7: Supervisor performance analysis
  console.log('\n7️⃣ Performance comparison analysis...');
  try {
    const response7 = await fetch('http://localhost:3003/api/supervisors?includeAnalytics=true');
    const supervisors = await response7.json();
    
    console.log('   📈 SUPERVISOR PERFORMANCE RANKING:');
    
    const sortedBySupervisors = supervisors
      .sort((a, b) => b.performanceScore - a.performanceScore)
      .map((sup, index) => ({
        rank: index + 1,
        name: sup.name,
        performance: sup.performanceScore,
        revenue: sup.revenueGenerated,
        efficiency: sup.analytics?.efficiency || 0,
        subordinates: sup.analytics?.subordinateCount || 0
      }));
    
    sortedBySupervisors.forEach(sup => {
      const medal = sup.rank === 1 ? '🥇' : sup.rank === 2 ? '🥈' : sup.rank === 3 ? '🥉' : '📍';
      console.log(`   ${medal} #${sup.rank}: ${sup.name}`);
      console.log(`      Performance: ${sup.performance}%`);
      console.log(`      Revenue: $${sup.revenue?.toLocaleString() || 'N/A'}`);
      console.log(`      Efficiency: ${sup.efficiency}%`);
      console.log(`      Manages: ${sup.subordinates} agents`);
    });

    // Best supervisor analysis
    const best = sortedBySupervisors[0];
    console.log(`\n   🏆 TOP PERFORMER: ${best.name}`);
    console.log(`       • Highest performance score: ${best.performance}%`);
    console.log(`       • Managing ${best.subordinates} subordinate agents`);
    console.log(`       • Generated $${best.revenue?.toLocaleString()} revenue`);
    console.log(`       • ${best.efficiency}% operational efficiency`);
    
  } catch (error) {
    console.log(`   ❌ Performance analysis error: ${error.message}`);
  }

  // TEST 8: Supervisor capabilities breakdown
  console.log('\n8️⃣ Capabilities analysis...');
  try {
    const response8 = await fetch('http://localhost:3003/api/supervisors');
    const supervisors = await response8.json();
    
    console.log('   🧠 SUPERVISOR CAPABILITIES MATRIX:');
    
    const allCapabilities = new Set();
    supervisors.forEach(sup => {
      if (sup.capabilities) {
        sup.capabilities.forEach(cap => allCapabilities.add(cap));
      }
    });
    
    console.log(`   📋 Total unique capabilities: ${allCapabilities.size}`);
    console.log(`   🔧 Capabilities: ${Array.from(allCapabilities).join(', ')}`);
    
    supervisors.forEach(sup => {
      console.log(`\n   👑 ${sup.name} capabilities:`);
      if (sup.capabilities) {
        sup.capabilities.forEach(cap => {
          console.log(`      ✅ ${cap}`);
        });
      } else {
        console.log(`      ❌ No capabilities listed`);
      }
    });
    
  } catch (error) {
    console.log(`   ❌ Capabilities analysis error: ${error.message}`);
  }

  console.log('\n🏁 === SUPERVISOR COMPLETE TEST FINISHED ===');
};

testSupervisorComplete(); 