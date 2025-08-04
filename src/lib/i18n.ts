
export type Locale = 'en' | 'bn';

export type TranslationKey = 
  // Nav
  | 'home' | 'tasks' | 'refer' | 'account'
  // Profile
  | 'profile' | 'settings' | 'logOut' | 'languageCurrency'
  | 'deposit' | 'withdraw' | 'collaboration' | 'accountDetails'
  | 'personalInformation' | 'helpSupport'
  | 'totalEarnings' | 'availableBalance' | 'totalDeposit' | 'totalWithdraw'
  // Home
  | 'successfulWithdrawal' | 'justWithdrew'
  | 'featuredTasksTitle' | 'featuredTasksDescription'
  | 'noticeBoardTitle'
  | 'notice1Title' | 'notice1Description'
  | 'notice2Title' | 'notice2Description'
  | 'notice3Title' | 'notice3Description'
  // Tasks
  | 'availableTasksTitle' | 'availableTasksDescription'
  | 'taskCompletedTitle' | 'taskCompletedDescription'
  | 'completeTheTask' | 'completed' | 'pleaseWait' | 'closeAdAndComplete'
  | 'task1Title' | 'task1Description'
  | 'task2Title' | 'task2Description'
  | 'task3Title' | 'task3Description'
  | 'task4Title' | 'task4Description'
  | 'task5Title' | 'task5Description'
  | 'task6Title' | 'task6Description'
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
  successfulWithdrawal: 'Successful Withdrawal!',
  justWithdrew: 'just withdrew',
  featuredTasksTitle: 'Profitable Tasks',
  featuredTasksDescription: 'Complete these tasks to earn more.',
  noticeBoardTitle: 'Notice Board',
  notice1Title: 'New high-value tasks available!',
  notice1Description: 'Check the tasks section for more earning opportunities. Limited slots available!',
  notice2Title: 'Referral Program Boost',
  notice2Description: 'For a limited time, get a 10% bonus on your first-level referral commissions.',
  notice3Title: 'Scheduled Maintenance',
  notice3Description: 'The platform will be down for scheduled maintenance on Sunday at 2 PM UTC.',
  availableTasksTitle: 'Available Tasks',
  availableTasksDescription: 'Complete tasks to earn rewards. Your earnings will be added to your profile balance.',
  taskCompletedTitle: 'Task Completed!',
  taskCompletedDescription: 'You\'ve earned',
  completeTheTask: 'Complete The Task',
  completed: 'Completed',
  pleaseWait: 'Please wait',
  closeAdAndComplete: 'Close Ad & Complete Task',
  task1Title: "Survey Completion",
  task1Description: "Complete a short survey about your shopping habits.",
  task2Title: "App Download",
  task2Description: "Download and install our partner's new mobile app.",
  task3Title: "Watch a Video Ad",
  task3Description: "Watch a 30-second promotional video.",
  task4Title: "Social Media Share",
  task4Description: "Share our promotional post on your social media profile.",
  task5Title: "Product Review",
  task5Description: "Write a review for a product you recently purchased.",
  task6Title: "Data Entry Task",
  task6Description: "Enter data from a scanned document into a spreadsheet.",
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
  successfulWithdrawal: 'সফল উত্তোলন!',
  justWithdrew: 'এইমাত্র উত্তোলন করেছেন',
  featuredTasksTitle: 'লাভজনক কাজগুলো',
  featuredTasksDescription: 'এই কাজগুলো সম্পূর্ণ করে আরও বেশি উপার্জন করুন।',
  noticeBoardTitle: 'নোটিশ বোর্ড',
  notice1Title: 'নতুন উচ্চ-মূল্যের কাজ পাওয়া যাচ্ছে!',
  notice1Description: 'আরও বেশি উপার্জনের সুযোগের জন্য টাস্ক বিভাগটি দেখুন। সীমিত সংখ্যক স্লট পাওয়া যাচ্ছে!',
  notice2Title: 'রেফারেল প্রোগ্রাম বুস্ট',
  notice2Description: 'সীমিত সময়ের জন্য, আপনার প্রথম-স্তরের রেফারেল কমিশনগুলিতে ১০% বোনাস পান।',
  notice3Title: 'পূর্বনির্ধারিত রক্ষণাবেক্ষণ',
  notice3Description: 'প্ল্যাটফর্মটি রবিবার দুপুর ২টা UTC-তে নির্ধারিত রক্ষণাবেক্ষণের জন্য ডাউন থাকবে।',
  availableTasksTitle: 'কার্যকলাপ',
  availableTasksDescription: 'পুরস্কার অর্জনের জন্য কাজগুলো সম্পন্ন করুন। আপনার উপার্জন আপনার প্রোফাইল ব্যালেন্সে যোগ করা হবে।',
  taskCompletedTitle: 'কাজ সম্পন্ন!',
  taskCompletedDescription: 'আপনি উপার্জন করেছেন',
  completeTheTask: 'কাজটি সম্পন্ন করুন',
  completed: 'সম্পন্ন',
  pleaseWait: 'অনুগ্রহ করে অপেক্ষা করুন',
  closeAdAndComplete: 'বিজ্ঞাপন বন্ধ করুন এবং কাজ সম্পন্ন করুন',
  task1Title: "জরিপ সমাপ্তি",
  task1Description: "আপনার কেনাকাটার অভ্যাস সম্পর্কে একটি সংক্ষিপ্ত জরিপ সম্পূর্ণ করুন।",
  task2Title: "অ্যাপ ডাউনলোড",
  task2Description: "আমাদের অংশীদারের নতুন মোবাইল অ্যাপ ডাউনলোড এবং ইনস্টল করুন।",
  task3Title: "একটি ভিডিও বিজ্ঞাপন দেখুন",
  task3Description: "একটি ৩০-সেকেন্ডের প্রচারমূলক ভিডিও দেখুন।",
  task4Title: "সোশ্যাল মিডিয়া শেয়ার",
  task4Description: "আপনার সোশ্যাল মিডিয়া প্রোফাইলে আমাদের প্রচারমূলক পোস্ট শেয়ার করুন।",
  task5Title: "পণ্য পর্যালোচনা",
  task5Description: "আপনি সম্প্রতি কিনেছেন এমন একটি পণ্যের জন্য একটি পর্যালোচনা লিখুন।",
  task6Title: "ডেটা এন্ট্রি টাস্ক",
  task6Description: "একটি স্ক্যান করা ডকুমেন্ট থেকে একটি স্প্রেডশীটে ডেটা প্রবেশ করান।",
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

export const translations = {
  en: { t: (key: TranslationKey) => en[key] || key },
  bn: { t: (key: TranslationKey) => bn[key] || key },
};
