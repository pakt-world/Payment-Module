# @pakt/payment-module

This package provides React components for handling both fiat and cryptocurrency payments within Pakt applications. It integrates with Stripe for fiat payments and Wagmi for crypto payments.

## Features

*   **Fiat Payments:** Uses Stripe Elements for secure credit card processing.
*   **Crypto Payments:** Integrates with Wagmi for connecting wallets and initiating transactions. Includes a payment modal.
*   **Configurable:** Requires a configuration provider to set up API details, theming, and integrations.
*   **Theming:** Supports custom themes to match your application's style.
*   **Built with:** React, TypeScript, Tailwind CSS, Radix UI, Zustand, TanStack Query, Wagmi.

## Installation

```bash
yarn add @pakt/payment-module
# or
npm install @pakt/payment-module
# or
bun add @pakt/payment-module
```

## Setup

Wrap your application or the relevant part of your component tree with the `ConfigProvider`. This provider initializes necessary contexts, libraries (like React Query and Wagmi if not provided externally), and global settings.

```typescript
import React from 'react';
import { ConfigProvider, ConfigContextType } from '@pakt/payment-module';
import { QueryClient } from '@tanstack/react-query'; // Optional: Provide your own client
import { createConfig, http } from 'wagmi'; // Import Wagmi config setup
import { mainnet, sepolia } from 'wagmi/chains'; // Import desired chains
import { injected } from 'wagmi/connectors'; // Import desired connectors

// 1. Create your Wagmi config
const wagmiConfig = createConfig({
  chains: [mainnet, sepolia],
  connectors: [injected()],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});

// 2. Define your Pakt Payment Module config
const paymentModuleConfig: ConfigContextType = {
  baseURL: 'YOUR_API_BASE_URL', // Your backend API base URL
  token: 'YOUR_AUTH_TOKEN', // Optional: Authentication token if needed for your API calls
  timezone: 'UTC', // User's timezone or a default
  // Optional: Provide your own React Query client
  // queryClient: new QueryClient(),
  // Optional: Provide custom error handling
  // errorHandler: (errorMsg) => console.error("Payment Module Error:", errorMsg),
  // Optional: Customize the theme
  // theme: { primaryColor: '#ff0000', ... },
  // Wagmi configuration is required
  wagmiConfig: wagmiConfig,
  // Stripe configuration is required
  stripeConfig: {
    publicKey: 'YOUR_STRIPE_PUBLIC_KEY',
    theme: 'light', // Optional: 'light' or 'dark'
  },
  // Optional: Add any other custom config your app needs via the context
  // customConfigKey: 'customValue',
};

function App() {
  return (
    <ConfigProvider config={paymentModuleConfig}>
      {/* Your application components */}
      {/* <MyPaymentComponent /> */}
    </ConfigProvider>
  );
}

export default App;
```

**Configuration Options (`ConfigContextType`):**

*   `axiosInstance?: AxiosInstance`: Provide a pre-configured Axios instance.
*   `baseURL?: string`: Base URL for internal API requests made by the module.
*   `queryClient?: QueryClient`: Provide a TanStack Query client instance. If not provided, the module creates its own.
*   `wagmiProvider?: WagmiProviderProps`: Provide Wagmi provider props. If not provided, the module wraps children with `<WagmiProvider>`.
*   `publicKey?: string`: Optional public key (purpose might be specific to Pakt API).
*   `clientId?: string`: Optional client ID (purpose might be specific to Pakt API).
*   `token?: string`: Optional Bearer token for authenticating internal API calls.
*   `timezone: string`: **Required.** User's timezone string (e.g., 'America/New_York', 'UTC').
*   `errorHandler?: (errorMessage: string) => void`: Optional callback function to handle errors originating from the module.
*   `theme?: ITheme`: Optional theme object to customize component appearance. See `src/styles/default-theme.ts` for structure.
*   `wagmiConfig: Config`: **Required.** Your Wagmi configuration object.
*   `stripeConfig: { publicKey: string; theme?: "light" | "dark"; }`: **Required.** Your Stripe public key and optional theme setting for Stripe Elements.

## Usage

Once the `ConfigProvider` is set up, you can use the exported components:

### Fiat Payments

```typescript
import { FiatPayment } from '@pakt/payment-module';

function MyFiatPaymentPage() {
  const handleSuccess = (paymentIntent) => {
    console.log('Fiat payment successful:', paymentIntent);
    // Handle successful payment (e.g., show success message, redirect)
  };

  const handleError = (error) => {
    console.error('Fiat payment error:', error);
    // Handle payment error
  };

  return (
    <FiatPayment
      clientSecret="pi_xxxxxxxx_secret_xxxxxxxx" // The client secret from your backend payment intent creation
      onSuccess={handleSuccess}
      onError={handleError}
      // Add other props as needed based on the component's definition
    />
  );
}
```
*Note: You need a backend endpoint to create a Stripe Payment Intent and return its `client_secret`.*

### Crypto Payments

```typescript
import { CryptoPaymentModal } from '@pakt/payment-module';
import { useDisclosure } from '@your-ui-library/hooks'; // Example hook for modal state

function MyCryptoPaymentTrigger() {
  const { isOpen, onOpen, onClose } = useDisclosure(); // Or manage modal state differently

  return (
    <>
      <button onClick={onOpen}>Pay with Crypto</button>
      <CryptoPaymentModal
        isOpen={isOpen}
        onClose={onClose}
        // Add other required props for the crypto payment modal
        // (e.g., amount, currency, recipient address, onSuccess, onError)
        // Check the component definition in 'src/components/crypto-payment' for details.
      />
    </>
  );
}
```
*Note: The exact props for `CryptoPaymentModal` need to be checked in the source code (`src/components/crypto-payment`).*

### Accessing Config

You can access the provided configuration within components wrapped by `ConfigProvider`:

```typescript
import { useConfig } from '@pakt/payment-module';

function MyComponent() {
  const config = useConfig();

  // Use config.baseURL, config.token, config.customConfigKey, etc.
  console.log('API Base URL:', config.baseURL);

  return <div>My Component using config</div>;
}
```

## Development

*   **Install Dependencies:** `yarn install` or `npm install` or `bun install`
*   **Lint:** `yarn lint`
*   **Format:** `yarn format`
*   **Build:** `yarn build`
*   **Run Development Server:** `yarn dev` (uses Rollup with watch mode and potentially live reload)
*   **Test:** `yarn test` (Note: Jest setup might need configuration)

## Contributing

Please refer to the `CODE_OF_CONDUCT.md` and `LICENSE` files.

## License

MIT
