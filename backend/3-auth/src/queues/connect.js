import amqplib from 'amqplib';

import config from '@/config.js';

export async function createConnection() {
  try {
    const connection = await amqplib.connect(config.RABBITMQ_ENDPOINT);
    const channel = await connection.createChannel();
    console.log('Connected to queue successfully.');

    closeConnection(channel, connection);

    return channel;
  } catch (error) {
    console.log('Connected to queue failed.');
    console.log(error);
    return undefined;
  }
}

function closeConnection(channel, connection) {
  process.once('SIGINT', async () => {
    await channel.close();
    await connection.close();
  });
}
