import { readFile, writeFile, mkdir, cp } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { extraCopy, extraInviteCopy } from '../src/yawmana-copy.mjs';
export const { policies, policySources } = JSON.parse(await readFile(new URL('../src/yawmana-content.json', import.meta.url), 'utf8'));
export const policySections = ['local','account','shared','backup','purchases','birthday','notifications','sharing','security','diagnostics','legal','transfers','retention','rights','children','choices','contact'];
export const productSections = ['support','privacy','account-deletion'];
// 语言顺序即语言菜单顺序；prefix 与官网各语言首页一致，home 是页脚公司链接的去处。
export const yawmanaLanguages = [
  {lang:'en', prefix:'', label:'English', short:'EN', home:'/'},
  {lang:'ar', prefix:'/ar', label:'العربية', short:'AR', dir:'rtl', home:'/ar/'},
  {lang:'de', prefix:'/de', label:'Deutsch', short:'DE', home:'/de/'},
  {lang:'fr', prefix:'/fr', label:'Français', short:'FR', home:'/fr/'},
  {lang:'he', prefix:'/he', label:'עברית', short:'HE', dir:'rtl', home:'/'},
  {lang:'zh-Hant', prefix:'/zh-hant', label:'繁體中文', short:'繁', home:'/zh-hant/'},
  {lang:'zh-Hans', prefix:'/zh-hans', label:'简体中文', short:'简', home:'/zh-hans/'},
  {lang:'nl', prefix:'/nl', label:'Nederlands', short:'NL', home:'/'},
  {lang:'sv', prefix:'/sv', label:'Svenska', short:'SV', home:'/'},
  {lang:'da', prefix:'/da', label:'Dansk', short:'DA', home:'/'},
  {lang:'nb', prefix:'/nb', label:'Norsk', short:'NO', home:'/'},
  {lang:'fi', prefix:'/fi', label:'Suomi', short:'FI', home:'/'},
];
const language = lang => yawmanaLanguages.find(l => l.lang === lang);
export const directionOf = lang => language(lang).dir || 'ltr';
export const productPath = (lang, section='support') => `${language(lang).prefix}/yawmana/${section==='support'?'':section+'/'}`;
export const yawmanaRoutes = yawmanaLanguages.flatMap(({lang}) => productSections.map(section => ({lang,section,path:productPath(lang,section)})));
export const invitePath = lang => `${language(lang).prefix}/yawmana/invite/`;
export const yawmanaInviteRoutes = yawmanaLanguages.map(({lang}) => ({lang, path:invitePath(lang)}));
const esc = text => String(text).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const email = 'yawmana@elevencapital.ltd';
export const yawmanaCopy = {
  en: {
    brand:'Yawmana', support:'Help and support', privacy:'Privacy policy', 'account-deletion':'Request account deletion',
    description:'Help, privacy information and account deletion requests for Yawmana, operated by Eleven Capital Limited, Hong Kong.',
    skip:'Skip to content', nav:'Yawmana support', language:'Language', company:'Eleven Capital', contents:'On this page', backTop:'Back to top',
    intro:'Find help with your household data, account and privacy.',
    privacySummary:'Read what stays on your device, what you choose to share and how your information is handled.',
    deletionSummary:'Learn how to request deletion of your account and associated personal data, including when you cannot access the app.',
    helpTitle:'Contact support', helpBody:'For help with your account or the app, email us with a description of the issue and the app version if available. Do not include passwords, sign-in codes or payment card details.',
    openSupport:'Open a support email', copyEmail:'Copy email address', copied:'Email address copied.', copyFailed:'Copying is unavailable. Select and copy the email address below.',
    operator:'Operated by Eleven Capital Limited, Hong Kong.',
    deletionIntro:'You can request deletion of your account and associated personal data in the app or by email. You do not need to reinstall the app to send an email request.',
    inAppTitle:'In the app', inAppBody:'Open account settings and choose account deletion. You will be asked to verify your account and review the effect on any families you own before confirming.',
    emailTitle:'Request by email', emailBody:'Write to us from the email address registered to your account, or include that address so we can help verify ownership. State that you want your account and associated personal data deleted, and add any relevant details about access problems.',
    openRequest:'Open an email request', emailNotice:'This opens your email app with a draft. Review it and send it yourself; opening the draft does not submit a request.',
    verifyTitle:'Verifying your request', verifyBody:'We need to verify that the request concerns your account before taking action. We may contact you through the registered email address; do not send your password, one-time codes, payment card details or an original identity document.',
    effectTitle:'What deletion affects', effectBody:'Deletion removes your sign-in account and personal cloud records, including your private backup, profile and saved birthday information. Families you own are deleted, which affects other members who use those shared family records.',
    retainTitle:'What may remain', retainBody:'Shared history in families owned by others may remain after account references are removed or replaced. Limited security, anti-abuse and benefit-verification records may also remain where needed; deletion is a process, not an immediate erasure of every platform record or backup.',
    timingTitle:'After you request deletion', timingBody:'Processing depends on verifying account ownership and the shared records involved. If more information is needed, we may contact you using the registered address.',
    deviceTitle:'Your device and subscription', deviceBody:'An email request cannot erase copies stored on your devices or files you exported. Manage those copies locally, and manage or cancel any subscription separately in Google Play; removing app data or deleting an account does not itself cancel the subscription.',
    requestSubject:'Yawmana account deletion request', requestBody:'Hello,\nI would like to request deletion of my Yawmana account and associated personal data.\n\nRegistered email address:\nAdditional details (optional):',
  },
  ar: {
    brand:'يومنا', support:'المساعدة والدعم', privacy:'سياسة الخصوصية', 'account-deletion':'طلب حذف الحساب',
    description:'المساعدة ومعلومات الخصوصية وطلبات حذف حساب يومنا، الذي تشغله شركة Eleven Capital Limited في هونغ كونغ.',
    skip:'الانتقال إلى المحتوى', nav:'دعم يومنا', language:'اللغة', company:'Eleven Capital', contents:'في هذه الصفحة', backTop:'العودة إلى الأعلى',
    intro:'المساعدة في بيانات منزلك وحسابك وخصوصيتك.',
    privacySummary:'تعرّف على ما يبقى على جهازك وما تختار مشاركته وكيفية التعامل مع معلوماتك.',
    deletionSummary:'تعرّف على طريقة طلب حذف حسابك وبياناتك الشخصية المرتبطة به، حتى إذا تعذّر عليك الوصول إلى التطبيق.',
    helpTitle:'التواصل مع الدعم', helpBody:'للمساعدة في حسابك أو التطبيق، راسلنا مع وصف للمشكلة وإصدار التطبيق إن توفر. لا تُدرج كلمات المرور أو رموز تسجيل الدخول أو بيانات البطاقة المصرفية.',
    openSupport:'فتح رسالة للدعم', copyEmail:'نسخ البريد الإلكتروني', copied:'تم نسخ البريد الإلكتروني.', copyFailed:'النسخ غير متاح. يمكنك تحديد عنوان البريد الإلكتروني أدناه ونسخه.',
    operator:'تتولى تشغيله شركة Eleven Capital Limited في هونغ كونغ.',
    deletionIntro:'يمكنك طلب حذف حسابك وبياناتك الشخصية المرتبطة به من التطبيق أو عبر البريد الإلكتروني. لا تحتاج إلى إعادة تثبيت التطبيق لإرسال الطلب بالبريد.',
    inAppTitle:'من التطبيق', inAppBody:'افتح إعدادات الحساب واختر حذف الحساب. سيُطلب منك التحقق من حسابك ومراجعة أثر الحذف على أي أسرة تملكها قبل التأكيد.',
    emailTitle:'الطلب عبر البريد الإلكتروني', emailBody:'راسلنا من البريد الإلكتروني المسجل في حسابك، أو اذكر ذلك العنوان لمساعدتنا في التحقق من ملكية الحساب. وضّح أنك تريد حذف حسابك وبياناتك الشخصية المرتبطة به، وأضف أي تفاصيل ذات صلة بتعذّر الوصول إليه.',
    openRequest:'فتح رسالة لطلب الحذف', emailNotice:'يفتح هذا الزر مسودة في تطبيق البريد لديك. راجعها وأرسلها بنفسك؛ فتح المسودة لا يعني تقديم الطلب.',
    verifyTitle:'التحقق من طلبك', verifyBody:'نحتاج إلى التحقق من أن الطلب يخص حسابك قبل اتخاذ إجراء. قد نتواصل معك عبر البريد المسجل؛ لا ترسل كلمة المرور أو الرموز المؤقتة أو بيانات البطاقة المصرفية أو أصل وثيقة الهوية.',
    effectTitle:'ما الذي يشمله الحذف', effectBody:'يشمل الحذف حساب تسجيل الدخول وسجلاتك السحابية الشخصية، بما فيها نسختك الاحتياطية الخاصة وملفك الشخصي وبيانات الميلاد المحفوظة. تُحذف أيضًا الأسر التي تملكها، مما يؤثر على الأعضاء الآخرين الذين يستخدمون سجلات تلك الأسر المشتركة.',
    retainTitle:'ما الذي قد يبقى', retainBody:'قد يبقى السجل المشترك في الأسر التي يملكها آخرون بعد إزالة الإشارات إلى حسابك أو استبدالها. وقد تبقى عند الحاجة سجلات محدودة للأمان ومنع إساءة الاستخدام والتحقق من المزايا؛ فالحذف عملية معالجة وليس محوًا فوريًا لكل سجل لدى المنصة أو نسخة احتياطية.',
    timingTitle:'بعد طلب الحذف', timingBody:'تعتمد المعالجة على التحقق من ملكية الحساب والسجلات المشتركة المعنية. وقد نتواصل معك عبر العنوان المسجل إذا احتجنا إلى معلومات إضافية.',
    deviceTitle:'جهازك واشتراكك', deviceBody:'لا يتيح طلب البريد محو النسخ المحفوظة على أجهزتك أو الملفات التي صدّرتها. يمكنك إدارة تلك النسخ محليًا، وإدارة أي اشتراك أو إلغائه بشكل منفصل في Google Play؛ فحذف بيانات التطبيق أو الحساب لا يلغي الاشتراك تلقائيًا.',
    requestSubject:'طلب حذف حساب يومنا', requestBody:'مرحبًا،\nأطلب حذف حسابي في يومنا والبيانات الشخصية المرتبطة به.\n\nالبريد الإلكتروني المسجل:\nتفاصيل إضافية (اختيارية):',
  },
  ...extraCopy,
};
const inviteCopy = {
  en: {
    brand: 'Yawmana', language: 'Language', title: 'You have a family invitation', eyebrow: 'Family invitation',
    lead: 'Install Yawmana, then return to this page and choose “Open Yawmana” to accept the invitation.',
    note: 'If Yawmana is already installed, you can open it now.',
    open: 'Open Yawmana', play: 'Get on Google Play', copy: 'Copy invitation link', copied: 'Invitation link copied.',
    copyFailed: 'Copying is unavailable. Select and copy the invitation link below.', invalid: 'Open this page from a valid invitation link to continue.',
    urlLabel: 'Invitation link', footer: 'Yawmana is operated by Eleven Capital Limited, Hong Kong.',
  },
  ar: {
    brand: 'يومنا', language: 'اللغة', title: 'لديك دعوة إلى أسرة', eyebrow: 'دعوة إلى أسرة',
    lead: 'ثبّت تطبيق يومنا، ثم عُد إلى هذه الصفحة واختر «فتح يومنا» لقبول الدعوة.',
    note: 'إذا كان تطبيق يومنا مثبتًا بالفعل، يمكنك فتحه الآن.',
    open: 'فتح يومنا', play: 'الحصول عليه من Google Play', copy: 'نسخ رابط الدعوة', copied: 'تم نسخ رابط الدعوة.',
    copyFailed: 'النسخ غير متاح. يمكنك تحديد رابط الدعوة أدناه ونسخه.', invalid: 'افتح هذه الصفحة من رابط دعوة صالح للمتابعة.',
    urlLabel: 'رابط الدعوة', footer: 'تتولى تشغيل يومنا شركة Eleven Capital Limited في هونغ كونغ.',
  },
  ...extraInviteCopy,
};
// 下拉语言菜单沿用官网的 language-picker 样式；链接保留 data-*-language，切换语言时带上邀请片段。
const languageMenu = (lang, label, hrefFor, attr) => `<details class="language-picker product-languages"><summary aria-label="${esc(label)}"><svg class="language-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18"/></svg><span class="language-current">${esc(language(lang).short)}</span><span aria-hidden="true">⌄</span></summary><div class="language-options">${yawmanaLanguages.map(l=>`<a ${attr} href="${hrefFor(l.lang)}" hreflang="${l.lang}" lang="${l.lang}" dir="${l.dir||'ltr'}"${l.lang===lang?' aria-current="page"':''}>${esc(l.label)}</a>`).join('')}</div></details>`;
const inline = text => esc(text).replaceAll(email, `<bdi dir="ltr">${email}</bdi>`).replace(/\b\d{4}-\d{2}-\d{2}\b/g, date => `<bdi dir="ltr">${date}</bdi>`);
const paragraph = text => `<p>${inline(text)}</p>`;
function contact(c, deletion=false) {
  const subject = deletion ? c.requestSubject : `${c.brand} — ${c.helpTitle}`;
  const body = deletion ? c.requestBody : '';
  const mailto = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  return `<div class="product-contact"><a class="product-primary" href="${esc(mailto)}">${esc(deletion?c.openRequest:c.openSupport)}<span aria-hidden="true">↗</span></a><button class="product-copy" type="button" data-copy-email data-copied="${esc(c.copied)}" data-copy-failed="${esc(c.copyFailed)}">${esc(c.copyEmail)}</button><a class="product-email" href="mailto:${email}"><bdi dir="ltr">${email}</bdi></a><p class="product-copy-status" role="status" aria-live="polite"></p></div>`;
}
function bodyFor(lang, section) {
  const c=yawmanaCopy[lang], p=policies[lang];
  if(section==='support')return `<div class="product-heading"><p class="product-eyebrow">${esc(c.brand)}</p><h1>${esc(c.support)}</h1>${paragraph(c.intro)}</div><div class="product-cards">${['privacy','account-deletion'].map((key,index)=>`<a class="product-card" href="${productPath(lang,key)}"><span class="product-card-number" aria-hidden="true">0${index+1}</span><h2>${esc(c[key])}<span aria-hidden="true">↗</span></h2>${paragraph(key==='privacy'?c.privacySummary:c.deletionSummary)}</a>`).join('')}</div><section class="product-support" aria-labelledby="support-contact"><h2 id="support-contact">${esc(c.helpTitle)}</h2>${paragraph(c.helpBody)}${contact(c)}</section>`;
  if(section==='privacy')return `<div class="product-heading"><p class="product-eyebrow">${esc(c.brand)}</p><h1>${esc(p.privacy_policy_title)}</h1><p class="product-updated">${inline(p.privacy_policy_updated)}</p>${paragraph(p.privacy_policy_intro)}</div><div class="product-policy"><nav class="product-contents" aria-label="${esc(c.contents)}"><p>${esc(c.contents)}</p><ol>${policySections.map(key=>`<li><a href="#${key}">${esc(p[`privacy_policy_${key}_title`])}</a></li>`).join('')}</ol></nav><div class="product-policy-copy">${policySections.map(key=>`<section id="${key}" aria-labelledby="${key}-title"><h2 id="${key}-title">${esc(p[`privacy_policy_${key}_title`])}</h2>${paragraph(p[`privacy_policy_${key}_body`])}</section>`).join('')}<aside class="product-policy-actions">${contact(c)}<a class="product-text-link" href="${productPath(lang,'account-deletion')}">${esc(c['account-deletion'])} →</a></aside></div></div>`;
  const article=(key)=>`<section aria-labelledby="${key}-title"><h2 id="${key}-title">${esc(c[key+'Title'])}</h2>${paragraph(c[key+'Body'])}</section>`;
  return `<div class="product-heading"><p class="product-eyebrow">${esc(c.brand)}</p><h1>${esc(c['account-deletion'])}</h1>${paragraph(c.deletionIntro)}</div><div class="product-deletion">${article('inApp')}<section class="product-request" aria-labelledby="email-title"><h2 id="email-title">${esc(c.emailTitle)}</h2>${paragraph(c.emailBody)}${contact(c,true)}<p class="product-notice">${esc(c.emailNotice)}</p></section>${['verify','effect','retain','timing','device'].map(article).join('')}<a class="product-text-link" href="${productPath(lang,'privacy')}">${esc(c.privacy)} →</a></div>`;
}
function page(lang, section, assets) {
  const c=yawmanaCopy[lang], path=productPath(lang,section), title=`${c.brand} | ${c[section]}`;
  return `<!doctype html><html lang="${lang}" dir="${directionOf(lang)}"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title><meta name="description" content="${esc(c.description)}"><link rel="canonical" href="https://elevencapital.ltd${path}">${yawmanaLanguages.map(({lang:other})=>`<link rel="alternate" hreflang="${other}" href="https://elevencapital.ltd${productPath(other,section)}">`).join('')}<link rel="alternate" hreflang="x-default" href="https://elevencapital.ltd${productPath('en',section)}"><meta property="og:type" content="website"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(c.description)}"><meta property="og:url" content="https://elevencapital.ltd${path}"><meta name="twitter:card" content="summary"><meta name="twitter:title" content="${esc(title)}"><meta name="twitter:description" content="${esc(c.description)}"><link rel="icon" href="/assets/favicon-christmas-tree.png" type="image/png"><link rel="stylesheet" href="${assets.siteCss}"><link rel="stylesheet" href="${assets.css}"><script defer src="${assets.js}"></script></head><body class="yawmana-site" id="top"><a class="skip" href="#main">${esc(c.skip)}</a><header class="product-header"><a class="product-brand" href="${productPath(lang)}">${esc(c.brand)}</a><nav aria-label="${esc(c.nav)}">${productSections.map(key=>`<a href="${productPath(lang,key)}"${key===section?' aria-current="page"':''}>${esc(c[key])}</a>`).join('')}</nav>${languageMenu(lang,c.language,other=>productPath(other,section),'data-yawmana-language')}</header><main id="main" class="product-main">${bodyFor(lang,section)}</main><footer class="product-footer"><div>${paragraph(c.operator)}<a href="${language(lang).home}">${esc(c.company)} ↗</a></div><a href="#top">${esc(c.backTop)} ↑</a></footer></body></html>`;
}
function invitePage(lang, assets) {
  const c = inviteCopy[lang], path = invitePath(lang);
  const url = 'https://play.google.com/store/apps/details?id=ltd.elevencapital.yawmana';
  return `<!doctype html><html lang="${lang}" dir="${directionOf(lang)}"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(c.brand)} | ${esc(c.title)}</title><meta name="description" content="${esc(c.lead)}"><meta name="robots" content="noindex, nofollow"><meta name="referrer" content="no-referrer"><link rel="canonical" href="https://elevencapital.ltd${path}">${yawmanaLanguages.map(({lang:other})=>`<link rel="alternate" hreflang="${other}" href="https://elevencapital.ltd${invitePath(other)}">`).join('')}<link rel="alternate" hreflang="x-default" href="https://elevencapital.ltd${invitePath('en')}"><link rel="icon" href="/assets/yawmana-logo.png" type="image/png"><link rel="stylesheet" href="${assets.siteCss}"><link rel="stylesheet" href="${assets.css}"><link rel="stylesheet" href="${assets.inviteCss}"><script type="module" src="${assets.inviteJs}"></script></head><body class="yawmana-site yawmana-invite"><main class="invite-main"><header class="invite-header"><div class="invite-brand" aria-label="${esc(c.brand)}"><img class="invite-mark" src="/assets/yawmana-logo.png" width="48" height="48" alt=""><span>${esc(c.brand)}</span></div><nav class="invite-languages" aria-label="${esc(c.language)}">${languageMenu(lang,c.language,invitePath,'data-invite-language')}</nav></header><section class="invite-copy" aria-labelledby="invite-title"><p class="invite-eyebrow">${esc(c.eyebrow)}</p><h1 id="invite-title">${esc(c.title)}</h1><p class="invite-lead">${esc(c.lead)}</p><p class="invite-note">${esc(c.note)}</p><div class="invite-actions"><button class="invite-open" data-invite-open type="button" disabled>${esc(c.open)} <span aria-hidden="true">↗</span></button><a class="invite-play" href="${url}" target="_blank" rel="noopener noreferrer">${esc(c.play)} <span aria-hidden="true">↗</span></a><button class="invite-copy-button" data-invite-copy type="button" data-copied="${esc(c.copied)}" data-copy-failed="${esc(c.copyFailed)}" disabled>${esc(c.copy)}</button></div><p class="invite-status" data-invite-status data-invalid="${esc(c.invalid)}" role="status" aria-live="polite"></p><code class="invite-url" data-invite-url aria-label="${esc(c.urlLabel)}"></code></section></main><footer class="invite-footer"><p>${esc(c.footer)}</p></footer></body></html>`;
}
export async function buildYawmana(siteCss) {
  const hash=async file=>createHash('sha256').update(await readFile(file)).digest('hex').slice(0,12);
  const assets={siteCss,css:`/yawmana.${await hash('src/yawmana.css')}.css`,js:`/yawmana.${await hash('src/yawmana.js')}.js`,inviteCss:`/yawmana-invite.${await hash('src/yawmana-invite.css')}.css`,inviteJs:`/yawmana-invite.${await hash('src/yawmana-invite.js')}.js`};
  await cp('src/yawmana.css','dist'+assets.css);await cp('src/yawmana.js','dist'+assets.js);
  await cp('src/yawmana-invite.css','dist'+assets.inviteCss);await cp('src/yawmana-invite.js','dist'+assets.inviteJs);
  for(const {lang,section,path} of yawmanaRoutes){await mkdir('dist'+path,{recursive:true});await writeFile('dist'+path+'index.html',page(lang,section,assets));}
  for(const {lang,path} of yawmanaInviteRoutes){await mkdir('dist'+path,{recursive:true});await writeFile('dist'+path+'index.html',invitePage(lang,assets));}
  console.log(`Built ${yawmanaRoutes.length} Yawmana support, privacy and deletion-request pages and ${yawmanaInviteRoutes.length} invitation pages.`);
}
