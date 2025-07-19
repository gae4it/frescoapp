import { orders, type Order, type InsertOrder, insertOrderSchema } from "@shared/schema";
import { z } from "zod";

export type IStorage = {
  createOrder(order: z.infer<typeof insertOrderSchema>): Promise<Order>;
  getOrders(): Promise<Order[]>;
};

export class MemStorage implements IStorage {
  private orders: Map<number, Order>;
  currentOrderId: number;

  constructor() {
    this.orders = new Map();
    this.currentOrderId = 1;
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = this.currentOrderId++;
    const order: Order = {
      id,
      customerName: insertOrder.customerName,
      customerEmail: insertOrder.customerEmail,
      customerPhone: insertOrder.customerPhone,
      customerAddress: insertOrder.customerAddress,
      customerNumber: insertOrder.customerNumber,
      items: insertOrder.items,
      // Convert undefined to null for nullable fields
      notes: insertOrder.notes ?? null,
      customerIntercom: insertOrder.customerIntercom ?? null,
      deliveryInstructions: insertOrder.deliveryInstructions ?? null
    };
    this.orders.set(id, order);
    return order;
  }

  async getOrders(): Promise<Order[]> {
    return Array.from(this.orders.values());
  }
}

export const storage = new MemStorage();