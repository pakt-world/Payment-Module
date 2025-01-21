import PaktIcon from "../assets/images/pakt.png";

const PoweredByPakt = ({ className }: { className?: string }) => {
    return (
        <a
            href="https://pakt.world"
            target="_blank"
            className={`flex cursor-pointer items-center text-title ${className}`}
            rel="noreferrer"
        >
            <p className="text-base">Powered by</p>{" "}
            <img width={92} height={36} alt="Pakt" src={PaktIcon} />
        </a>
    );
};

export default PoweredByPakt;
