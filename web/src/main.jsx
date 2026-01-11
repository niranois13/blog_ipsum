import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { ModalProvider } from "./components/ui/ModalContext.jsx";
import "./styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthProvider from "./context/AuthContext.jsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <BrowserRouter>
            <QueryClientProvider client={queryClient}>
                <AuthProvider>
                    <ModalProvider>
                        <App />
                    </ModalProvider>
                </AuthProvider>
            </QueryClientProvider>
        </BrowserRouter>
    </StrictMode>
);
