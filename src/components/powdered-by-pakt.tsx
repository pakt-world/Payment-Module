import PaktIcon from "../assets/images/pakt.png";

const PoweredByPakt = ({ className }: { className?: string }) => {
    return (
        <a
            href="https://pakt.world"
            target="_blank"
            className={`pam:flex pam:cursor-pointer pam:items-center pam:text-heading-text ${className}`}
            rel="noreferrer"
        >
            <p className="pam:text-white">Powered by</p>{" "}
            <img width={92} height={36} alt="Pakt" src={PaktIcon} />
        </a>
    );
};

export default PoweredByPakt;
