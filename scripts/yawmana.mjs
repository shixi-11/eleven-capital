import { readFile, writeFile, mkdir, cp } from 'node:fs/promises';
import { createHash } from 'node:crypto';
export const { policies, policySources } = JSON.parse(await readFile(new URL('../src/yawmana-content.json', import.meta.url), 'utf8'));
export const policySections = ['local','account','shared','backup','purchases','birthday','notifications','sharing','security','retention','choices','contact'];
export const productSections = ['support','privacy','account-deletion'];
export const productPath = (lang, section='support') => `${lang==='ar'?'/ar':''}/yawmana/${section==='support'?'':section+'/'}`;
export const yawmanaRoutes = ['en','ar'].flatMap(lang => productSections.map(section => ({lang,section,path:productPath(lang,section)})));
const esc = text => String(text).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const email = 'info@elevencapital.ltd';
const copy = {
  en: {
    brand:'Yawmana', support:'Help and support', privacy:'Privacy policy', 'account-deletion':'Request account deletion',
    description:'Help, privacy information and account deletion requests for Yawmana, operated by Eleven Capital Limited, Hong Kong.',
    skip:'Skip to content', nav:'Yawmana support', language:'Language', company:'Eleven Capital', contents:'On this page',
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
    skip:'الانتقال إلى المحتوى', nav:'دعم يومنا', language:'اللغة', company:'Eleven Capital', contents:'في هذه الصفحة',
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
};
const inline = text => esc(text).replaceAll(email, `<bdi dir="ltr">${email}</bdi>`).replace(/\b\d{4}-\d{2}-\d{2}\b/g, date => `<bdi dir="ltr">${date}</bdi>`);
const paragraph = text => `<p>${inline(text)}</p>`;
function contact(c, deletion=false) {
  const subject = deletion ? c.requestSubject : `${c.brand} — ${c.helpTitle}`;
  const body = deletion ? c.requestBody : '';
  const mailto = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  return `<div class="product-contact"><a class="product-primary" href="${esc(mailto)}">${esc(deletion?c.openRequest:c.openSupport)}<span aria-hidden="true">↗</span></a><button class="product-copy" type="button" data-copy-email data-copied="${esc(c.copied)}" data-copy-failed="${esc(c.copyFailed)}">${esc(c.copyEmail)}</button><a class="product-email" href="mailto:${email}"><bdi dir="ltr">${email}</bdi></a><p class="product-copy-status" role="status" aria-live="polite"></p></div>`;
}
function bodyFor(lang, section) {
  const c=copy[lang], p=policies[lang];
  if(section==='support')return `<div class="product-heading"><p class="product-eyebrow">${esc(c.brand)}</p><h1>${esc(c.support)}</h1>${paragraph(c.intro)}</div><div class="product-cards">${['privacy','account-deletion'].map((key,index)=>`<a class="product-card" href="${productPath(lang,key)}"><span class="product-card-number" aria-hidden="true">0${index+1}</span><h2>${esc(c[key])}<span aria-hidden="true">↗</span></h2>${paragraph(key==='privacy'?c.privacySummary:c.deletionSummary)}</a>`).join('')}</div><section class="product-support" aria-labelledby="support-contact"><h2 id="support-contact">${esc(c.helpTitle)}</h2>${paragraph(c.helpBody)}${contact(c)}</section>`;
  if(section==='privacy')return `<div class="product-heading"><p class="product-eyebrow">${esc(c.brand)}</p><h1>${esc(p.privacy_policy_title)}</h1><p class="product-updated">${inline(p.privacy_policy_updated)}</p>${paragraph(p.privacy_policy_intro)}</div><div class="product-policy"><nav class="product-contents" aria-label="${esc(c.contents)}"><p>${esc(c.contents)}</p><ol>${policySections.map(key=>`<li><a href="#${key}">${esc(p[`privacy_policy_${key}_title`])}</a></li>`).join('')}</ol></nav><div class="product-policy-copy">${policySections.map(key=>`<section id="${key}" aria-labelledby="${key}-title"><h2 id="${key}-title">${esc(p[`privacy_policy_${key}_title`])}</h2>${paragraph(p[`privacy_policy_${key}_body`])}</section>`).join('')}<aside class="product-policy-actions">${contact(c)}<a class="product-text-link" href="${productPath(lang,'account-deletion')}">${esc(c['account-deletion'])} →</a></aside></div></div>`;
  const article=(key)=>`<section aria-labelledby="${key}-title"><h2 id="${key}-title">${esc(c[key+'Title'])}</h2>${paragraph(c[key+'Body'])}</section>`;
  return `<div class="product-heading"><p class="product-eyebrow">${esc(c.brand)}</p><h1>${esc(c['account-deletion'])}</h1>${paragraph(c.deletionIntro)}</div><div class="product-deletion">${article('inApp')}<section class="product-request" aria-labelledby="email-title"><h2 id="email-title">${esc(c.emailTitle)}</h2>${paragraph(c.emailBody)}${contact(c,true)}<p class="product-notice">${esc(c.emailNotice)}</p></section>${['verify','effect','retain','timing','device'].map(article).join('')}<a class="product-text-link" href="${productPath(lang,'privacy')}">${esc(c.privacy)} →</a></div>`;
}
function page(lang, section, assets) {
  const c=copy[lang], path=productPath(lang,section), title=`${c.brand} | ${c[section]}`;
  return `<!doctype html><html lang="${lang}" dir="${lang==='ar'?'rtl':'ltr'}"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title><meta name="description" content="${esc(c.description)}"><link rel="canonical" href="https://elevencapital.ltd${path}">${['en','ar'].map(other=>`<link rel="alternate" hreflang="${other}" href="https://elevencapital.ltd${productPath(other,section)}">`).join('')}<link rel="alternate" hreflang="x-default" href="https://elevencapital.ltd${productPath('en',section)}"><meta property="og:type" content="website"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(c.description)}"><meta property="og:url" content="https://elevencapital.ltd${path}"><meta name="twitter:card" content="summary"><meta name="twitter:title" content="${esc(title)}"><meta name="twitter:description" content="${esc(c.description)}"><link rel="icon" href="/assets/favicon-christmas-tree.png" type="image/png"><link rel="stylesheet" href="${assets.siteCss}"><link rel="stylesheet" href="${assets.css}"><script defer src="${assets.js}"></script></head><body class="yawmana-site" id="top"><a class="skip" href="#main">${esc(c.skip)}</a><header class="product-header"><a class="product-brand" href="${productPath(lang)}">${esc(c.brand)}</a><nav aria-label="${esc(c.nav)}">${productSections.map(key=>`<a href="${productPath(lang,key)}"${key===section?' aria-current="page"':''}>${esc(c[key])}</a>`).join('')}</nav><div class="product-languages" aria-label="${esc(c.language)}">${['en','ar'].map(other=>`<a data-yawmana-language href="${productPath(other,section)}" hreflang="${other}" lang="${other}" dir="${other==='ar'?'rtl':'ltr'}"${other===lang?' aria-current="page"':''}>${other==='en'?'English':'العربية'}</a>`).join('')}</div></header><main id="main" class="product-main">${bodyFor(lang,section)}</main><footer class="product-footer"><div>${paragraph(c.operator)}<a href="${lang==='ar'?'/ar/':'/'}">${esc(c.company)} ↗</a></div><a href="#top">${lang==='ar'?'العودة إلى الأعلى':'Back to top'} ↑</a></footer></body></html>`;
}
export async function buildYawmana(siteCss) {
  const hash=async file=>createHash('sha256').update(await readFile(file)).digest('hex').slice(0,12);
  const assets={siteCss,css:`/yawmana.${await hash('src/yawmana.css')}.css`,js:`/yawmana.${await hash('src/yawmana.js')}.js`};
  await cp('src/yawmana.css','dist'+assets.css);await cp('src/yawmana.js','dist'+assets.js);
  for(const {lang,section,path} of yawmanaRoutes){await mkdir('dist'+path,{recursive:true});await writeFile('dist'+path+'index.html',page(lang,section,assets));}
  console.log('Built 6 Yawmana support, privacy and deletion-request pages.');
}
