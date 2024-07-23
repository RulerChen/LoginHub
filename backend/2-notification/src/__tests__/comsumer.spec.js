import { jest } from '@jest/globals';

jest.unstable_mockModule('@/queues/connect.js', () => ({
  createConnection: jest.fn(),
}));

const connection = await import('@/queues/connect.js');
const { consumeAuthEmailMessages } = await import('@/queues/consumer.js');

describe('Email Consumer', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('consumeAuthEmailMessages method', () => {
    test('should be called', async () => {
      const channel = {
        assertExchange: jest.fn(),
        publish: jest.fn(),
        assertQueue: jest.fn(),
        bindQueue: jest.fn(),
        consume: jest.fn(),
      };
      jest.spyOn(channel, 'assertExchange');
      jest.spyOn(channel, 'assertQueue').mockReturnValue({ queue: 'auth-signup-email', messageCount: 0, consumerCount: 0 });
      jest.spyOn(connection, 'createConnection').mockReturnValue(channel);

      const connectionChannel = await connection.createConnection();
      await consumeAuthEmailMessages(connectionChannel);

      expect(connectionChannel.assertExchange).toHaveBeenCalledWith('notification', 'direct');
      expect(connectionChannel.assertQueue).toHaveBeenCalledTimes(1);
      expect(connectionChannel.bindQueue).toHaveBeenCalledWith('auth-signup-email', 'notification', 'auth.signup.email');
      expect(connectionChannel.consume).toHaveBeenCalledTimes(1);
    });
  });
});
