import { FC } from 'react';
import { PagePaths } from '@/constants';
import { SITE_NAME } from '@/constants/pagesMeta';
import PageContainer from '@CommonComponents/PageContainer';
import { Inner, LogoLink, StyledHeader } from './Header.styled';

const Header: FC = () => {
  return (
    <StyledHeader>
      <PageContainer>
        <Inner>
          <LogoLink to={PagePaths.root}>{SITE_NAME}</LogoLink>
        </Inner>
      </PageContainer>
    </StyledHeader>
  );
};

export default Header;
