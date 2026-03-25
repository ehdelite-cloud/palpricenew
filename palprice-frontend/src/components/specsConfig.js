// مواصفات كل فئة — key هو المفتاح في DB، label هو ما يظهر للمستخدم

export const CATEGORY_SPECS = {
  // موبايلات
  "1": [
    { key: "processor",       labelAr: "المعالج",              labelEn: "Processor",         placeholder: "مثال: Apple A17 Pro" },
    { key: "ram",             labelAr: "الذاكرة RAM",           labelEn: "RAM",               placeholder: "مثال: 8 GB" },
    { key: "storage",         labelAr: "التخزين",               labelEn: "Storage",           placeholder: "مثال: 256 GB" },
    { key: "main_camera",     labelAr: "الكاميرا الخلفية",     labelEn: "Main Camera",       placeholder: "مثال: 48MP + 12MP + 12MP" },
    { key: "front_camera",    labelAr: "الكاميرا الأمامية",    labelEn: "Front Camera",      placeholder: "مثال: 12MP" },
    { key: "battery",         labelAr: "البطارية",              labelEn: "Battery",           placeholder: "مثال: 3274 mAh" },
    { key: "screen_size",     labelAr: "حجم الشاشة",           labelEn: "Screen Size",       placeholder: "مثال: 6.1 بوصة" },
    { key: "screen_type",     labelAr: "نوع الشاشة",           labelEn: "Screen Type",       placeholder: "مثال: Super Retina XDR OLED" },
    { key: "os",              labelAr: "نظام التشغيل",          labelEn: "OS",                placeholder: "مثال: iOS 17" },
    { key: "connectivity",    labelAr: "الاتصال",               labelEn: "Connectivity",      placeholder: "مثال: 5G, WiFi 6, Bluetooth 5.3" },
    { key: "sim",             labelAr: "الشريحة",               labelEn: "SIM",               placeholder: "مثال: Nano SIM + eSIM" },
    { key: "colors",          labelAr: "الألوان المتاحة",      labelEn: "Colors",            placeholder: "مثال: أسود، أبيض، أزرق" },
  ],

  // لابتوبات
  "2": [
    { key: "processor",       labelAr: "المعالج",              labelEn: "Processor",         placeholder: "مثال: Apple M3 Pro" },
    { key: "ram",             labelAr: "الذاكرة RAM",           labelEn: "RAM",               placeholder: "مثال: 16 GB" },
    { key: "storage",         labelAr: "التخزين",               labelEn: "Storage",           placeholder: "مثال: 512 GB SSD" },
    { key: "screen_size",     labelAr: "حجم الشاشة",           labelEn: "Screen Size",       placeholder: "مثال: 14.2 بوصة" },
    { key: "screen_res",      labelAr: "دقة الشاشة",           labelEn: "Resolution",        placeholder: "مثال: 3024 × 1964" },
    { key: "gpu",             labelAr: "كارت الشاشة",          labelEn: "GPU",               placeholder: "مثال: NVIDIA RTX 4070" },
    { key: "battery",         labelAr: "البطارية",              labelEn: "Battery",           placeholder: "مثال: 72Wh — حتى 18 ساعة" },
    { key: "weight",          labelAr: "الوزن",                 labelEn: "Weight",            placeholder: "مثال: 1.6 كيلوغرام" },
    { key: "os",              labelAr: "نظام التشغيل",          labelEn: "OS",                placeholder: "مثال: macOS Sonoma" },
    { key: "ports",           labelAr: "المنافذ",               labelEn: "Ports",             placeholder: "مثال: 3× USB-C, HDMI, SD Card" },
    { key: "keyboard",        labelAr: "لوحة المفاتيح",        labelEn: "Keyboard",          placeholder: "مثال: Backlit, Arabic/English" },
  ],

  // تابلت
  "3": [
    { key: "processor",       labelAr: "المعالج",              labelEn: "Processor",         placeholder: "مثال: Apple M2" },
    { key: "ram",             labelAr: "الذاكرة RAM",           labelEn: "RAM",               placeholder: "مثال: 8 GB" },
    { key: "storage",         labelAr: "التخزين",               labelEn: "Storage",           placeholder: "مثال: 256 GB" },
    { key: "screen_size",     labelAr: "حجم الشاشة",           labelEn: "Screen Size",       placeholder: "مثال: 12.9 بوصة" },
    { key: "screen_type",     labelAr: "نوع الشاشة",           labelEn: "Screen Type",       placeholder: "مثال: Liquid Retina XDR" },
    { key: "battery",         labelAr: "البطارية",              labelEn: "Battery",           placeholder: "مثال: 10541 mAh" },
    { key: "main_camera",     labelAr: "الكاميرا",             labelEn: "Camera",            placeholder: "مثال: 12MP Wide + 10MP Ultra Wide" },
    { key: "os",              labelAr: "نظام التشغيل",          labelEn: "OS",                placeholder: "مثال: iPadOS 17" },
    { key: "connectivity",    labelAr: "الاتصال",               labelEn: "Connectivity",      placeholder: "مثال: WiFi 6E + 5G" },
    { key: "accessories",     labelAr: "الملحقات المدعومة",   labelEn: "Accessories",       placeholder: "مثال: Apple Pencil 2, Magic Keyboard" },
  ],

  // سماعات
  "4": [
    { key: "type",            labelAr: "النوع",                labelEn: "Type",              placeholder: "مثال: In-ear / Over-ear" },
    { key: "connectivity",    labelAr: "الاتصال",               labelEn: "Connectivity",      placeholder: "مثال: Bluetooth 5.3" },
    { key: "anc",             labelAr: "إلغاء الضوضاء",        labelEn: "ANC",               placeholder: "مثال: نعم — Active Noise Cancellation" },
    { key: "battery",         labelAr: "عمر البطارية",         labelEn: "Battery Life",      placeholder: "مثال: 30 ساعة مع الكيس" },
    { key: "driver",          labelAr: "حجم الدرايفر",         labelEn: "Driver Size",       placeholder: "مثال: 40mm" },
    { key: "waterproof",      labelAr: "مقاومة الماء",         labelEn: "Water Resistance",  placeholder: "مثال: IPX4" },
    { key: "microphone",      labelAr: "الميكروفون",           labelEn: "Microphone",        placeholder: "مثال: مدمج للمكالمات" },
    { key: "charging",        labelAr: "الشحن",                labelEn: "Charging",          placeholder: "مثال: USB-C, شحن لاسلكي" },
  ],

  // شاشات
  "5": [
    { key: "screen_size",     labelAr: "حجم الشاشة",           labelEn: "Screen Size",       placeholder: "مثال: 27 بوصة" },
    { key: "resolution",      labelAr: "الدقة",                labelEn: "Resolution",        placeholder: "مثال: 2560 × 1440 QHD" },
    { key: "refresh_rate",    labelAr: "معدل التحديث",         labelEn: "Refresh Rate",      placeholder: "مثال: 144Hz" },
    { key: "panel_type",      labelAr: "نوع اللوحة",           labelEn: "Panel Type",        placeholder: "مثال: IPS / VA / OLED" },
    { key: "response_time",   labelAr: "وقت الاستجابة",        labelEn: "Response Time",     placeholder: "مثال: 1ms" },
    { key: "brightness",      labelAr: "السطوع",               labelEn: "Brightness",        placeholder: "مثال: 400 نيت" },
    { key: "ports",           labelAr: "المنافذ",               labelEn: "Ports",             placeholder: "مثال: 2× HDMI, DisplayPort, USB-A" },
    { key: "hdr",             labelAr: "دعم HDR",              labelEn: "HDR",               placeholder: "مثال: HDR400" },
    { key: "curved",          labelAr: "مقوسة",                labelEn: "Curved",            placeholder: "مثال: نعم — 1000R" },
  ],

  // كاميرات
  "6": [
    { key: "megapixels",      labelAr: "عدد الميغابيكسل",     labelEn: "Megapixels",        placeholder: "مثال: 24.2MP" },
    { key: "type",            labelAr: "نوع الكاميرا",         labelEn: "Type",              placeholder: "مثال: Mirrorless / DSLR" },
    { key: "sensor",          labelAr: "المستشعر",             labelEn: "Sensor",            placeholder: "مثال: APS-C / Full Frame" },
    { key: "video",           labelAr: "تسجيل الفيديو",        labelEn: "Video",             placeholder: "مثال: 4K 60fps" },
    { key: "iso",             labelAr: "نطاق ISO",             labelEn: "ISO Range",         placeholder: "مثال: 100-51200" },
    { key: "stabilization",   labelAr: "تثبيت الصورة",         labelEn: "Stabilization",     placeholder: "مثال: 5-axis IBIS" },
    { key: "battery",         labelAr: "البطارية",              labelEn: "Battery",           placeholder: "مثال: 570 لقطة لكل شحنة" },
    { key: "connectivity",    labelAr: "الاتصال",               labelEn: "Connectivity",      placeholder: "مثال: WiFi, Bluetooth, USB-C" },
  ],

  // أجهزة منزلية
  "7": [
    { key: "power",           labelAr: "الاستهلاك الكهربائي", labelEn: "Power",             placeholder: "مثال: 2000 واط" },
    { key: "dimensions",      labelAr: "الأبعاد",              labelEn: "Dimensions",        placeholder: "مثال: 60 × 85 × 60 سم" },
    { key: "weight",          labelAr: "الوزن",                labelEn: "Weight",            placeholder: "مثال: 12 كيلوغرام" },
    { key: "features",        labelAr: "المميزات",             labelEn: "Features",          placeholder: "مثال: Smart WiFi, تحكم بالصوت" },
    { key: "warranty",        labelAr: "الضمان",               labelEn: "Warranty",          placeholder: "مثال: سنتان" },
    { key: "energy_class",    labelAr: "فئة الطاقة",           labelEn: "Energy Class",      placeholder: "مثال: A+++" },
  ],

  // ملحقات
  "8": [
    { key: "compatibility",   labelAr: "التوافق",              labelEn: "Compatibility",     placeholder: "مثال: iPhone 15 Pro, Samsung S24" },
    { key: "material",        labelAr: "المادة",               labelEn: "Material",          placeholder: "مثال: ألومنيوم، سيليكون" },
    { key: "connectivity",    labelAr: "الاتصال",               labelEn: "Connectivity",      placeholder: "مثال: USB-C, Bluetooth" },
    { key: "features",        labelAr: "المميزات",             labelEn: "Features",          placeholder: "مثال: مقاومة للكسر، IPX4" },
    { key: "warranty",        labelAr: "الضمان",               labelEn: "Warranty",          placeholder: "مثال: سنة واحدة" },
  ],
};

// أيقونات المواصفات
export const SPEC_ICONS = {
  processor: "⚙️",
  ram: "💾",
  storage: "💿",
  main_camera: "📷",
  front_camera: "🤳",
  battery: "🔋",
  screen_size: "📐",
  screen_type: "🖥️",
  screen_res: "🖥️",
  resolution: "🖥️",
  os: "💻",
  connectivity: "📶",
  sim: "📱",
  colors: "🎨",
  gpu: "🎮",
  weight: "⚖️",
  ports: "🔌",
  keyboard: "⌨️",
  accessories: "🖊️",
  type: "🏷️",
  anc: "🎧",
  driver: "🔊",
  waterproof: "💧",
  microphone: "🎤",
  charging: "⚡",
  refresh_rate: "🔄",
  panel_type: "🖥️",
  response_time: "⏱️",
  brightness: "☀️",
  hdr: "✨",
  curved: "〰️",
  megapixels: "📸",
  sensor: "📡",
  video: "🎥",
  iso: "🌙",
  stabilization: "🎯",
  power: "⚡",
  dimensions: "📏",
  features: "✨",
  warranty: "🛡️",
  energy_class: "🌱",
  compatibility: "🔗",
  material: "🧱",
};