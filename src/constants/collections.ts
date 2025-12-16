/**
 * Constantes centralizadas para nombres de colecciones MongoDB - Kitchen Service
 * 
 * Principio: Single Source of Truth
 * 
 * Convenciones:
 * - Usar lowercase para nombres simples
 * - Usar snake_case para nombres compuestos
 * - Especificar siempre explícitamente en los schemas Mongoose
 * 
 * @see DB_NAMING_CONVENTIONS.md para documentación completa
 */

export const MONGO_COLLECTIONS = {
  /**
   * Colección de órdenes en cocina
   */
  KITCHEN_ORDERS: 'kitchen_orders'
} as const;

/**
 * Tipo derivado para validación en tiempo de compilación
 */
export type MongoCollectionName = typeof MONGO_COLLECTIONS[keyof typeof MONGO_COLLECTIONS];

/**
 * Nombres de bases de datos
 */
export const MONGO_DATABASES = {
  /**
   * Base de datos principal del Kitchen Service
   */
  KITCHEN: 'kitchen_db'
} as const;
