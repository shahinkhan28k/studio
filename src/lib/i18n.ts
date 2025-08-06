
export type Locale = 'en' | 'bn' | 'es' | 'hi';

export type TranslationKey = 
  // Nav
  | 'home' | 'tasks' | 'refer' | 'account' | 'investment'
  // Profile
  | 'profile' | 'settings' | 'logOut' | 'languageCurrency'
  | 'deposit' | 'withdraw' | 'collaboration' | 'accountDetails'
  | 'personalInformation' | 'helpSupport'
  | 'totalEarnings' | 'availableBalance' | 'totalDeposit' | 'totalWithdraw' | 'todaysEarnings'
  // Home
  | 'successfulWithdrawal' | 'justWithdrew'
  | 'featuredTasksTitle' | 'featuredTasksDescription'
  | 'noticeBoardTitle'
  // Tasks
  | 'availableTasksTitle' | 'availableTasksDescription'
  | 'taskCompletedTitle' | 'taskCompletedDescription'
  | 'completeTheTask' | 'completed' | 'pleaseWait' | 'closeAdAndComplete'
  // Refer
  | 'referAndEarnTitle' | 'referAndEarnDescription'
  | 'yourReferralLinkTitle' | 'yourReferralLinkDescription'
  | 'commissionStructureTitle'
  | 'level1' | 'level1Description'
  | 'level2' | 'level2Description'
  | 'level3' | 'level3Description'
  | 'yourReferralsTitle' | 'yourReferralsDescription'
  | 'name' | 'level' | 'commissionEarned'
  ;


export type Language = {
  t: (key: TranslationKey) => string;
  locale: Locale;
}

const en: { [key in TranslationKey]: string } = {
  home: 'Home',
  tasks: 'Tasks',
  refer: 'Refer',
  account: 'Account',
  investment: 'Investment',
  profile: 'Profile',
  settings: 'Settings',
  logOut: 'Log Out',
  languageCurrency: 'Language & Currency',
  deposit: 'Deposit',
  withdraw: 'Withdraw',
  collaboration: 'Collaboration',
  accountDetails: 'Account Details',
  personalInformation: 'Personal Information',
  helpSupport: 'Help & Support',
  totalEarnings: 'Total Earnings',
  availableBalance: 'Available Balance',
  totalDeposit: 'Total Deposit',
  totalWithdraw: 'Total Withdraw',
  todaysEarnings: "Today's Earnings",
  successfulWithdrawal: 'Successful Withdrawal!',
  justWithdrew: 'just withdrew',
  featuredTasksTitle: 'Profitable Tasks',
  featuredTasksDescription: 'Complete these tasks to earn more.',
  noticeBoardTitle: 'Notice Board',
  availableTasksTitle: 'Available Tasks',
  availableTasksDescription: 'Complete tasks to earn rewards. Your earnings will be added to your profile balance.',
  taskCompletedTitle: 'Task Completed!',
  taskCompletedDescription: 'You\'ve earned',
  completeTheTask: 'Complete The Task',
  completed: 'Completed',
  pleaseWait: 'Please wait',
  closeAdAndComplete: 'Close Ad & Complete Task',
  referAndEarnTitle: 'Refer & Earn',
  referAndEarnDescription: 'Invite your friends and earn commissions from their tasks.',
  yourReferralLinkTitle: 'Your Referral Link',
  yourReferralLinkDescription: "Share this link with your friends. You'll earn a commission every time they complete a task.",
  commissionStructureTitle: 'Commission Structure',
  level1: 'Level 1',
  level1Description: 'Earn 5% from your direct referrals.',
  level2: 'Level 2',
  level2Description: 'Earn 2% from their referrals.',
  level3: 'Level 3',
  level3Description: 'Earn 1% from the next level.',
  yourReferralsTitle: 'Your Referrals',
  yourReferralsDescription: "Here's a list of members who joined using your link.",
  name: 'Name',
  level: 'Level',
  commissionEarned: 'Commission Earned',
};

