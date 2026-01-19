import { createContext, useContext, useEffect, useState } from "react";

const PreferencesContext = createContext();

export default function CookieProvider({ children }) {
    const [preferencesConsent, setPreferencesConsent] = useState(null);

    useEffect(() => {
        try {
            if (typeof window === "undefined") return;

            if (!("localStorage" in window)) {
                setPreferencesConsent(null);
                return;
            }

            const saved = localStorage.getItem("sitePreferences");
            if (saved === "true") setPreferencesConsent(true);
            else if (saved === "false") setPreferencesConsent(false);
            else setPreferencesConsent(null);
        } catch (error) {
            console.error({ error: error });
            setPreferencesConsent(null);
        }
    }, []);

    const safeSet = (value) => {
        try {
            if (typeof window !== "undefined" && "localStorage" in window) {
                window.localStorage.setItem("sitePreferences", value);
            }
        } catch (error) {
            console.error({ error: error });
        }
        setPreferencesConsent(value === "true");
    };

    const acceptPreferences = () => safeSet("true");
    const rejectPreferences = () => safeSet("false");

    return (
        <PreferencesContext.Provider
            value={{
                preferencesConsent,
                acceptPreferences,
                rejectPreferences,
            }}
        >
            {children}
        </PreferencesContext.Provider>
    );
}

export function usePreferences() {
    return useContext(PreferencesContext);
}
