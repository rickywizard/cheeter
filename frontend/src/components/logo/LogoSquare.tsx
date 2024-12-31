import { ImageSizeProps } from './ImageSizeProps';

const LogoSquare = ({ width, height, className }: ImageSizeProps) => {
  return (
    <img
      src="/logo-square.png"
      alt=""
      width={width}
      height={height}
      className={className}
    />
  );
};

export default LogoSquare;
