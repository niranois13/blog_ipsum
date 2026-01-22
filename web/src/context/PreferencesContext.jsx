import { createContext, useContext, useEffect, useState } from "react";

const PreferencesContext = createContext();

export default function PreferencesProvider({ children }) {
    const [preferencesConsent, setPreferencesConsent] = useState(null);

    useEffect(() => {
        try {
            if (typeof window === "undefined") return;

            if (!("localStorage" in window)) {
                setPreferencesConsent(null);
                return;
            }

            const saved = localStorage.getItem("sitePreferences");
            if (saved === "true") setPreferencesConsent("true");
            else if (saved === "false") setPreferencesConsent("false");
            else setPreferencesConsent(null);
        } catch {
            setPreferencesConsent(null);
        }
    }, []);

    const safeSet = (value) => {
        try {
            window.localStorage.setItem("sitePreferences", value);
        } catch {
            setPreferencesConsent(null);
        }
        setPreferencesConsent(value);
    };

    const acceptPreferences = () => safeSet("true");

    const rejectPreferences = () => safeSet("false");

    const revokePreferences = () => {
        safeSet("false");
        deleteAllCookies();
        removeYouTubeIframes();
    };

    return (
        <PreferencesContext.Provider
            value={{
                preferencesConsent,
                acceptPreferences,
                rejectPreferences,
                revokePreferences,
            }}
        >
            {children}
        </PreferencesContext.Provider>
    );
}

export function usePreferences() {
    return useContext(PreferencesContext);
}

function deleteAllCookies() {
    document.cookie.split(";").forEach((cookie) => {
        const name = cookie.split("=")[0].trim();
        document.cookie = `${name}=; Max-Age=0; path=/`;
    });
}

function removeYouTubeIframes() {
    document.querySelectorAll("iframe").forEach((iframe) => {
        if (iframe.src.includes("youtube")) {
            iframe.remove();
        }
    });
}
