import {
  KitchenOrderStatus,
  ALL_KITCHEN_ORDER_STATES,
  ALLOWED_KITCHEN_STATE_TRANSITIONS,
  KITCHEN_CANCELLABLE_STATES,
  KITCHEN_FINAL_STATES,
  isValidKitchenStateTransition,
  isKitchenCancellable,
  isKitchenFinalState,
  KITCHEN_ORDER_EVENT_NAMES,
  KITCHEN_STATE_TO_EVENT,
  KITCHEN_TO_ORDER_STATUS
} from '../../../src/constants/orderStates';

/**
 * Tests unitarios para constantes y funciones de orderStates
 * Valida nomenclatura, transiciones y reglas de negocio
 */
describe('orderStates - Unit Tests', () => {
  describe('KitchenOrderStatus enum', () => {
    it('debe tener todos los estados definidos en minúsculas', () => {
      expect(KitchenOrderStatus.RECEIVED).toBe('received');
      expect(KitchenOrderStatus.PREPARING).toBe('preparing');
      expect(KitchenOrderStatus.READY).toBe('ready');
      expect(KitchenOrderStatus.CANCELLED).toBe('cancelled');
    });

    it('debe contener exactamente 4 estados', () => {
      const statusValues = Object.values(KitchenOrderStatus);
      expect(statusValues).toHaveLength(4);
    });
  });

  describe('ALL_KITCHEN_ORDER_STATES', () => {
    it('debe contener todos los estados válidos', () => {
      expect(ALL_KITCHEN_ORDER_STATES).toContain('received');
      expect(ALL_KITCHEN_ORDER_STATES).toContain('preparing');
      expect(ALL_KITCHEN_ORDER_STATES).toContain('ready');
      expect(ALL_KITCHEN_ORDER_STATES).toContain('cancelled');
      expect(ALL_KITCHEN_ORDER_STATES).toHaveLength(4);
    });
  });

  describe('ALLOWED_KITCHEN_STATE_TRANSITIONS', () => {
    it('debe permitir transición de received a preparing', () => {
      expect(ALLOWED_KITCHEN_STATE_TRANSITIONS[KitchenOrderStatus.RECEIVED])
        .toContain(KitchenOrderStatus.PREPARING);
    });

    it('debe permitir transición de received a cancelled', () => {
      expect(ALLOWED_KITCHEN_STATE_TRANSITIONS[KitchenOrderStatus.RECEIVED])
        .toContain(KitchenOrderStatus.CANCELLED);
    });

    it('debe permitir transición de preparing a ready', () => {
      expect(ALLOWED_KITCHEN_STATE_TRANSITIONS[KitchenOrderStatus.PREPARING])
        .toContain(KitchenOrderStatus.READY);
    });

    it('debe permitir transición de preparing a cancelled', () => {
      expect(ALLOWED_KITCHEN_STATE_TRANSITIONS[KitchenOrderStatus.PREPARING])
        .toContain(KitchenOrderStatus.CANCELLED);
    });

    it('cancelled debe ser estado final sin transiciones', () => {
      expect(ALLOWED_KITCHEN_STATE_TRANSITIONS[KitchenOrderStatus.CANCELLED])
        .toEqual([]);
    });
  });

  describe('isValidKitchenStateTransition', () => {
    it('debe validar transición válida: received → preparing', () => {
      expect(isValidKitchenStateTransition(
        KitchenOrderStatus.RECEIVED,
        KitchenOrderStatus.PREPARING
      )).toBe(true);
    });

    it('debe validar transición válida: preparing → ready', () => {
      expect(isValidKitchenStateTransition(
        KitchenOrderStatus.PREPARING,
        KitchenOrderStatus.READY
      )).toBe(true);
    });

    it('debe rechazar transición inválida: received → ready', () => {
      expect(isValidKitchenStateTransition(
        KitchenOrderStatus.RECEIVED,
        KitchenOrderStatus.READY
      )).toBe(false);
    });

    it('debe rechazar transición desde cancelled', () => {
      expect(isValidKitchenStateTransition(
        KitchenOrderStatus.CANCELLED,
        KitchenOrderStatus.RECEIVED
      )).toBe(false);
    });

    it('debe permitir cancelación desde received', () => {
      expect(isValidKitchenStateTransition(
        KitchenOrderStatus.RECEIVED,
        KitchenOrderStatus.CANCELLED
      )).toBe(true);
    });

    it('debe permitir cancelación desde preparing', () => {
      expect(isValidKitchenStateTransition(
        KitchenOrderStatus.PREPARING,
        KitchenOrderStatus.CANCELLED
      )).toBe(true);
    });
  });

  describe('isKitchenCancellable', () => {
    it('debe permitir cancelar desde received', () => {
      expect(isKitchenCancellable(KitchenOrderStatus.RECEIVED)).toBe(true);
    });

    it('debe permitir cancelar desde preparing', () => {
      expect(isKitchenCancellable(KitchenOrderStatus.PREPARING)).toBe(true);
    });

    it('debe permitir cancelar desde ready', () => {
      expect(isKitchenCancellable(KitchenOrderStatus.READY)).toBe(true);
    });

    it('no debe permitir cancelar desde cancelled', () => {
      expect(isKitchenCancellable(KitchenOrderStatus.CANCELLED)).toBe(false);
    });
  });

  describe('isKitchenFinalState', () => {
    it('cancelled debe ser estado final', () => {
      expect(isKitchenFinalState(KitchenOrderStatus.CANCELLED)).toBe(true);
    });

    it('received no debe ser estado final', () => {
      expect(isKitchenFinalState(KitchenOrderStatus.RECEIVED)).toBe(false);
    });

    it('preparing no debe ser estado final', () => {
      expect(isKitchenFinalState(KitchenOrderStatus.PREPARING)).toBe(false);
    });

    it('ready no debe ser estado final', () => {
      expect(isKitchenFinalState(KitchenOrderStatus.READY)).toBe(false);
    });
  });

  describe('KITCHEN_ORDER_EVENT_NAMES', () => {
    it('debe tener nombres de eventos correctos', () => {
      expect(KITCHEN_ORDER_EVENT_NAMES.RECEIVED).toBe('order.received');
      expect(KITCHEN_ORDER_EVENT_NAMES.PREPARING).toBe('order.preparing');
      expect(KITCHEN_ORDER_EVENT_NAMES.READY).toBe('order.ready');
      expect(KITCHEN_ORDER_EVENT_NAMES.CANCELLED).toBe('order.cancelled');
    });
  });

  describe('KITCHEN_CANCELLABLE_STATES', () => {
    it('debe incluir estados cancelables', () => {
      expect(KITCHEN_CANCELLABLE_STATES).toContain(KitchenOrderStatus.RECEIVED);
      expect(KITCHEN_CANCELLABLE_STATES).toContain(KitchenOrderStatus.PREPARING);
      expect(KITCHEN_CANCELLABLE_STATES).toContain(KitchenOrderStatus.READY);
      expect(KITCHEN_CANCELLABLE_STATES).toHaveLength(3);
    });
  });

  describe('KITCHEN_FINAL_STATES', () => {
    it('debe incluir solo cancelled como estado final', () => {
      expect(KITCHEN_FINAL_STATES).toContain(KitchenOrderStatus.CANCELLED);
      expect(KITCHEN_FINAL_STATES).toHaveLength(1);
    });
  });

  describe('KITCHEN_STATE_TO_EVENT', () => {
    it('debe mapear correctamente RECEIVED a evento', () => {
      expect(KITCHEN_STATE_TO_EVENT[KitchenOrderStatus.RECEIVED]).toBe('order.received');
    });

    it('debe mapear correctamente PREPARING a evento', () => {
      expect(KITCHEN_STATE_TO_EVENT[KitchenOrderStatus.PREPARING]).toBe('order.preparing');
    });

    it('debe mapear correctamente READY a evento', () => {
      expect(KITCHEN_STATE_TO_EVENT[KitchenOrderStatus.READY]).toBe('order.ready');
    });

    it('debe mapear correctamente CANCELLED a evento', () => {
      expect(KITCHEN_STATE_TO_EVENT[KitchenOrderStatus.CANCELLED]).toBe('order.cancelled');
    });
  });

  describe('KITCHEN_TO_ORDER_STATUS', () => {
    it('debe mapear estados a formato de Order Service', () => {
      expect(KITCHEN_TO_ORDER_STATUS[KitchenOrderStatus.RECEIVED]).toBe('received');
      expect(KITCHEN_TO_ORDER_STATUS[KitchenOrderStatus.PREPARING]).toBe('preparing');
      expect(KITCHEN_TO_ORDER_STATUS[KitchenOrderStatus.READY]).toBe('ready');
      expect(KITCHEN_TO_ORDER_STATUS[KitchenOrderStatus.CANCELLED]).toBe('cancelled');
    });
  });
});
