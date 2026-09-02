# Eleven Capital

[English](#english) · [简体中文](#简体中文)

## English

The open-source website for Eleven Capital Limited, connecting AI agents,
custom product development and maintenance with blockchain research,
incubation and international business.

**Website:** [elevencapital.ltd](https://elevencapital.ltd/)

A trilingual, responsive static site with English at `/`, Traditional Chinese
at `/zh-hant/` and Simplified Chinese at `/zh-hans/`. The former `/en/` URL
redirects to `/`. Each language has dedicated `about/`, `services/`, `founder/`
and `partners/` pages. Navigation opens those pages and language switching
preserves the current section. Values and the full biography open by default.
Self-hosted fonts provide consistent Chinese and English typography.
The homepage connects four customer needs to relevant services. Service pages
outline deliverables and answer questions about scope, cost and ongoing support;
email links open a localized project inquiry template.
Every page renders complete HTML without JavaScript.
No third-party analytics, cookies, or runtime dependencies are required.

### Development

Requires Node.js 24.x. Install the build-time OpenCC dependency first.

```sh
npm ci
npm run dev
```

Open `http://127.0.0.1:4187`. Run `npm run build` to regenerate the site after
editing; `npm run check` verifies content, links, assets and metadata.

### Content and deployment

- `src/content.mjs`: Traditional Chinese and English source content; Simplified Chinese generated at build time, partner links.
- `src/styles.css`: responsive design tokens and layouts.
- `src/main.js`: mobile navigation and language-switch anchor continuity.
- `scripts/build.mjs`: static HTML and SEO metadata generation.
- `public/assets/`: website images, brand assets and licensed web fonts.
- `vercel.json`: deployment, security headers and legacy page redirects.

On Vercel, import this repository. Framework: **Other**; build command:
`npm run build`; output directory: `dist`. Add the apex and `www` domains in
project settings and follow the project's current DNS instructions. Preserve
mail and unrelated DNS records at the registrar.

The code is MIT-licensed. Brand assets, the portrait and company-specific copy
are excluded; see [ASSETS.md](ASSETS.md).

## 简体中文

十一资本官方网站源码。服务涵盖AI智能体、应用产品代开发、代维护、区块链与前沿应用研究、投研孵化及国际业务协同。

**正式网站：**[elevencapital.ltd](https://elevencapital.ltd/)

网站默认使用英文，提供简体中文、繁体中文和英文独立页面。每种语言都包含首页、关于我们、服务与能力、创始人、合作伙伴，共15个页面。导航直接进入子页面，切换语言保留当前栏目；完整履历与价值观默认展开。自托管字体统一中英文排版，支持手机与桌面浏览、搜索与社交分享信息，以及旧页面地址跳转。页面正文预先生成为 HTML，关闭 JavaScript 也能阅读。不接入第三方分析，不使用 Cookie，无运行时依赖。

首页按四类客户需求提供服务入口。服务页说明可约定的交付成果、合作流程、费用与维护安排；邮箱链接打开对应语言的项目咨询草稿。

### 本地运行

安装 Node.js 24.x 后运行 `npm ci`、`npm run dev`，打开 `http://127.0.0.1:4187`。修改后用 `npm run build` 重新生成，用 `npm run check` 核对内容、链接、素材与元信息。

中英文内容维护在 `src/content.mjs`，样式维护在 `src/styles.css`。Vercel 使用 Other 框架、`npm run build` 构建命令与 `dist` 输出目录。域名解析以 Vercel 当前项目实际要求为准，保留邮箱及无关解析。

代码采用 MIT 许可证；品牌名称、Logo、人物照片与公司专属文案不随代码开放使用权，详见 [ASSETS.md](ASSETS.md)。