const bn: { [key in TranslationKey]: string } = {
  home: 'হোম',
  tasks: 'কাজ',
  refer: 'রেফার',
  account: 'অ্যাকাউন্ট',
  investment: 'বিনিয়োগ',
  profile: 'প্রোফাইল',
  settings: 'সেটিংস',
  logOut: 'লগ আউট',
  languageCurrency: 'ভাষা ও মুদ্রা',
  deposit: 'ডিপোজিট',
  withdraw: 'উত্তোলন',
  collaboration: 'সহযোগিতা',
  accountDetails: 'অ্যাকাউন্ট বিবরণী',
  personalInformation: 'ব্যক্তিগত তথ্য',
  helpSupport: 'সহায়তা ও সমর্থন',
  totalEarnings: 'মোট আয়',
  availableBalance: 'বর্তমান ব্যালেন্স',
  totalDeposit: 'মোট জমা',
  totalWithdraw: 'মোট উত্তোলন',
  todaysEarnings: 'আজকের আয়',
  successfulWithdrawal: 'সফল উত্তোলন!',
  justWithdrew: 'এইমাত্র উত্তোলন করেছেন',
  featuredTasksTitle: 'লাভজনক কাজগুলো',
  featuredTasksDescription: 'এই কাজগুলো সম্পূর্ণ করে আরও বেশি উপার্জন করুন।',
  noticeBoardTitle: 'নোটিশ বোর্ড',
  availableTasksTitle: 'কার্যকলাপ',
  availableTasksDescription: 'পুরস্কার অর্জনের জন্য কাজগুলো সম্পন্ন করুন। আপনার উপার্জন আপনার প্রোফাইল ব্যালেন্সে যোগ করা হবে।',
  taskCompletedTitle: 'কাজ সম্পন্ন!',
  taskCompletedDescription: 'আপনি উপার্জন করেছেন',
  completeTheTask: 'কাজটি সম্পন্ন করুন',
  completed: 'সম্পন্ন',
  pleaseWait: 'অনুগ্রহ করে অপেক্ষা করুন',
  closeAdAndComplete: 'বিজ্ঞাপন বন্ধ করুন এবং কাজ সম্পন্ন করুন',
  referAndEarnTitle: 'রেফার করুন এবং উপার্জন করুন',
  referAndEarnDescription: 'আপনার বন্ধুদের আমন্ত্রণ জানান এবং তাদের কাজ থেকে কমিশন উপার্জন করুন।',
  yourReferralLinkTitle: 'আপনার রেফারেল লিঙ্ক',
  yourReferralLinkDescription: 'এই লিঙ্কটি আপনার বন্ধুদের সাথে শেয়ার করুন। তারা যখনই একটি কাজ সম্পন্ন করবে আপনি একটি কমিশন উপার্জন করবেন।',
  commissionStructureTitle: 'কমিশন কাঠামো',
  level1: 'স্তর ১',
  level1Description: 'আপনার সরাসরি রেফারেল থেকে ৫% উপার্জন করুন।',
  level2: 'স্তর ২',
  level2Description: 'তাদের রেফারেল থেকে ২% উপার্জন করুন।',
  level3: 'স্তর ৩',
  level3Description: 'পরবর্তী স্তর থেকে ১% উপার্জন করুন।',
  yourReferralsTitle: 'আপনার রেফারেল',
  yourReferralsDescription: 'আপনার লিঙ্ক ব্যবহার করে যোগদানকারী সদস্যদের একটি তালিকা এখানে।',
  name: 'নাম',
  level: 'স্তর',
  commissionEarned: 'উপার্জিত কমিশন',
};

const es: { [key in TranslationKey]: string } = {
  home: 'Inicio',
  tasks: 'Tareas',
  refer: 'Referir',
  account: 'Cuenta',
  investment: 'Inversión',
  profile: 'Perfil',
  settings: 'Configuración',
  logOut: 'Cerrar Sesión',
  languageCurrency: 'Idioma y Moneda',
  deposit: 'Depósito',
  withdraw: 'Retirar',
  collaboration: 'Colaboración',
  accountDetails: 'Detalles de la Cuenta',
  personalInformation: 'Información Personal',
  helpSupport: 'Ayuda y Soporte',
  totalEarnings: 'Ganancias Totales',
  availableBalance: 'Saldo Disponible',
  totalDeposit: 'Depósito Total',
  totalWithdraw: 'Retiro Total',
  todaysEarnings: 'Ganancias de Hoy',
  successfulWithdrawal: '¡Retiro Exitoso!',
  justWithdrew: 'acaba de retirar',
  featuredTasksTitle: 'Tareas Rentables',
  featuredTasksDescription: 'Completa estas tareas para ganar más.',
  noticeBoardTitle: 'Tablón de Anuncios',
  availableTasksTitle: 'Tareas Disponibles',
  availableTasksDescription: 'Completa tareas para ganar recompensas. Tus ganancias se añadirán al saldo de tu perfil.',
  taskCompletedTitle: '¡Tarea Completada!',
  taskCompletedDescription: 'Has ganado',
  completeTheTask: 'Completar la Tarea',
  completed: 'Completado',
  pleaseWait: 'Por favor, espera',
  closeAdAndComplete: 'Cerrar Anuncio y Completar Tarea',
  referAndEarnTitle: 'Refiere y Gana',
  referAndEarnDescription: 'Invita a tus amigos y gana comisiones por sus tareas.',
  yourReferralLinkTitle: 'Tu Enlace de Referido',
  yourReferralLinkDescription: 'Comparte este enlace con tus amigos. Ganarás una comisión cada vez que completen una tarea.',
  commissionStructureTitle: 'Estructura de Comisiones',
  level1: 'Nivel 1',
  level1Description: 'Gana un 5% de tus referidos directos.',
  level2: 'Nivel 2',
  level2Description: 'Gana un 2% de sus referidos.',
  level3: 'Nivel 3',
  level3Description: 'Gana un 1% del siguiente nivel.',
  yourReferralsTitle: 'Tus Referidos',
  yourReferralsDescription: 'Aquí tienes una lista de los miembros que se unieron usando tu enlace.',
  name: 'Nombre',
  level: 'Nivel',
  commissionEarned: 'Comisión Ganada',
};

