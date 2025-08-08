import PaktIcon from "../../assets/images/pakt-logo.png";

export const BrandLoader = () => {
    return (
        <div className="pam:flex pam:h-full pam:w-full pam:items-center pam:justify-center pam:bg-product-bg">
            <div className="pam:relative pam:flex pam:h-32 pam:w-32 pam:items-center pam:justify-center pam:max-sm:pam:scale-[0.8]">
                <div className="pam:absolute pam:h-full pam:w-full pam:animate-spin pam:rounded-full pam:border pam:border-transparent pam:border-t-blue-darkest" />
                <div className="pam:relative pam:flex pam:h-28 pam:w-28 pam:items-center pam:justify-center">
                    <div className="pam:animate-spin2 pam:absolute pam:h-full pam:w-full pam:rounded-full pam:border pam:border-transparent pam:border-t-primary-lighter" />
                    <div className="pam:relative pam:flex pam:h-28 pam:w-28 pam:items-center pam:justify-center">
                        <div className="pam:animate-spin3 pam:absolute pam:h-full pam:w-full pam:rounded-full pam:border pam:border-transparent pam:border-t-blue-darkest" />
                        <div className="pam:relative pam:flex pam:h-32 pam:w-32 pam:items-center pam:justify-center">
                            <div className="pam:animate-spin4 pam:absolute pam:h-full pam:w-full pam:rounded-full pam:border pam:border-transparent pam:border-t-primary-lighter" />
                            <div className="pam:relative pam:flex pam:h-28 pam:w-28 pam:items-center pam:justify-center">
                                <div className="pam:animate-spin5 pam:absolute pam:h-full pam:w-full pam:rounded-full pam:border pam:border-transparent pam:border-t-blue-darkest" />
                                <div className="pam:relative pam:flex pam:h-28 pam:w-28 pam:items-center pam:justify-center">
                                    <div className="pam:animate-spin6 pam:absolute pam:h-full pam:w-full pam:rounded-full pam:border pam:border-transparent pam:border-t-primary-lighter" />
                                    <img
                                        width={48}
                                        height={48}
                                        alt="Pakt"
                                        src={PaktIcon}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
