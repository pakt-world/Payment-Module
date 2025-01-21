/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import React, { ReactNode } from 'react';

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { OnRampElementProps, OnRampProps, StripeContextProps } from './type';

// ReactContext to simplify access of StripeOnramp object
const CryptoElementsContext = React.createContext<OnRampProps>({ onramp: null });

const CryptoElements = ({
  stripeOnramp,
  children,
}:StripeContextProps) => {
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
const OnrampElement = ({
  clientSecret,
  appearance,
  ...props
}: OnRampElementProps) => {
  const stripeOnramp = useStripeOnramp();
  const onrampElementRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const containerRef = onrampElementRef.current;
    if (containerRef) {
      containerRef.innerHTML = '';

      if (clientSecret && stripeOnramp) {
        stripeOnramp
          .createSession({
            clientSecret,
            appearance,
          })
          .mount(containerRef)
      }
    }
  }, [clientSecret, stripeOnramp]);

  return <div {...props} ref={onrampElementRef}></div>;
};


export {
  CryptoElements,
  useStripeOnramp,
  OnrampElement,
}
