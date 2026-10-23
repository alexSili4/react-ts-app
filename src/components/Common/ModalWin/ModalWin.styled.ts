import styled from '@emotion/styled';

export const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: ${({ theme }) => theme.zIndex.modal};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing(5)}px;
  background-color: ${({ theme }) => theme.colors.backdrop};
`;

// Власна прокрутка довгого вмісту; Lenis її не перехоплює (data-lenis-prevent).
export const Dialog = styled.div`
  max-width: 100%;
  max-height: 100%;
  overflow-y: auto;
  padding: ${({ theme }) => theme.spacing(8)}px;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radius.m}px;

  &:focus {
    outline: none;
  }
`;
