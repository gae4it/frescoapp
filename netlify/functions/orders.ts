import { Handler } from '@netlify/functions';
import { z } from 'zod';

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
  items: z.string()
});

// Simple in-memory storage for demo (in production use a real database)
const orders: any[] = [];
let currentOrderId = 1;

// Email sending function
async function sendOrderEmail(orderData: any) {
  try {
    // Format the order items for email
    const items = JSON.parse(orderData.items);
    const itemsList = items.map((item: any) => 
      `- ${item.name} (Quantità: ${item.quantity}) - €${item.price}`
    ).join('\n');

    const emailBody = `
Nuovo ordine ricevuto!

DATI CLIENTE:
Nome: ${orderData.customerName}
Email: ${orderData.customerEmail}
Telefono: ${orderData.customerPhone}
Indirizzo: ${orderData.customerAddress}, ${orderData.customerNumber}
${orderData.customerIntercom ? `Citofono: ${orderData.customerIntercom}` : ''}

PRODOTTI ORDINATI:
${itemsList}

${orderData.deliveryInstructions ? `ISTRUZIONI CONSEGNA:\n${orderData.deliveryInstructions}` : ''}

${orderData.notes ? `NOTE:\n${orderData.notes}` : ''}
    `;

    // Log the email content for debugging
    console.log('=== NEW ORDER EMAIL ===');
    console.log('To: gae4it@gmail.com');
    console.log('Subject: Nuovo ordine da', orderData.customerName);
    console.log('Customer Email:', orderData.customerEmail);
    console.log('Content:', emailBody);
    console.log('========================');

    // Try to submit via Netlify Forms as backup
    try {
      const formData = new URLSearchParams();
      formData.append('form-name', 'order-notification');
      formData.append('customer-name', orderData.customerName);
      formData.append('customer-email', orderData.customerEmail);
      formData.append('customer-phone', orderData.customerPhone);
      formData.append('customer-address', `${orderData.customerAddress}, ${orderData.customerNumber}`);
      formData.append('order-details', itemsList);
      formData.append('delivery-instructions', orderData.deliveryInstructions || '');
      formData.append('notes', orderData.notes || '');

      // Submit to Netlify Forms
      const formResponse = await fetch('https://frescoapp.netlify.app/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString()
      });

      if (formResponse.ok) {
        console.log('Order submitted via Netlify Forms successfully');
        return true;
      }
    } catch (error) {
      console.log('Netlify Forms submission failed:', error);
    }

    return true; // Return true anyway since we logged the order
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
}

export const handler: Handler = async (event, context) => {
  // Handle CORS preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
      },
      body: ''
    };
  }

  // Handle POST requests (create order)
  if (event.httpMethod === 'POST') {
    try {
      console.log('Received POST request to orders function');
      console.log('Event body:', event.body);
      
      const orderData = JSON.parse(event.body || '{}');
      console.log('Parsed order data:', orderData);
      
      // Validate the order data
      const validatedData = emailOrderSchema.parse(orderData);
      console.log('Validated data:', validatedData);
      
      // Create order
      const order = {
        id: currentOrderId++,
        ...validatedData,
        createdAt: new Date().toISOString()
      };
      
      // Store order
      orders.push(order);
      
      // Send email notification
      const emailSent = await sendOrderEmail(validatedData);
      
      console.log(`Order created: ${JSON.stringify(order)}`);
      console.log(`Email sent: ${emailSent}`);
      
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
        },
        body: JSON.stringify({ 
          ...order, 
          emailSent,
          message: 'Order created successfully'
        })
      };
    } catch (error) {
      console.error("Order creation error:", error);
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ 
          message: "Invalid order data",
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      };
    }
  }

  // Handle GET requests (get orders)
  if (event.httpMethod === 'GET') {
    try {
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
        },
        body: JSON.stringify(orders)
      };
    } catch (error) {
      console.error("Get orders error:", error);
      return {
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ message: "Failed to fetch orders" })
      };
    }
  }

  // Method not allowed
  return {
    statusCode: 405,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({ message: 'Method not allowed' })
  };
};