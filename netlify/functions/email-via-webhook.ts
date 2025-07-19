import { Handler } from '@netlify/functions';

export const handler: Handler = async (event, context) => {
  // Handle CORS preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ message: 'Method not allowed' })
    };
  }

  try {
    const { orderData } = JSON.parse(event.body || '{}');
    
    // Format the order items for email
    const items = JSON.parse(orderData.items);
    const itemsList = items.map((item: any) => 
      `- ${item.name} (Quantità: ${item.quantity}) - €${item.price}`
    ).join('\n');

    const totalAmount = items.reduce((total: number, item: any) => 
      total + (parseFloat(item.price) * item.quantity), 0
    ).toFixed(2);

    // Create comprehensive order data
    const orderSummary = {
      orderId: `ORD-${Date.now()}`,
      timestamp: new Date().toISOString(),
      customer: {
        name: orderData.customerName,
        email: orderData.customerEmail,
        phone: orderData.customerPhone,
        address: `${orderData.customerAddress}, ${orderData.customerNumber}`,
        intercom: orderData.customerIntercom || '',
        deliveryInstructions: orderData.deliveryInstructions || '',
        notes: orderData.notes || ''
      },
      items: items,
      itemsList: itemsList,
      totalAmount: totalAmount,
      formattedDate: new Date().toLocaleString('it-IT')
    };

    // Email content for store owner
    const storeEmailContent = `
🛒 NUOVO ORDINE RICEVUTO!

📋 DETTAGLI ORDINE:
ID Ordine: ${orderSummary.orderId}
Data: ${orderSummary.formattedDate}

👤 DATI CLIENTE:
Nome: ${orderSummary.customer.name}
Email: ${orderSummary.customer.email}
Telefono: ${orderSummary.customer.phone}
Indirizzo: ${orderSummary.customer.address}
${orderSummary.customer.intercom ? `Citofono: ${orderSummary.customer.intercom}` : ''}

🛍️ PRODOTTI ORDINATI:
${orderSummary.itemsList}

💰 TOTALE: €${orderSummary.totalAmount}

${orderSummary.customer.deliveryInstructions ? `📦 ISTRUZIONI CONSEGNA:\n${orderSummary.customer.deliveryInstructions}` : ''}

${orderSummary.customer.notes ? `📝 NOTE:\n${orderSummary.customer.notes}` : ''}

---
Ordine ricevuto tramite Fresco App
    `;

    // Try multiple email services
    let emailSent = false;
    const emailResults = [];

    // Method 1: Use Formspree (free service)
    try {
      const formspreeData = new FormData();
      formspreeData.append('email', 'gae4it@gmail.com');
      formspreeData.append('subject', `🛒 Nuovo ordine da ${orderSummary.customer.name}`);
      formspreeData.append('message', storeEmailContent);
      formspreeData.append('_replyto', orderSummary.customer.email);

      const formspreeResponse = await fetch('https://formspree.io/f/xpwagqpv', { // You need to create a form at formspree.io
        method: 'POST',
        body: formspreeData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (formspreeResponse.ok) {
        emailSent = true;
        emailResults.push('Formspree: SUCCESS');
        console.log('Email sent via Formspree successfully');
      } else {
        emailResults.push(`Formspree: FAILED (${formspreeResponse.status})`);
      }
    } catch (error) {
      emailResults.push(`Formspree: ERROR (${error})`);
      console.log('Formspree failed:', error);
    }

    // Method 2: Use EmailJS (if not sent via Formspree)
    if (!emailSent) {
      try {
        const emailjsData = {
          service_id: 'default_service',
          template_id: 'template_order',
          user_id: 'YOUR_EMAILJS_USER_ID',
          template_params: {
            to_email: 'gae4it@gmail.com',
            from_name: 'Fresco App',
            subject: `🛒 Nuovo ordine da ${orderSummary.customer.name}`,
            message: storeEmailContent,
            customer_name: orderSummary.customer.name,
            customer_email: orderSummary.customer.email,
            order_total: `€${orderSummary.totalAmount}`
          }
        };

        const emailjsResponse = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(emailjsData)
        });

        if (emailjsResponse.ok) {
          emailSent = true;
          emailResults.push('EmailJS: SUCCESS');
          console.log('Email sent via EmailJS successfully');
        } else {
          emailResults.push(`EmailJS: FAILED (${emailjsResponse.status})`);
        }
      } catch (error) {
        emailResults.push(`EmailJS: ERROR (${error})`);
        console.log('EmailJS failed:', error);
      }
    }

    // Method 3: Use a simple webhook for logging (always works)
    try {
      const webhookData = {
        type: 'new_order',
        order: orderSummary,
        emailContent: storeEmailContent,
        timestamp: new Date().toISOString()
      };

      // Send to a webhook service for logging (you can use webhook.site for testing)
      const webhookResponse = await fetch('https://webhook.site/#!/unique-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(webhookData)
      });

      emailResults.push('Webhook: SENT');
      console.log('Order data sent to webhook for logging');
    } catch (error) {
      emailResults.push(`Webhook: ERROR (${error})`);
    }

    // Always log the complete order details
    console.log('=== COMPLETE ORDER DETAILS ===');
    console.log('Order ID:', orderSummary.orderId);
    console.log('Customer:', orderSummary.customer.name, '(', orderSummary.customer.email, ')');
    console.log('Total:', `€${orderSummary.totalAmount}`);
    console.log('Items:', orderSummary.items.length);
    console.log('Email Results:', emailResults);
    console.log('Full Email Content:');
    console.log(storeEmailContent);
    console.log('==============================');

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: true,
        emailSent: emailSent,
        emailResults: emailResults,
        orderSummary: orderSummary,
        message: emailSent ? 'Email sent successfully!' : 'Order logged successfully. Check function logs for details.'
      })
    };

  } catch (error) {
    console.error('Email processing error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: false,
        message: 'Failed to process order email',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    };
  }
};