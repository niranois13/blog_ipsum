import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../router/ProtectedRoute.jsx";

const Home = lazy(() => import("../../pages/Home.jsx"));
const ArticlePage = lazy(() => import("../../pages/ArticlePage.jsx"));
const AdminArticles = lazy(() => import("../../pages/AdminArticles.jsx"));
const EditorPage = lazy(() => import("../../pages/EditorPage.jsx"));

export default function MainContent() {
    return (
        <main className="bg-bg flex-1 w-full">
            <Suspense fallback={<p>Loading page...</p>}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/article/:id" element={<ArticlePage />} />
                    <Route element={<ProtectedRoute />}>
                        <Route path="/admin/articles" element={<AdminArticles />} />
                        <Route path="/editor/new" element={<EditorPage />} />
                        <Route path="/editor/:id" element={<EditorPage />} />
                    </Route>
                </Routes>
            </Suspense>
        </main>
    );
}
