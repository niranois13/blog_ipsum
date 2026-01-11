import { createContext, useContext, useEffect, useRef, useState } from "react";

const ModalContext = createContext();

export function ModalProvider({ children }) {
    const [modalContent, setModalContent] = useState(null);
    const modalRef = useRef(null);
    let lastFocusedElement = useRef(null);

    const openModal = (content) => {
        lastFocusedElement = document.activeElement;
        setModalContent(content);
    };

    const closeModal = () => {
        setModalContent(null);
        if (lastFocusedElement.current) {
            lastFocusedElement.current.focus();
        }
    };

    useEffect(() => {
        if (!modalContent) return;

        const modal = modalRef.current;
        const focusable = modal.querySelectorAll(
            "input, button, textarea, select, a[href], [tabindex]:not([tabindex='-1'])"
        );
        if (focusable.length > 0) focusable[0].focus();

        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                closeModal();
            }

            if (e.key === "Tab") {
                const first = focusable[0];
                const last = focusable[focusable.length - 1];

                if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [modalContent]);

    const handleBackgroundClick = (e) => {
        if (e.target === e.currentTarget) closeModal();
    };

    return (
        <ModalContext.Provider value={{ modalContent, openModal, closeModal }}>
            {children}

            {modalContent && (
                <div
                    className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
                    onClick={handleBackgroundClick}
                >
                    <div
                        ref={modalRef}
                        aria-label="authentication modal openned"
                        role="dialog"
                        aria-modal="true"
                        className="bg-bg p-6 rounded-xl shadow-xl outline-none"
                    >
                        {modalContent}
                    </div>
                </div>
            )}
        </ModalContext.Provider>
    );
}

export const useModal = () => useContext(ModalContext);
