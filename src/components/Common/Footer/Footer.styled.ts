import styled from '@emotion/styled';

export const StyledFooter = styled.footer`
  padding-top: ${({ theme }) => theme.spacing(10)}px;
  padding-bottom: ${({ theme }) => theme.spacing(10)}px;
  border-top: 1px solid ${({ theme }) => theme.colors.surface};
`;

export const Copyright = styled.p`
  font-size: ${({ theme }) => theme.fontSize.caption};
  line-height: ${({ theme }) => theme.lineHeight.body};
  color: ${({ theme }) => theme.colors.textSecondary};
`;
