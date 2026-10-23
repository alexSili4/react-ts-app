import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import { Links } from '@/constants';
import { SITE_NAME } from '@/utils/pageTitle';
import GeneralContainer from '@CommonComponents/GeneralContainer';
import {
  Copyright,
  Inner,
  SocialLink,
  SocialList,
  StyledFooter,
} from './Footer.styled';

// Назви соцмереж — бренди, їх не перекладаємо. Іконки aria-hidden (IconContext
// у main.tsx), тож імʼя посиланню дає aria-label.
const SOCIAL_LINKS = [
  { href: Links.instagram, label: 'Instagram', Icon: FaInstagram },
  { href: Links.linkedin, label: 'LinkedIn', Icon: FaLinkedinIn },
];

const Footer: FC = () => {
  const { t } = useTranslation();

  return (
    <StyledFooter>
      <GeneralContainer>
        <Inner>
          <Copyright>
            {t('footer.copyright', {
              year: new Date().getFullYear(),
              siteName: SITE_NAME,
            })}
          </Copyright>
          <SocialList>
            {SOCIAL_LINKS.map(({ href, label, Icon }) => (
              <li key={href}>
                <SocialLink
                  href={href}
                  target='_blank'
                  rel='noopener noreferrer'
                  aria-label={label}
                >
                  <Icon />
                </SocialLink>
              </li>
            ))}
          </SocialList>
        </Inner>
      </GeneralContainer>
    </StyledFooter>
  );
};

export default Footer;
