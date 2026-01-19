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
        <div class="video-placeholder bg-gray-100 border rounded p-4 text-center my-4">
            <p class="mb-2 text-sm text-gray-700">
                This video is hosted on YouTube and requires cookie consent.
            </p>
            <a href="/privacy" class="underline text-blue-600">
                Manage privacy settings
            </a>
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
