# 📧 Setup Email Netlify Forms - SOLUZIONE DEFINITIVA

## 🎯 Obiettivo
Ricevere email a `gae4it@gmail.com` ogni volta che arriva un ordine.

## ✅ Soluzione: Netlify Forms + Email Notifications

### Passo 1: Configura le Notifiche Email su Netlify

1. **Vai su Netlify Dashboard**
   - https://app.netlify.com
   - Seleziona il sito `frescoapp`

2. **Vai su Forms**
   - Sidebar > Forms
   - Dovresti vedere il form `order-notification`

3. **Configura le Notifiche Email**
   - Clicca sul form `order-notification`
   - Vai su "Settings & Usage"
   - Clicca "Add notification"
   - Seleziona "Email notification"
   - Inserisci: `gae4it@gmail.com`
   - Salva

### Passo 2: Personalizza il Template Email (Opzionale)

Puoi personalizzare il template email:
- Subject: `🛒 Nuovo ordine da {{customer-name}}`
- Body: Include tutti i campi del form

### Passo 3: Test

1. Vai su https://frescoapp.netlify.app/checkout
2. Compila il form con dati di test
3. Invia l'ordine
4. Controlla `gae4it@gmail.com` (anche spam)

## 🔍 Monitoraggio

### Netlify Dashboard
- **Forms**: Vedi tutti gli ordini ricevuti
- **Functions**: Vedi i log dettagliati

### Email che Riceverai
```
🛒 Nuovo ordine da Mario Rossi

Order ID: ORD-1234567890
Cliente: Mario Rossi (mario@email.com)
Telefono: 1234567890
Indirizzo: Via Roma 123, 45
Prodotti:
- Pomodori (Quantità: 2) - €3.50
- Pane (Quantità: 1) - €1.20
Totale: €8.20
Data: 15/12/2023, 14:30:25
```

## 🚀 Vantaggi di Questa Soluzione

✅ **Completamente gratuita**
✅ **Zero configurazione API**
✅ **Affidabile al 100%**
✅ **Backup automatico** (tutti gli ordini salvati su Netlify)
✅ **Dashboard per vedere tutti gli ordini**
✅ **Notifiche email immediate**

## 🔧 Troubleshooting

### Se non ricevi email:
1. Controlla la cartella spam
2. Verifica che la notifica sia configurata correttamente
3. Controlla i log delle funzioni Netlify

### Se il form non funziona:
1. Controlla che il form HTML sia presente in `index.html`
2. Verifica che il nome del form sia `order-notification`
3. Controlla i log delle funzioni

## 📊 Alternative Gratuite (se Netlify Forms non funziona)

1. **Formspree** (100 submission/mese gratis)
2. **Getform** (50 submission/mese gratis)
3. **FormSubmit** (illimitato, ma meno affidabile)

Ma **Netlify Forms è la scelta migliore** per il tuo caso!