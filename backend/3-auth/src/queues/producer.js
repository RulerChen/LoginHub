import { createConnection } from '@/queues/connect.js';

export async function publishDirectMessage(exchangeName, routingKey, message) {
  try {
    const channel = await createConnection();
    channel.assertExchange(exchangeName, 'direct', { durable: true, autoDelete: false });
    channel.publish(exchangeName, routingKey, Buffer.from(message), { persistent: true });

    console.log('Message published successfully.');
  } catch (error) {
    throw new Error(error);
  }
}
