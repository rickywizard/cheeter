import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LogoSquare } from '../../../components/logo';
import { MdOutlineMail, MdPassword } from 'react-icons/md';
import { LoginData } from '../../../interfaces/LoginData.interface';
import Input from '../../../components/input/Input';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [formData, setFormData] = useState<LoginData>({
    account: '',
    password: '',
  });

  const useLoginMutation = () =>
    useMutation({
      mutationFn: async (data: LoginData) => {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (!res.ok) {
          const errorResponse = await res.json();
          throw new Error(errorResponse.error || 'Something went wrong');
        }

        return await res.json();
      },
      onError: (error: Error) => {
        toast.error(error.message);
      },
      onSuccess: (res) => {
        toast.success(res.message);
        console.log(res);
      },
    });

  const { mutate, isPending } = useLoginMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate(formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="lg:max-w-screen-xl mx-auto flex gap-10 h-screen px-10 sm:max-w-screen-sm">
      <div className="flex-1 hidden lg:flex items-center  justify-center">
        <LogoSquare className="lg:w-96" />
      </div>
      <div className="flex-1 flex flex-col justify-center items-center">
        <form className="flex gap-4 flex-col w-full" onSubmit={handleSubmit}>
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
            {isPending ? 'Loading...' : 'Login'}
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
