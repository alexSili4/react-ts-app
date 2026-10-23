import styled from '@emotion/styled';

// Тягнеться на всю висоту між хедером і футером (#root — flex-колонка в
// GlobalStyles), тож футер на короткій сторінці лишається внизу екрана.
export const Main = styled.main`
  flex-grow: 1;
`;
