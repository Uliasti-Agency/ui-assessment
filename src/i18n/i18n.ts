import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from "./en.json";
import de from "./de.json";
import es from "./es.json";

const resources = {
  de: {common: de},
  en: {common: en},
  es: {common: es},
}


i18n
.use(LanguageDetector)
.use(initReactI18next)
.init({
  resources,
  defaultNS: 'common',
  fallbackLng: 'en',
  supportedLngs: ['de', 'en', 'es'],
  interpolation: {
    escapeValue: false,
  },
  debug: false,
})

export default i18n

