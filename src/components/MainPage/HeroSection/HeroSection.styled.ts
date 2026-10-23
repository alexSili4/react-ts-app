import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { bodyRegular16, h1 } from '@/styles/typography';

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing(4)}px;
  min-height: calc(100vh - ${({ theme }) => theme.headerHeight.mobile}px);

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}px) {
    min-height: calc(100vh - ${({ theme }) => theme.headerHeight.tablet}px);
  }
`;

export const Title = styled(motion.h1)`
  ${h1}
`;

export const Subtitle = styled.p`
  ${bodyRegular16}
  max-width: 560px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;
