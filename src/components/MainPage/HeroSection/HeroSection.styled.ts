import styled from '@emotion/styled';
import { bodyRegular16, h1 } from '@/styles/typography';

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing(4)}px;
  padding-top: ${({ theme }) => theme.spacing(30)}px;
  padding-bottom: ${({ theme }) => theme.spacing(30)}px;
`;

export const Title = styled.h1`
  ${h1}
`;

export const Subtitle = styled.p`
  ${bodyRegular16}
  max-width: 560px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;
