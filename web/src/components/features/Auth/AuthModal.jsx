import { useModal } from "../../ui/ModalContext";
import { useState } from "react";
import { useLogin } from "../../../hooks/auth/useLogin";

export default function AuthModal() {
    const { closeModal } = useModal();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const loginMutation = useLogin();

    const handleSubmit = (e) => {
        e.preventDefault();
        loginMutation.mutate(
            { email, password },
            {
                onSuccess: () => {
                    closeModal();
                },
            }
        );
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <h2 className="text-xl font-bold text-center text-primary">Connexion</h2>

            <input
                type="email"
                placeholder="Email"
                className="border p-2 rounded border-primary"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <input
                type="password"
                placeholder="Mot de passe"
                className="border p-2 rounded border-primary"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <button
                type="submit"
                className="
                    bg-primary
                    text-light
                    p-2
                    rounded
                    hover:text-accent
                    font-bold
                    cursor-pointer"
                aria-label="submit login"
                disabled={loginMutation.isLoading}
            >
                {loginMutation.isLoading ? "Connexion..." : "Se connecter"}
            </button>

            {loginMutation.isError && (
                <p className="text-red-500 text-sm">
                    Échec de la connexion. Vérifiez vos identifiants.
                </p>
            )}

            <button
                aria-label="cancel authentication"
                type="button"
                onClick={closeModal}
                className="text-sm text-gray-500 hover:text-gray-700 cursor-pointer"
            >
                Annuler
            </button>
        </form>
    );
}
