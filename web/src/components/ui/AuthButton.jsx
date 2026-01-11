import { CircleUser, LogOut } from "lucide-react";
import { useModal } from "./ModalContext";
import AuthModal from "..//features/Auth/AuthModal";
import { useAuth } from "../../context/AuthContext";
import useLogout from "../../hooks/auth/useLogout";

export default function AuthButton() {
    const { isLoggedIn } = useAuth();
    const { openModal } = useModal();
    const logOutMutation = useLogout();

    if (!isLoggedIn) {
        return (
            <button
                aria-label="authentication"
                className="lg:text-3xl md:text-2xl text-xl cursor-pointer"
                onClick={() => openModal(<AuthModal />)}
            >
                <CircleUser className="text-light hover:text-accent hover:shadow-sm" />
            </button>
        );
    } else {
        return (
            <button
                aria-label="logout button"
                className="lg:text-3xl md:text-2xl text-xl cursor-pointer"
                onClick={() => logOutMutation.mutate()}
            >
                <LogOut className="text-light hover:text-accent" />
            </button>
        );
    }
}