const hi: { [key in TranslationKey]: string } = {
  home: 'होम',
  tasks: 'कार्य',
  refer: 'रेफर करें',
  account: 'खाता',
  investment: 'निवेश',
  profile: 'प्रोफ़ाइल',
  settings: 'सेटिंग्स',
  logOut: 'लॉग आउट',
  languageCurrency: 'भाषा और मुद्रा',
  deposit: 'जमा',
  withdraw: 'निकालें',
  collaboration: 'सहयोग',
  accountDetails: 'खाता विवरण',
  personalInformation: 'व्यक्तिगत जानकारी',
  helpSupport: 'सहायता और समर्थन',
  totalEarnings: 'कुल कमाई',
  availableBalance: 'उपलब्ध शेष',
  totalDeposit: 'कुल जमा',
  totalWithdraw: 'कुल निकासी',
  todaysEarnings: 'आज की कमाई',
  successfulWithdrawal: 'सफल निकासी!',
  justWithdrew: 'ने अभी निकाला',
  featuredTasksTitle: 'लाभदायक कार्य',
  featuredTasksDescription: 'अधिक कमाने के लिए इन कार्यों को पूरा करें।',
  noticeBoardTitle: 'सूचना पट्ट',
  availableTasksTitle: 'उपलब्ध कार्य',
  availableTasksDescription: 'पुरस्कार अर्जित करने के लिए कार्यों को पूरा करें। आपकी कमाई आपके प्रोफ़ाइल शेष में जोड़ दी जाएगी।',
  taskCompletedTitle: 'कार्य पूरा हुआ!',
  taskCompletedDescription: 'आपने कमाया है',
  completeTheTask: 'कार्य पूरा करें',
  completed: 'पूरा हुआ',
  pleaseWait: 'कृपया प्रतीक्षा करें',
  closeAdAndComplete: 'विज्ञापन बंद करें और कार्य पूरा करें',
  referAndEarnTitle: 'रेफर करें और कमाएं',
  referAndEarnDescription: 'अपने दोस्तों को आमंत्रित करें और उनके कार्यों से कमीशन कमाएं।',
  yourReferralLinkTitle: 'आपका रेफरल लिंक',
  yourReferralLinkDescription: 'इस लिंक को अपने दोस्तों के साथ साझा करें। जब भी वे कोई कार्य पूरा करेंगे तो आपको कमीशन मिलेगा।',
  commissionStructureTitle: 'कमीशन संरचना',
  level1: 'स्तर 1',
  level1Description: 'अपने प्रत्यक्ष रेफरल से 5% कमाएं।',
  level2: 'स्तर 2',
  level2Description: 'उनके रेफरल से 2% कमाएं।',
  level3: 'स्तर 3',
  level3Description: 'अगले स्तर से 1% कमाएं।',
  yourReferralsTitle: 'आपके रेफरल',
  yourReferralsDescription: 'यहां उन सदस्यों की सूची है जो आपके लिंक का उपयोग करके शामिल हुए हैं।',
  name: 'नाम',
  level: 'स्तर',
  commissionEarned: 'कमीशन अर्जित',
};


export const translations: Record<Locale, { t: (key: TranslationKey) => string }> = {
  en: { t: (key: TranslationKey) => en[key] || key },
  bn: { t: (key: TranslationKey) => bn[key] || key },
  es: { t: (key: TranslationKey) => es[key] || key },
  hi: { t: (key: TranslationKey) => hi[key] || key },
};
