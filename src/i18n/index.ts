import {createInstance} from 'i18next';
import {initReactI18next} from 'react-i18next';
import {getLocales} from 'expo-localization';

import {resources} from './resources';

const deviceLanguage = getLocales()[0]?.languageCode === 'en' ? 'en' : 'es';

const i18n = createInstance();

i18n.use(initReactI18next).init({
  resources,
  lng: deviceLanguage,
  fallbackLng: 'es',
  defaultNS: 'common',
  interpolation: {escapeValue: false},
  returnNull: false,
});

export default i18n;
