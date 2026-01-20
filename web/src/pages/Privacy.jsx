import { usePreferences } from "../context/PreferencesContext";

export default function Privacy() {
    const { preferencesConsent, acceptPreferences, rejectPreferences, revokePreferences } =
        usePreferences();

    return (
        <main className="max-w-4xl mx-auto p-6 space-y-8">
            <h1 className="text-4xl font-bold">Politique de confidentialité</h1>

            {/* Données personnelles */}
            <section className="space-y-3">
                <h2 className="text-2xl font-semibold">Données personnelles</h2>
                <p>
                    Ce site ne collecte aucune donnée personnelle permettant d’identifier
                    directement un visiteur.
                </p>
                <p>
                    Lorsqu’un utilisateur publie un commentaire, un identifiant technique et un
                    pseudonyme généré aléatoirement sont stockés dans un cookie afin d’associer les
                    commentaires à ce pseudonyme.
                </p>
                <p>Aucune donnée - personnelle ou technique - n’est collectée par nos services.</p>
            </section>

            {/* Services tiers */}
            <section className="space-y-3">
                <h2 className="text-2xl font-semibold">Services tiers</h2>

                <h3 className="font-medium">Cloudinary</h3>
                <p>
                    Cloudinary est utilisé uniquement pour l’hébergement et la diffusion d’images.
                    Ce service ne dépose aucun cookie et ne collecte aucune donnée sur les visiteurs
                    du site.
                </p>

                <h3 className="font-medium mt-4">YouTube</h3>
                <p>
                    Les vidéos sont hébergées sur YouTube. Ce service peut déposer des cookies et
                    collecter des données à des fins de suivi et de personnalisation.
                </p>
                <p>
                    Nous utilisons la version Youtube-nocookie qui limite au maximum les données
                    collectées par ce service.
                </p>
                <p>
                    Les vidéos YouTube ne sont chargées qu’après acceptation explicite des cookies.
                    Sans consentement, un simple emplacement est affiché à la place de la vidéo.
                </p>
            </section>

            {/* Consentement */}
            <section className="space-y-3">
                <h2 className="text-2xl font-semibold">Gestion du consentement</h2>

                {preferencesConsent === "true" && (
                    <>
                        <p>
                            Vous avez actuellement accepté l’utilisation des cookies nécessaires à
                            l’affichage des vidéos YouTube et à la publication de commentaires.
                        </p>
                        <button
                            onClick={revokePreferences}
                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                            Retirer mon consentement
                        </button>
                    </>
                )}

                {preferencesConsent === "false" && (
                    <>
                        <p>
                            Vous avez refusé l’utilisation des cookies. Les vidéos YouTube et la
                            publication de commentaires sont désactivées.
                        </p>
                        <button
                            onClick={acceptPreferences}
                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                        >
                            Accepter les cookies
                        </button>
                    </>
                )}

                {preferencesConsent === null && (
                    <>
                        <p>
                            Vous n’avez pas encore choisi si vous souhaitez autoriser les cookies
                            pour les vidéos YouTube et les commentaires.
                        </p>
                        <div className="flex gap-4">
                            <button
                                onClick={acceptPreferences}
                                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                            >
                                Accepter
                            </button>
                            <button
                                onClick={rejectPreferences}
                                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                            >
                                Refuser
                            </button>
                        </div>
                    </>
                )}
            </section>

            {/* Info légale */}
            <section className="text-sm text-gray-500">
                <p>
                    Note : Les cookies déposés directement par YouTube ou Google ne peuvent pas être
                    supprimés par ce site. Leur suppression ou gestion peut être effectuée via les
                    paramètres de votre navigateur.
                </p>
            </section>
        </main>
    );
}
