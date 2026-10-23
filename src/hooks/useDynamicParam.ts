import { PagePaths } from '@/constants';
import { useParams } from 'react-router';

const useDynamicParam = (): string => {
  const dynamicParam = useParams()[PagePaths.dynamicParam] ?? '';

  return dynamicParam;
};

export default useDynamicParam;
