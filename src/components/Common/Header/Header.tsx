import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { navLinks, PagePaths } from '@/constants';
import PageContainer from '@CommonComponents/PageContainer';
import Logo from '@/icons/logo.svg?react';
import {
  Inner,
  LogoLink,
  NavList,
  StyledHeader,
  StyledNavLink,
} from './Header.styled';

// Заготовка: лого й навігація з navLinks. Мобільне меню — модалкою через
// useModalWin / AnimatedModalWin, коли його намалює дизайнер.
const Header: FC = () => {
  const { t } = useTranslation();

  return (
    <StyledHeader>
      <PageContainer>
        <Inner>
          <LogoLink to={PagePaths.root} aria-label={t('header.logo')}>
            <Logo />
          </LogoLink>
          <nav aria-label={t('nav.label')}>
            <NavList>
              {navLinks.map(({ titleKey, path }) => (
                <li key={path}>
                  <StyledNavLink to={path} end>
                    {t(titleKey)}
                  </StyledNavLink>
                </li>
              ))}
            </NavList>
          </nav>
        </Inner>
      </PageContainer>
    </StyledHeader>
  );
};

export default Header;
