import React, { useState } from 'react';
import { FaUser } from 'react-icons/fa';
import {
  MdDriveFileRenameOutline,
  MdOutlineMail,
  MdPassword,
} from 'react-icons/md';
import { Link } from 'react-router-dom';
import { Logo, LogoSquare } from '../../../components/logo';
import SignUpInput from '../../../components/input/Input';
import { SignUpRequest } from '../../../interfaces/SignUpRequest.interface';
import useSignUpMutation from '../../../hooks/useSignUpMutation';

const SignUpPage = () => {
  const [formData, setFormData] = useState<SignUpRequest>({
    email: '',
    username: '',
    fullname: '',
    password: '',
  });

  const { mutate, isPending } = useSignUpMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate(formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
      <div className="lg:max-w-screen-xl mx-auto flex gap-10 h-screen px-10 md:max-w-screen-sm overflow-y-auto">
        <div className="flex-1 hidden lg:flex items-center justify-center">
          <LogoSquare className="w-96" />
        </div>
        <div className="flex-1 flex flex-col justify-center items-center">
          <form
            className="mx-auto flex gap-4 flex-col w-full"
            onSubmit={handleSubmit}
          >
            <div className="lg:hidden">
              <Logo className="w-60" />
            </div>
            <h1 className="text-4xl font-extrabold text-white">Join now.</h1>
            <SignUpInput
              type="email"
              className="grow"
              placeholder="Email"
              name="email"
              onChange={handleInputChange}
              value={formData.email}
            >
              <MdOutlineMail />
            </SignUpInput>
            <SignUpInput
              type="text"
              className="grow"
              placeholder="Username"
              name="username"
              onChange={handleInputChange}
              value={formData.username}
            >
              <FaUser />
            </SignUpInput>
            <SignUpInput
              type="text"
              className="grow"
              placeholder="Full Name"
              name="fullname"
              onChange={handleInputChange}
              value={formData.fullname}
            >
              <MdDriveFileRenameOutline />
            </SignUpInput>
            <SignUpInput
              type="password"
              className="grow"
              placeholder="Password"
              name="password"
              onChange={handleInputChange}
              value={formData.password}
            >
              <MdPassword />
            </SignUpInput>
            <button className="btn rounded-md btn-primary text-white">
              {isPending ? 'Loading...' : 'Sign up'}
            </button>
          </form>
          <div className="flex flex-col gap-2 mt-4 w-full">
            <p className="text-white text-sm">Already have an account?</p>
            <Link to="/login">
              <button className="btn rounded-md btn-primary text-white btn-outline w-full">
                Sign in
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUpPage;
