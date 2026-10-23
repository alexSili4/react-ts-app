import styled from '@emotion/styled';
import { caption } from '@/styles/typography';

export const StyledFooter = styled.footer`
  padding-top: ${({ theme }) => theme.spacing(10)}px;
  padding-bottom: ${({ theme }) => theme.spacing(10)}px;
  border-top: 1px solid ${({ theme }) => theme.colors.surface};
`;

export const Copyright = styled.p`
  ${caption}
  color: ${({ theme }) => theme.colors.textSecondary};
`;
