import { NextRequest, NextResponse } from 'next/server';

export const dynamic = "force-dynamic";

// In-memory storage for demo purposes
let mockNotifications: any[] = [
  {
    id: 'notif-001',
    type: 'email',
    provider: 'sendgrid',
    recipient: 'fleet@manager.com',
    subject: 'Route Optimization Alert',
    message: 'Route efficiency improved by 15%',
    status: 'delivered',
    priority: 'normal',
    createdAt: new Date(),
    sentAt: new Date(),
    deliveredAt: new Date()
  },
  {
    id: 'notif-002',
    type: 'sms',
    provider: 'twilio',
    recipient: '+1234567890',
    subject: null,
    message: 'Delivery completed successfully',
    status: 'sent',
    priority: 'high',
    createdAt: new Date(Date.now() - 3600000),
    sentAt: new Date(Date.now() - 3600000),
    deliveredAt: null
  }
];

let mockCommunicationLogs: any[] = [
  {
    id: 'comm-001',
    type: 'email',
    provider: 'sendgrid',
    sender: 'system@fleetopia.co',
    recipient: 'fleet@manager.com',
    subject: 'Daily Fleet Report',
    content: 'Your daily fleet performance report is ready',
    status: 'delivered',
    cost: 0.0001,
    timestamp: new Date(),
    metadata: { messageId: 'SG-msg-001', priority: 'normal' }
  }
];

// GET Communication data and provider capabilities
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const provider = searchParams.get('provider') || 'sendgrid';
    const type = searchParams.get('type') || 'all';
    const limit = parseInt(searchParams.get('limit') || '20');

    // Filter data based on type
    const filteredNotifications = type !== 'all' 
      ? mockNotifications.filter(n => n.type === type).slice(0, limit)
      : mockNotifications.slice(0, limit);
    
    const filteredCommunicationLogs = type !== 'all'
      ? mockCommunicationLogs.filter(l => l.type === type).slice(0, limit)
      : mockCommunicationLogs.slice(0, limit);

    // Mock provider capabilities based on research
    const providerCapabilities = {
      sendgrid: {
        provider: 'sendgrid',
        types: ['email'],
        features: ['templates', 'analytics', 'ab_testing', 'automation'],
        deliverabilityRate: 0.97,
        maxEmailsPerDay: 100000,
        pricing: 'from_$15_per_month',
        integrations: ['salesforce', 'shopify', 'wordpress']
      },
      mailgun: {
        provider: 'mailgun',
        types: ['email'],
        features: ['email_parsing', 'validation', 'automation', 'analytics'],
        deliverabilityRate: 0.974,
        maxEmailsPerDay: 50000,
        pricing: 'from_$35_per_month',
        integrations: ['api_focused', 'developer_friendly']
      },
      twilio: {
        provider: 'twilio',
        types: ['email', 'sms', 'voice', 'push'],
        features: ['multi_channel', 'global_reach', 'programmable', 'scalable'],
        deliverabilityRate: 0.95,
        pricing: 'pay_as_you_go',
        integrations: ['sendgrid_email', 'voice_api', 'messaging_api']
      }
    };

    const capabilities = providerCapabilities[provider as keyof typeof providerCapabilities] || providerCapabilities.sendgrid;

    return NextResponse.json({
      success: true,
      data: {
        capabilities,
        notifications: filteredNotifications,
        communicationLogs: filteredCommunicationLogs,
        stats: {
          totalNotifications: filteredNotifications.length,
          totalCommunications: filteredCommunicationLogs.length,
          deliveredToday: filteredCommunicationLogs.filter(log => 
            log.status === 'delivered' && 
            log.timestamp > new Date(Date.now() - 24 * 60 * 60 * 1000)
          ).length
        }
      },
      provider,
      type,
      message: `Communication data retrieved from ${provider}`,
      timestamp: new Date()
    });

  } catch (error) {
    console.error('Communication API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch communication data',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date()
    }, { status: 500 });
  }
}

