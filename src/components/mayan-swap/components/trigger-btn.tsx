
import mayanLogo from "../../../assets/icons/mayanIcon.png";
import EthIcon from "../../../assets/icons/eth.png";
import baseIcon from "../../../assets/icons/base.png";
import SolIcon from "../../../assets/icons/solana.png";

const icons = [
  { icon: SolIcon, name:"Solana" },
  { icon: baseIcon, name:"Base" },
  { icon: EthIcon, name:"Ethereum" },
]

const MayanTriggerButton = ( { onClick }: { onClick:()=>void }) => {
  return(
    <button
      type="button"
      onClick={onClick}
      className={`pam-flex pam-items-center pam-justify-between pam-rounded-2xl pam-border pam-border-[#DFDFE6] pam-p-1 pam-px-4 pam-py-3 pam-text-left hover:pam-border-blue-darkest hover:!pam-border-opacity-30 disabled:pam-cursor-not-allowed disabled:pam-opacity-50`}
>
    <span className="pam-flex pam-w-full pam-items-center pam-gap-2">
        <span>Mayan</span>
        {icons.map((ic)=>(
          <span className="pam-flex pam-flex-row pam-gap-1 pam-p-1 pam-text-[12px] pam-text-[#5538EE] pam-bg-[#E7E7FF] pam-w-fit pam-rounded-2xl">
            <img className="pam-w-[16px] pam-rounded-full" src={ic.icon} /> {ic.name}
          </span>
        ))}
    </span>

    <span>
      {mayanLogo != null && (
        <img src={mayanLogo} width={20} height={20} alt="" />
      )}
    </span>
</button>
  )
}

export default MayanTriggerButton;
