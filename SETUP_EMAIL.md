# Setup Email per Fresco App

## Problema Attuale
Gli ordini vengono salvati e loggati correttamente, ma le email non arrivano a `gae4it@gmail.com`.

## Soluzione Immediata: Formspree

### Passo 1: Registrati su Formspree
1. Vai su https://formspree.io
2. Registrati con un account gratuito
3. Crea un nuovo form
4. Imposta l'email di destinazione: `gae4it@gmail.com`
5. Copia l'endpoint del form (es: `https://formspree.io/f/xpwagqpv`)

### Passo 2: Aggiorna la Funzione
Nel file `netlify/functions/email-via-webhook.ts`, sostituisci:
```typescript
const formspreeResponse = await fetch('https://formspree.io/f/xpwagqpv', {
```

Con il tuo endpoint Formspree reale.

### Passo 3: Test
1. Fai il deploy su Netlify
2. Prova a fare un ordine
3. Controlla la tua email `gae4it@gmail.com`

## Soluzione Alternativa: EmailJS

### Passo 1: Registrati su EmailJS
1. Vai su https://www.emailjs.com
2. Registrati con un account gratuito
3. Crea un servizio email
4. Crea un template per gli ordini
5. Copia le chiavi API

### Passo 2: Configura le Variabili
Nel Netlify Dashboard, aggiungi le variabili d'ambiente:
- `EMAILJS_SERVICE_ID`
- `EMAILJS_TEMPLATE_ID`
- `EMAILJS_USER_ID`

## Monitoraggio Ordini

### Netlify Dashboard
1. Vai su https://app.netlify.com
2. Seleziona il sito frescoapp
3. Functions > email-via-webhook > View logs

Ogni ordine viene loggato con:
- ID ordine univoco
- Dati completi del cliente
- Lista prodotti
- Totale ordine
- Timestamp

### Netlify Forms (Backup)
1. Dashboard > Forms > order-notification
2. Qui trovi tutti gli ordini come backup

## Status Attuale

✅ **Funziona:**
- Form di checkout
- Validazione dati
- Salvataggio ordini
- Logging completo
- Pagina di conferma

❌ **Da Sistemare:**
- Invio email effettivo

## Prossimi Passi

1. **Immediato**: Configura Formspree per ricevere email
2. **Breve termine**: Aggiungi email di conferma al cliente
3. **Lungo termine**: Integra servizio email professionale (SendGrid, Mailgun)

## Test Rapido

Per testare se gli ordini arrivano:
1. Vai su https://frescoapp.netlify.app/checkout
2. Compila il form con dati di test
3. Controlla i log su Netlify Dashboard
4. Cerca nel log il messaggio "COMPLETE ORDER DETAILS"

Tutti i dettagli dell'ordine sono loggati, quindi nessun ordine va perso!