// Send notification/communication
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      type, 
      provider = 'sendgrid', 
      recipient, 
      subject, 
      message, 
      priority = 'normal',
      userId 
    } = body;

    if (!type || !recipient || !message) {
      return NextResponse.json({
        success: false,
        error: 'Type, recipient, and message are required',
        timestamp: new Date()
      }, { status: 400 });
    }

    // Mock sending logic based on provider and type
    const sendResult = {
      success: Math.random() > 0.05, // 95% success rate
      messageId: `${provider.toUpperCase()}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      deliveryTime: Math.floor(Math.random() * 30) + 5, // 5-35 seconds
      cost: type === 'sms' ? 0.0075 : type === 'email' ? 0.0001 : 0.05
    };

    // Create notification record (mock)
    const notification = {
      id: `notif-${Date.now()}`,
      userId,
      type,
      provider,
      recipient,
      subject,
      message,
      status: sendResult.success ? 'sent' : 'failed',
      priority,
      createdAt: new Date(),
      sentAt: sendResult.success ? new Date() : null,
      deliveredAt: sendResult.success ? new Date(Date.now() + sendResult.deliveryTime * 1000) : null,
      metadata: {
        messageId: sendResult.messageId,
        cost: sendResult.cost,
        deliveryTime: sendResult.deliveryTime
      }
    };

    // Create communication log (mock)
    const communicationLog = {
      id: `comm-${Date.now()}`,
      type,
      provider,
      sender: 'system@fleetopia.co',
      recipient,
      subject,
      content: message,
      status: sendResult.success ? 'sent' : 'failed',
      cost: sendResult.cost,
      timestamp: new Date(),
      metadata: {
        messageId: sendResult.messageId,
        priority,
        deliveryTime: sendResult.deliveryTime
      }
    };

    // Add to mock storage
    mockNotifications.unshift(notification);
    mockCommunicationLogs.unshift(communicationLog);

    // Simulate delivery status update for successful sends
    if (sendResult.success) {
      setTimeout(() => {
        const notifIndex = mockNotifications.findIndex(n => n.id === notification.id);
        const logIndex = mockCommunicationLogs.findIndex(l => l.id === communicationLog.id);
        
        if (notifIndex !== -1) {
          mockNotifications[notifIndex].status = 'delivered';
          mockNotifications[notifIndex].deliveredAt = new Date();
        }
        
        if (logIndex !== -1) {
          mockCommunicationLogs[logIndex].status = 'delivered';
        }
      }, sendResult.deliveryTime * 1000);
    }

    // Generate different response based on communication type
    let responseMessage = '';
    switch (type) {
      case 'email':
        responseMessage = `Email ${sendResult.success ? 'sent' : 'failed'} via ${provider}`;
        break;
      case 'sms':
        responseMessage = `SMS ${sendResult.success ? 'sent' : 'failed'} via ${provider}`;
        break;
      case 'push':
        responseMessage = `Push notification ${sendResult.success ? 'sent' : 'failed'} via ${provider}`;
        break;
      default:
        responseMessage = `Message ${sendResult.success ? 'sent' : 'failed'} via ${provider}`;
    }

    return NextResponse.json({
      success: sendResult.success,
      data: {
        notification,
        communicationLog,
        sendResult
      },
      message: responseMessage,
      provider,
      type,
      timestamp: new Date()
    });

  } catch (error) {
    console.error('Communication send error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to send communication',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date()
    }, { status: 500 });
  }
}

// Update notification/communication status
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, deliveredAt } = body;

    if (!id || !status) {
      return NextResponse.json({
        success: false,
        error: 'ID and status are required',
        timestamp: new Date()
      }, { status: 400 });
    }

    // Update notification in mock storage
    const notifIndex = mockNotifications.findIndex(n => n.id === id);
    if (notifIndex !== -1) {
      mockNotifications[notifIndex].status = status;
      if (deliveredAt) {
        mockNotifications[notifIndex].deliveredAt = new Date(deliveredAt);
      }
    }

    // Update communication log in mock storage  
    const logIndex = mockCommunicationLogs.findIndex(l => l.id === id);
    if (logIndex !== -1) {
      mockCommunicationLogs[logIndex].status = status;
    }

    return NextResponse.json({
      success: true,
      message: `Status updated to ${status}`,
      updatedNotification: notifIndex !== -1 ? mockNotifications[notifIndex] : null,
      updatedLog: logIndex !== -1 ? mockCommunicationLogs[logIndex] : null,
      timestamp: new Date()
    });

  } catch (error) {
    console.error('Communication update error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update communication',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date()
    }, { status: 500 });
  }
}
