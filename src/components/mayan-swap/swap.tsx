import { useEffect } from "react";
import { useConfig } from 'context/config-context';
import { MayanWidgetProps, SetReadyProps } from "./types";

declare global {
  interface Window {
    MayanSwap?: {
      init: (elementId: string, config: object) => void;
    };
  }
}

const MayanSwapWidget = ({ rpcs, sourceChains, destinationChains, tokensFrom, tokensTo, setReady }: MayanWidgetProps & SetReadyProps) => {
  const { mayanConfig } = useConfig();
  
  console.log("===>mayan-config", tokensFrom, tokensTo);
  
  useEffect(() => {
    // Function to load the script dynamically
    const script = document.createElement("script");
    script.src = "https://cdn.mayan.finance/widget_ultimate-0-4-5.js";
    script.integrity = "sha256-Dem40VAlLsczlbgJyd9U20HCZiihA1UFQy96wdDqVYQ=";
    script.crossOrigin = "anonymous";
    script.async = true;

    script.onload = () => {
      // console.log("onlaoded--->", window.MayanSwap)
      setReady();
      if (window.MayanSwap) {
        const config = {
          appIdentity: {
            name: mayanConfig.appName,
            icon: mayanConfig.appIcon, // should be relative address
            uri: mayanConfig.appUrl,
          },
          rpcs: {...rpcs},
          sourceChains: [...sourceChains],
          destinationChains: [...destinationChains],
          setDefaultToken: true,
          tokens: {
            from: tokensFrom,
            to: tokensTo
          },
          tokenAmountInput:  100,
          defaultGasDrop: {
            solana: 0.04,
            avalanche: 0.005,
          },
          destinationWallets: {
            avalanche: "0x332e8c5c835dB218E8a0f31a4c45b1bF93F3471E"
          },
          colors: {
            mainBox: mayanConfig.colors?.background || "#ffffff",
          },
          // referrerAddress: 'mysolanawallet'
        };

        window.MayanSwap.init("swap_widget", config);

        // Delay execution to allow widget to fully load
        setTimeout(() => {
          injectValue("100");
        }, 1000);
      }
    };

    document.body.appendChild(script);

    // Cleanup script when component unmounts
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const injectValue = (value: string) => {
    const widgetContainer = document.getElementById("swap_widget");
    if (!widgetContainer) return;

    // Find the input field inside the widget
    const parentContainer = widgetContainer.querySelector("#MAYAN_SWAP_PV_ROOT") as HTMLInputElement;
    console.log("ii", parentContainer);
    if (parentContainer){
      const newDiv = document.createElement("div");
      newDiv.textContent = "Injected Content Here";
      newDiv.style.padding = "10px";
      newDiv.style.background = "#f0f0f0";
      newDiv.style.borderRadius = "5px";
      newDiv.style.marginTop = "10px";
      // parentContainer.appendChild(newDiv);
      const buttonDiv = parentContainer.querySelector(".MuiBox-root css-jhjyr2") as HTMLInputElement;
      // const buttonDiv = parentContainer.getElementsByClassName("MuiBox-root css-jhjyr2") as HTMLInputElement;
      buttonDiv.insertAdjacentElement("afterend", newDiv);
    }
  };
  
  return <div id="swap_widget" />;
};

export default MayanSwapWidget;
