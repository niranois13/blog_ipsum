import DOMPurify from "./DOMPurifySetup";
import Quill from "quill";

export function parseArticleContent(content) {
    try {
        if (!content) return { ops: [] };

        if (typeof content === "string") {
            const parsed = JSON.parse(content);
            if (parsed.ops && Array.isArray(parsed.ops)) return parsed;
        }

        if (content.ops && Array.isArray(content.ops)) return content;

        return { ops: [] };
    } catch (err) {
        console.error("Error parsing content:", err);
        return { ops: [] };
    }
}

let quillInstance = null;

function transformDeltaForConsent(delta, consent) {
    const ops = [];

    for (const op of delta.ops) {
        if (op.insert?.video) {
            if (consent) {
                ops.push(op);
            } else {
                ops.push({ insert: "[[VIDEO_PLACEHOLDER]]\n" });
            }
            continue;
        }

        ops.push(op);
    }

    return { ops };
}

function replaceVideoPlaceholders(html) {
    return html.replace(/\[\[VIDEO_PLACEHOLDER\]\]/g, videoPlaceholderHTML());
}

function videoPlaceholderHTML() {
    return `
        <div class="relative w-full max-w-[80%] mx-auto aspect-video bg-black rounded-lg overflow-hidden my-4 flex items-center justify-center">

            <div class="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-center px-6">
                <div class="mb-4">
                    <div class="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-lg">
                        <svg class="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                        </svg>
                    </div>
                </div>

                <p class="text-white text-lg font-medium mb-2">Cette vidéo est hébergée sur YouTube</p>
                <p class="text-gray-300 text-sm mb-4">Vous devez accepter les cookies pour la lire</p>

                <a href="/privacy" class="text-sm text-blue-400 hover:underline">Gérer mes préférences de confidentialité</a>
            </div>
        </div>
    `;
}

function getQuillInstance() {
    if (quillInstance) return quillInstance;

    const container = document.createElement("div");
    container.style.display = "none";
    document.body.appendChild(container);

    quillInstance = new Quill(container, {
        readOnly: true,
        theme: "snow",
        modules: { toolbar: false },
    });

    return quillInstance;
}

function normalizeVideoLayout(delta) {
    const ops = [];

    for (let i = 0; i < delta.ops.length; i++) {
        const op = delta.ops[i];
        const nextOp = delta.ops[i + 1];

        if (op.insert?.video) {
            ops.push(op);
            if (nextOp?.insert === "string" && nextOp?.insert !== "\n") ops.push({ insert: "\n" });
            continue;
        }

        ops.push(op);
    }

    return { ops };
}

function sanitizeYoutubeIframes(html) {
    const container = document.createElement("div");
    container.innerHTML = html;

    const iframes = container.querySelectorAll("iframe");

    for (const iframe of iframes) {
        try {
            const src = iframe.getAttribute("src");
            if (!src) {
                iframe.remove();
                continue;
            }

            const url = new URL(src);

            const isYoutube =
                (url.hostname === "www.youtube.com" || url.hostname === "youtube.com") &&
                url.pathname.startsWith("/embed/");

            if (!isYoutube) {
                iframe.remove();
                continue;
            }

            const videoId = url.pathname.split("/embed/")[1].split("?")[0];
            const newUrl = `https://www.youtube-nocookie.com/embed/${videoId}?rel=0`;

            iframe.setAttribute("src", newUrl);
            iframe.setAttribute("loading", "lazy");
            iframe.setAttribute(
                "allow",
                "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            );
            iframe.setAttribute("allowfullscreen", "");
            iframe.setAttribute(
                "sandbox",
                "allow-scripts allow-same-origin allow-presentation allow-popups"
            );
        } catch {
            iframe.remove();
        }
    }

    return container.innerHTML;
}

export function quillDeltaToCleanHtml(delta, consent) {
    if (!delta?.ops) return "";

    delta = normalizeVideoLayout(delta);

    const quill = getQuillInstance();

    const safeDelta = transformDeltaForConsent(delta, consent);
    quill.setContents(safeDelta);

    let html = quill.container.querySelector(".ql-editor").innerHTML;

    html = DOMPurify.sanitize(html, {
        USE_PROFILES: { html: true },
        ADD_TAGS: consent ? ["iframe"] : ["div"],
        ADD_ATTR: consent
            ? ["src", "allow", "allowfullscreen", "loading", "sandbox"]
            : ["data-video-placeholder"],
    });

    if (consent) {
        html = sanitizeYoutubeIframes(html);
    } else {
        html = replaceVideoPlaceholders(html);
    }

    return html;
}
