import { IoHome, IoNotifications } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { BiLogOut } from 'react-icons/bi';
import { Logo, LogoSquare } from '../logo';
import NavLink from './NavLink';
import { RiUserFill } from 'react-icons/ri';

const Sidebar = () => {
  const data = {
    fullName: 'John Doe',
    username: 'johndoe',
    profileImg: '/avatars/boy1.png',
  };

  return (
    <div className="md:flex-[2_2_0] w-18 max-w-52">
      <div className="sticky top-0 left-0 h-screen flex flex-col border-r border-gray-700 w-20 md:w-full md:pl-3">
        <Link
          to="/"
          className="flex justify-center py-3 md:pr-3 md:justify-start"
        >
          <Logo className="md:block hidden" />
          <LogoSquare className="md:hidden block w-12" />
        </Link>
        <ul className="flex flex-col gap-3 mt-4">
          <NavLink text="Home">
            <IoHome className="w-6 h-6" />
          </NavLink>
          <NavLink text="Notifications">
            <IoNotifications className="w-6 h-6" />
          </NavLink>
          <NavLink text="Profile">
            <RiUserFill className="w-6 h-6" />
          </NavLink>
        </ul>
        {data && (
          <div className="pl-3 pr-3 mt-auto mb-10">
            <Link
              to={`/profile/${data.username}`}
              className="flex gap-2 items-start transition-all duration-300 hover:bg-[#181818] py-2 md:px-4 rounded-full"
            >
              <div className="avatar hidden md:inline-flex">
                <div className="w-8 rounded-full">
                  <img src={data?.profileImg || '/avatar-placeholder.png'} />
                </div>
              </div>
              <div className="flex md:justify-between justify-center items-center flex-1">
                <div className="hidden md:block">
                  <p className="text-white font-bold text-sm w-20 truncate">
                    {data?.fullName}
                  </p>
                  <p className="text-slate-500 text-sm">@{data?.username}</p>
                </div>
                <BiLogOut className="w-5 h-5 cursor-pointer" />
              </div>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
export default Sidebar;
