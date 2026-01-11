import { useNavigate } from "react-router-dom";

export default function AdminButton({
    Icon,
    IconSize = 24,
    buttonText,
    linkTo,
    divClassName = "",
    txtClassName = "",
}) {
    const navigate = useNavigate();

    return (
        <button
            type="button"
            className={`
                lg:text-md md:text-sm text-xs
                cursor-pointer
                flex flex-col items-center
                text-dark hover:text-accent hover:underline
                ${divClassName}
                `}
            onClick={(e) => {
                e.stopPropagation();
                navigate(linkTo);
            }}
        >
            {Icon && <Icon size={IconSize} />}
            <span className={`${txtClassName}`}>{buttonText}</span>
        </button>
    );
}
