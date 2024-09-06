"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = __importStar(require("fs"));
var path = __importStar(require("path"));
var api_1 = require("../lib/api");
var pages = [
    { path: '/', priority: 1 },
];
var postsData = (0, api_1.getAllPosts)();
var postPages = postsData.map(function (post) {
    return {
        path: "/posts/".concat(post.slug),
        priority: 0.8,
    };
});
var generateSitemap = function () {
    var now = new Date().toISOString();
    var sitemap = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n  <urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n    ".concat(__spreadArray(__spreadArray([], pages, true), postPages, true).map(function (page) {
        return "\n      <url>\n        ".concat(page.path.startsWith('https://') ? "<loc>".concat(page.path, "</loc>") : "<loc>".concat("https://gavinliblog.com".concat(page.path), "</loc>"), "\n        <lastmod>").concat(now, "</lastmod>\n        <changefreq>daily</changefreq>\n        <priority>").concat(page.priority, "</priority>\n      </url>\n    ");
    })
        .join(''), "\n  </urlset>");
    fs.writeFileSync(path.join("./public", 'sitemap.xml'), sitemap);
};
generateSitemap();
