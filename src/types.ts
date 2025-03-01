/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

interface BasicModalProps {
  isOpen: boolean;
  closeModal: () => void;
  collectionId: string;
}

interface onFinishResponseProps {
  status: string;
  txId: string;
}

type IAny = any;
type I0xAddressType = `0x${string}`;

interface ITheme extends Record<string, any> {
  primary?: string;
  info?: string;
  secondary?: string;
  "blue-lightest"?: string;
  "blue-darkest"?: string;
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
  "modal-color"?:string;
  "modal-bd"?:string;
}


interface IGetRequestSignature {
  signature: string;
  timeStamp: string;
}

interface IGetRequestSignatureParam {
  url: string;
  publicKey: string;
  clientId: string;
}


export {
  IAny,
  I0xAddressType,
  type BasicModalProps,
  type onFinishResponseProps,
  type ITheme,
  type IGetRequestSignature,
  type IGetRequestSignatureParam
}
