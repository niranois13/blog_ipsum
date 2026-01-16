// QuillEditor.jsx
import React, { useEffect, useRef } from "react";
import Quill from "quill";

const QuillEditor = ({
    value = { ops: [] },
    onChange,
    placeholder = "Lorem ipsum dolor sit amet...",
}) => {
    const editorRef = useRef(null);
    const quillRef = useRef(null);
    const onChangeRef = useRef(onChange);

    useEffect(() => {
        onChangeRef.current = onChange;
    }, [onChange]);

    useEffect(() => {
        import("quill/dist/quill.snow.css");
    }, []);

    useEffect(() => {
        if (!editorRef.current || quillRef.current) return;

        const quill = new Quill(editorRef.current, {
            theme: "snow",
            placeholder,
            modules: {
                toolbar: [
                    [{ header: [1, 2, 3, false] }],
                    ["bold", "italic", "underline"],
                    ["blockquote", "code-block"],
                    ["link", "image", "video", "formula"],
                    [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
                    [{ indent: "-1" }, { indent: "+1" }],
                    [{ size: ["small", "large", "huge", false] }],
                    [{ color: [] }, { background: [] }],
                    [{ font: [] }],
                    [{ align: [] }],
                    ["clean"],
                ],
            },
        });

        quillRef.current = quill;

        if (value.ops) {
            quill.setContents(value);
        }

        quill.on("text-change", () => {
            const delta = quill.getContents();
            onChangeRef.current?.(delta);
        });

        return;
    });

    useEffect(() => {
        const quill = quillRef.current;
        if (!quill || !value.ops) return;

        const current = quill.getContents();

        if (JSON.stringify(current.ops) !== JSON.stringify(value.ops)) {
            quill.setContents(value);
        }
    }, [value]);

    return <div ref={editorRef} style={{ minHeight: 150 }} />;
};

export default QuillEditor;
