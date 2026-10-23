import styled from '@emotion/styled';

// Тягнеться між хедером і футером (#root — flex-колонка в GlobalStyles), тож
// на короткій сторінці футер лишається внизу екрана.
export const Main = styled.main`
  flex-grow: 1;
`;
