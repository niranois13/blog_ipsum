import { Link } from "react-router-dom";

export default function VideoPlaceholder() {
    return (
        <div className="relative w-full max-w-[80%] mx-auto aspect-video bg-black rounded-lg overflow-hidden my-4 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-center px-6">
                <div className="mb-4">
                    <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-lg">
                        <svg
                            className="w-8 h-8 text-white ml-1"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    </div>
                </div>

                <p className="text-white text-lg font-medium mb-2">
                    Cette vidéo est hébergée sur YouTube
                </p>
                <p className="text-gray-300 text-sm mb-4">
                    Vous devez accepter les cookies pour la lire
                </p>

                <Link to="/privacy" className="text-sm text-blue-400 underline">
                    Gérer mes préférences de confidentialité
                </Link>
            </div>
        </div>
    );
}
