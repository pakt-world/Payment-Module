/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import '@stripe/stripe-js';
import { ReactElement, useCallback, memo } from 'react';

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { CryptoElements, OnrampElement, FINISHED_PAYMENT } from './context';
import { StripeModalProps } from './type';
import Modal from '../../common/modal';
import PaktWrapper from '../../modal-wrapper';
import Logger from '../../../lib/logger';
import { IAny } from '../../../types';
import { useConfig } from '../../../context/config-context';

const StripePaymentModal = ({ collectionId, isOpen, closeModal, onFinishResponse, config, isLoading }:StripeModalProps): ReactElement => {
  Logger.debug("open StripePaymentModal", { collectionId, isOpen, closeModal, onFinishResponse });  
  const { stripeConfig } = useConfig();

  if (!stripeConfig) {
    throw new Error("Stripe config is not found");
  }

  const onChange = useCallback(({ session }: { session: IAny }) => {
    Logger.debug(`OnrampSession is now in ${session.status} state.`, { session });
    if (session.status == FINISHED_PAYMENT){
      const responseP = { status: session.status, txId:session.quote?.blockchain_tx_id }
      Logger.info(`OnrampSession is now complete ${session.status}`, { responseP });
      onFinishResponse(responseP);
      closeModal();
    }
  }, [closeModal]);

  return (
    <Modal 
      isOpen={isOpen}
      closeModal={closeModal}
      disableClickOutside
    >
      <PaktWrapper showPakt={true}>
        <div className="pam:mx-auto pam:flex pam:w-full pam:flex-col pam:gap-4 pam:sm:pam:max-w-[400px] pam:sm:pam:min-h-[600px] pam:border-white">
            <CryptoElements publicKey={stripeConfig.publicKey}>
                <OnrampElement 
                  clientSecret={ stripeConfig.clientSecret}
                  appearance={{ theme: stripeConfig.theme || "dark" }}
                  onChange={onChange}
                  config={config}
                  isLoading={isLoading}
                />
            </CryptoElements>
        </div>
      </PaktWrapper>
    </Modal>
  )
}

export default memo(StripePaymentModal);
