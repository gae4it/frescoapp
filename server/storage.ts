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
      ...insertOrder,
      id,
    };
    this.orders.set(id, order);
    return order;
  }

  async getOrders(): Promise<Order[]> {
    return Array.from(this.orders.values());
  }
}

export const storage = new MemStorage();
