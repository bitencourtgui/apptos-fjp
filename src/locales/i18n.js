import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { en } from './translations/en';
import { de } from './translations/de';
import { es } from './translations/es';
import { ptbr } from './translations/ptbr';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      de: { translation: de },
      es: { translation: es },
      ptbr: { translation: ptbr }
    },
    lng: 'ptbr',
    fallbackLng: 'ptbr',
    interpolation: {
      escapeValue: false
    }
  });
