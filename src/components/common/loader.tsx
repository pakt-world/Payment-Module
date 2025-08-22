/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type FC } from "react";
import { Loader2 } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { cn } from "../../utils";

interface SpinnerProps {
    size?: number;
    className?: string;
}

export const Spinner: FC<SpinnerProps> = ({ size = 24, className }) => {
    return (
        <div
            className={cn(
                `pam:flex pam:w-full pam:items-center pam:justify-center pam:h-full pam:text-brand-primary`,
                className
            )}
        >
            <Loader2 className="pam:animate-spin" size={size} />
        </div>
    );
};
