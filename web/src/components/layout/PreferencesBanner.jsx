// CookieBanner.jsx
import { useEffect, useState } from "react";
import { usePreferences } from "../../context/PreferencesContext";

export default function PreferencesBanner() {
    const { preferencesConsent, acceptPreferences, rejectPreferences } = usePreferences();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;
    if (preferencesConsent !== null) return null;

    return (
        <div className="fixed bottom-0 w-full bg-gray-900 text-white p-4 flex flex-col md:flex-row justify-between items-center z-50">
            <p className="mb-2 md:mb-0">
                This site uses local storage and embedded content (video, image).
                <br />
                You can enable or disable them at any time.{" "}
                <a href="/privacy" className="underline">
                    Learn more
                </a>
                .
            </p>
            <div className="flex gap-2">
                <button className="bg-green-500 px-4 py-2 rounded" onClick={acceptPreferences}>
                    Accept
                </button>
                <button className="bg-red-500 px-4 py-2 rounded" onClick={rejectPreferences}>
                    Reject
                </button>
            </div>
        </div>
    );
}
