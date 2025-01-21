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
import Modal from 'components/common/modal';

// const LOADING_STATE = "loading";
// const ERROR_STATE = "error";

const StripePaymentModal = ({ isOpen, closeModal, publicKey, amount, chain, coin, depositAddress, secretKey }:StripeModalProps) => {
  const [clientSecret, setClientSecret] = useState<string>(secretKey);
  const stripeOnrampPromise = loadStripeOnramp(publicKey);
  
  return(
    <Modal 
      isOpen={isOpen}
      closeModal={closeModal}
      disableClickOutside
    >
      <CryptoElements stripeOnramp={stripeOnrampPromise}>
        <OnrampElement clientSecret={clientSecret} />
      </CryptoElements>
    </Modal>
  )
}


export default StripePaymentModal;
