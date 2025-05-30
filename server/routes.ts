import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";

// Define the email order schema
const emailOrderSchema = z.object({
  email: z.string().email(),
  items: z.array(z.string()).min(1)
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Create order endpoint
  app.post("/api/orders", async (req, res) => {
    try {
      const orderData = emailOrderSchema.parse(req.body);
      const order = await storage.createOrder(orderData);
      
      // Here you would typically integrate with an email service
      // to send the order confirmation emails
      console.log(`Order created: ${JSON.stringify(order)}`);
      
      res.json(order);
    } catch (error) {
      console.error("Order creation error:", error);
      res.status(400).json({ message: "Invalid order data" });
    }
  });

  // Get all orders endpoint
  app.get("/api/orders", async (req, res) => {
    try {
      const orders = await storage.getOrders();
      res.json(orders);
    } catch (error) {
      console.error("Get orders error:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
