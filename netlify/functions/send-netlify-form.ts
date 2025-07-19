import { Handler } from '@netlify/functions';

export const handler: Handler = async (event, context) => {
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
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ message: 'Method not allowed' })
    };
  }

  try {
    const { orderData } = JSON.parse(event.body || '{}');
    
    // Format order items
    const items = JSON.parse(orderData.items);
    const itemsList = items.map((item: any) => 
      `- ${item.name} (Quantità: ${item.quantity}) - €${item.price}`
    ).join('\n');

    const totalAmount = items.reduce((total: number, item: any) => 
      total + (parseFloat(item.price) * item.quantity), 0
    ).toFixed(2);

    const orderId = `ORD-${Date.now()}`;

    // Submit directly to Netlify Forms
    const formData = new URLSearchParams();
    formData.append('form-name', 'order-notification');
    formData.append('order-id', orderId);
    formData.append('customer-name', orderData.customerName);
    formData.append('customer-email', orderData.customerEmail);
    formData.append('customer-phone', orderData.customerPhone);
    formData.append('customer-address', `${orderData.customerAddress}, ${orderData.customerNumber}`);
    formData.append('customer-intercom', orderData.customerIntercom || '');
    formData.append('order-details', itemsList);
    formData.append('total-amount', `€${totalAmount}`);
    formData.append('delivery-instructions', orderData.deliveryInstructions || '');
    formData.append('notes', orderData.notes || '');
    formData.append('order-date', new Date().toLocaleString('it-IT'));

    // Submit to Netlify Forms
    const response = await fetch('https://frescoapp.netlify.app/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString()
    });

    const success = response.ok;

    // Log complete order details
    console.log('🛒 === NUOVO ORDINE RICEVUTO ===');
    console.log(`📋 ID Ordine: ${orderId}`);
    console.log(`👤 Cliente: ${orderData.customerName} (${orderData.customerEmail})`);
    console.log(`���� Telefono: ${orderData.customerPhone}`);
    console.log(`📍 Indirizzo: ${orderData.customerAddress}, ${orderData.customerNumber}`);
    if (orderData.customerIntercom) console.log(`🔔 Citofono: ${orderData.customerIntercom}`);
    console.log(`🛍️ Prodotti:\n${itemsList}`);
    console.log(`💰 Totale: €${totalAmount}`);
    if (orderData.deliveryInstructions) console.log(`📦 Istruzioni: ${orderData.deliveryInstructions}`);
    if (orderData.notes) console.log(`📝 Note: ${orderData.notes}`);
    console.log(`📅 Data: ${new Date().toLocaleString('it-IT')}`);
    console.log(`✅ Netlify Form Submitted: ${success}`);
    console.log('================================');

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: true,
        orderId: orderId,
        netlifyFormSubmitted: success,
        message: 'Ordine inviato con successo! Riceverai una notifica email.',
        customerName: orderData.customerName,
        totalAmount: `€${totalAmount}`
      })
    };

  } catch (error) {
    console.error('❌ Errore invio ordine:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: false,
        message: 'Errore durante l\'invio dell\'ordine',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    };
  }
};