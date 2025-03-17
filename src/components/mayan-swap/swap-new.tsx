
import { Button, Spinner } from "components/common";
import {  APIChainsResponse, APITokensResponse, MayanWidgetProps, Option, OptionDataResponse, SetReadyProps, SwapDataResponse } from "./types";
import { SelectDropdown } from "components/common/select";
import MayanSwapHeader from "./header";
import { Loader2 } from "lucide-react";
import { sentenceCase } from "utils";

interface SwapWidgetFlow {
  isLoading:boolean, 
  btnReady:boolean, 
  btnLoading: boolean, 
  closeModal: ()=>void 
  networksPayload: OptionDataResponse<APIChainsResponse>;
  tokensPayload: OptionDataResponse<APITokensResponse>;
  swapPayload?: SwapDataResponse;
}

const RenderOptionView = ({ value }: { value: Option}) => {
  return (
    <div className="pam-flex pam-gap-4 pam-text-black pam-text-base pam-w-full pam-justify-between">
      <div className="pam-flex pam-flex-row pam-text-sm pam-gap-2 pam-items-center pam-justify-center ">
        {value?.meta?.icon && <div className="pam-flex pam-bg-grey pam-rounded-xl">
          <img width={24} height={24} src={value?.meta?.icon}/>
        </div>}
        <span>{sentenceCase(value.label)}</span>
        {value?.meta?.symbol && <span className="pam-text-sm pam-text-[#00000080] pam-opacity-50">{value?.meta?.symbol}</span>}
      </div>
      {(value?.meta?.amount && value?.meta?.usdRate) && <div className="pam-flex pam-flex-col pam-text-sm">
        <p>{value?.meta?.amount}</p>
        <span className="pam-text-[#00000080] pam-opacity-50">${value?.meta?.usdRate}</span>
      </div>}
    </div>
  )
}

const WrapperSelect = ({ label, value, options, showBreakLine, onChange, disabled, loading }: { label: string, value: Option, showBreakLine:boolean, options: Option[], disabled?:boolean, loading: boolean, onChange: (value:Option)=>void}) => {
  return(
    <div className="pam-flex-col pam-gap-2">
      <p className="pam-font-[100] pam-text-base pam-text-[#999999]">{label}</p>
      <SelectDropdown 
          options={options}
          value={value}
          onChange={(value)=>onChange(value)}
          placeholder={label}
          disabled={disabled || loading}
          className="sm:pam-w-full"
          triggerClassName="pam-h-12 pam-w-full sm:pam-text-base pam-text-[#999999]"
          dropdownClassName="pam-gap-2"
          showBreakLine={showBreakLine}
          RenderView={RenderOptionView}
          loading={loading}
      />
    </div>
  )
}

const MayanSwapWidget = ({ isLoading, btnLoading, btnReady, networksPayload, tokensPayload, swapPayload, closeModal }: SwapWidgetFlow) => {
  return (
    <>
      <MayanSwapHeader closeModal={closeModal}/>
      <div className="pam-flex pam-flex-col pam-justify-center pam-gap-4">
        <WrapperSelect 
          label="Network"
          options={networksPayload?.optionMapped || []}
          value={networksPayload.selectedOption || {} as Option}
          onChange={networksPayload.selectOption}
          showBreakLine={false}
          loading={networksPayload.loading}
        />
        <WrapperSelect 
          label="Token"
          options={tokensPayload.optionMapped || []}
          value={tokensPayload.selectedOption as Option}
          onChange={tokensPayload.selectOption}
          showBreakLine={true}
          loading={tokensPayload.loading}
        />
        <div className="pam-flex pam-flex-col pam-min-h-[200px] pam-items-center pam-justify-center">
          {swapPayload && <>
            {swapPayload.loading ? 
              <Loader2 className="pam-animate-spin pam-text-primary" size={35}  />
            :
              <></>
            }
          </>}
          
        </div>
        <div className="pam-mt-auto">
          <Button
              disabled={!btnReady || btnLoading || isLoading}
              onClick={() => console.log("clicked--")}
              fullWidth
              variant="primary"
              size="md"
          >
              <div className="pam-flex pam-items-center pam-justify-center pam-gap-2">
                  <span> {!btnLoading && "Connect Wallet"}</span>
                  <span>{btnLoading && <Spinner />}</span>
              </div>
          </Button>
        </div>
      </div>
    </>
  );
};

export default MayanSwapWidget;
