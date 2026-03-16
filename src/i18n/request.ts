import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale }) => {
  // Агар бо кадом сабабе locale аз параметрҳо наояд
  const activeLocale = locale || 'tj';

  return {
    // ДИҚҚАТ: Ин сатр барои Next.js 15/16 ҳатмист!
    locale: activeLocale, 
    messages: (await import(`../messages/${activeLocale}.json`)).default
  };
});