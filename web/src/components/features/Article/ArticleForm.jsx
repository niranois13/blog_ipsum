import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ImageUp, X } from "lucide-react";
import { useCreateArticle } from "../../../hooks/article/useCreateArticle";
import { useUpdateArticle } from "../../../hooks/article/useUpdateArticle";
import { useDeleteArticle } from "../../../hooks/article/useDeleteArticle";
import { lazy, Suspense } from "react";

const QuillEditor = lazy(() => import("../../../QuillEditor"));

export default function ArticleForm({ mode = "create", initialArticle = null }) {
    const [title, setTitle] = useState("");
    const [cover, setCover] = useState(null);
    const [coverName, setCoverName] = useState("");
    const [coverAlt, setCoverAlt] = useState("");
    const [summary, setSummary] = useState("");
    const [content, setContent] = useState({ ops: [] });
    const [status, setStatus] = useState("DRAFT");
    const fileInputRef = useRef(null);

    const navigate = useNavigate();

    useEffect(() => {
        if (mode === "edit" && initialArticle.article) {
            const article = initialArticle.article;
            setTitle(article.title || "");
            setSummary(article.summary || "");
            setContent(article.content || { ops: [] });
            setStatus(article.status || "DRAFT");

            if (article.coverUrl) {
                setCover(null);
                setCoverName(article.coverUrl.split("/").pop());
            }

            setCoverAlt(article.coverAlt || "");
        }
    }, [mode, initialArticle]);

    const createArticleMutation = useCreateArticle(() => {
        navigate("/admin/articles");
    });
    const updateArticleMutation = useUpdateArticle(() => {
        navigate("/admin/articles");
    });
    const deleteArticleMutation = useDeleteArticle(() => {
        navigate("/admin/articles");
    });

    const isBusy =
        createArticleMutation.isPending ||
        updateArticleMutation.isPending ||
        deleteArticleMutation.isPending;

    const handleCoverChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCover(file);
            setCoverName(file.name);
        } else {
            setCover(null);
            setCoverName("");
        }
    };

    const removeCover = () => {
        setCover(null);
        setCoverName("");
        if (fileInputRef.current) {
            fileInputRef.current.value = null;
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = { title, summary, content, coverAlt, status };

        if (cover) payload.cover = cover;

        if (mode === "edit") {
            updateArticleMutation.mutate({
                id: initialArticle.article.id,
                data: payload,
            });
        } else {
            createArticleMutation.mutate(payload);
        }
    };

    const handleDelete = (e) => {
        e.preventDefault();
        if (!initialArticle.article.id) return;

        if (!window.confirm("Are you sure you want to delete this article?")) return;

        deleteArticleMutation.mutate(initialArticle.article.id);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <input
                type="text"
                placeholder="Article title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full p-2 border rounded-sm border-primary"
            />

            <div className="w-full flex flex-col sm:flex-row gap-5">
                <div className="flex-1 min-w-[200px] flex flex-col gap-2">
                    <label
                        htmlFor="cover-upload"
                        className="
                            flex items-center justify-center
                            border-2 border-dashed border-primary
                            rounded-sm p-2
                            cursor-pointer
                            hover:bg-primary/10
                            transition
                            gap-2
                        "
                    >
                        <ImageUp size={24} className="text-primary" />
                        <span className="text-sm text-primary">
                            {coverName || "Upload cover image"}
                        </span>
                    </label>

                    {coverName && (
                        <div className="flex items-center justify-between mt-1 gap-2">
                            <span className="text-sm text-primary truncate">{coverName}</span>
                            <button
                                type="button"
                                onClick={removeCover}
                                className="flex items-center text-red-500 hover:text-red-700 cursor-pointer gap-1"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    )}

                    <input
                        id="cover-upload"
                        type="file"
                        accept="image/webp,image/avif,image/jpeg,image/png"
                        onChange={handleCoverChange}
                        ref={fileInputRef}
                        className="hidden"
                    />
                </div>

                <input
                    type="text"
                    placeholder="Cover image alt text"
                    value={coverAlt}
                    onChange={(e) => setCoverAlt(e.target.value)}
                    className="flex-1 min-w-[150px] p-2 border rounded-sm border-primary"
                />
            </div>

            <textarea
                placeholder="Summary (max 1000 chars)"
                maxLength={1000}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="w-full p-2 border rounded-sm border-primary h-32"
            />

            <div>
                <Suspense fallback={<p>Loading editor...</p>}>
                    <QuillEditor value={content} onChange={setContent} />
                </Suspense>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-5 sm:gap-10">
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="px-6 py-3 border rounded-sm border-primary text-primary"
                >
                    <option value="DRAFT">Draft</option>
                    <option value="PUBLISHED">Published</option>
                </select>

                <button
                    type="submit"
                    disabled={isBusy}
                    className="px-6 py-3 bg-primary hover:bg-dark text-light rounded-sm font-bold"
                >
                    Save article
                </button>

                <button
                    type="button"
                    disabled={isBusy}
                    onClick={handleDelete}
                    className="px-6 py-3 bg-red-500 hover:bg-red-400 text-light rounded-sm font-bold"
                >
                    Delete article
                </button>
            </div>
        </form>
    );
}
