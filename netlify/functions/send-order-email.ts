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

    // Email content for store owner
    const storeEmailContent = `
NUOVO ORDINE RICEVUTO!

DATI CLIENTE:
Nome: ${orderData.customerName}
Email: ${orderData.customerEmail}
Telefono: ${orderData.customerPhone}
Indirizzo: ${orderData.customerAddress}, ${orderData.customerNumber}
${orderData.customerIntercom ? `Citofono: ${orderData.customerIntercom}` : ''}

PRODOTTI ORDINATI:
${itemsList}

TOTALE: €${totalAmount}

${orderData.deliveryInstructions ? `ISTRUZIONI CONSEGNA:\n${orderData.deliveryInstructions}` : ''}

${orderData.notes ? `NOTE:\n${orderData.notes}` : ''}

Data ordine: ${new Date().toLocaleString('it-IT')}
    `;

    // Email content for customer
    const customerEmailContent = `
Ciao ${orderData.customerName},

Grazie per il tuo ordine! Abbiamo ricevuto la tua richiesta e provvederemo alla preparazione al più presto.

RIEPILOGO ORDINE:
${itemsList}

TOTALE: €${totalAmount}

INDIRIZZO DI CONSEGNA:
${orderData.customerAddress}, ${orderData.customerNumber}
${orderData.customerIntercom ? `Citofono: ${orderData.customerIntercom}` : ''}

${orderData.deliveryInstructions ? `ISTRUZIONI CONSEGNA:\n${orderData.deliveryInstructions}` : ''}

Ti contatteremo presto per confermare la consegna.

Grazie mille e una splendida giornata!

Il team di Fresco App
    `;

    // Send emails using a simple SMTP service or email API
    // For now, we'll use a webhook approach with Netlify Forms
    
    // Submit to Netlify Forms for store notification
    const storeFormData = new URLSearchParams();
    storeFormData.append('form-name', 'order-notification');
    storeFormData.append('customer-name', orderData.customerName);
    storeFormData.append('customer-email', orderData.customerEmail);
    storeFormData.append('customer-phone', orderData.customerPhone);
    storeFormData.append('customer-address', `${orderData.customerAddress}, ${orderData.customerNumber}`);
    storeFormData.append('order-details', itemsList);
    storeFormData.append('total-amount', `€${totalAmount}`);
    storeFormData.append('delivery-instructions', orderData.deliveryInstructions || '');
    storeFormData.append('notes', orderData.notes || '');
    storeFormData.append('order-date', new Date().toLocaleString('it-IT'));

    // Submit customer confirmation form
    const customerFormData = new URLSearchParams();
    customerFormData.append('form-name', 'customer-confirmation');
    customerFormData.append('customer-name', orderData.customerName);
    customerFormData.append('customer-email', orderData.customerEmail);
    customerFormData.append('order-summary', itemsList);
    customerFormData.append('total-amount', `€${totalAmount}`);
    customerFormData.append('delivery-address', `${orderData.customerAddress}, ${orderData.customerNumber}`);

    let storeEmailSent = false;
    let customerEmailSent = false;

    try {
      // Submit store notification
      const storeResponse = await fetch('https://frescoapp.netlify.app/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: storeFormData.toString()
      });

      if (storeResponse.ok) {
        storeEmailSent = true;
        console.log('Store notification sent via Netlify Forms');
      }
    } catch (error) {
      console.log('Store notification failed:', error);
    }

    try {
      // Submit customer confirmation
      const customerResponse = await fetch('https://frescoapp.netlify.app/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: customerFormData.toString()
      });

      if (customerResponse.ok) {
        customerEmailSent = true;
        console.log('Customer confirmation sent via Netlify Forms');
      }
    } catch (error) {
      console.log('Customer confirmation failed:', error);
    }

    // Log the email content for debugging
    console.log('=== STORE EMAIL ===');
    console.log('To: gae4it@gmail.com');
    console.log('Subject: Nuovo ordine da', orderData.customerName);
    console.log('Content:', storeEmailContent);
    console.log('==================');

    console.log('=== CUSTOMER EMAIL ===');
    console.log('To:', orderData.customerEmail);
    console.log('Subject: Conferma ordine - Fresco App');
    console.log('Content:', customerEmailContent);
    console.log('=====================');

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: true,
        storeEmailSent,
        customerEmailSent,
        message: 'Email notifications processed'
      })
    };

  } catch (error) {
    console.error('Email sending error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: false,
        message: 'Failed to send email notifications',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    };
  }
};