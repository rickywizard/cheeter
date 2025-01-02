const LoadingSpinner = ({ size = 'md' }: { size?: string }) => {
  const sizeClass = `loading-${size}`;

  return <span className={`loading loading-dots ${sizeClass}`} />;
};

export default LoadingSpinner;
