import { invalidQuillContent, validQuillContent } from "../helpers/quillContent";

export const invalidArticleCases = [
    {
        name: "invalid quill content",
        body: {
            title: "Invalid content",
            summary: "Summary",
            content: invalidQuillContent(),
            status: "DRAFT",
        },
        error: /Invalid Quill content/i,
    },
    {
        name: "stringified invalid JSON",
        body: {
            title: "Bad JSON",
            summary: "Oops",
            content: "{not-json}",
            status: "DRAFT",
        },
        error: /Invalid content/i,
    },
    {
        name: "invalid article status",
        body: {
            title: "Bad status",
            summary: "Test",
            content: validQuillContent(),
            status: "DELETED",
        },
        error: /Invalid status/i,
    },
    {
        name: "published without cover",
        body: {
            title: "Published",
            summary: "Summary",
            content: validQuillContent(),
            status: "PUBLISHED",
        },
        error: /Cover is required/i,
    },
    {
        name: "missing status",
        body: {
            title: "Draft",
            summary: "Summary",
            content: validQuillContent(),
        },
        error: /Missing parameters/i,
    },
    {
        name: "missing content",
        body: {
            title: "Draft",
            summary: "Summary",
            status: "DRAFT",
        },
        error: /Missing parameters/i,
    },
    {
        name: "invalid cover on draft",
        body: {
            title: "Draft",
            summary: "Summary",
            content: validQuillContent(),
            coverID: 42,
            coverAlt: "Cover alt",
            status: "DRAFT",
        },
        error: /Cover must be a valid Cloudinary URL if provided/i,
    },
    {
        name: "missing alt on draft",
        body: {
            title: "Draft",
            summary: "Summary",
            content: validQuillContent(),
            coverID: "cloudinary://image",
            status: "DRAFT",
        },
        error: /An alt field is required for cover images/i,
    },
    {
        name: "missing alt on published",
        body: {
            title: "Published",
            summary: "Summary",
            content: validQuillContent(),
            coverID: "cloudinary://image",
            status: "PUBLISHED",
        },
        error: /A cover alt field is mandatory for accessibility purposes./i,
    },
];
