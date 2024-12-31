import { ImageSizeProps } from './ImageSizeProps';

const Logo = ({ width, height, className }: ImageSizeProps) => {
  return (
    <img
      src="/logo.png"
      alt=""
      width={width}
      height={height}
      className={className}
    />
  );
};

export default Logo;
