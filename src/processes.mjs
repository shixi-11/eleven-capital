import OpenCC from 'opencc-js';

// Diagram copy is kept in HTML so it remains readable, translatable and selectable.
export const processCopy = {
  'zh-Hant': {
    aiTitle: 'AI如何融入工作',
    ai: [['資料與需求','明確任務，連接已授權的資料。'],['檢索與處理','整理資訊，產出可供檢查的結果。'],['人工確認','核對內容，確認關鍵判斷與操作。'],['交付與執行','輸出成果，或執行已確認的操作。']],
    capitalTitle: '創業與資本支持路徑',
    capital: [['商業驗證','釐清市場、模式與產品方向。'],['融資準備','梳理計劃、估值與股權安排。'],['夥伴對接','接洽合適的產業夥伴與投資者。'],['協作推進','按項目條件協調後續工作。']],
    capitalNote: '各階段按項目需要組合，融資與交易另行評估。'
  },
  en: {
    aiTitle: 'How AI fits into your workflow',
    ai: [['Inputs and goals','Define the task and connect authorised sources.'],['Search and processing','Organise information and produce results for review.'],['Human review','Check content and approve key decisions and actions.'],['Delivery and action','Deliver the output or carry out approved actions.']],
    capitalTitle: 'A path for venture and capital support',
    capital: [['Business validation','Clarify the market, business model and product direction.'],['Financing preparation','Review plans, valuation and ownership arrangements.'],['Partner introductions','Engage relevant industry partners and investors.'],['Coordinated follow-through','Coordinate next steps around the project’s requirements.']],
    capitalNote: 'Stages are tailored to each project; financing and transactions are assessed separately.'
  },
  ja: {
    aiTitle: '業務にAIを取り入れる流れ',
    ai: [['資料と目的','作業を定義し、利用許可のある資料を接続。'],['検索と処理','情報を整理し、確認用の結果を作成。'],['人による確認','内容を精査し、重要な判断や操作を承認。'],['成果と実行','成果物を届け、承認済みの操作を実行。']],
    capitalTitle: '起業・資本支援の進め方',
    capital: [['事業の検証','市場、ビジネスモデル、製品の方向性を整理。'],['資金調達の準備','事業計画、評価額、株式保有構成を検討。'],['パートナーとの接点','適切な事業パートナーや投資家との協議。'],['連携して推進','案件の条件に応じて次の作業を調整。']],
    capitalNote: '支援段階は案件に応じて組み合わせます。資金調達や個別取引は別途検討します。'
  },
  ko: {
    aiTitle: '업무에 AI를 도입하는 흐름',
    ai: [['자료와 목표','작업을 정의하고 허가된 자료를 연결합니다.'],['검색과 처리','정보를 정리해 검토할 결과를 만듭니다.'],['사람의 확인','내용과 주요 판단, 실행할 작업을 확인합니다.'],['결과와 실행','결과물을 전달하거나 승인된 작업을 실행합니다.']],
    capitalTitle: '창업과 자본 지원의 흐름',
    capital: [['사업 검증','시장, 비즈니스 모델과 제품 방향을 정리합니다.'],['자금 조달 준비','계획, 기업가치와 지분 구조를 검토합니다.'],['파트너 연결','적합한 산업 파트너 및 투자자와 협의합니다.'],['협력 추진','프로젝트 여건에 맞춰 후속 업무를 조율합니다.']],
    capitalNote: '단계는 프로젝트에 맞게 구성하며, 자금 조달과 개별 거래는 별도로 검토합니다.'
  },
  es: {
    aiTitle: 'Cómo integrar la IA en su trabajo',
    ai: [['Datos y objetivos','Definir la tarea y conectar fuentes autorizadas.'],['Búsqueda y procesamiento','Organizar la información y preparar resultados para revisar.'],['Revisión humana','Verificar el contenido y aprobar decisiones y acciones clave.'],['Entrega y ejecución','Entregar los resultados o ejecutar las acciones aprobadas.']],
    capitalTitle: 'Un recorrido de apoyo empresarial y de capital',
    capital: [['Validación del negocio','Definir el mercado, el modelo de negocio y el producto.'],['Preparación financiera','Revisar planes, valoración y estructura accionarial.'],['Contactos estratégicos','Contactar con colaboradores del sector e inversores adecuados.'],['Coordinación y seguimiento','Coordinar los siguientes pasos según el proyecto.']],
    capitalNote: 'Las etapas se adaptan a cada proyecto; la financiación y las operaciones se evalúan por separado.'
  },
  fr: {
    aiTitle: 'Intégrer l’IA à votre travail',
    ai: [['Données et objectifs','Définir la tâche et connecter les sources autorisées.'],['Recherche et traitement','Organiser les informations et préparer les résultats à vérifier.'],['Validation humaine','Vérifier le contenu et approuver les décisions et actions clés.'],['Livraison et exécution','Livrer les résultats ou exécuter les actions approuvées.']],
    capitalTitle: 'Le parcours d’accompagnement entrepreneurial et financier',
    capital: [['Validation du projet','Préciser le marché, le modèle économique et le produit.'],['Préparation du financement','Examiner les plans, la valorisation et l’actionnariat.'],['Mise en relation','Échanger avec les partenaires sectoriels et investisseurs adaptés.'],['Suivi coordonné','Coordonner la suite selon les conditions du projet.']],
    capitalNote: 'Les étapes sont adaptées au projet ; financements et opérations sont examinés séparément.'
  },
  de: {
    aiTitle: 'So fügt sich KI in Ihre Abläufe ein',
    ai: [['Daten und Ziele','Aufgabe definieren und freigegebene Quellen anbinden.'],['Suche und Verarbeitung','Informationen ordnen und Ergebnisse zur Prüfung vorbereiten.'],['Menschliche Prüfung','Inhalte prüfen und wichtige Entscheidungen und Aktionen freigeben.'],['Ergebnisse und Ausführung','Ergebnisse liefern oder freigegebene Aktionen ausführen.']],
    capitalTitle: 'Der Weg zur Gründungs- und Kapitalunterstützung',
    capital: [['Geschäftsmodell prüfen','Markt, Geschäftsmodell und Produktrichtung klären.'],['Finanzierung vorbereiten','Pläne, Bewertung und Beteiligungsstruktur prüfen.'],['Partner ansprechen','Passende Branchenpartner und Investoren einbeziehen.'],['Umsetzung koordinieren','Weitere Schritte nach den Projektanforderungen abstimmen.']],
    capitalNote: 'Die Phasen richten sich nach dem Projekt; Finanzierungen und Transaktionen werden gesondert geprüft.'
  },
  ar: {
    aiTitle: 'كيف يندمج الذكاء الاصطناعي في العمل',
    ai: [['البيانات والأهداف','تحديد المهمة وربط المصادر المصرّح باستخدامها.'],['البحث والمعالجة','تنظيم المعلومات وإعداد نتائج قابلة للمراجعة.'],['المراجعة البشرية','التحقق من المحتوى واعتماد القرارات والإجراءات الأساسية.'],['التسليم والتنفيذ','تسليم النتائج أو تنفيذ الإجراءات المعتمدة.']],
    capitalTitle: 'مسار دعم المشاريع ورأس المال',
    capital: [['التحقق من جدوى الأعمال','توضيح السوق ونموذج الأعمال واتجاه المنتج.'],['التحضير للتمويل','مراجعة الخطط والتقييم وهيكل الملكية.'],['التواصل مع الشركاء','التواصل مع شركاء القطاعات والمستثمرين المناسبين.'],['تنسيق المتابعة','تنسيق الخطوات التالية وفق متطلبات المشروع.']],
    capitalNote: 'تُكيّف المراحل حسب المشروع، ويُقيّم التمويل والمعاملات بشكل منفصل.'
  }
};
const toSimplified = OpenCC.Converter({from:'hk',to:'cn'});
processCopy['zh-Hans'] = JSON.parse(toSimplified(JSON.stringify(processCopy['zh-Hant'])));

