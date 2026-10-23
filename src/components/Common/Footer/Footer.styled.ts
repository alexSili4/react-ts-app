import styled from '@emotion/styled';
import { caption } from '@/styles/typography';

export const StyledFooter = styled.footer`
  padding-top: ${({ theme }) => theme.spacing(10)}px;
  padding-bottom: ${({ theme }) => theme.spacing(10)}px;
  border-top: 1px solid ${({ theme }) => theme.colors.surface};
`;

export const Inner = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(4)}px;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;

export const Copyright = styled.p`
  ${caption}
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const SocialList = styled.ul`
  display: flex;
  gap: ${({ theme }) => theme.spacing(3)}px;
`;

export const SocialLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${({ theme }) => theme.spacing(10)}px;
  height: ${({ theme }) => theme.spacing(10)}px;
  color: ${({ theme }) => theme.colors.textSecondary};
  border: 1px solid ${({ theme }) => theme.colors.surface};
  border-radius: 50%;
  transition:
    color ${({ theme }) => theme.transitionDurationAndFunc.all},
    border-color ${({ theme }) => theme.transitionDurationAndFunc.all};

  &:is(:hover, :focus-visible) {
    color: ${({ theme }) => theme.colors.text};
    border-color: ${({ theme }) => theme.colors.text};
  }
`;
