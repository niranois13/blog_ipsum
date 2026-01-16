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
    console.log("normalizeDelta received delta:", delta);

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

    console.log("normalizeDelta output delta:", ops);

    return { ops };
}

export function quillDeltaToCleanHtml(delta) {
    if (!delta?.ops) return "";

    const quill = getQuillInstance();
    const normalized = normalizeDelta(delta);
    quill.setContents(normalized);

    const rawHtml = quill.container.querySelector(".ql-editor").innerHTML;
    console.log("rawHtml:", rawHtml);

    const cleanHtml = DOMPurify.sanitize(rawHtml, {
        USE_PROFILES: { html: true },
        ADD_TAGS: ["iframe"],
        ADD_ATTR: ["allow", "allowfullscreen", "frameborder", "scrolling"],
    });

    return cleanHtml.replace(/<iframe[^>]*src="([^"]+)"[^>]*><\/iframe>/g, (match, src) => {
        if (!src.includes("youtube.com/embed")) return "";
        return match;
    });
}
