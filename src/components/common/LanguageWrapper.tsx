import React, { useEffect } from 'react';
import { useParams, Outlet, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';

const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
});

const cacheLtr = createCache({
  key: 'mui',
});

const supportedLanguages = ['fa', 'en'];

export const LanguageWrapper: React.FC = () => {
  const { lang } = useParams<{ lang: string }>();
  const { i18n } = useTranslation();

  const isValidLang = lang && supportedLanguages.includes(lang);

  useEffect(() => {
    if (isValidLang && i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
    if (isValidLang) {
      document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';
      document.documentElement.lang = lang;
    }
  }, [lang, isValidLang, i18n]);

  if (!isValidLang) {
    return <Navigate to="/fa" replace />;
  }

  const isRtl = lang === 'fa';

  return (
    <CacheProvider value={isRtl ? cacheRtl : cacheLtr}>
      <Outlet />
    </CacheProvider>
  );
};

export default LanguageWrapper;