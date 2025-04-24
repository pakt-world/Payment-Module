/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import React, { useMemo } from 'react';
import {loadStripeOnramp} from '@stripe/crypto';

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { OnRampElementProps, OnRampProps, StripeContextProps } from './type';
import { IAny } from 'types';
import { OnrampSession, OnrampUIEventMap } from '@stripe/crypto';
import { Spinner } from '../../../components/common';

const FINISHED_PAYMENT = "fulfillment_complete";
const UIReady =  "initialized";

const LISTER_ON_READY = "onramp_ui_loaded";
const LISTER_ON_CHANGE = "onramp_session_updated";

// ReactContext to simplify access of StripeOnramp object
const CryptoElementsContext = React.createContext<OnRampProps>({ onramp: null });

const CryptoElementsComp = ({
  publicKey,
  children,
}:StripeContextProps) => {
  const stripeOnramp = useMemo(()=>loadStripeOnramp(publicKey),[publicKey]);
  const [ctx, setContext] = React.useState<OnRampProps>(() => ({ onramp: null}));

  React.useEffect(() => {
    let isMounted = true;

    Promise.resolve(stripeOnramp).then((onramp) => {
      if (onramp && isMounted) {
        setContext((ctx) => (ctx.onramp ? ctx : { onramp }));
      }
    });

    return () => {
      isMounted = false;
    };
  }, [stripeOnramp]);

  return (
    <CryptoElementsContext.Provider value={ctx}>
      {children}
    </CryptoElementsContext.Provider>
  );
};

// React hook to get StripeOnramp from context
const useStripeOnramp = () => {
  const context = React.useContext<OnRampProps>(CryptoElementsContext);
  return context?.onramp;
};

// React element to render Onramp UI
const useOnrampSessionListener = (
  type: keyof OnrampUIEventMap,
  session:OnrampSession,
  callback: (data:IAny) => void
) => {
  React.useEffect(() => {
    if (session && callback) {
      const listener = (e:IAny) => callback(e.payload);
      session.addEventListener(type, listener);
      return () => {
        session.removeEventListener(type, listener);
      };
    }
    return () => {};
  }, [session, callback, type]);
};

// React element to render Onramp UI
const OnrampElement = ({
  clientSecret,
  appearance,
  onChange,
  isLoading,
  ...props
}: OnRampElementProps) => {
  const stripeOnramp = useStripeOnramp();
  const onrampElementRef = React.useRef<HTMLDivElement>(null);
  const [session, setSession] = React.useState<OnrampSession>();
  const [isReady, SetIsReady] = React.useState(false);
  
  React.useEffect(() => {
    const containerRef = onrampElementRef.current;
    if (containerRef && !isReady) {
      containerRef.innerHTML = '';

      if (clientSecret && stripeOnramp) {
        setSession( 
          stripeOnramp
            .createSession({
              clientSecret,
              appearance,
            })
            .mount(containerRef)
        )
      }
    }
  }, [appearance, clientSecret, stripeOnramp]);

  const onUIReady = ({ session }:{ session:{ status: string }}) => {
    if (session.status === UIReady && !isReady){
      SetIsReady(true);
    }
  }

  useOnrampSessionListener(LISTER_ON_READY, session as OnrampSession, onUIReady);
  useOnrampSessionListener(LISTER_ON_CHANGE, session as OnrampSession, onChange);

  return (
  <>
    {(!isReady || isLoading)&& <Spinner size={30} className="pam-text-white" />}
    <div {...props} ref={onrampElementRef}></div>
  </>
  );
};

const CryptoElements = React.memo(CryptoElementsComp);
// const OnrampElement = React.memo(OnrampElementComp);

export {
  CryptoElements,
  useStripeOnramp,
  OnrampElement,
  FINISHED_PAYMENT,
}
