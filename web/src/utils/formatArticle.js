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

function normalizeDelta(delta) {
    const ops = [];

    for (let i = 0; i < delta.ops.length; i++) {
        const op = delta.ops[i];

        if (op.insert?.video) {
            ops.push(op);
            ops.push({ insert: "\n" });
            continue;
        }

        if (typeof op.insert === "string" && i > 0 && delta.ops[i - 1]?.insert?.video) {
            ops.push({ insert: op.insert });
            continue;
        }

        ops.push(op);
    }

    return { ops };
}

export function quillDeltaToCleanHtml(delta) {
    if (!delta?.ops) return "";

    const quill = getQuillInstance();
    const normalized = normalizeDelta(delta);
    quill.setContents(normalized);

    const rawHtml = quill.container.querySelector(".ql-editor").innerHTML;
    const cleanHtml = DOMPurify.sanitize(rawHtml, {
        USE_PROFILES: { html: true },
        ADD_TAGS: ["iframe"],
        ADD_ATTR: ["src", "allow", "allowfullscreen", "referrerpolicy", "loading", "sandbox"],
    });

    const sanitizedVideoHTML = sanitizeVideos(cleanHtml);

    return sanitizedVideoHTML;
}

function sanitizeVideos(html) {
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
