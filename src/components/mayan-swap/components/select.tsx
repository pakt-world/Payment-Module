import { SelectDropdown } from "components/common/select"
import { Option } from "../types"
import { sentenceCase } from "utils"


const RenderOptionView = ({ value }: { value: Option}) => {
  return (
    <div className="pam-font-400 pam-flex pam-gap-4 pam-text-black pam-text-base pam-w-full pam-justify-between">
      <div className="pam-flex pam-flex-row pam-text-sm pam-gap-2 pam-items-center pam-justify-center ">
        {value?.meta?.icon && <div className="pam-flex pam-bg-grey pam-rounded-xl">
          <img width={24} height={24} src={value?.meta?.icon}/>
        </div>}
        <span>{sentenceCase(value.label)}</span>
        {value?.meta?.symbol && <span className="pam-text-sm pam-text-[#00000080] pam-opacity-50">{value?.meta?.symbol}</span>}
      </div>
      {(value?.meta?.amount && value?.meta?.usd) && <div className="pam-flex pam-flex-col pam-text-sm pam-justify-end pam-items-end pam-text-[#00000080]">
        <span>{value?.meta?.amount}</span>
        <span className="pam-opacity-50">${value?.meta?.usd}</span>
      </div>}
    </div>
  )
}

const WrapperSelect = ({ label, value, options, showBreakLine, onChange, disabled, loading }: { label: string, value: Option, showBreakLine:boolean, options: Option[], disabled?:boolean, loading: boolean, onChange: (value:Option)=>void}) => {
  return(
    <div className="pam-flex pam-flex-col pam-gap-2">
      <p className="pam-text-base pam-text-tbody">{label}</p>
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

export default WrapperSelect
