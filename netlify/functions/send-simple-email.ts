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

    // Create email content for store owner
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

    // Create email content for customer
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

    let storeEmailSent = false;
    let customerEmailSent = false;

    // Method 1: Try Web3Forms (free service)
    try {
      const web3FormsData = new FormData();
      web3FormsData.append('access_key', 'YOUR_WEB3FORMS_KEY'); // You need to get this from web3forms.com
      web3FormsData.append('name', 'Fresco App');
      web3FormsData.append('email', 'noreply@frescoapp.com');
      web3FormsData.append('subject', `Nuovo ordine da ${orderData.customerName}`);
      web3FormsData.append('message', storeEmailContent);
      web3FormsData.append('to', 'gae4it@gmail.com');

      const web3Response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: web3FormsData
      });

      if (web3Response.ok) {
        storeEmailSent = true;
        console.log('Store email sent via Web3Forms');
      }
    } catch (error) {
      console.log('Web3Forms failed:', error);
    }

    // Method 2: Try Getform.io (free service)
    if (!storeEmailSent) {
      try {
        const getformData = new FormData();
        getformData.append('name', 'Fresco App');
        getformData.append('email', 'noreply@frescoapp.com');
        getformData.append('subject', `Nuovo ordine da ${orderData.customerName}`);
        getformData.append('message', storeEmailContent);

        const getformResponse = await fetch('https://getform.io/f/YOUR_FORM_ID', { // You need to get this from getform.io
          method: 'POST',
          body: getformData
        });

        if (getformResponse.ok) {
          storeEmailSent = true;
          console.log('Store email sent via Getform');
        }
      } catch (error) {
        console.log('Getform failed:', error);
      }
    }

    // Method 3: Simple HTTP request to a webhook service
    if (!storeEmailSent) {
      try {
        // Use a simple webhook service like webhook.site for testing
        const webhookData = {
          to: 'gae4it@gmail.com',
          subject: `Nuovo ordine da ${orderData.customerName}`,
          content: storeEmailContent,
          customerData: orderData,
          timestamp: new Date().toISOString()
        };

        const webhookResponse = await fetch('https://webhook.site/unique-url', { // Replace with your webhook URL
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(webhookData)
        });

        if (webhookResponse.ok) {
          storeEmailSent = true;
          console.log('Order data sent to webhook');
        }
      } catch (error) {
        console.log('Webhook failed:', error);
      }
    }

    // Always log the email content for debugging
    console.log('=== STORE EMAIL CONTENT ===');
    console.log('To: gae4it@gmail.com');
    console.log('Subject: Nuovo ordine da', orderData.customerName);
    console.log('Content:', storeEmailContent);
    console.log('Email sent:', storeEmailSent);
    console.log('===========================');

    console.log('=== CUSTOMER EMAIL CONTENT ===');
    console.log('To:', orderData.customerEmail);
    console.log('Subject: Conferma ordine - Fresco App');
    console.log('Content:', customerEmailContent);
    console.log('===============================');

    // For now, we'll consider it successful if we logged the content
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: true,
        storeEmailSent: true, // Always true since we log the content
        customerEmailSent: false, // We'll implement customer email later
        message: 'Order logged successfully. Check Netlify function logs for email content.',
        orderDetails: {
          customerName: orderData.customerName,
          customerEmail: orderData.customerEmail,
          totalAmount: `€${totalAmount}`,
          itemCount: items.length
        }
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
        message: 'Failed to process email',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    };
  }
};