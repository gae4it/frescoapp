import { Handler } from "@netlify/functions";
import { z } from "zod";
import { Resend } from "resend";

// Define the schema directly in the function to avoid import issues
const emailOrderSchema = z.object({
  customerName: z.string().min(2, "Nome richiesto"),
  customerEmail: z.string().email("Email non valida"),
  customerPhone: z.string().min(6, "Telefono richiesto"),
  customerAddress: z.string().min(5, "Indirizzo richiesto"),
  customerNumber: z.string().min(1, "Numero civico richiesto"),
  customerIntercom: z.string().optional(),
  deliveryInstructions: z.string().optional(),
  notes: z.string().optional(),
  items: z.string(),
});

// Simple in-memory storage for demo (in production use a real database)
const orders: any[] = [];
let currentOrderId = 1;

// Email sending function using Resend
async function sendOrderEmail(orderData: any) {
  try {
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      throw new Error(
        "RESEND_API_KEY non impostata nelle variabili ambiente Netlify"
      );
    }
    const resend = new Resend(resendApiKey);
    // Format the order items for email
    const items = JSON.parse(orderData.items);
    const itemsList = items
      .map(
        (item: any) =>
          `- ${item.name} (Quantità: ${item.quantity}) - €${item.price}`
      )
      .join("\n");

    const emailBody = `Nuovo ordine ricevuto!\n\nDATI CLIENTE:\nNome: ${orderData.customerName}\nEmail: ${orderData.customerEmail}\nTelefono: ${orderData.customerPhone}\nIndirizzo: ${orderData.customerAddress}, ${orderData.customerNumber}\n${orderData.customerIntercom ? `Citofono: ${orderData.customerIntercom}\n` : ""}\nPRODOTTI ORDINATI:\n${itemsList}\n\n${orderData.deliveryInstructions ? `ISTRUZIONI CONSEGNA:\n${orderData.deliveryInstructions}\n` : ""}${orderData.notes ? `NOTE:\n${orderData.notes}\n` : ""}`;

    const subject = `Nuovo ordine da ${orderData.customerName}`;
    const to = "gae4it@gmail.com";
    const from = "noreply@frescoapp.netlify.app"; // Puoi personalizzare il mittente

    const { data, error } = await resend.emails.send({
      from,
      to,
      subject,
      text: emailBody,
    });
    if (error) {
      console.error("Errore invio email con Resend:", error);
      return false;
    }
    console.log("Email inviata con Resend:", data);
    return true;
  } catch (error) {
    console.error("Email sending error:", error);
    return false;
  }
}

export const handler: Handler = async (event, context) => {
  // Handle CORS preflight requests
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      },
      body: "",
    };
  }

  // Handle POST requests (create order)
  if (event.httpMethod === "POST") {
    try {
      console.log("Received POST request to orders function");
      console.log("Event body:", event.body);

      const orderData = JSON.parse(event.body || "{}");
      console.log("Parsed order data:", orderData);

      // Validate the order data
      const validatedData = emailOrderSchema.parse(orderData);
      console.log("Validated data:", validatedData);

      // Create order
      const order = {
        id: currentOrderId++,
        ...validatedData,
        createdAt: new Date().toISOString(),
      };

      // Store order
      orders.push(order);

      // Invia email con Resend
      const emailSent = await sendOrderEmail(validatedData);
      console.log(`Order created: ${JSON.stringify(order)}`);
      console.log(`Email sent: ${emailSent}`);
      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        },
        body: JSON.stringify({
          ...order,
          emailSent,
          message: "Order created successfully",
        }),
      };
    } catch (error) {
      console.error("Order creation error:", error);
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          message: "Invalid order data",
          error: error instanceof Error ? error.message : "Unknown error",
        }),
      };
    }
  }

  // Handle GET requests (get orders)
  if (event.httpMethod === "GET") {
    try {
      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        },
        body: JSON.stringify(orders),
      };
    } catch (error) {
      console.error("Get orders error:", error);
      return {
        statusCode: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ message: "Failed to fetch orders" }),
      };
    }
  }

  // Method not allowed
  return {
    statusCode: 405,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({ message: "Method not allowed" }),
  };
};
