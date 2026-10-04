import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import faTranslation from './fa.json';
import enTranslation from './en.json';

i18n.use(initReactI18next).init({
  resources: {
    fa: { translation: faTranslation },
    en: { translation: enTranslation },
  },
  fallbackLng: 'fa', // اگر زبانی پیدا نشد، به صورت پیش‌فرض فارسی باشد
  interpolation: {
    escapeValue: false, // برای جلوگیری از مشکلات XSS در ری‌اکت
  },
});

export default i18n;