export interface IPageMetaData {
  // Частина до « | SITE_NAME»: разом із суфіксом ≤ 60 символів, інакше Google
  // обріже кінець. Порожній рядок дає саму назву сайту.
  title: string;
  // 150–160 символів. Без неї тегу description у сторінки немає зовсім: ні в
  // HTML збірки, ні після Helmet — загальний з index.html не лишається.
  description?: string;
  // Абсолютний URL файла з public/, JPG 1200×630: WebP показують не всі
  // соцмережі. Без нього — спільна картка /og-image.jpg.
  image?: string;
  noIndex?: boolean;
}

export interface IPageMetaTags {
  title: string;
  description?: string;
  canonical: string;
  image: string;
  noIndex: boolean;
}
