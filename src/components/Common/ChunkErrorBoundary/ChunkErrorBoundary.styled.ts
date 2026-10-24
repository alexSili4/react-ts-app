import styled from '@emotion/styled';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing(4)}px;
  min-height: 100dvh;
  padding: ${({ theme }) => theme.spacing(5)}px;
  text-align: center;
`;

export const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSize.h1};
  line-height: ${({ theme }) => theme.lineHeight.heading};
`;

export const Message = styled.p`
  font-size: ${({ theme }) => theme.fontSize.body};
  line-height: ${({ theme }) => theme.lineHeight.body};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const Button = styled.button`
  font-size: ${({ theme }) => theme.fontSize.caption};
  line-height: ${({ theme }) => theme.lineHeight.body};
  margin-top: ${({ theme }) => theme.spacing(4)}px;
  padding: ${({ theme }) => theme.spacing(3)}px ${({ theme }) => theme.spacing(6)}px;
  border: 1px solid ${({ theme }) => theme.colors.text};
  border-radius: ${({ theme }) => theme.radius.l}px;
`;
