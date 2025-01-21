/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import {loadStripeOnramp} from '@stripe/crypto';
import '@stripe/stripe-js';
import { ReactElement, useState } from 'react';

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { CryptoElements, OnrampElement } from './context';
import { StripeModalProps } from './type';
import Modal from 'components/common/modal';

// const LOADING_STATE = "loading";
// const ERROR_STATE = "error";

const StripePaymentModal = ({ isOpen, closeModal, publicKey, amount, chain, coin, depositAddress, secretKey }:StripeModalProps): ReactElement => {
  console.log("open StripePaymentModal");
  // const [clientSecret, setClientSecret] = useState<string>(secretKey);
  const stripeOnrampPromise = loadStripeOnramp(publicKey);
  
  return(
    <Modal 
      isOpen={isOpen}
      closeModal={closeModal}
      disableClickOutside
    >
      <div className="pam-mx-auto pam-flex pam-w-full pam-flex-col pam-gap-4 sm:pam-max-w-[400px]">
        <CryptoElements stripeOnramp={stripeOnrampPromise}>
          <OnrampElement clientSecret={secretKey} />
        </CryptoElements>
      </div>
    </Modal>
  )
}


export default StripePaymentModal;
