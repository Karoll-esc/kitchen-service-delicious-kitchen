/**
 * Script para simular eventos de order-service
 * Uso: npm run test:publish
 */

import * as amqp from 'amqplib';

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost:5672';
const EXCHANGE = 'orders_exchange';

async function publishTestOrder() {
  try {
    console.log('🐰 Conectando a RabbitMQ...');
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();

    await channel.assertExchange(EXCHANGE, 'topic', { durable: true });

    // Evento de prueba order.created
    const testOrder = {
      orderId: `ORD-TEST-${Date.now()}`,
      userId: 'user-test-001',
      customerName: 'Juan Pérez',
      customerEmail: 'juan@example.com',
      items: [
        {
          name: 'Pizza Margarita',
          quantity: 2,
          price: 12.99
        },
        {
          name: 'Pasta Carbonara',
          quantity: 1,
          price: 10.99
        }
      ],
      notes: 'Sin cebolla, por favor',
      totalAmount: 36.97
    };

    const messageBuffer = Buffer.from(JSON.stringify(testOrder));
    
    channel.publish(
      EXCHANGE,
      'order.created',
      messageBuffer,
      {
        persistent: true,
        contentType: 'application/json',
        timestamp: Date.now()
      }
    );

    console.log('✅ Evento order.created publicado:');
    console.log(JSON.stringify(testOrder, null, 2));

    setTimeout(() => {
      channel.close();
      connection.close();
      console.log('🔚 Conexión cerrada');
      process.exit(0);
    }, 500);

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

publishTestOrder();
