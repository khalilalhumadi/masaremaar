// content.ts — bilingual content store for Masar Emaar
// All copy lives here so it's easy to wire to a real CMS later.

export type Locale = "en" | "ar";
export const LOCALES: Locale[] = ["en", "ar"];
export const DEFAULT_LOCALE: Locale = "en";

// A display-title is an array of plain strings and {em} runs (gold accent).
export type TitlePart = string | { em: string };

export const CONTENT = {
  brand: {
    en: { name: "Masar Emaar", tagline: "Contracting Co." },
    ar: { name: "مسار إعمار", tagline: "شركة المقاولات" },
  },

  nav: {
    en: [
      { id: "home", label: "Home" },
      { id: "about", label: "About" },
      { id: "services", label: "Services" },
      { id: "projects", label: "Projects" },
      { id: "how", label: "How We Work" },
      { id: "profile", label: "Company Profile" },
      { id: "contact", label: "Contact" },
    ],
    ar: [
      { id: "home", label: "الرئيسية" },
      { id: "about", label: "من نحن" },
      { id: "services", label: "الخدمات" },
      { id: "projects", label: "المشاريع" },
      { id: "how", label: "منهجية العمل" },
      { id: "profile", label: "ملف الشركة" },
      { id: "contact", label: "تواصل معنا" },
    ],
  },

  hero: {
    en: {
      eyebrow: "Riyadh, Saudi Arabia — Est. 2017",
      title: ["Shaping", "landscapes,", { em: "delivering" }, "excellence."] as TitlePart[],
      sub: "A trusted Saudi contracting and civil engineering firm building infrastructure, industrial facilities, and landmark developments aligned with Vision 2030.",
      ctaPrimary: "Explore our work",
      ctaSecondary: "Request a proposal",
      metaLabel: "Years of operation",
      metaSuffix: "Years",
    },
    ar: {
      eyebrow: "الرياض، المملكة العربية السعودية — تأسست 2017",
      title: ["نُشكّل الفضاءات،", { em: "ونُسلّم" }, "بإتقان."] as TitlePart[],
      sub: "شركة سعودية موثوقة في المقاولات والهندسة المدنية، نُنفّذ مشاريع البنية التحتية والمنشآت الصناعية والتطويرات الكبرى بما يتماشى مع رؤية 2030.",
      ctaPrimary: "استعرض أعمالنا",
      ctaSecondary: "اطلب عرض سعر",
      metaLabel: "سنوات من العمل",
      metaSuffix: "سنوات",
    },
  },

  intro: {
    en: {
      eyebrow: "About the company",
      title: ["Quality and customer", "confidence are", { em: "our principles." }] as TitlePart[],
      lede: "Established in 2017 and headquartered in Al Olaya, Riyadh, Masar Emaar Contracting Company has grown into a trusted name in the contracting industry.",
      body: [
        "From state-of-the-art buildings to complex civil engineering projects, our success stems from a commitment to excellence, innovation, and sustainability.",
        "We provide high-quality, reliable solutions that exceed client expectations — supported by a skilled workforce and strong partnerships across the Kingdom.",
      ],
      cta: "About Masar Emaar",
    },
    ar: {
      eyebrow: "عن الشركة",
      title: ["الجودة وثقة العميل", { em: "هي مبادئنا." }] as TitlePart[],
      lede: "تأسست شركة مسار إعمار للمقاولات عام 2017 ومقرها حي العليا في الرياض، وأصبحت اسماً موثوقاً به في قطاع المقاولات.",
      body: [
        "من تشييد المباني الحديثة إلى تنفيذ مشاريع الهندسة المدنية المعقّدة، يستند نجاحنا إلى التزامنا بالتميّز والابتكار والاستدامة.",
        "نقدّم حلولاً عالية الجودة تتجاوز توقعات عملائنا، مدعومة بكوادر بشرية مؤهّلة وشراكات قويّة في جميع أنحاء المملكة.",
      ],
      cta: "تعرّف على مسار إعمار",
    },
  },

  stats: {
    en: [
      { num: "2017", label: "Year established" },
      { num: "9", sup: "+", label: "Years of experience" },
      { num: "13", sup: "+", label: "Major projects delivered" },
      { num: "6", label: "Service disciplines" },
    ],
    ar: [
      { num: "2017", label: "سنة التأسيس" },
      { num: "9", sup: "+", label: "سنوات من الخبرة" },
      { num: "13", sup: "+", label: "مشروع كبير منجز" },
      { num: "6", label: "تخصصات الخدمة" },
    ],
  },

  services: {
    en: {
      eyebrow: "What we do",
      title: ["Comprehensive contracting,", { em: "engineered" }, "precisely."] as TitlePart[],
      cta: "All services",
      items: [
        { id: "building", icon: "building", title: "Building Construction & Equipping", desc: "Delivering high-quality construction solutions, including the full equipping of buildings to meet both functional and aesthetic requirements." },
        { id: "precast", icon: "precast", title: "Precast & General Construction", desc: "Efficient precast solutions alongside general construction services for residential, commercial, and industrial projects." },
        { id: "infrastructure", icon: "roads", title: "Infrastructure & Roadworks", desc: "Specialised in the construction of canals, roads, and railways, ensuring durable and sustainable infrastructure across the Kingdom." },
        { id: "mep", icon: "mep", title: "Electrical & Plumbing (MEP)", desc: "Expert design, installation, and maintenance of electrical systems and plumbing networks for buildings of any scale." },
        { id: "civil", icon: "civil", title: "Civil & Structural Engineering", desc: "Executing complex civil engineering and architectural projects with precision, innovative design, and structural integrity." },
        { id: "woodmetal", icon: "fabrication", title: "Woodwork & Metal Fabrication", desc: "High-quality wood and metal structures crafted to each project’s unique specifications — from joinery to architectural metalwork." },
      ],
    },
    ar: {
      eyebrow: "ما نقدّمه",
      title: ["مقاولات متكاملة،", { em: "بدقّة هندسية." }] as TitlePart[],
      cta: "جميع الخدمات",
      items: [
        { id: "building", icon: "building", title: "تشييد المباني والتجهيز", desc: "حلول إنشاء عالية الجودة تشمل التجهيز الكامل للمباني لتلبية المتطلبات الوظيفية والجمالية على حدٍّ سواء." },
        { id: "precast", icon: "precast", title: "الخرسانة الجاهزة والإنشاءات العامة", desc: "حلول خرسانية جاهزة وخدمات إنشاء عامة للمشاريع السكنية والتجارية والصناعية." },
        { id: "infrastructure", icon: "roads", title: "البنية التحتية والطرق", desc: "متخصصون في إنشاء القنوات والطرق والسكك الحديدية، لضمان بنية تحتية متينة ومستدامة في جميع أنحاء المملكة." },
        { id: "mep", icon: "mep", title: "الخدمات الكهربائية والصحية", desc: "تصميم وتركيب وصيانة الأنظمة الكهربائية والشبكات الصحية بخبرة عالية لمختلف أنواع المباني." },
        { id: "civil", icon: "civil", title: "الهندسة المدنية والإنشائية", desc: "تنفيذ مشاريع الهندسة المدنية والمعمارية المعقّدة بدقّة وتصاميم مبتكرة وسلامة إنشائية." },
        { id: "woodmetal", icon: "fabrication", title: "الأعمال الخشبية والتصنيع المعدني", desc: "هياكل خشبية ومعدنية عالية الجودة مصمّمة وفق متطلبات كل مشروع — من النجارة إلى الأعمال المعدنية المعمارية." },
      ],
    },
  },

  projects: {
    en: {
      eyebrow: "Selected projects",
      title: ["Delivering across the Kingdom’s", { em: "most demanding" }, "sectors."] as TitlePart[],
      cta: "View all projects",
      filters: ["All", "Infrastructure", "Industrial", "Public", "Residential", "Transport"],
    },
    ar: {
      eyebrow: "مشاريع مختارة",
      title: ["ننفّذ في أكثر القطاعات", { em: "تطلّباً" }, "في المملكة."] as TitlePart[],
      cta: "جميع المشاريع",
      filters: ["الكل", "البنية التحتية", "الصناعة", "القطاع العام", "السكنية", "النقل"],
    },
  },

  projectList: [
    { id: "sadara", title: { en: "Sadara Project", ar: "مشروع صدارة" }, location: { en: "Jubail Industrial City", ar: "مدينة الجبيل الصناعية" }, category: { en: "Industrial", ar: "الصناعة" }, year: "2024", featured: true,
      desc: { en: "Industrial works on one of the Kingdom’s largest petrochemical complexes — covering structural, MEP and finishing scopes.", ar: "أعمال صناعية ضمن أحد أكبر المجمعات البتروكيماوية في المملكة، شملت الأعمال الإنشائية والكهروميكانيكية والتشطيبات." } },
    { id: "shifa", title: { en: "Al-Shifa Housing", ar: "إسكان الشفا" }, location: { en: "Riyadh", ar: "الرياض" }, category: { en: "Residential", ar: "السكنية" }, year: "2023", featured: false,
      desc: { en: "Residential development in south Riyadh — full structural and finishing works across multiple housing blocks.", ar: "مشروع تطوير سكني في جنوب الرياض، شمل الأعمال الإنشائية والتشطيبات الكاملة عبر عدّة مجمّعات سكنية." } },
    { id: "3j1", title: { en: "3J1 Riyadh Metro", ar: "مترو الرياض 3J1" }, location: { en: "Riyadh", ar: "الرياض" }, category: { en: "Transport", ar: "النقل" }, year: "2022", featured: true,
      desc: { en: "Finishing works package on the Riyadh Metro — paints, gypsum board installations and architectural detailing across multiple stations.", ar: "حزمة أعمال تشطيب ضمن مشروع مترو الرياض — دهانات وتركيب ألواح جبس وتفاصيل معمارية في عدّة محطات." } },
    { id: "power-qassim", title: { en: "Qassim Power Station", ar: "محطة قوى القصيم" }, location: { en: "Qassim Road", ar: "طريق القصيم" }, category: { en: "Infrastructure", ar: "البنية التحتية" }, year: "2022", featured: false,
      desc: { en: "Civil works on a regional power station along the Qassim corridor — foundations, structural concrete and access works.", ar: "أعمال مدنية لمحطة طاقة إقليمية على محور القصيم — أساسات وخرسانات إنشائية وأعمال وصول." } },
    { id: "security-abha", title: { en: "General Security Project", ar: "مشروع الأمن العام" }, location: { en: "Abha", ar: "أبها" }, category: { en: "Public", ar: "القطاع العام" }, year: "2021", featured: false,
      desc: { en: "Large-scale civil works in Abha — focused on structural integrity and foundational excellence for a public security facility.", ar: "أعمال مدنية واسعة في أبها — مركّزة على السلامة الإنشائية وجودة الأساسات لمنشأة أمنية حكومية." } },
    { id: "king-fahd", title: { en: "King Fahd Causeway", ar: "جسر الملك فهد" }, location: { en: "Eastern Province", ar: "المنطقة الشرقية" }, category: { en: "Infrastructure", ar: "البنية التحتية" }, year: "2020", featured: true,
      desc: { en: "Civil, MEP and finishing works on the vital King Fahd Causeway — structural construction, full MEP and modern interior finishes.", ar: "أعمال مدنية وكهروميكانيكية وتشطيبات على جسر الملك فهد الحيوي — إنشاءات وتشطيبات داخلية حديثة." } },
    { id: "salwa", title: { en: "Salwa Project", ar: "مشروع سلوى" }, location: { en: "Riyadh", ar: "الرياض" }, category: { en: "Residential", ar: "السكنية" }, year: "2020", featured: false,
      desc: { en: "Comprehensive development covering MEP, civil and finishing — integrated coordination across multiple disciplines.", ar: "مشروع تطوير شامل غطّى الأعمال المدنية والكهروميكانيكية والتشطيبات بتنسيق متكامل بين التخصصات." } },
    { id: "kku", title: { en: "King Khalid University", ar: "جامعة الملك خالد" }, location: { en: "Abha", ar: "أبها" }, category: { en: "Public", ar: "القطاع العام" }, year: "2019", featured: false,
      desc: { en: "Campus facilities works at King Khalid University in Abha — academic and support buildings.", ar: "أعمال منشآت جامعية في جامعة الملك خالد بأبها — مبانٍ أكاديمية ومنشآت مساندة." } },
    { id: "kafo", title: { en: "KAFO 409–412", ar: "مشروع KAFO 409–412" }, location: { en: "Saudi Arabia", ar: "المملكة العربية السعودية" }, category: { en: "Industrial", ar: "الصناعة" }, year: "2019", featured: false,
      desc: { en: "Industrial scope works across the KAFO 409–412 packages — structural and MEP coordination.", ar: "أعمال صناعية ضمن حزم KAFO 409–412 — تنسيق إنشائي وكهروميكانيكي." } },
    { id: "mashriah", title: { en: "Al-Mashriah Project", ar: "مشروع المشرية" }, location: { en: "Saudi Arabia", ar: "المملكة العربية السعودية" }, category: { en: "Residential", ar: "السكنية" }, year: "2019", featured: false,
      desc: { en: "Residential and mixed-use construction with full finishing scope.", ar: "مشروع سكني ومتعدّد الاستخدامات بأعمال تشطيب كاملة." } },
    { id: "pnu-metro", title: { en: "Princess Noura University Station", ar: "محطة جامعة الأميرة نورة" }, location: { en: "Riyadh Metro", ar: "مترو الرياض" }, category: { en: "Transport", ar: "النقل" }, year: "2018", featured: true,
      desc: { en: "Major metro station on the Riyadh Metro at Princess Noura University — civil, MEP, and architectural finishing.", ar: "محطة مترو رئيسية في جامعة الأميرة نورة ضمن مترو الرياض — أعمال مدنية وكهروميكانيكية وتشطيبات معمارية." } },
    { id: "aramco-haradh", title: { en: "Aramco Haradh Project", ar: "مشروع أرامكو حرض" }, location: { en: "Haradh", ar: "حرض" }, category: { en: "Industrial", ar: "الصناعة" }, year: "2018", featured: false,
      desc: { en: "Industrial works package for Saudi Aramco at the Haradh field — civil and structural scopes.", ar: "حزمة أعمال صناعية لأرامكو السعودية في حقل حرض — نطاق مدني وإنشائي." } },
    { id: "royal-commission", title: { en: "Royal Commission Project", ar: "مشروع الهيئة الملكية" }, location: { en: "Jubail / Yanbu", ar: "الجبيل / ينبع" }, category: { en: "Public", ar: "القطاع العام" }, year: "2017", featured: false,
      desc: { en: "Strategic infrastructure works under the Royal Commission for Jubail and Yanbu.", ar: "أعمال بنية تحتية استراتيجية تحت إشراف الهيئة الملكية للجبيل وينبع." } },
  ],

  about: {
    en: {
      eyebrow: "About us",
      title: ["Building a legacy of", { em: "quality and reliability." }] as TitlePart[],
      sub: "Since 2017, Masar Emaar has been dedicated to delivering excellence in contracting and construction across Saudi Arabia.",
      visionTitle: "Our Vision",
      vision: "To be a trusted leader in the construction and contracting industry — recognized for pioneering solutions, operational excellence, and a commitment to transforming landscapes and communities in Saudi Arabia and beyond.",
      missionTitle: "Our Mission",
      mission: "To deliver innovative and reliable contracting services by leveraging modern technologies, skilled expertise, and sustainable practices, ensuring the highest standards of quality and customer satisfaction in every project.",
      mdEyebrow: "Managing Director’s Statement",
      mdName: "Mr. Khalil Al-Humadi",
      mdRole: "Managing Director",
      mdStatement: "Since our establishment in 2017, Masar Emaar Contracting Company has grown into a trusted name in the contracting industry. From constructing state-of-the-art buildings to delivering complex civil engineering projects, our success stems from a commitment to excellence, innovation, and sustainability. Looking ahead, we aim to lead the industry by embracing cutting-edge technologies and fostering sustainable practices.",
      teamTitle: "Our professional team",
      teamSub: "A talented team of professionals — spanning management, finance, engineering and procurement — ensuring the highest standards at every step.",
      departments: [
        { name: "Managing Director", desc: "Strategic leadership and oversight of all operations." },
        { name: "Operations Department", desc: "Day-to-day project delivery and coordination." },
        { name: "Project Department", desc: "End-to-end project management and engineering." },
        { name: "Service Department", desc: "Client services and after-handover support." },
        { name: "Logistics Department", desc: "Procurement, materials and site logistics." },
        { name: "Finance", desc: "Cost control, budgeting and financial planning." },
        { name: "Administration / HR", desc: "People, compliance and organisational support." },
      ],
    },
    ar: {
      eyebrow: "من نحن",
      title: ["نبني إرثاً من", { em: "الجودة والموثوقية." }] as TitlePart[],
      sub: "منذ عام 2017، التزمت مسار إعمار بتقديم التميّز في المقاولات والإنشاءات في جميع أنحاء المملكة العربية السعودية.",
      visionTitle: "رؤيتنا",
      vision: "أن نكون قائداً موثوقاً في صناعة المقاولات والإنشاءات، نُعرف بحلولنا الرائدة وتميّزنا التشغيلي والتزامنا بتحويل الفضاءات والمجتمعات في المملكة العربية السعودية وخارجها.",
      missionTitle: "رسالتنا",
      mission: "تقديم خدمات مقاولات مبتكرة وموثوقة من خلال توظيف التقنيات الحديثة والخبرات الماهرة والممارسات المستدامة، لضمان أعلى معايير الجودة ورضا العملاء في كل مشروع.",
      mdEyebrow: "كلمة المدير العام",
      mdName: "الأستاذ خليل الحمادي",
      mdRole: "المدير العام",
      mdStatement: "منذ تأسيس الشركة عام 2017، نمت مسار إعمار للمقاولات لتصبح اسماً موثوقاً في قطاع المقاولات. من تشييد المباني الحديثة إلى تنفيذ مشاريع الهندسة المدنية المعقّدة، يستند نجاحنا إلى التزامنا بالتميّز والابتكار والاستدامة. ونتطلّع قُدماً إلى قيادة الصناعة عبر تبنّي أحدث التقنيات وتعزيز الممارسات المستدامة.",
      teamTitle: "فريقنا المهني",
      teamSub: "فريق من الكوادر المؤهّلة في الإدارة والمالية والهندسة والمشتريات — يضمن أعلى المعايير في كل خطوة.",
      departments: [
        { name: "المدير العام", desc: "القيادة الاستراتيجية والإشراف العام على العمليات." },
        { name: "إدارة العمليات", desc: "تنفيذ المشاريع وتنسيقها يومياً." },
        { name: "إدارة المشاريع", desc: "إدارة المشاريع والهندسة من البداية إلى التسليم." },
        { name: "إدارة الخدمات", desc: "خدمات العملاء ودعم ما بعد التسليم." },
        { name: "إدارة الخدمات اللوجستية", desc: "المشتريات والمواد ولوجستيات المواقع." },
        { name: "الإدارة المالية", desc: "ضبط التكاليف والميزانيات والتخطيط المالي." },
        { name: "الإدارة / الموارد البشرية", desc: "الأفراد والامتثال والدعم التنظيمي." },
      ],
    },
  },

  why: {
    en: {
      eyebrow: "Why Masar Emaar",
      title: ["Trusted on the Kingdom’s", { em: "most demanding" }, "projects."] as TitlePart[],
      items: [
        { title: "Aligned with Vision 2030", desc: "Every project contributes to Saudi Arabia’s national development goals — sustainably, locally, and at scale." },
        { title: "End-to-end capability", desc: "From civil and structural to MEP, precast, woodwork and finishing — coordinated under one roof." },
        { title: "Track record at scale", desc: "Riyadh Metro stations, Aramco facilities, the King Fahd Causeway, and national security infrastructure." },
        { title: "Skilled local workforce", desc: "A team of engineers, project managers, and tradespeople tuned to Saudi standards and conditions." },
        { title: "Quality, on time", desc: "Rigorous project controls, deadline discipline, and a culture of doing it right the first time." },
        { title: "Sustainable practices", desc: "Modern techniques and materials chosen for durability and environmental responsibility." },
      ],
    },
    ar: {
      eyebrow: "لماذا مسار إعمار",
      title: ["موثوقون في", { em: "أكثر مشاريع المملكة" }, "تطلّباً."] as TitlePart[],
      items: [
        { title: "منسجمون مع رؤية 2030", desc: "كل مشروع يُسهم في تحقيق أهداف التنمية الوطنية في المملكة، باستدامة ومحلّية وبحجم مؤثّر." },
        { title: "تخصصات متكاملة", desc: "من الأعمال المدنية والإنشائية إلى الكهروميكانيكية والخرسانة الجاهزة والنجارة والتشطيبات — منسّقة تحت مظلة واحدة." },
        { title: "سجلّ بحجم كبير", desc: "محطات مترو الرياض، منشآت أرامكو، جسر الملك فهد، وبنية تحتية أمنية وطنية." },
        { title: "كوادر محلية مؤهّلة", desc: "فريق من المهندسين ومديري المشاريع والفنيين متّفقين مع المعايير والظروف السعودية." },
        { title: "جودة في الوقت المحدّد", desc: "ضوابط مشاريع صارمة، انضباط في المواعيد، وثقافة العمل الصحيح من المرّة الأولى." },
        { title: "ممارسات مستدامة", desc: "تقنيات ومواد حديثة تُختار للمتانة والمسؤولية البيئية." },
      ],
    },
  },

  how: {
    en: {
      eyebrow: "How we work",
      title: ["A four-step process,", { em: "engineered" }, "for outcome."] as TitlePart[],
      sub: "Our process is designed to ensure precision, quality, and timely delivery for every project — combining expertise, advanced technology, and a customer-first approach.",
      steps: [
        { title: "Initial Consultation", desc: "We begin with a thorough understanding of your requirements, site evaluations, and project objectives to establish a strong foundation." },
        { title: "Design & Planning", desc: "Our team develops detailed designs and project plans, integrating sustainable and innovative solutions tailored to your needs." },
        { title: "Execution & Supervision", desc: "With expert management and skilled workers, we ensure smooth project execution, maintaining quality and adhering to deadlines." },
        { title: "Completion & Handover", desc: "We deliver completed projects on time, meeting and exceeding expectations while ensuring long-term performance." },
      ],
    },
    ar: {
      eyebrow: "منهجية العمل",
      title: ["أربع خطوات،", { em: "مُهندَسة" }, "للنتيجة."] as TitlePart[],
      sub: "منهجيّتنا مصمّمة لضمان الدقّة والجودة والتسليم في الوقت المحدّد لكل مشروع — تجمع بين الخبرة والتقنيات المتقدّمة والنهج الذي يضع العميل أولاً.",
      steps: [
        { title: "الاستشارة المبدئية", desc: "نبدأ بفهم متطلباتك بدقة، مع تقييم الموقع وأهداف المشروع لبناء أساسٍ قوي." },
        { title: "التصميم والتخطيط", desc: "يطوّر فريقنا تصاميم وخطط مشاريع تفصيلية، تدمج الحلول المستدامة والمبتكرة المصمّمة لاحتياجاتك." },
        { title: "التنفيذ والإشراف", desc: "بإدارة خبيرة وعمالة ماهرة، نضمن تنفيذاً سلساً مع الحفاظ على الجودة والالتزام بالمواعيد." },
        { title: "الإنجاز والتسليم", desc: "نسلّم المشاريع في وقتها مع تجاوز التوقعات وضمان الأداء طويل الأمد." },
      ],
    },
  },

  cta: {
    en: {
      title: ["Have a project", { em: "in mind?" }] as TitlePart[],
      sub: "Let’s talk about how we can deliver it — from concept to handover.",
      cta: "Start a conversation",
      ctaSecondary: "WhatsApp us",
    },
    ar: {
      title: ["لديك مشروع", { em: "في بالك؟" }] as TitlePart[],
      sub: "لنتحدّث حول كيفية تنفيذه — من الفكرة إلى التسليم.",
      cta: "ابدأ المحادثة",
      ctaSecondary: "راسلنا عبر واتساب",
    },
  },

  contact: {
    en: {
      eyebrow: "Get in touch",
      title: ["Let’s build", { em: "something" }, "together."] as TitlePart[],
      sub: "Reach out for proposals, project enquiries, or partnerships. Our team responds within one business day.",
      address: "Al Olaya, Riyadh, Saudi Arabia",
      addressLabel: "Head office",
      emailLabel: "Email",
      email: "info@masaremaar.com",
      phoneLabel: "Phone",
      phone: "+966 53 813 4516",
      hoursLabel: "Office hours",
      hours: "Sun – Thu, 9:00 – 17:00 (AST)",
      formTitle: "Send us a message",
      fields: { name: "Full name", email: "Email", phone: "Phone (optional)", service: "Service of interest", message: "How can we help?" },
      submit: "Send enquiry",
    },
    ar: {
      eyebrow: "تواصل معنا",
      title: ["لنبنِ شيئاً", { em: "معاً." }] as TitlePart[],
      sub: "تواصل معنا للحصول على عروض، استفسارات المشاريع، أو الشراكات. يستجيب فريقنا خلال يوم عمل واحد.",
      address: "حي العليا، الرياض، المملكة العربية السعودية",
      addressLabel: "المقر الرئيسي",
      emailLabel: "البريد الإلكتروني",
      email: "info@masaremaar.com",
      phoneLabel: "الهاتف",
      phone: "+966 53 813 4516",
      hoursLabel: "ساعات العمل",
      hours: "الأحد – الخميس، 9:00 – 17:00",
      formTitle: "أرسل لنا رسالة",
      fields: { name: "الاسم الكامل", email: "البريد الإلكتروني", phone: "الهاتف (اختياري)", service: "الخدمة المطلوبة", message: "كيف يمكننا مساعدتك؟" },
      submit: "إرسال الاستفسار",
    },
  },

  footer: {
    en: {
      tagline: "Committed to Quality · Driven by Excellence · Built for the Future.",
      sections: [
        { title: "Sitemap", links: [
          { id: "home", label: "Home" },
          { id: "about", label: "About" },
          { id: "services", label: "Services" },
          { id: "projects", label: "Projects" },
          { id: "how", label: "How We Work" },
          { id: "contact", label: "Contact" },
        ] },
        { title: "Services", links: [
          { label: "Building Construction" },
          { label: "Infrastructure & Roads" },
          { label: "Precast" },
          { label: "Electrical & Plumbing" },
          { label: "Civil & Structural" },
          { label: "Woodwork & Metal" },
        ] },
        { title: "Contact", links: [
          { label: "Al Olaya, Riyadh" },
          { label: "+966 53 813 4516" },
          { label: "info@masaremaar.com" },
          { label: "WhatsApp" },
        ] },
      ],
      legal: "© 2026 Masar Emaar Contracting Co. All rights reserved.",
      crLine: "Commercial Registration · Riyadh, Saudi Arabia",
    },
    ar: {
      tagline: "الجودة عهدنا · التميّز وقودنا · المستقبل بناؤنا.",
      sections: [
        { title: "خريطة الموقع", links: [
          { id: "home", label: "الرئيسية" },
          { id: "about", label: "من نحن" },
          { id: "services", label: "الخدمات" },
          { id: "projects", label: "المشاريع" },
          { id: "how", label: "منهجية العمل" },
          { id: "contact", label: "تواصل معنا" },
        ] },
        { title: "الخدمات", links: [
          { label: "تشييد المباني" },
          { label: "البنية التحتية والطرق" },
          { label: "الخرسانة الجاهزة" },
          { label: "الكهربائية والصحية" },
          { label: "المدنية والإنشائية" },
          { label: "الخشبية والمعدنية" },
        ] },
        { title: "تواصل معنا", links: [
          { label: "حي العليا، الرياض" },
          { label: "+966 53 813 4516" },
          { label: "info@masaremaar.com" },
          { label: "واتساب" },
        ] },
      ],
      legal: "© 2026 شركة مسار إعمار للمقاولات. جميع الحقوق محفوظة.",
      crLine: "السجل التجاري · الرياض، المملكة العربية السعودية",
    },
  },

  ui: {
    en: {
      readMore: "Read more",
      viewProject: "View project",
      enquireService: "Enquire about this service",
      featured: "Featured",
      year: "Year",
      category: "Category",
      location: "Location",
      back: "Back",
      next: "Next",
      prev: "Previous",
      filterBy: "Filter by",
      sortBy: "Sort by",
      lang: "العربية",
      downloadProfile: "Download Company Profile (PDF)",
      backToSite: "Back to website",
    },
    ar: {
      readMore: "اقرأ المزيد",
      viewProject: "عرض المشروع",
      enquireService: "استفسر عن هذه الخدمة",
      featured: "مميّز",
      year: "السنة",
      category: "التصنيف",
      location: "الموقع",
      back: "رجوع",
      next: "التالي",
      prev: "السابق",
      filterBy: "تصفية",
      sortBy: "ترتيب",
      lang: "English",
      downloadProfile: "تحميل ملف الشركة (PDF)",
      backToSite: "العودة للموقع",
    },
  },
} as const;

