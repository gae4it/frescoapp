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

    // Use a simple email service like EmailJS or FormSubmit
    // For now, we'll use FormSubmit which is free and doesn't require API keys
    
    // Email for store owner
    const storeEmailData = {
      name: 'Fresco App - Nuovo Ordine',
      email: 'noreply@frescoapp.com',
      subject: `Nuovo ordine da ${orderData.customerName}`,
      message: `
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
      `
    };

    // Email for customer
    const customerEmailData = {
      name: 'Fresco App',
      email: 'noreply@frescoapp.com',
      subject: 'Conferma ordine - Fresco App',
      message: `
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
      `
    };

    let storeEmailSent = false;
    let customerEmailSent = false;

    // Send email to store owner using FormSubmit
    try {
      const storeFormData = new URLSearchParams();
      storeFormData.append('name', storeEmailData.name);
      storeFormData.append('email', storeEmailData.email);
      storeFormData.append('subject', storeEmailData.subject);
      storeFormData.append('message', storeEmailData.message);
      storeFormData.append('_to', 'gae4it@gmail.com');
      storeFormData.append('_subject', storeEmailData.subject);
      storeFormData.append('_captcha', 'false');
      storeFormData.append('_template', 'table');

      const storeResponse = await fetch('https://formsubmit.co/gae4it@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: storeFormData.toString()
      });

      if (storeResponse.ok) {
        storeEmailSent = true;
        console.log('Store email sent successfully via FormSubmit');
      } else {
        console.log('Store email failed:', storeResponse.status, storeResponse.statusText);
      }
    } catch (error) {
      console.log('Store email error:', error);
    }

    // Send confirmation email to customer
    try {
      const customerFormData = new URLSearchParams();
      customerFormData.append('name', customerEmailData.name);
      customerFormData.append('email', customerEmailData.email);
      customerFormData.append('subject', customerEmailData.subject);
      customerFormData.append('message', customerEmailData.message);
      customerFormData.append('_to', orderData.customerEmail);
      customerFormData.append('_subject', customerEmailData.subject);
      customerFormData.append('_captcha', 'false');
      customerFormData.append('_template', 'table');

      const customerResponse = await fetch(`https://formsubmit.co/${orderData.customerEmail}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: customerFormData.toString()
      });

      if (customerResponse.ok) {
        customerEmailSent = true;
        console.log('Customer email sent successfully via FormSubmit');
      } else {
        console.log('Customer email failed:', customerResponse.status, customerResponse.statusText);
      }
    } catch (error) {
      console.log('Customer email error:', error);
    }

    // Log the email content for debugging
    console.log('=== STORE EMAIL ===');
    console.log('To: gae4it@gmail.com');
    console.log('Subject:', storeEmailData.subject);
    console.log('Content:', storeEmailData.message);
    console.log('Sent:', storeEmailSent);
    console.log('==================');

    console.log('=== CUSTOMER EMAIL ===');
    console.log('To:', orderData.customerEmail);
    console.log('Subject:', customerEmailData.subject);
    console.log('Content:', customerEmailData.message);
    console.log('Sent:', customerEmailSent);
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
        message: 'Email notifications sent via FormSubmit'
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