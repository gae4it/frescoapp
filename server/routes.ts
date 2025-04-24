import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { emailOrderSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/orders", async (req, res) => {
    try {
      const orderData = emailOrderSchema.parse(req.body);
      const order = await storage.createOrder(orderData);
      
      // Here you would typically integrate with an email service
      // to send the order confirmation emails
      
      res.json(order);
    } catch (error) {
      res.status(400).json({ message: "Invalid order data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
