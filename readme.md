# @pakt/payment-module

This package provides React components for handling both fiat and cryptocurrency payments within Pakt applications. It integrates with Stripe for fiat payments and Wagmi v2 for crypto payments.

## Features

*   **Fiat Payments:** Uses Stripe Elements for secure credit card processing and onramp.
*   **Crypto Payments:** Integrates with Wagmi v2 for connecting wallets and initiating transactions.

## Installation
```bash
yarn add @pakt/payment-module
# or
npm install @pakt/payment-module
# or
bun add @pakt/payment-module
```

## Setup

**Important:** You need to import the module's stylesheet for components to render correctly. Import it in your main application entry point (e.g., `main.tsx` or `App.tsx`):

```typescript
import '@pakt/payment-module/dist/styles.css';
```

```typescript
import React from 'react';
import { ConfigContextType } from '@pakt/payment-module';

import { createConfig, http } from 'wagmi'; // Import Wagmi config setup
import { mainnet, sepolia } from 'wagmi/chains'; // Import desired chains
import { injected } from 'wagmi/connectors'; // Import desired connectors

// 1. Create your Wagmi config (v2)
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
  // Optional: Customize the theme
  theme: { primaryColor: '#ff0000', ... },
   // crypto configuration is required for crypto payments
  cryptoConfig:{
    wagmiConfig: wagmiConfig,
  },
  // stripe configuration is required for fiat payments
  stripeConfig: {
    publicKey: 'YOUR_STRIPE_PUBLIC_KEY',
    clientSecret: 'YOUR_STRIPE_CLIENT_SECRET', 
    theme: 'light', // Optional: 'light' or 'dark'
  },
  // Optional: Provide custom error handling
  errorHandler: (errorMsg) => console.error("Payment Module Error:", errorMsg),
};

export default paymentModuleConfig;
```

**Configuration Options (`ConfigContextType`):**

*   `errorHandler?: (errorMessage: string) => void`: Optional callback function to handle errors originating from the module.
*   `theme?: ITheme`: Optional theme object to customize component appearance.
*   `cryptoConfig: { wagmiConfig: Config }`: **Required for crypto payments.** Your Wagmi v2 configuration object.
*   `stripeConfig: { publicKey: string; clientSecret: string; theme?: "light" | "dark"; }`: **Required for fiat payments.** Your Stripe configuration including public key, client secret, and optional theme setting.

## Usage
### Fiat Payments

```typescript
import { FiatPaymentModal } from '@pakt/payment-module';
import { useDisclosure } from '@your-ui-library/hooks'; // Example hook for modal state

function MyFiatPaymentPage() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);

  const handleSuccess = (data: onFinishResponseProps) => {
    console.log('Fiat payment successful:', data);
    // Handle successful payment (e.g., show success message, redirect)
  };

  return (
    <>
      <button onClick={onOpen}>Pay with Card</button>
      <FiatPaymentModal
        isOpen={isOpen}
        closeModal={onClose}
        collectionId="your-collection-id"
        config={paymentModuleConfig}
        chain="ETH"
        onFinishResponse={handleSuccess}
        isLoading={isLoading}
      />
    </>
  );
}
```

### Crypto Payments

```typescript
import { CryptoPaymentModal } from '@pakt/payment-module';
import { useDisclosure } from '@your-ui-library/hooks'; // Example hook for modal state

function MyCryptoPaymentTrigger() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);

  const handleSuccess = (data: onFinishResponseProps) => {
    console.log('Payment successful:', data);
    // Handle successful payment
  };

  return (
    <>
      <button onClick={onOpen}>Pay with Crypto</button>
      <CryptoPaymentModal
        isOpen={isOpen}
        closeModal={onClose}
        config={paymentModuleConfig}
        collectionId="your-collection-id"
        amount={0.1} // Amount to pay in the token's base unit
        coin="ETH" // Token symbol (e.g., "ETH", "USDT")
        depositAddress="0x..." // Recipient wallet address
        chainId={1} // Network chain ID (e.g., 1 for Ethereum mainnet)
        tokenDecimal={18} // Token decimals (e.g., 18 for ETH, 6 for USDT)
        contractAddress="0x..." // Optional: Token contract address for ERC20 tokens
        onSuccessResponse={handleSuccess}
        isLoading={isLoading}
      />
    </>
  );
}
```

Required Props for FiatPaymentModal:
* `isOpen`: boolean - Controls modal visibility
* `closeModal`: () => void - Function to close the modal
* `collectionId`: string - Your collection identifier
* `config`: ConfigContextType - Your payment module configuration
* `chain`: CHAIN_TYPES - Chain type for the payment
* `onFinishResponse`: (data: onFinishResponseProps) => void - Callback for successful payment

Optional Props for FiatPaymentModal:
* `isLoading`: boolean - Loading state

Required Props for CryptoPaymentModal:
* `isOpen`: boolean - Controls modal visibility
* `closeModal`: () => void - Function to close the modal
* `config`: ConfigContextType - Your payment module configuration
* `collectionId`: string - Your collection identifier
* `amount`: number - Amount to pay in the token's base unit
* `coin`: string - Token symbol (e.g., "ETH", "USDT")
* `depositAddress`: string - Recipient wallet address
* `chainId`: number - Network chain ID (e.g., 1 for Ethereum mainnet)
* `tokenDecimal`: number - Token decimals (e.g., 18 for ETH, 6 for USDT)
* `onSuccessResponse`: (data: onFinishResponseProps) => void - Callback for successful payment

Optional Props for CryptoPaymentModal:
* `contractAddress`: string - Token contract address for ERC20 tokens
* `isLoading`: boolean - Loading state

## Configuration

The module requires a configuration object of type `ConfigContextType` that includes:

```typescript
interface ConfigContextType {
  // Required configurations
  cryptoConfig: {
    wagmiConfig: Config; // Your Wagmi v2 configuration
    theme?: "light" | "dark";
    publicKey: string; // Your Pakt public key
  };
  stripeConfig: {
    publicKey: string; // Your Stripe public key
    clientSecret?: string; // Optional: Client secret for payment intent
    theme?: "light" | "dark";
  };
  errorHandler?: (errorMessage: string) => void; // Custom error handler
  theme?: ITheme; // Custom theme object
}
```

## Contributing

Please refer to the `CODE_OF_CONDUCT.md` and `LICENSE` files.

## License

MIT
