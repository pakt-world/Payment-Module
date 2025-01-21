/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import {loadStripeOnramp} from '@stripe/crypto';
import '@stripe/stripe-js';
import { useState } from 'react';

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { CryptoElements, OnrampElement } from './context';
import { StripeModalProps } from './type';

// const LOADING_STATE = "loading";
// const ERROR_STATE = "error";

const StripePaymentModal = ({  }:StripeModalProps) => {
  const [clientSecret, setClientSecret] = useState<string>("");
  const stripeOnrampPromise = loadStripeOnramp("pk_test_qblFNYngBkEdjEZ16jxxoWSM");

  // if 
  
  return(
    <CryptoElements stripeOnramp={stripeOnrampPromise}>
      <OnrampElement clientSecret={clientSecret} />
    </CryptoElements>
  )
}


export default StripePaymentModal;
