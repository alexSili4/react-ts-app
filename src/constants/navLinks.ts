import { NavLinks } from '@/types/navLinks.types';
import PagePaths from './pagePaths';

// Пункти навігації хедера. Підписи — ключі перекладу (src/i18n/locales).
const navLinks: NavLinks = [{ titleKey: 'nav.main', path: PagePaths.root }];

export default navLinks;
