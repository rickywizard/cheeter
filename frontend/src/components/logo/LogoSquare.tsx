import logo from '../../assets/logo-square.png';
import { ImageSizeProps } from './ImageSizeProps';

const LogoSquare = ({ width, height, className }: ImageSizeProps) => {
  return (
    <img
      src={logo}
      alt=""
      width={width}
      height={height}
      className={className}
    />
  );
};

export default LogoSquare;