const paths = {
  sources: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h4"/>',
  process: '<rect x="7" y="7" width="10" height="10" rx="2"/><path d="M9 3v4m6-4v4M9 17v4m6-4v4M3 9h4m-4 6h4m10-6h4m-4 6h4"/>',
  review: '<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/>',
  output: '<path d="M12 3v12m-4-4 4 4 4-4M4 15v5h16v-5"/>',
  validate: '<circle cx="10" cy="10" r="6"/><path d="m14.5 14.5 5 5M7 10h6m-3-3v6"/>',
  plan: '<path d="M5 4h14v17H5zM9 2v4m6-4v4M9 10h6m-6 4h6m-6 4h3"/>',
  connect: '<circle cx="5" cy="12" r="3"/><circle cx="18" cy="5" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8 10 7-4m-7 8 7 4"/>',
  sustain: '<path d="M20 8a8 8 0 0 0-14-3L3 8m0-5v5h5M4 16a8 8 0 0 0 14 3l3-3m0 5v-5h-5"/>',
};
export function processIcon(name) {
  return `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]}</svg>`;
}
const esc = value => String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
export function processSteps(steps, icons, compact = false) {
  return `<ol class="process-steps${compact ? ' process-steps--compact' : ''}">${steps.map(([title,detail],i)=>`<li><span class="process-node">${processIcon(icons[i])}</span><div><strong>${esc(title)}</strong>${compact ? '' : `<p>${esc(detail)}</p>`}</div></li>`).join('')}</ol>`;
}
export function serviceProcess(c, id) {
  const copy=processCopy[c.lang];
  const key=id==='technology'?'ai':id==='capital'?'capital':null;
  if(!key)return '';
  const icons=key==='ai'?['sources','process','review','output']:['validate','plan','connect','sustain'];
  return `<figure class="service-process" aria-labelledby="${id}-process-title"><figcaption id="${id}-process-title">${esc(copy[key+'Title'])}</figcaption>${processSteps(copy[key],icons)}${key==='capital'?`<p class="process-note">${esc(copy.capitalNote)}</p>`:''}</figure>`;
}