// Construction/infrastructure image library (Unsplash, with crop)
export const IMAGES = {
  hero: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=2000&q=80&auto=format&fit=crop",
  heroAlt: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=2000&q=80&auto=format&fit=crop",
  heroAlt2: "https://images.unsplash.com/photo-1590725140246-20acdee442be?w=2000&q=80&auto=format&fit=crop",
  about: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1600&q=80&auto=format&fit=crop",
  md: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80&auto=format&fit=crop",
  service: {
    building: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1200&q=80&auto=format&fit=crop",
    precast: "https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=1200&q=80&auto=format&fit=crop",
    roads: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1200&q=80&auto=format&fit=crop",
    mep: "https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?w=1200&q=80&auto=format&fit=crop",
    civil: "https://images.unsplash.com/photo-1590725140246-20acdee442be?w=1200&q=80&auto=format&fit=crop",
    fabrication: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=1200&q=80&auto=format&fit=crop",
  } as Record<string, string>,
  project: {
    sadara: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&q=80&auto=format&fit=crop",
    shifa: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1600&q=80&auto=format&fit=crop",
    "3j1": "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=1600&q=80&auto=format&fit=crop",
    "power-qassim": "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1600&q=80&auto=format&fit=crop",
    "security-abha": "https://images.unsplash.com/photo-1486718448742-163732cd1544?w=1600&q=80&auto=format&fit=crop",
    "king-fahd": "https://images.unsplash.com/photo-1545158539-1709190d1c1f?w=1600&q=80&auto=format&fit=crop",
    salwa: "https://images.unsplash.com/photo-1448630360428-65456885c650?w=1600&q=80&auto=format&fit=crop",
    kku: "https://images.unsplash.com/photo-1562774053-701939374585?w=1600&q=80&auto=format&fit=crop",
    kafo: "https://images.unsplash.com/photo-1473445730015-841f29a9490b?w=1600&q=80&auto=format&fit=crop",
    mashriah: "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=1600&q=80&auto=format&fit=crop",
    "pnu-metro": "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=1600&q=80&auto=format&fit=crop",
    "aramco-haradh": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&q=80&auto=format&fit=crop",
    "royal-commission": "https://images.unsplash.com/photo-1531834685032-c34bf0d84c77?w=1600&q=80&auto=format&fit=crop",
  } as Record<string, string>,
};

export type Project = (typeof CONTENT.projectList)[number];

// Build a locale-aware href for a nav id ("home" → "/en", others → "/en/about")
export function navHref(locale: Locale, id: string): string {
  return id === "home" ? `/${locale}` : `/${locale}/${id}`;
}
