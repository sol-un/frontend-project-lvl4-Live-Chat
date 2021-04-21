import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ru from './locales/ru.js';
import en from './locales/en.js';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      ru,
      en,
    },
    lng: 'ru',
    fallbackLng: 'ru',
  });

export default i18n;
