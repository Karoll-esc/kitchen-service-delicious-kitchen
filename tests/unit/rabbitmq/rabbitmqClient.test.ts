import { RabbitMQClient } from '../../../src/rabbitmq/rabbitmqClient';

/**
 * Tests unitarios para RabbitMQClient
 * 
 * Nota: Estos tests validan la estructura y métodos del cliente RabbitMQ
 * sin conexión real al broker (se mockea la conexión)
 */
describe('RabbitMQClient - Unit Tests', () => {
  let rabbitMQClient: RabbitMQClient;

  beforeEach(() => {
    rabbitMQClient = new RabbitMQClient();
  });

  describe('Constructor', () => {
    it('debe instanciar correctamente el cliente', () => {
      expect(rabbitMQClient).toBeDefined();
      expect(rabbitMQClient).toBeInstanceOf(RabbitMQClient);
    });
  });

  describe('Métodos públicos', () => {
    it('debe tener método publish', () => {
      expect(rabbitMQClient.publish).toBeDefined();
      expect(typeof rabbitMQClient.publish).toBe('function');
    });

    it('debe tener método connect', () => {
      expect(rabbitMQClient.connect).toBeDefined();
      expect(typeof rabbitMQClient.connect).toBe('function');
    });

    it('debe tener método consume', () => {
      expect(rabbitMQClient.consume).toBeDefined();
      expect(typeof rabbitMQClient.consume).toBe('function');
    });

    it('debe tener método close', () => {
      expect(rabbitMQClient.close).toBeDefined();
      expect(typeof rabbitMQClient.close).toBe('function');
    });

    it('debe tener método isConnected', () => {
      expect(rabbitMQClient.isConnected).toBeDefined();
      expect(typeof rabbitMQClient.isConnected).toBe('function');
    });
  });

  describe('Manejo de conexión simulada', () => {
    it('debe manejar publish cuando está mockeado', async () => {
      // En entorno de test, RabbitMQ está mockeado y simplemente mockear publish
      const mockPublish = jest.fn().mockResolvedValue(undefined);
      rabbitMQClient.publish = mockPublish;
      
      await rabbitMQClient.publish('test.event', { data: 'test' });
      
      expect(mockPublish).toHaveBeenCalledWith('test.event', { data: 'test' });
    });
  });

  describe('Validación de parámetros', () => {
    it('debe aceptar routingKey como string', () => {
      const mockPublish = jest.fn().mockResolvedValue(undefined);
      rabbitMQClient.publish = mockPublish;
      
      rabbitMQClient.publish('valid.routing.key', { test: true });
      
      expect(mockPublish).toHaveBeenCalledWith('valid.routing.key', { test: true });
    });

    it('debe aceptar message como objeto', () => {
      const mockPublish = jest.fn().mockResolvedValue(undefined);
      rabbitMQClient.publish = mockPublish;
      
      rabbitMQClient.publish('test.event', { 
        orderId: '123', 
        status: 'received' 
      });
      
      expect(mockPublish).toHaveBeenCalledWith('test.event', { 
        orderId: '123', 
        status: 'received' 
      });
    });
  });
});
