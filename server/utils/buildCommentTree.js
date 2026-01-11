export default function buildCommentTree(comments) {
    if (!comments || !Array.isArray(comments)) return [];

    const nodes = comments.map((c) => c.dataValues || c);

    const map = new Map();
    const roots = [];

    nodes.forEach((node) => {
        node.replies = [];
        map.set(node.id, node);
    });

    nodes.forEach((node) => {
        if (node.replyToId === null) {
            roots.push(node);
        } else {
            const parent = map.get(node.replyToId);
            if (parent) {
                parent.replies.push(node);
            } else {
                roots.push(node);
            }
        }
    });

    return roots;
}
