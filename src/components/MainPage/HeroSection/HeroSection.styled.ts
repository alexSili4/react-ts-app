import styled from '@emotion/styled';

// ≈ 65 знаків кеглем body: довші рядки важче читати.
const SUBTITLE_MAX_WIDTH = 560;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing(4)}px;
  padding-top: ${({ theme }) => theme.spacing(30)}px;
  padding-bottom: ${({ theme }) => theme.spacing(30)}px;
`;

export const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSize.h1};
  line-height: ${({ theme }) => theme.lineHeight.heading};
`;

export const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSize.body};
  line-height: ${({ theme }) => theme.lineHeight.body};
  max-width: ${SUBTITLE_MAX_WIDTH}px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;
