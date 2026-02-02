export function validQuillContent() {
    return {
        ops: [{ insert: "Hello world\n" }],
    };
}

export function invalidQuillContent() {
    return {
        foo: "bar",
    };
}
