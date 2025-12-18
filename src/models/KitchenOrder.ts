import mongoose, { Schema, Document } from 'mongoose';
import { MONGO_COLLECTIONS } from '../constants/collections';
import { KitchenOrderStatus, ALL_KITCHEN_ORDER_STATES } from '../constants/orderStates';

export interface IKitchenOrder extends Document {
  orderId: string;
  orderNumber?: string;  // ✅ NUEVO: Número de orden legible (ORD-xxx)
  userId: string;
  customerName?: string;
  customerEmail?: string;
  items: Array<{
    name: string;
    quantity: number;
    price?: number;
  }>;
  status: KitchenOrderStatus;
  receivedAt: Date;
  preparingAt?: Date;
  readyAt?: Date;
  cancelledAt?: Date;
  cancellationReason?: string;
  estimatedTime?: number; // en minutos
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const KitchenOrderSchema = new Schema({
  orderId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  orderNumber: {
    type: String,
    index: true
  },
  userId: {
    type: String,
    required: true
  },
  customerName: String,
  customerEmail: String,
  items: [{
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: Number
  }],
  status: { 
    type: String, 
    enum: ALL_KITCHEN_ORDER_STATES,
    default: KitchenOrderStatus.RECEIVED,
    index: true
  },
  receivedAt: {
    type: Date,
    default: Date.now
  },
  preparingAt: Date,
  readyAt: Date,
  cancelledAt: Date,
  cancellationReason: String,
  estimatedTime: Number,
  notes: String
}, {
  timestamps: true,
  collection: MONGO_COLLECTIONS.KITCHEN_ORDERS // Especifica nombre de colección explícitamente
});

export const KitchenOrder = mongoose.model<IKitchenOrder>('KitchenOrder', KitchenOrderSchema);