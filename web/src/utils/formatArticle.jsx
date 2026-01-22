import VideoPlaceholder from "../components/ui/VideoPlaceholder";

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

export function quillDeltaToReact(delta, consent) {
    if (!delta?.ops) return [];

    return delta.ops.map((op, index) => {
        // Gestion des inserts d'objet (video, image)
        if (typeof op.insert === "object") {
            if (op.insert.video) {
                return consent ? (
                    <iframe
                        key={index}
                        src={op.insert.video.replace(
                            "youtube.com/embed/",
                            "youtube-nocookie.com/embed/"
                        )}
                        loading="lazy"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        sandbox="allow-scripts allow-same-origin allow-presentation allow-popups"
                        className="w-full aspect-video rounded-lg"
                    />
                ) : (
                    <VideoPlaceholder key={index} />
                );
            }
            if (op.insert.image) {
                return (
                    <img key={index} src={op.insert.image} alt="" className="w-full rounded-lg" />
                );
            }
            return null;
        }

        if (typeof op.insert === "string") {
            const text = op.insert;
            const attr = op.attributes || {};

            switch (true) {
                case !!attr.header:
                    if (attr.header === 1)
                        return (
                            <h2 key={index} className="text-4xl mt-8 mb-4 font-bold">
                                {text}
                            </h2>
                        );

                    if (attr.header === 2)
                        return (
                            <h3 key={index} className="text-3xl mt-7 mb-4 font-semibold">
                                {text}
                            </h3>
                        );
                    if (attr.header === 3)
                        return (
                            <h4 key={index} className="text-2xl mt-6 mb-4 font-medium">
                                {text}
                            </h4>
                        );
                    break;

                case !!attr.bold && !!attr.italic && !!attr.underline:
                    return (
                        <p key={index}>
                            <strong>
                                <em>
                                    <u>{text}</u>
                                </em>
                            </strong>
                        </p>
                    );

                case !!attr.bold && !!attr.italic:
                    return (
                        <p key={index}>
                            <strong>
                                <em>{text}</em>
                            </strong>
                        </p>
                    );

                case !!attr.bold && !!attr.underline:
                    return (
                        <p key={index}>
                            <strong>
                                <u>{text}</u>
                            </strong>
                        </p>
                    );

                case !!attr.italic && !!attr.underline:
                    return (
                        <p key={index}>
                            <em>
                                <u>{text}</u>
                            </em>
                        </p>
                    );

                case !!attr.bold:
                    return (
                        <p key={index}>
                            <strong>{text}</strong>
                        </p>
                    );

                case !!attr.italic:
                    return (
                        <p key={index}>
                            <em>{text}</em>
                        </p>
                    );

                case !!attr.underline:
                    return (
                        <p key={index}>
                            <u>{text}</u>
                        </p>
                    );

                case !!attr.blockquote:
                    return (
                        <blockquote
                            key={index}
                            className="border-l-4 border-gray-200 pl-4 text-gray-500 italic my-6"
                        >
                            {text}
                        </blockquote>
                    );

                case !!attr["code-block"]:
                    return (
                        <pre key={index}>
                            <code>{text}</code>
                        </pre>
                    );

                case !!attr.link:
                    return (
                        <a key={index} href={attr.link}>
                            {text}
                        </a>
                    );

                default:
                    return <p key={index}>{text}</p>;
            }
        }

        return null;
    });
}
