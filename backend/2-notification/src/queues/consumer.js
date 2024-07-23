import { sendEmail } from '@/utils/sendEmail.js';
import { createConnection } from '@/queues/connect.js';
import config from '@/config.js';

export async function consumeAuthEmailMessages() {
  try {
    const channel = await createConnection();

    const exchangeName = 'notification';
    const routingKey = 'auth.signup.email';
    const queueName = 'auth-signup-email';
    await channel.assertExchange(exchangeName, 'direct', { durable: true, autoDelete: false });

    const queue = await channel.assertQueue(queueName, { durable: true, autoDelete: false });
    await channel.bindQueue(queue.queue, exchangeName, routingKey);

    channel.consume(queue.queue, async (msg) => {
      const { receiverEmail, verifyLink, template } = JSON.parse(msg.content.toString());
      const locals = {
        appLink: `${config.CLIENT_URL}`,
        appIcon: 'https://i.ibb.co/v3JywRD/logo.jpg',
        verifyLink,
      };
      await sendEmail(template, receiverEmail, locals);
      channel.ack(msg);
      console.log('Email sent successfully.');
    });
  } catch (error) {
    throw new Error(error);
  }
}
