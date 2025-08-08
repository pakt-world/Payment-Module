# @pakt/payment-module

This package provides React components for handling both fiat and cryptocurrency payments within Pakt applications. It integrates with Stripe for fiat payments and Wagmi v2 for crypto payments.

## Features

*   **Unified Payment System:** New ref-based API for seamless payment method selection
*   **Fiat Payments:** Uses Stripe Elements for secure credit card processing and onramp.
*   **Crypto Payments:** Integrates with Wagmi v2 for connecting wallets and initiating transactions.
*   **Flexible Configuration:** Support for enabling/disabling specific payment methods

## Installation
```bash
yarn add @pakt/payment-module
# or
npm install @pakt/payment-module
# or
bun add @pakt/payment-module
```

## Setup

**Note:** Styles are automatically included when you import components from this module. No manual CSS import is required! ✨

```typescript
import React from 'react';
import { ConfigContextType, ITheme } from '@pakt/payment-module';

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
  theme: { primary: '#ff0000', ... },
  // crypto configuration is optional for crypto payments
  cryptoConfig: {
    wagmiConfig: wagmiConfig,
  },
  // stripe configuration is optional for fiat payments
  stripeConfig: {
    publicKey: 'YOUR_STRIPE_PUBLIC_KEY',
    clientSecret: 'YOUR_STRIPE_CLIENT_SECRET', 
    theme: 'light', // Optional: 'light' or 'dark'
  },
  // Required: Pakt configuration
  paktConfig: {
    baseUrl: 'YOUR_PAKT_API_BASE_URL',
    verbose: true, // Optional: Enable debug logging
  },
  // Optional: Provide custom error handling
  errorHandler: (errorMsg) => console.error("Payment Module Error:", errorMsg),
};

export default paymentModuleConfig;
```

**Configuration Options (`ConfigContextType`):**

*   `errorHandler?: (errorMessage: string) => void`: Optional callback function to handle errors originating from the module.
*   `theme?: ITheme`: Optional theme object to customize component appearance.
*   `cryptoConfig?: { wagmiConfig: Config }`: Optional. Required for crypto payments. Your Wagmi v2 configuration object.
*   `stripeConfig?: { publicKey: string; clientSecret: string; theme?: "light" | "dark"; }`: Optional. Required for fiat payments. Your Stripe configuration including public key, client secret, and optional theme setting.
*   `paktConfig: { baseUrl: string; verbose?: boolean }`: **Required.** Pakt API configuration including base URL and optional verbose logging.

## Usage

> **✨ New in v0.2.1:** We've introduced a unified payment system with a ref-based API that simplifies payment integration. This is now the recommended approach for new implementations.

### Unified Payment System (Recommended)

The new unified payment system provides a single component that can handle both crypto and fiat payments with an intuitive ref-based API.

```typescript
import React, { useRef } from 'react';
import PaktPaymentModule, { 
  PaymentSystemRef, 
  ConfigContextType, 
  onFinishResponseProps,
  PaymentData 
} from '@pakt/payment-module';

function MyPaymentComponent() {
  const paymentRef = useRef<PaymentSystemRef>(null);

  const handlePaymentSuccess = (response: onFinishResponseProps) => {
    console.log('Payment successful:', response);
    // Handle successful payment (e.g., show success message, redirect)
  };

  const handlePaymentError = (response: onFinishResponseProps) => {
    console.error('Payment failed:', response);
    // Handle payment error
  };

  const handleStartPayment = () => {
    // Start payment with automatic method selection
    paymentRef.current?.startPayment({
      amount: 10.5,
      coin: "USDC",
      description: "Service payment",
      isDirect: true,
      collectionType: "service",
      owner: "user-id",
      name: "Service Name"
    });
  };

  const handleStartCryptoPayment = () => {
    // Start crypto payment directly
    paymentRef.current?.startCryptoPayment({
      amount: 10.5,
      coin: "USDC", 
      description: "Crypto payment",
      isDirect: true,
      collectionType: "service",
      owner: "user-id",
      name: "Service Name"
    });
  };

  const handleStartFiatPayment = () => {
    // Start fiat payment directly
    paymentRef.current?.startFiatPayment({
      amount: 10.5,
      coin: "USD",
      description: "Card payment", 
      isDirect: false,
      collectionType: "service",
      owner: "user-id",
      name: "Service Name"
    });
  };

  return (
    <div>
      <button onClick={handleStartPayment}>
        Pay Now
      </button>
      <button onClick={handleStartCryptoPayment}>
        Pay with Crypto
      </button>
      <button onClick={handleStartFiatPayment}>
        Pay with Card
      </button>
      
      <PaktPaymentModule
        ref={paymentRef}
        config={paymentModuleConfig}
        onPaymentSuccess={handlePaymentSuccess}
        onPaymentError={handlePaymentError}
        enabledMethods={["crypto", "fiat"]} // Optional: specify which methods to enable
        isLoading={false}
      />
    </div>
  );
}
```

