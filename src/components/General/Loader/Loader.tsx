import { FC } from 'react';
import { ThreeDots } from 'react-loader-spinner';

const Loader: FC = () => (
  <ThreeDots
    height='120'
    width='120'
    radius='9'
    color='#808080'
    ariaLabel='three-dots-loading'
    wrapperStyle={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      transform: 'translateX(-50%) translateY(-50%)',
    }}
    visible
  />
);

export default Loader;
