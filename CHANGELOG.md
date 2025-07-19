# Changelog

## Storia dello sviluppo e dei fix principali

### Inizio progetto

- **838ec81** Initial commit: creazione repository e struttura base.
- **23002f5/fff976b** Avvio progetto React con Vite, prime pagine e componenti base.

### Prime funzionalità e UI

- Implementazione delle macro-categorie, pagine prodotto, carrello, checkout e routing con Wouter.
- Aggiunta persistenza carrello con localStorage e gestione stato con Context API.
- UI mobile-first, componenti riutilizzabili, badge dinamici, selettori quantità/varietà, form checkout.

### Integrazione build e deploy

- **2461feb/a42b9d1/c8a453c** Setup GitHub Actions per build/test automatici.
- **65eb142/86decbe/382f2bf** Configurazione deploy su GitHub Pages.
- Fix vari su configurazione base path e asset per deploy statico.

### Passaggio a Netlify e fix deploy

- **4caef1b** Fix path index.html in Vite config per build Netlify.
- **cb0268f/0639eb5** Fix vite.config.ts e output build in client/dist.
- **71fe75a** Fix base path per asset su Netlify.
- Creazione file `netlify.toml` per configurare build e publish directory.
- Azzeramento di client/vite.config.ts per evitare conflitti.
- Correzione import vite.config in server/vite.ts.
- Fix allowedHosts in opzioni server Vite.

### Prompt e troubleshooting AI

- Diagnosi e fix errori Netlify: "Could not resolve entry module 'index.html'", "Deploy directory 'client/dist' does not exist", pagina bianca dopo deploy.
- Aggiornamento base path in vite.config.ts da "/shoppinglistmanager/" a "/" per deploy root.
- Prompt e risposte AI su ogni errore, con spiegazione dettagliata dei fix e delle cause.

### Stato attuale

- Build e deploy Netlify funzionanti.
- App responsive, con tutte le funzionalità richieste da prompt iniziale.
- Changelog aggiornato con storia completa dei fix e delle scelte tecniche.

---

Questo changelog riassume la storia dei commit, i prompt AI e tutti i fix principali che hanno portato l'app allo stato attuale.
