# Fresco App

Fresco App is a modern shopping list manager designed to help users organize, track, and manage their grocery shopping efficiently. Built with React, Vite, and TypeScript, it features a clean UI, mobile-friendly navigation, and seamless integration with backend services for order management and notifications.

## Features

- **Product Catalog**: Browse and search products by category.
- **Shopping Cart**: Add, remove, and update items in your cart.
- **Order Management**: Place orders and receive confirmation.
- **Responsive Design**: Optimized for both desktop and mobile devices.
- **Email Notifications**: Receive order confirmations via email (Netlify Functions integration).
- **Modern UI Components**: Built with reusable and accessible UI components.

## Project Structure

```
client/           # Frontend React app
  src/
    components/   # UI and feature components
    contexts/     # React context providers (e.g., CartContext)
    data/         # Static data (e.g., products)
    hooks/        # Custom React hooks
    lib/          # Utilities and query clients
    pages/        # Page components (Home, Cart, Checkout, etc.)
netlify/functions # Serverless functions for email and order handling
server/           # Backend server (if used)
shared/           # Shared types and schema
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/gae4it/frescoapp.git
   cd shoppinglistmanager
   ```
2. Install dependencies for the client:
   ```sh
   cd client
   npm install
   # or
   yarn install
   ```
3. (Optional) Install server or Netlify function dependencies as needed.

### Running the App

To start the development server:

```sh
cd client
npm run dev
# or
yarn dev
```

The app will be available at `http://localhost:5173` (or as specified by Vite).

### Building for Production

```sh
cd client
npm run build
# or
yarn build
```

### Deploying

- The app can be deployed to Netlify or any static hosting provider.
- Netlify Functions are used for email and order processing.

## Contributing

Contributions are welcome! Please open issues or submit pull requests for improvements and bug fixes.

## License

This project is licensed under the MIT License.

---

For more details, see the documentation files in the repository.
