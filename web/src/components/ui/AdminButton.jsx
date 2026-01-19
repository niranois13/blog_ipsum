import { useNavigate } from "react-router-dom";

export default function AdminButton({
    Icon,
    IconSize = 24,
    buttonText,
    linkTo,
    onClick,
    divClassName = "",
    txtClassName = "",
    disabled = false,
}) {
    const navigate = useNavigate();

    function handleClick(e) {
        e.stopPropagation();

        if (disabled) return;

        if (onClick) {
            onClick(e);
            return;
        }

        if (linkTo) {
            navigate(linkTo);
        }
    }

    return (
        <button
            type="button"
            disabled={disabled}
            onClick={handleClick}
            className={`
                lg:text-md md:text-sm text-xs
                cursor-pointer
                flex flex-col items-center
                text-dark hover:text-accent hover:underline
                ${divClassName}
                `}
        >
            {Icon && <Icon size={IconSize} />}
            <span className={`${txtClassName}`}>{buttonText}</span>
        </button>
    );
}
