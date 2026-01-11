import { Routes, Route } from "react-router-dom";
import Home from "../../pages/Home.jsx";
import AdminArticles from "../../pages/AdminArticles.jsx";
import EditorPage from "../../pages/EditorPage.jsx";
import ProtectedRoute from "../router/ProtectedRoute.jsx";
import ArticlePage from "../../pages/ArticlePage.jsx";

export default function MainContent() {
    return (
        <main className="bg-bg flex-1 w-full">
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/article/:id" element={<ArticlePage />} />
                <Route element={<ProtectedRoute />}>
                    <Route path="/admin/articles" element={<AdminArticles />} />
                    <Route path="/editor/new" element={<EditorPage />} />
                    <Route path="/editor/:id" element={<EditorPage />} />
                </Route>
            </Routes>
        </main>
    );
}
