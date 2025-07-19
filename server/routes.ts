import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { emailOrderSchema } from "@shared/schema";

// Email sending function using multiple methods
async function sendOrderEmail(orderData: any) {
  try {
    // Format the order items for email
    const items = JSON.parse(orderData.items);
    const itemsList = items
      .map(
        (item: any) =>
          `- ${item.name} (Quantità: ${item.quantity}) - €${item.price}`
      )
      .join("\n");

    const emailBody = `
Nuovo ordine ricevuto!

DATI CLIENTE:
Nome: ${orderData.customerName}
Email: ${orderData.customerEmail}
Telefono: ${orderData.customerPhone}
Indirizzo: ${orderData.customerAddress}, ${orderData.customerNumber}
${orderData.customerIntercom ? `Citofono: ${orderData.customerIntercom}` : ""}

PRODOTTI ORDINATI:
${itemsList}

${orderData.deliveryInstructions ? `ISTRUZIONI CONSEGNA:\n${orderData.deliveryInstructions}` : ""}

${orderData.notes ? `NOTE:\n${orderData.notes}` : ""}
    `;

    // Method 1: Try Netlify function
    try {
      const response = await fetch("/.netlify/functions/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: "gae4it@gmail.com",
          subject: `Nuovo ordine da ${orderData.customerName}`,
          text: emailBody,
          customerEmail: orderData.customerEmail,
        }),
      });

      if (response.ok) {
        console.log("Email sent via Netlify function");
        return true;
      }
    } catch (error) {
      console.log("Netlify function failed, trying form submission");
    }

    // Method 2: Try Netlify Forms as backup
    try {
      const formData = new URLSearchParams();
      formData.append("form-name", "order-notification");
      formData.append("customer-name", orderData.customerName);
      formData.append("customer-email", orderData.customerEmail);
      formData.append("customer-phone", orderData.customerPhone);
      formData.append(
        "customer-address",
        `${orderData.customerAddress}, ${orderData.customerNumber}`
      );
      formData.append("order-details", itemsList);
      formData.append(
        "delivery-instructions",
        orderData.deliveryInstructions || ""
      );
      formData.append("notes", orderData.notes || "");

      const formResponse = await fetch("/", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      });

      if (formResponse.ok) {
        console.log("Order submitted via Netlify Forms");
        return true;
      }
    } catch (error) {
      console.log("Netlify Forms also failed");
    }

    // If both methods fail, at least log the order
    console.log("=== ORDER RECEIVED (EMAIL FAILED) ===");
    console.log(emailBody);
    console.log("");
  } catch (error) {
    console.error("Error in sendOrderEmail:", error);
    return false;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Create order endpoint
  app.post("/api/orders", async (req, res) => {
    try {
      const orderData = emailOrderSchema.parse(req.body);
      const order = await storage.createOrder(orderData);

      // Send email notification
      const emailSent = await sendOrderEmail(orderData);

      console.log(`Order created: ${JSON.stringify(order)}`);
      console.log(`Email sent: ${emailSent}`);

      res.json({ ...order, emailSent });
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
