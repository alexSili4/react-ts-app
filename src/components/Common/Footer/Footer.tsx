import { FC } from 'react';
import { SITE_NAME } from '@/utils/pageTitle';
import PageContainer from '@CommonComponents/PageContainer';
import { Copyright, StyledFooter } from './Footer.styled';

// Заготовка: лише копірайт. Контакти, соцмережі, навігація — з макета.
const Footer: FC = () => {
  return (
    <StyledFooter>
      <PageContainer>
        <Copyright>
          © {new Date().getFullYear()} {SITE_NAME}. Усі права захищено.
        </Copyright>
      </PageContainer>
    </StyledFooter>
  );
};

export default Footer;
