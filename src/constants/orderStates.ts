/**
 * @file orderStates.ts
 * @description Definición centralizada de estados de pedidos para Kitchen Service
 * 
 * Kitchen Service maneja únicamente estados internos de cocina:
 * - received: Pedido recibido desde Order Service
 * - preparing: Cocinero comenzó a preparar el pedido
 * - ready: Pedido listo para entrega
 * - cancelled: Pedido cancelado
 * 
 * NO gestiona los estados 'pending' (pre-cocina) ni 'completed' (post-cocina)
 * 
 * @see ORDER_STATES.md - Documentación completa de estados y transiciones
 */

/**
 * Estados de pedidos gestionados por Kitchen Service
 * Nomenclatura: minúsculas, formato snake_case (consistente con Order Service)
 */
export enum KitchenOrderStatus {
  /** Kitchen Service ha recibido y registrado el pedido */
  RECEIVED = 'received',
  
  /** El equipo de cocina está preparando activamente el pedido */
  PREPARING = 'preparing',
  
  /** Pedido completamente preparado, esperando entrega al cliente */
  READY = 'ready',
  
  /** Pedido cancelado por cliente o administrador */
  CANCELLED = 'cancelled'
}

/**
 * Array de todos los estados válidos en Kitchen Service
 */
export const ALL_KITCHEN_ORDER_STATES = Object.values(KitchenOrderStatus);

/**
 * Mapa de transiciones de estado permitidas en Kitchen Service
 */
export const ALLOWED_KITCHEN_STATE_TRANSITIONS: Record<KitchenOrderStatus, KitchenOrderStatus[]> = {
  [KitchenOrderStatus.RECEIVED]: [KitchenOrderStatus.PREPARING, KitchenOrderStatus.CANCELLED],
  [KitchenOrderStatus.PREPARING]: [KitchenOrderStatus.READY, KitchenOrderStatus.CANCELLED],
  [KitchenOrderStatus.READY]: [KitchenOrderStatus.CANCELLED], // Solo admin puede cancelar desde READY
  [KitchenOrderStatus.CANCELLED]: [] // Estado final
};

/**
 * Estados desde los cuales Kitchen Service permite cancelación
 */
export const KITCHEN_CANCELLABLE_STATES: KitchenOrderStatus[] = [
  KitchenOrderStatus.RECEIVED,
  KitchenOrderStatus.PREPARING,
  KitchenOrderStatus.READY
];

/**
 * Estado final en Kitchen Service
 */
export const KITCHEN_FINAL_STATES: KitchenOrderStatus[] = [
  KitchenOrderStatus.CANCELLED
  // READY no es final porque el pedido puede ser cancelado desde READY
];

/**
 * Valida si una transición de estado es permitida en Kitchen Service
 * @param currentStatus - Estado actual del pedido en cocina
 * @param newStatus - Nuevo estado deseado
 * @returns true si la transición es válida, false si no
 */
export function isValidKitchenStateTransition(
  currentStatus: KitchenOrderStatus,
  newStatus: KitchenOrderStatus
): boolean {
  const allowedTransitions = ALLOWED_KITCHEN_STATE_TRANSITIONS[currentStatus];
  return allowedTransitions.includes(newStatus);
}

/**
 * Verifica si un estado de cocina es cancelable
 * @param status - Estado del pedido en cocina
 * @returns true si se puede cancelar desde ese estado
 */
export function isKitchenCancellable(status: KitchenOrderStatus): boolean {
  return KITCHEN_CANCELLABLE_STATES.includes(status);
}

/**
 * Verifica si un estado de cocina es final
 * @param status - Estado del pedido en cocina
 * @returns true si el estado es final
 */
export function isKitchenFinalState(status: KitchenOrderStatus): boolean {
  return KITCHEN_FINAL_STATES.includes(status);
}

/**
 * Nombres de eventos RabbitMQ publicados por Kitchen Service
 * Consistentes con Order Service
 */
export const KITCHEN_ORDER_EVENT_NAMES = {
  RECEIVED: 'order.received',
  PREPARING: 'order.preparing',
  READY: 'order.ready',
  CANCELLED: 'order.cancelled',
  STATUS_UPDATED: 'order.status.updated'
} as const;

/**
 * Mapeo de estados de cocina a nombres de eventos
 */
export const KITCHEN_STATE_TO_EVENT: Record<KitchenOrderStatus, string> = {
  [KitchenOrderStatus.RECEIVED]: KITCHEN_ORDER_EVENT_NAMES.RECEIVED,
  [KitchenOrderStatus.PREPARING]: KITCHEN_ORDER_EVENT_NAMES.PREPARING,
  [KitchenOrderStatus.READY]: KITCHEN_ORDER_EVENT_NAMES.READY,
  [KitchenOrderStatus.CANCELLED]: KITCHEN_ORDER_EVENT_NAMES.CANCELLED
};

/**
 * Mapeo de Kitchen Service status a Order Service status
 * Garantiza interoperabilidad entre servicios
 */
export const KITCHEN_TO_ORDER_STATUS: Record<KitchenOrderStatus, string> = {
  [KitchenOrderStatus.RECEIVED]: 'received',
  [KitchenOrderStatus.PREPARING]: 'preparing',
  [KitchenOrderStatus.READY]: 'ready',
  [KitchenOrderStatus.CANCELLED]: 'cancelled'
};
