# Development guide

[English](#english) · [简体中文](#简体中文) · [Company overview](README.md)

## English

The Eleven Capital website is a responsive static site. It uses Node.js 24.x and OpenCC at build time, with no runtime framework. Pages contain complete HTML and remain readable with JavaScript disabled.

### Run locally

```sh
npm ci
npm run dev
```

Open `http://127.0.0.1:4187`. After editing, run `npm run build` to regenerate the site and `npm run check` to verify routes, links, language continuity, fonts, assets and metadata.

### Project structure

- `src/content.mjs`: English and Traditional Chinese content, with Simplified Chinese generated using OpenCC.
- `src/styles.css`: typography and responsive layouts.
- `src/main.js`: mobile navigation and language switching.
- `scripts/build.mjs`: static pages, metadata and sitemap generation.
- `public/assets/`: images, icons and licensed self-hosted fonts.
- `vercel.json`: deployment settings, headers and redirects.

English uses `/`, Simplified Chinese `/zh-hans/`, and Traditional Chinese `/zh-hant/`. Each language has a home page and `about/`, `services/`, `founder/` and `partners/` pages. Language switching retains the current section.

Font updates and asset licensing are documented in [ASSETS.md](ASSETS.md). If you adapt the code for another organisation, replace the company content, branding, contact details and domain references.

### Deploy

Import the repository into Vercel. Select **Other** as the framework, `npm run build` as the build command and `dist` as the output directory. Connect your domain using the DNS values shown for your own project, preserving mail and unrelated records.

## 简体中文

十一资本官网是响应式静态网站，构建时使用Node.js 24.x与OpenCC，无运行时框架依赖。页面预先生成为完整HTML，关闭JavaScript也能阅读。

### 本地运行

```sh
npm ci
npm run dev
```

打开`http://127.0.0.1:4187`。修改后运行`npm run build`重新生成网站，再运行`npm run check`核对页面地址、链接、语言切换、字体、素材与元信息。

### 维护与部署

英文与繁体中文内容位于`src/content.mjs`，简体中文通过OpenCC生成。排版位于`src/styles.css`，页面交互位于`src/main.js`，构建脚本位于`scripts/build.mjs`，素材位于`public/assets/`。

英文首页为`/`，简体中文为`/zh-hans/`，繁体中文为`/zh-hant/`。每种语言包含首页、关于我们、服务与能力、创始人、合作伙伴，共15个页面。语言切换保留当前栏目。

字体更新及素材授权见[ASSETS.md](ASSETS.md)。将代码用于其他机构时，请替换公司文案、品牌素材、联系方式和域名。

在Vercel导入仓库后，框架选择**Other**，构建命令填写`npm run build`，输出目录填写`dist`。域名解析以您自己的项目提供的DNS值为准，保留邮箱及无关记录。
