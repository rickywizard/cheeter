import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Logo, LogoSquare } from '../../../components/logo';
import { MdOutlineMail, MdPassword } from 'react-icons/md';
import { ILoginProps } from '../../../interfaces/ILoginProps';
import Input from '../../../components/input/Input';

const LoginPage = () => {
  const [formData, setFormData] = useState<ILoginProps>({
    account: '',
    password: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="lg:max-w-screen-xl mx-auto flex h-screen px-10 sm:max-w-screen-sm">
      <div className="flex-1 hidden lg:flex items-center  justify-center">
        <LogoSquare className="lg:w-96" />
      </div>
      <div className="flex-1 flex flex-col justify-center items-center">
        <form className="flex gap-4 flex-col" onSubmit={handleSubmit}>
          <Logo />
          <h1 className="text-4xl font-extrabold text-white">{"Let's"} go.</h1>
          <Input
            type="text"
            className="grow"
            placeholder="Username or Email"
            name="account"
            onChange={handleInputChange}
            value={formData.account}
          >
            <MdOutlineMail />
          </Input>

          <Input
            type="password"
            className="grow"
            placeholder="Password"
            name="password"
            onChange={handleInputChange}
            value={formData.password}
          >
            <MdPassword />
          </Input>
          <button className="btn rounded-md btn-primary text-white">
            {/* {isPending ? "Loading..." : "Login"} */}
          </button>
        </form>
        <div className="flex flex-col gap-2 mt-4 w-full">
          <p className="text-white text-sm">{"Don't"} have an account?</p>
          <Link to="/sign-up">
            <button className="btn rounded-md btn-primary text-white btn-outline w-full">
              Sign up
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
