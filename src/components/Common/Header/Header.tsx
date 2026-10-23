import { FC } from 'react';
import { PagePaths } from '@/constants';
import PageContainer from '@CommonComponents/PageContainer';
import Logo from '@/icons/Common/logo.svg?react';
import { Inner, LogoLink, StyledHeader } from './Header.styled';

// Заготовка: лише лого. Навігація — список із constants/navLinks.ts,
// мобільне меню — модалкою (ModalWin), коли їх намалює
// дизайнер (ARCHITECTURE.md).
const Header: FC = () => {
  return (
    <StyledHeader>
      <PageContainer>
        <Inner>
          <LogoLink to={PagePaths.root} aria-label='На головну'>
            <Logo />
          </LogoLink>
        </Inner>
      </PageContainer>
    </StyledHeader>
  );
};

export default Header;
