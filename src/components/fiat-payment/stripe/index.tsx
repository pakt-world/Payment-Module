/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import {loadStripeOnramp} from '@stripe/crypto';
import '@stripe/stripe-js';
import { ReactElement, useCallback, memo, useMemo, useState } from 'react';

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { CryptoElements, OnrampElement, FINISHED_PAYMENT } from './context';
import { StripeModalProps } from './type';
import Modal from 'components/common/modal';
import PaktWrapper from 'components/modal-wrapper';
import Logger from 'lib/logger';
import { IAny } from 'types';
import { usePostStripeInitiate } from 'lib/api/payment';
import { Spinner } from 'components/common';

const StripePaymentModal = ({ collectionId, isOpen, closeModal, publicKey, theme, onFinishResponse }:StripeModalProps): ReactElement => {
  Logger.info("open StripePaymentModal");
  // const [loading,setLoading] = useState<boolean>(true);
  const [clientSecret, setClientSecret] = useState("");

  const stripeMutate = usePostStripeInitiate();

  const stripeOnrampPromise = loadStripeOnramp(publicKey);

  const onChange = useCallback(({ session }: { session: IAny }) => {
    Logger.debug(`OnrampSession is now in ${session.status} state.`, { session });
    if (session.status == FINISHED_PAYMENT){
      const responseP = { status: session.status, txId:session.quote?.blockchain_tx_id }
      Logger.info(`OnrampSession is now complete ${session.status}`, { responseP });
      onFinishResponse(responseP);
      closeModal();
    }
  }, [closeModal]);

  useMemo(()=>{
  if (isOpen){
    stripeMutate.mutate({
      collectionId
    },{
      onSuccess:(data)=>{
        setClientSecret(data.client_secret);
      }
    })
  }
  },[collectionId, isOpen]);
  
  return(
    <Modal 
      isOpen={isOpen}
      closeModal={closeModal}
      disableClickOutside
    >
      <PaktWrapper showPakt={true}>
        <div className="pam-mx-auto pam-flex pam-w-full pam-flex-col pam-gap-4 sm:pam-max-w-[400px] sm:pam-min-h-[600px] pam-border-white">
            <CryptoElements stripeOnramp={stripeOnrampPromise}>
                <OnrampElement 
                  clientSecret={clientSecret}
                  appearance={{ theme: theme || "dark" }}
                  onChange={onChange}
                  isLoading={stripeMutate.isPending}
                />
            </CryptoElements>
        </div>
      </PaktWrapper>
    </Modal>
  )
}

export default memo(StripePaymentModal);