**PaktPaymentModule Props:**
* `config`: ConfigContextType - Your payment module configuration
* `onPaymentSuccess?`: (response: onFinishResponseProps) => void - Success callback
* `onPaymentError?`: (response: onFinishResponseProps) => void - Error callback  
* `enabledMethods?`: ("crypto" | "fiat")[] - Array of enabled payment methods (default: ["crypto", "fiat"])
* `isLoading?`: boolean - Loading state

**PaymentSystemRef Methods:**
* `startPayment(data: PaymentData)`: Start payment with automatic method selection
* `startCryptoPayment(data: PaymentData)`: Start crypto payment directly
* `startFiatPayment(data: PaymentData)`: Start fiat payment directly
* `close()`: Close any open payment modals

**PaymentData Interface:**
```typescript
interface PaymentData {
  amount: number;          // Payment amount
  coin: string;           // Currency/token symbol (e.g., "USDC", "USD")
  description: string;    // Payment description
  isDirect: boolean;      // Whether this is a direct payment
  collectionType: string; // Type of collection (e.g., "service", "tip")
  owner: string;          // Owner/recipient ID
  name: string;           // Collection/service name
}
```

### Individual Payment Components (Legacy)

For backward compatibility, you can still use the individual payment modal components:

#### Fiat Payments

```typescript
import { FiatPaymentModal, ConfigContextType, onFinishResponseProps } from '@pakt/payment-module';
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

#### Crypto Payments

```typescript
import { CryptoPaymentModal, ConfigContextType, onFinishResponseProps } from '@pakt/payment-module';
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
  // Optional configurations (enable features as needed)
  cryptoConfig?: {
    wagmiConfig: Config; // Your Wagmi v2 configuration
    wagmiProvider?: WagmiProviderProps;
    queryClient?: QueryClient;
  };
  stripeConfig?: {
    publicKey: string; // Your Stripe public key
    clientSecret: string; // Client secret for payment intent
    theme?: "light" | "dark";
  };
  // Required configuration
  paktConfig: {
    baseUrl: string; // Pakt API base URL
    verbose?: boolean; // Enable debug logging
  };
  errorHandler?: (errorMessage: string) => void; // Custom error handler
  theme?: ITheme; // Custom theme object
}
```

## Hooks

The package also provides a custom hook for advanced payment operations:

```typescript
import { usePaymentModule, UsePaymentModuleReturn, PaymentResponse } from '@pakt/payment-module';

function MyComponent() {
  const {
    payment,
    loading,
    error,
    initiateCryptoPayment,
    validateCryptoPayment,
    clearError,
    clearPayment
  } = usePaymentModule();

  const handleCryptoPayment = async () => {
    const response = await initiateCryptoPayment({
      // payment data
    });
    
    if (response.status === 'success') {
      // Payment initiated successfully
      const validationResponse = await validateCryptoPayment(collectionId);
      // Handle validation result
    }
  };

  const handleClearError = () => {
    clearError();
  };

  const handleClearPayment = () => {
    clearPayment();
  };

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && (
        <div>
          <p>Error: {error}</p>
          <button onClick={handleClearError}>Clear Error</button>
        </div>
      )}
      <button onClick={handleCryptoPayment}>
        Start Crypto Payment
      </button>
      <button onClick={handleClearPayment}>
        Clear Payment Data
      </button>
    </div>
  );
}
```

**usePaymentModule Return Type:**
```typescript
interface UsePaymentModuleReturn {
  // State
  payment: Payment | null;
  loading: boolean;
  error: string | null;
  
  // Payment Methods
  initiateCryptoPayment: (payload: any) => Promise<PaymentResponse<any>>;
  validateCryptoPayment: (collectionId: string, retries?: number, retryDelay?: number) => Promise<PaymentResponse<any>>;
  
  // Utility Methods
  clearError: () => void;
  clearPayment: () => void;
}
```

## Types Reference

The package exports comprehensive TypeScript types for better development experience:

### Core Types

```typescript
// Configuration interface
interface ConfigContextType {
  cryptoConfig?: {
    wagmiConfig: Config;
    wagmiProvider?: WagmiProviderProps;
    queryClient?: QueryClient;
  };
  stripeConfig?: {
    publicKey: string;
    clientSecret: string;
    theme?: "light" | "dark";
  };
  paktConfig: {
    baseUrl: string;
    verbose?: boolean;
  };
  errorHandler?: (errorMessage: string) => void;
  theme?: ITheme;
}

// Payment data structure
interface PaymentData {
  amount: number;          // Payment amount
  coin: string;           // Currency/token symbol
  description: string;    // Payment description
  isDirect: boolean;      // Whether this is a direct payment
  collectionType: string; // Type of collection
  owner: string;          // Owner/recipient ID
  name: string;           // Collection/service name
}

