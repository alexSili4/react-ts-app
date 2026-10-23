// Адреса файлу з public/ з урахуванням base: якщо збірку віддають з підтеки
// (base: '/frontend/' у vite.config.ts), '/files/x.json' там треба звертати до
// '/frontend/files/x.json'. Початковий слеш у path необовʼязковий.
const getPublicUrl = (path: string): string => {
  const { BASE_URL } = import.meta.env;
  const baseUrl = BASE_URL.endsWith('/') ? BASE_URL : `${BASE_URL}/`;

  return `${baseUrl}${path.startsWith('/') ? path.slice(1) : path}`;
};

export default getPublicUrl;
