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
- `src/locales/`: Japanese, Korean, Spanish, French, German and Arabic translations, each with complete page content and interface labels.
- `src/styles.css`: typography and responsive layouts.
- `src/main.js`: mobile navigation and language switching.
- `scripts/build.mjs`: static pages, metadata and sitemap generation.
- `public/assets/`: images, icons and licensed self-hosted fonts.
- `vercel.json`: deployment settings, headers and redirects.

English remains the default homepage at `/`. The language menu follows this order: Simplified Chinese `/zh-hans/`, Traditional Chinese `/zh-hant/`, English `/`, Japanese `/ja/`, Korean `/ko/`, Spanish `/es/`, French `/fr/`, German `/de/` and Arabic `/ar/`. Each language has a home page and `about/`, `services/`, `founder/` and `partners/` pages: 45 pages in total. Language switching retains the current page and section anchor.

Chinese is the editorial source for translation. Preserve the scope of services, factual qualifications and brand tone while writing naturally in each language. Spanish uses neutral business language suitable for readers in Spain and Latin America. Keep locale keys and array order aligned with the source. Arabic pages use `dir="rtl"`, logical CSS properties and isolated left-to-right email addresses. Check translated layouts on desktop, tablet and mobile after copy changes, including long words, menu labels and Arabic text shaping. The build emits canonical URLs, all nine language alternatives and a sitemap; `npm run check` verifies translation structure, language order, routes and font coverage.

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

英文与繁体中文内容位于`src/content.mjs`，简体中文通过OpenCC生成，日文、韩文、西班牙文、法文、德文和阿拉伯文位于`src/locales/`。排版位于`src/styles.css`，页面交互位于`src/main.js`，构建脚本位于`scripts/build.mjs`，素材位于`public/assets/`。

语言菜单依次为简体中文`/zh-hans/`、繁体中文`/zh-hant/`、英文`/`、日文`/ja/`、韩文`/ko/`、西班牙文`/es/`、法文`/fr/`、德文`/de/`、阿拉伯文`/ar/`，默认首页仍为英文。每种语言包含首页、关于我们、服务与能力、创始人、合作伙伴，共45个页面。切换语言时保留当前页面和章节锚点。

以中文为翻译原文，保留服务范围、事实限定与品牌语气，同时使用各语言自然的表达。西班牙文采用适合西班牙及拉美读者的通用商务表达。各语言的字段和数组顺序须与原文对应。阿拉伯文页面采用从右向左的阅读方向、逻辑方向样式，并单独处理邮箱的从左向右顺序。文案更新后检查桌面、平板与手机端的长词、菜单、断行和阿拉伯文字形连接。构建自动生成规范网址、九种语言互链和站点地图，`npm run check`检查翻译结构、语言顺序、页面地址与字体覆盖。

字体更新及素材授权见[ASSETS.md](ASSETS.md)。将代码用于其他机构时，请替换公司文案、品牌素材、联系方式和域名。

在Vercel导入仓库后，框架选择**Other**，构建命令填写`npm run build`，输出目录填写`dist`。域名解析以您自己的项目提供的DNS值为准，保留邮箱及无关记录。
