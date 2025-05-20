import StripePaymentModal from "./stripe-payment"
import { ConfigProvider } from "../../../context/config-context"
import { ReactElement } from "react"
import { StripeModalProps } from "./type"


const FiatPaymentModal = ({ collectionId, isOpen, closeModal, onFinishResponse, config, isLoading, chain }:StripeModalProps): ReactElement  => {
  return (
    <ConfigProvider config={config} >
        <StripePaymentModal 
            chain={chain}
            collectionId={collectionId}
            isOpen={isOpen}
            closeModal={closeModal}
            onFinishResponse={onFinishResponse}
            config={config}
            isLoading={isLoading}
        />
    </ConfigProvider>
  )
}

export default FiatPaymentModal;