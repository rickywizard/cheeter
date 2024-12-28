import { ReactNode } from 'react';

interface InputProps {
  type: string;
  name: string;
  placeholder?: string;
  className: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  children?: ReactNode;
}

const Input: React.FC<InputProps> = ({
  type,
  name,
  className,
  placeholder,
  value,
  onChange,
  children,
}: InputProps) => {
  return (
    <label className="input input-bordered rounded flex items-center gap-2">
      {children}
      <input
        type={type}
        className={className}
        placeholder={placeholder}
        name={name}
        onChange={onChange}
        value={value}
      />
    </label>
  );
};

export default Input;
