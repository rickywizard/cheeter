import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface NavLinkProps {
  text: string;
  children: ReactNode;
}

const NavLink = ({ text, children }: NavLinkProps) => {
  return (
    <li className="flex justify-center md:pr-3 md:px-0 px-3">
      <Link
        to="/"
        className="flex gap-3 items-center justify-center md:justify-start hover:bg-stone-900 transition-all rounded-md duration-300 py-2 md:pl-2 w-full cursor-pointer"
      >
        {children}
        <span className="text-lg hidden md:block">{text}</span>
      </Link>
    </li>
  );
};

export default NavLink;
