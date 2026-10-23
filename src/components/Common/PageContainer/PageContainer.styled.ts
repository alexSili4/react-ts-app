import styled from '@emotion/styled';

// Контейнер сітки: ширина не більша за grid.maxWidth, бічні поля — за
// брейкпоінтами з теми.
export const PageContainer = styled.div`
  width: 100%;
  max-width: ${({ theme }) => theme.grid.maxWidth}px;
  margin-left: auto;
  margin-right: auto;
  padding-left: ${({ theme }) => theme.grid.margin.mobile}px;
  padding-right: ${({ theme }) => theme.grid.margin.mobile}px;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}px) {
    padding-left: ${({ theme }) => theme.grid.margin.tablet}px;
    padding-right: ${({ theme }) => theme.grid.margin.tablet}px;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}px) {
    padding-left: ${({ theme }) => theme.grid.margin.desktop}px;
    padding-right: ${({ theme }) => theme.grid.margin.desktop}px;
  }
`;
