"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPostSlugs = getPostSlugs;
exports.getPostBySlug = getPostBySlug;
exports.getAllPosts = getAllPosts;
var fs_1 = __importDefault(require("fs"));
var gray_matter_1 = __importDefault(require("gray-matter"));
var path_1 = require("path");
var postsDirectory = (0, path_1.join)(process.cwd(), "_posts");
function getPostSlugs() {
    return fs_1.default.readdirSync(postsDirectory);
}
function getPostBySlug(slug) {
    var realSlug = slug.replace(/\.md$/, "");
    var fullPath = (0, path_1.join)(postsDirectory, "".concat(realSlug, ".md"));
    var fileContents = fs_1.default.readFileSync(fullPath, "utf8");
    var _a = (0, gray_matter_1.default)(fileContents), data = _a.data, content = _a.content;
    return __assign(__assign({}, data), { slug: realSlug, content: content });
}
function getAllPosts() {
    var slugs = getPostSlugs();
    var topTitle = "Crazy Challenge: Run Llama 405B on a 8GB VRAM GPU";
    var posts = slugs
        .map(function (slug) { return getPostBySlug(slug); })
        // sort posts by date in descending order
        .sort(function (post1, post2) { return (post1.title == topTitle ? -1 : (post2.title == topTitle ? 1 : (post1.date > post2.date ? -1 : 1))); });
    return posts;
}