// Response interface for payment callbacks
interface onFinishResponseProps {
  status: "success" | "error";
  message: string;
  txId: string;
  collectionId?: string;
}

// Theme customization interface
interface ITheme {
  primary?: string;
  secondary?: string;
  info?: string;
  line?: string;
  title?: string;
  body?: string;
  warning?: string;
  success?: string;
  danger?: string;
  magnolia?: string;
  "exhibit-tab-list"?: string;
  "primary-brighter"?: string;
  "refer-border"?: string;
  "btn-primary"?: string;
  "primary-gradient"?: string;
  "modal-radius"?: string;
}
```

### Component Props Types

```typescript
// Main payment module props
interface PaymentSystemProps {
  onPaymentSuccess?: (response: onFinishResponseProps) => void;
  onPaymentError?: (response: onFinishResponseProps) => void;
  enabledMethods?: ("crypto" | "fiat")[];
  isLoading?: boolean;
}

// Payment system ref methods
type PaymentSystemRef = {
  startPayment: (data: PaymentData) => void;
  startCryptoPayment: (data: PaymentData) => void;
  startFiatPayment: (data: PaymentData) => void;
  close: () => void;
};

// Basic modal props (for legacy components)
interface BasicModalProps {
  config: ConfigContextType;
  isOpen: boolean;
  closeModal: () => void;
  collectionId: string;
}
```

### Hook Types

```typescript
// usePaymentModule hook return type
interface UsePaymentModuleReturn {
  payment: Payment | null;
  loading: boolean;
  error: string | null;
  initiateCryptoPayment: (payload: any) => Promise<PaymentResponse<any>>;
  validateCryptoPayment: (collectionId: string, retries?: number, retryDelay?: number) => Promise<PaymentResponse<any>>;
  clearError: () => void;
  clearPayment: () => void;
}

// Payment response type
interface PaymentResponse<T = any> {
  status: 'success' | 'error';
  message: string;
  data: T;
  statusCode: number;
}
```

### Utility Types

```typescript
// Generic any type
type IAny = any;

// Ethereum address type
type I0xAddressType = `0x${string}`;
```

## Quick Start Example

Here's a complete example showing how to use the package with proper TypeScript types:

```typescript
import React, { useRef, useState } from 'react';
import { createConfig, http } from 'wagmi';
import { avalancheFuji } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';

import PaktPaymentModule, {
  PaymentSystemRef,
  ConfigContextType,
  PaymentData,
  onFinishResponseProps,
  usePaymentModule,
  UsePaymentModuleReturn,
  PaymentResponse
} from '@pakt/payment-module';

// Wagmi configuration
const wagmiConfig = createConfig({
  chains: [avalancheFuji],
  connectors: [injected()],
  transports: {
    [avalancheFuji.id]: http(),
  },
});

// Payment module configuration
const config: ConfigContextType = {
  cryptoConfig: {
    wagmiConfig,
  },
  stripeConfig: {
    publicKey: 'pk_test_...',
    clientSecret: 'pi_...',
    theme: 'dark',
  },
  paktConfig: {
    baseUrl: 'https://api.pakt.com/v1',
    verbose: true,
  },
};

function App() {
  const paymentRef = useRef<PaymentSystemRef>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handlePaymentSuccess = (response: onFinishResponseProps) => {
    console.log('Payment successful:', response);
    setIsLoading(false);
  };

  const handlePaymentError = (response: onFinishResponseProps) => {
    console.error('Payment failed:', response);
    setIsLoading(false);
  };

  const startPayment = () => {
    setIsLoading(true);
    const paymentData: PaymentData = {
      amount: 100,
      coin: 'USDC',
      description: 'Service payment',
      isDirect: true,
      collectionType: 'service',
      owner: 'user-123',
      name: 'Premium Service'
    };
    paymentRef.current?.startPayment(paymentData);
  };

  return (
    <div>
      <button onClick={startPayment} disabled={isLoading}>
        {isLoading ? 'Processing...' : 'Pay $100'}
      </button>
      
      <PaktPaymentModule
        ref={paymentRef}
        config={config}
        onPaymentSuccess={handlePaymentSuccess}
        onPaymentError={handlePaymentError}
        enabledMethods={['crypto', 'fiat']}
        isLoading={isLoading}
      />
    </div>
  );
}

export default App;
```

## Changelog

### v0.2.1
- ✨ **New**: Unified `PaktPaymentModule` component with ref-based API
- ✨ **New**: Support for enabling/disabling specific payment methods
- ✨ **New**: `usePaymentModule` hook for advanced payment operations
- ✨ **New**: Comprehensive TypeScript type exports
- 🔧 **Updated**: Configuration structure with optional crypto/stripe configs
- 🔧 **Added**: Required `paktConfig` for API communication
- 📚 **Improved**: Documentation with complete type reference

## Contributing

Please refer to the `CODE_OF_CONDUCT.md` and `LICENSE` files.

## License

MIT
